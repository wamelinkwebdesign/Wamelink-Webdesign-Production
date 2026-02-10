import type { VercelRequest, VercelResponse } from '@vercel/node';

// Gmail OAuth2 - Step 1: Redirect user to Google consent screen
// Required env vars: GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REDIRECT_URI

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const redirectUri = process.env.GMAIL_REDIRECT_URI || `https://${req.headers.host}/api/gmail/callback`;

  if (!clientId) {
    return res.status(500).json({ error: 'GMAIL_CLIENT_ID not configured' });
  }

  const scopes = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.readonly',
  ].join(' ');

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', scopes);
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');
  authUrl.searchParams.set('state', 'wamelink-gmail-auth');

  return res.redirect(302, authUrl.toString());
}
