import type { VercelRequest, VercelResponse } from '@vercel/node';

// Phase 5: Score a prospect's website quality
// Uses Google PageSpeed Insights API (FREE - no key needed for basic usage)
// + basic HTML analysis to determine if a business needs a new website

interface WebsiteScore {
  url: string;
  overallScore: number; // 0-100 (lower = better prospect for us!)
  prospectScore: number; // 0-100 (higher = better prospect)
  loadTime: number | null; // seconds
  mobileScore: number | null; // 0-100
  desktopScore: number | null; // 0-100
  hasHttps: boolean;
  hasMobileViewport: boolean;
  hasModernDesign: boolean;
  issues: string[];
  opportunities: string[];
}

async function getPageSpeedScore(url: string, strategy: 'mobile' | 'desktop'): Promise<any> {
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo`;

  const response = await fetch(apiUrl, { signal: AbortSignal.timeout(30000) });

  if (!response.ok) return null;
  return response.json();
}

async function analyzeHTML(url: string): Promise<{
  hasViewport: boolean;
  hasModernFramework: boolean;
  hasOldTech: boolean;
  hasSocialMeta: boolean;
  hasSchemaOrg: boolean;
  hasAnalytics: boolean;
  copyrightYear: number | null;
  techIssues: string[];
}> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WamelinkBot/1.0)',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return {
        hasViewport: false, hasModernFramework: false, hasOldTech: false,
        hasSocialMeta: false, hasSchemaOrg: false, hasAnalytics: false,
        copyrightYear: null, techIssues: ['Website niet bereikbaar'],
      };
    }

    const html = await response.text();
    const issues: string[] = [];

    const hasViewport = html.includes('viewport');
    if (!hasViewport) issues.push('Geen mobiele viewport meta tag');

    const hasModernFramework = /react|vue|angular|next|nuxt|svelte|gatsby|astro/i.test(html);
    const hasOldTech = /wordpress|joomla|drupal|wix\.com|squarespace|weebly/i.test(html);

    const hasSocialMeta = html.includes('og:title') || html.includes('twitter:card');
    if (!hasSocialMeta) issues.push('Geen social media meta tags');

    const hasSchemaOrg = html.includes('schema.org');
    if (!hasSchemaOrg) issues.push('Geen structured data (Schema.org)');

    const hasAnalytics = /google-analytics|gtag|gtm\.js|analytics\.js|plausible|umami|fathom/i.test(html);
    if (!hasAnalytics) issues.push('Geen analytics geïnstalleerd');

    // Try to find copyright year
    const yearMatch = html.match(/©\s*(\d{4})/);
    const copyrightYear = yearMatch ? parseInt(yearMatch[1]) : null;
    if (copyrightYear && copyrightYear < new Date().getFullYear() - 2) {
      issues.push(`Copyright jaar ${copyrightYear} — mogelijk verouderd`);
    }

    // Check for jQuery (often sign of older site)
    if (html.includes('jquery') && !hasModernFramework) {
      issues.push('Gebruikt jQuery zonder modern framework');
    }

    // Check for table-based layouts
    if ((html.match(/<table/gi) || []).length > 3 && !html.includes('data-table')) {
      issues.push('Mogelijk table-based layout');
    }

    return { hasViewport, hasModernFramework, hasOldTech, hasSocialMeta, hasSchemaOrg, hasAnalytics, copyrightYear, techIssues: issues };
  } catch (err) {
    return {
      hasViewport: false, hasModernFramework: false, hasOldTech: false,
      hasSocialMeta: false, hasSchemaOrg: false, hasAnalytics: false,
      copyrightYear: null, techIssues: ['Kon website niet analyseren'],
    };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { urls } = req.body; // Array of URLs to score

  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: 'urls array is required' });
  }

  // Limit to 5 at a time (PageSpeed API rate limits)
  const urlsToScore = urls.slice(0, 5);

  const results: WebsiteScore[] = [];

  for (const rawUrl of urlsToScore) {
    let url = rawUrl;
    if (!url.startsWith('http')) url = 'https://' + url;

    try {
      // Run PageSpeed + HTML analysis in parallel
      const [mobileResult, htmlAnalysis] = await Promise.all([
        getPageSpeedScore(url, 'mobile').catch(() => null),
        analyzeHTML(url),
      ]);

      const mobileScore = mobileResult?.lighthouseResult?.categories?.performance?.score
        ? Math.round(mobileResult.lighthouseResult.categories.performance.score * 100)
        : null;

      const seoScore = mobileResult?.lighthouseResult?.categories?.seo?.score
        ? Math.round(mobileResult.lighthouseResult.categories.seo.score * 100)
        : null;

      const accessibilityScore = mobileResult?.lighthouseResult?.categories?.accessibility?.score
        ? Math.round(mobileResult.lighthouseResult.categories.accessibility.score * 100)
        : null;

      // Extract load time
      const loadTime = mobileResult?.lighthouseResult?.audits?.['speed-index']?.numericValue
        ? Math.round(mobileResult.lighthouseResult.audits['speed-index'].numericValue / 100) / 10
        : null;

      const hasHttps = url.startsWith('https');

      // Compute issues list
      const issues: string[] = [...htmlAnalysis.techIssues];
      const opportunities: string[] = [];

      if (!hasHttps) issues.push('Geen HTTPS — onveilig');
      if (mobileScore !== null && mobileScore < 50) {
        issues.push(`Mobiele performance score: ${mobileScore}/100`);
        opportunities.push('Snellere mobiele website kan meer klanten opleveren');
      }
      if (seoScore !== null && seoScore < 80) {
        issues.push(`SEO score: ${seoScore}/100`);
        opportunities.push('Betere SEO = meer vindbaarheid in Google');
      }
      if (loadTime && loadTime > 4) {
        issues.push(`Laadtijd: ${loadTime}s (te langzaam)`);
        opportunities.push('Snelle website verhoogt conversie met 20-30%');
      }
      if (htmlAnalysis.hasOldTech) {
        opportunities.push('Upgraden naar moderne technologie voor betere prestaties');
      }
      if (!htmlAnalysis.hasViewport) {
        opportunities.push('Mobiel-vriendelijke website (80% zoekt via telefoon)');
      }

      // Calculate overall website quality (0-100, higher = better website)
      let overallScore = 50; // Start neutral
      if (mobileScore !== null) overallScore = (overallScore + mobileScore) / 2;
      if (seoScore !== null) overallScore = (overallScore + seoScore) / 2;
      if (hasHttps) overallScore += 5;
      if (htmlAnalysis.hasViewport) overallScore += 5;
      if (htmlAnalysis.hasModernFramework) overallScore += 10;
      if (htmlAnalysis.hasSchemaOrg) overallScore += 5;
      overallScore = Math.max(0, Math.min(100, Math.round(overallScore)));

      // Prospect score = inverse of website quality (bad website = great prospect!)
      const prospectScore = Math.max(0, Math.min(100, 100 - overallScore));

      results.push({
        url,
        overallScore,
        prospectScore,
        loadTime,
        mobileScore,
        desktopScore: null, // Skip desktop to save API calls
        hasHttps,
        hasMobileViewport: htmlAnalysis.hasViewport,
        hasModernDesign: htmlAnalysis.hasModernFramework,
        issues,
        opportunities,
      });
    } catch (err: any) {
      // If scoring fails, still return the URL with a high prospect score (can't even load = needs help)
      results.push({
        url,
        overallScore: 10,
        prospectScore: 90,
        loadTime: null,
        mobileScore: null,
        desktopScore: null,
        hasHttps: url.startsWith('https'),
        hasMobileViewport: false,
        hasModernDesign: false,
        issues: ['Website kon niet worden geanalyseerd — mogelijk offline of zeer traag'],
        opportunities: ['Volledig nieuwe website nodig'],
      });
    }
  }

  // Sort by prospect score (best prospects first)
  results.sort((a, b) => b.prospectScore - a.prospectScore);

  return res.status(200).json({
    success: true,
    scores: results,
  });
}
