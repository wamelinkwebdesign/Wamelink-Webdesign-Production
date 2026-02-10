import type { VercelRequest, VercelResponse } from '@vercel/node';

// Check Gmail OAuth connection status

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const raw = await kvGet('gmail:tokens');

    if (!raw) {
      return res.status(200).json({
        connected: false,
        authorizeUrl: '/api/gmail/authorize',
      });
    }

    const tokens = JSON.parse(raw);

    // Verify token still works by getting profile
    const profileResponse = await fetch('https://www.googleapis.com/gmail/v1/users/me/profile', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!profileResponse.ok) {
      // Token might be expired, but refresh_token exists
      if (tokens.refresh_token) {
        return res.status(200).json({
          connected: true,
          needsRefresh: true,
          email: null,
        });
      }
      return res.status(200).json({
        connected: false,
        authorizeUrl: '/api/gmail/authorize',
      });
    }

    const profile = await profileResponse.json();

    return res.status(200).json({
      connected: true,
      email: profile.emailAddress,
      messagesTotal: profile.messagesTotal,
    });
  } catch (error: any) {
    return res.status(200).json({
      connected: false,
      error: error.message,
      authorizeUrl: '/api/gmail/authorize',
    });
  }
}
