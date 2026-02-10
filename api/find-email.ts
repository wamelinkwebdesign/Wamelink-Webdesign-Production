import type { VercelRequest, VercelResponse } from '@vercel/node';

// Scrape email addresses from a business website
// Checks: homepage, /contact, /about, /over-ons, /impressum pages
// No API key needed — completely free

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// Common spam/generic emails to filter out
const IGNORE_EMAILS = [
  'example.com', 'sentry.io', 'wixpress.com', 'wordpress.org',
  'schema.org', 'w3.org', 'google.com', 'facebook.com',
  'yourdomain.com', 'domain.com', 'email.com', 'test.com',
];

const IGNORE_PREFIXES = [
  'noreply', 'no-reply', 'mailer-daemon', 'postmaster',
  'webmaster', 'hostmaster', 'abuse', 'support@wordpress',
];

function extractEmails(html: string): string[] {
  // Decode HTML entities
  const decoded = html
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\[at\]/gi, '@')
    .replace(/\[dot\]/gi, '.')
    .replace(/ at /gi, '@')
    .replace(/ dot /gi, '.');

  const matches = decoded.match(EMAIL_REGEX) || [];

  // Dedupe and filter
  const unique = [...new Set(matches.map((e) => e.toLowerCase()))];

  return unique.filter((email) => {
    // Filter out image/file extensions mistaken as emails
    if (/\.(png|jpg|jpeg|gif|svg|css|js|webp|pdf)$/i.test(email)) return false;
    // Filter out known spam domains
    if (IGNORE_EMAILS.some((d) => email.includes(d))) return false;
    // Filter out generic prefixes
    if (IGNORE_PREFIXES.some((p) => email.startsWith(p))) return false;
    // Must have a valid-looking domain
    const domain = email.split('@')[1];
    if (!domain || domain.split('.').length < 2) return false;
    return true;
  });
}

function scoreEmail(email: string, websiteDomain: string): number {
  let score = 0;
  const emailDomain = email.split('@')[1];

  // Matches website domain = high confidence
  if (emailDomain === websiteDomain || websiteDomain.includes(emailDomain) || emailDomain.includes(websiteDomain.replace('www.', ''))) {
    score += 50;
  }

  // Personal-looking prefixes are better than generic
  const prefix = email.split('@')[0];
  if (/^(info|contact|hello|hallo)$/i.test(prefix)) score += 20;
  if (/^[a-z]+\.[a-z]+$/i.test(prefix)) score += 30; // firstname.lastname
  if (/^[a-z]{2,}$/i.test(prefix) && prefix.length > 3) score += 15;

  // Penalize generic
  if (/^(admin|sales|marketing|hr|office)$/i.test(prefix)) score += 5;

  return score;
}

async function fetchPage(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WamelinkBot/1.0)',
        'Accept': 'text/html',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) return null;

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return null;

    return await response.text();
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'url is required' });
  }

  let baseUrl = url;
  if (!baseUrl.startsWith('http')) baseUrl = 'https://' + baseUrl;
  // Remove trailing slash
  baseUrl = baseUrl.replace(/\/+$/, '');

  // Extract domain for scoring
  let domain = '';
  try {
    domain = new URL(baseUrl).hostname.replace(/^www\./, '');
  } catch {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  // Pages to check (in order of priority)
  const pagesToCheck = [
    baseUrl,
    baseUrl + '/contact',
    baseUrl + '/contact/',
    baseUrl + '/over-ons',
    baseUrl + '/about',
    baseUrl + '/about-us',
    baseUrl + '/impressum',
    baseUrl + '/contacteer-ons',
  ];

  const allEmails: Map<string, { email: string; score: number; foundOn: string }> = new Map();

  // Fetch pages in parallel (max 4 at a time)
  for (let i = 0; i < pagesToCheck.length; i += 4) {
    const batch = pagesToCheck.slice(i, i + 4);
    const results = await Promise.all(batch.map((pageUrl) => fetchPage(pageUrl)));

    results.forEach((html, idx) => {
      if (!html) return;
      const pageUrl = batch[idx];
      const emails = extractEmails(html);

      emails.forEach((email) => {
        const score = scoreEmail(email, domain);
        const existing = allEmails.get(email);
        if (!existing || score > existing.score) {
          allEmails.set(email, {
            email,
            score,
            foundOn: pageUrl.replace(baseUrl, '') || '/',
          });
        }
      });
    });

    // If we already found good emails on the homepage/contact, skip the rest
    const bestScore = Math.max(0, ...[...allEmails.values()].map((e) => e.score));
    if (bestScore >= 50 && allEmails.size >= 1) break;
  }

  // Sort by score
  const sorted = [...allEmails.values()].sort((a, b) => b.score - a.score);

  return res.status(200).json({
    success: true,
    domain,
    emails: sorted.slice(0, 5), // Return top 5
    bestEmail: sorted[0]?.email || null,
  });
}
