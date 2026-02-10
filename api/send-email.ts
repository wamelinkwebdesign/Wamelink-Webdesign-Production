import type { VercelRequest, VercelResponse } from '@vercel/node';

// Phase 1: Send real emails via Resend
// Environment variable needed: RESEND_API_KEY
// DNS records needed: SPF + DKIM for wamelinkwebdesign.nl (Resend dashboard guides you through this)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, body, replyTo } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, body' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY not configured' });
  }

  try {
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
        // Send as both HTML and plain text for maximum deliverability
        html: body
          .replace(/\n/g, '<br />')
          .replace(
            /^(.+)$/gm,
            '<p style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:14px;color:#333;">$1</p>'
          ),
        text: body,
        reply_to: replyTo || 'dennis@wamelinkwebdesign.nl',
        headers: {
          'X-Entity-Ref-ID': `wamelink-outreach-${Date.now()}`,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', data);
      return res.status(response.status).json({ error: data.message || 'Failed to send email' });
    }

    return res.status(200).json({
      success: true,
      messageId: data.id,
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
