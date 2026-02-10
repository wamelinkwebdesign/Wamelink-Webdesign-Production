import type { VercelRequest, VercelResponse } from '@vercel/node';

// Gmail OAuth2 - Step 2: Handle callback, exchange code for tokens
// Stores refresh_token + access_token in Upstash Redis

async function kvSet(key: string, value: string) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error('KV not configured');

  await fetch(`${url}/set/${key}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: value,
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { code, state, error: authError } = req.query;

  if (authError) {
    return res.status(400).send(`
      <html><body style="font-family:sans-serif;text-align:center;padding:60px;">
        <h2>Autorisatie geweigerd</h2>
        <p>${authError}</p>
        <p><a href="/">Terug naar Wamelink</a></p>
      </body></html>
    `);
  }

  if (!code || state !== 'wamelink-gmail-auth') {
    return res.status(400).json({ error: 'Invalid callback' });
  }

  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const redirectUri = process.env.GMAIL_REDIRECT_URI || `https://${req.headers.host}/api/gmail/callback`;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Gmail OAuth not configured' });
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: code as string,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return res.status(400).send(`
        <html><body style="font-family:sans-serif;text-align:center;padding:60px;">
          <h2>Token exchange mislukt</h2>
          <p>${tokenData.error_description || tokenData.error}</p>
          <p><a href="/api/gmail/authorize">Probeer opnieuw</a></p>
        </body></html>
      `);
    }

    // Store tokens in Upstash Redis
    const tokens = {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expiry: Date.now() + (tokenData.expires_in * 1000),
    };

    await kvSet('gmail:tokens', JSON.stringify(tokens));

    // Get user email for confirmation
    const profileResponse = await fetch('https://www.googleapis.com/gmail/v1/users/me/profile', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileResponse.json();

    return res.status(200).send(`
      <html><body style="font-family:Inter,sans-serif;text-align:center;padding:60px;background:#f9fafb;">
        <div style="max-width:400px;margin:0 auto;background:white;border-radius:16px;padding:40px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <div style="width:48px;height:48px;background:#10B981;border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
            <span style="color:white;font-size:24px;">✓</span>
          </div>
          <h2 style="margin:0 0 8px;font-size:20px;">Gmail Verbonden!</h2>
          <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">${profile.emailAddress || 'Je Gmail account'} is succesvol gekoppeld.</p>
          <p style="color:#9ca3af;font-size:12px;">E-mails worden nu verstuurd via je Gmail met je standaard handtekening.</p>
          <a href="/" style="display:inline-block;margin-top:24px;background:#FFD700;color:black;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;border:1px solid black;">Terug naar Sales</a>
        </div>
      </body></html>
    `);
  } catch (error: any) {
    return res.status(500).send(`
      <html><body style="font-family:sans-serif;text-align:center;padding:60px;">
        <h2>Er ging iets mis</h2>
        <p>${error.message}</p>
        <p><a href="/api/gmail/authorize">Probeer opnieuw</a></p>
      </body></html>
    `);
  }
}
