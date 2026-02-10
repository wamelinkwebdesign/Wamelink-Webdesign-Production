import type { VercelRequest, VercelResponse } from '@vercel/node';

// Smart email sending: Gmail OAuth (with signature) → Resend fallback
// Gmail requires: GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET + OAuth flow completed
// Resend requires: RESEND_API_KEY + DNS records

async function kvGet(key: string): Promise<string | null> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;

  const response = await fetch(`${url}/get/${key}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return data.result || null;
}

async function kvSet(key: string, value: string) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return;

  await fetch(`${url}/set/${key}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: value,
  });
}

async function sendViaGmail(to: string, subject: string, body: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const raw = await kvGet('gmail:tokens');
  if (!raw) return { success: false, error: 'not_connected' };

  let tokens = JSON.parse(raw);

  // Refresh if needed
  if (Date.now() > tokens.expiry - 300000) {
    const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        refresh_token: tokens.refresh_token,
        client_id: process.env.GMAIL_CLIENT_ID!,
        client_secret: process.env.GMAIL_CLIENT_SECRET!,
        grant_type: 'refresh_token',
      }),
    });

    const refreshData = await refreshResponse.json();
    if (!refreshResponse.ok) return { success: false, error: 'refresh_failed' };

    tokens = {
      access_token: refreshData.access_token,
      refresh_token: tokens.refresh_token,
      expiry: Date.now() + (refreshData.expires_in * 1000),
    };
    await kvSet('gmail:tokens', JSON.stringify(tokens));
  }

  // Get signature
  let signature = '';
  try {
    const sendAsResponse = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/settings/sendAs',
      { headers: { Authorization: `Bearer ${tokens.access_token}` } }
    );
    const sendAsData = await sendAsResponse.json();
    const primarySendAs = sendAsData.sendAs?.find((s: any) => s.isPrimary);
    signature = primarySendAs?.signature || '';
  } catch { /* continue without signature */ }

  // Build HTML
  const htmlBody = body
    .replace(/\n/g, '<br />')
    .replace(
      /^(.+)$/gm,
      '<p style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:14px;color:#333;">$1</p>'
    );

  const fullHtml = signature
    ? `${htmlBody}<br /><div style="border-top:1px solid #ddd;padding-top:12px;margin-top:16px;">${signature}</div>`
    : htmlBody;

  // Build MIME
  const boundary = `boundary_${Date.now()}`;
  const plainText = body;

  const messageParts = [
    `To: ${to}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(plainText).toString('base64'),
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(fullHtml).toString('base64'),
    '',
    `--${boundary}--`,
  ];

  const rawMessage = Buffer.from(messageParts.join('\r\n'))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const sendResponse = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: rawMessage }),
    }
  );

  const sendResult = await sendResponse.json();

  if (!sendResponse.ok) {
    return { success: false, error: sendResult.error?.message || 'Gmail send failed' };
  }

  return { success: true, messageId: sendResult.id };
}

async function sendViaResend(to: string, subject: string, body: string, replyTo?: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) return { success: false, error: 'RESEND_API_KEY not configured' };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Dennis Wamelink <dennis@wamelinkwebdesign.nl>',
      to: [to],
      subject,
      html: body
        .replace(/\n/g, '<br />')
        .replace(
          /^(.+)$/gm,
          '<p style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:14px;color:#333;">$1</p>'
        ),
      text: body,
      reply_to: replyTo || 'dennis@wamelinkwebdesign.nl',
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return { success: false, error: data.message || 'Resend error' };
  }

  return { success: true, messageId: data.id };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, body, replyTo } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, body' });
  }

  // Try Gmail first (sends with signature)
  const gmailResult = await sendViaGmail(to, subject, body);

  if (gmailResult.success) {
    return res.status(200).json({
      success: true,
      messageId: gmailResult.messageId,
      provider: 'gmail',
    });
  }

  // Fall back to Resend
  console.log(`Gmail failed (${gmailResult.error}), falling back to Resend`);
  const resendResult = await sendViaResend(to, subject, body, replyTo);

  if (resendResult.success) {
    return res.status(200).json({
      success: true,
      messageId: resendResult.messageId,
      provider: 'resend',
    });
  }

  return res.status(500).json({
    error: 'Both Gmail and Resend failed',
    gmail: gmailResult.error,
    resend: resendResult.error,
  });
}
