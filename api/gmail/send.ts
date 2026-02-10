import type { VercelRequest, VercelResponse } from '@vercel/node';

// Gmail OAuth2 - Send email via Gmail API
// Sends with the user's default Gmail signature automatically

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

async function refreshAccessToken(refreshToken: string): Promise<string> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.GMAIL_CLIENT_ID!,
      client_secret: process.env.GMAIL_CLIENT_SECRET!,
      grant_type: 'refresh_token',
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || 'Token refresh failed');

  // Update stored tokens
  const tokens = {
    access_token: data.access_token,
    refresh_token: refreshToken,
    expiry: Date.now() + (data.expires_in * 1000),
  };
  await kvSet('gmail:tokens', JSON.stringify(tokens));

  return data.access_token;
}

async function getValidAccessToken(): Promise<string> {
  const raw = await kvGet('gmail:tokens');
  if (!raw) throw new Error('Gmail not connected. Visit /api/gmail/authorize first.');

  const tokens = JSON.parse(raw);

  // Refresh if expiring in next 5 minutes
  if (Date.now() > tokens.expiry - 300000) {
    return refreshAccessToken(tokens.refresh_token);
  }

  return tokens.access_token;
}

function createRawEmail(to: string, subject: string, bodyHtml: string): string {
  // Build MIME message — Gmail will append the user's signature automatically
  // when we use the Gmail API with the "sendAsEmail" setting
  const boundary = `boundary_${Date.now()}`;

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
    Buffer.from(bodyHtml.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '')).toString('base64'),
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(bodyHtml).toString('base64'),
    '',
    `--${boundary}--`,
  ];

  const message = messageParts.join('\r\n');

  // URL-safe base64 encode the entire message
  return Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, body } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, body' });
  }

  try {
    const accessToken = await getValidAccessToken();

    // Get user's Gmail signature (SendAs settings)
    const sendAsResponse = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/settings/sendAs',
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const sendAsData = await sendAsResponse.json();
    const primarySendAs = sendAsData.sendAs?.find((s: any) => s.isPrimary);
    const signature = primarySendAs?.signature || '';

    // Build HTML body with signature
    const htmlBody = body
      .replace(/\n/g, '<br />')
      .replace(
        /^(.+)$/gm,
        '<p style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:14px;color:#333;">$1</p>'
      );

    // Append signature with separator
    const fullHtml = signature
      ? `${htmlBody}<br /><div style="border-top:1px solid #ddd;padding-top:12px;margin-top:16px;">${signature}</div>`
      : htmlBody;

    const raw = createRawEmail(to, subject, fullHtml);

    // Send via Gmail API
    const sendResponse = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raw }),
      }
    );

    const sendResult = await sendResponse.json();

    if (!sendResponse.ok) {
      console.error('Gmail send error:', sendResult);
      return res.status(sendResponse.status).json({
        error: sendResult.error?.message || 'Failed to send email',
      });
    }

    return res.status(200).json({
      success: true,
      messageId: sendResult.id,
      threadId: sendResult.threadId,
      provider: 'gmail',
    });
  } catch (error: any) {
    console.error('Gmail send failed:', error);

    if (error.message.includes('not connected')) {
      return res.status(401).json({
        error: 'Gmail niet verbonden',
        action: 'authorize',
        authorizeUrl: '/api/gmail/authorize',
      });
    }

    return res.status(500).json({ error: error.message });
  }
}
