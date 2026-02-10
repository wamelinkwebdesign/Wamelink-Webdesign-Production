import type { VercelRequest, VercelResponse } from '@vercel/node';

// Phase 2 bonus: Analyze a prospect's website to find talking points
// Environment variable needed: ANTHROPIC_API_KEY

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Fetch the website HTML
    const siteResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WamelinkBot/1.0; +https://wamelinkwebdesign.nl)',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!siteResponse.ok) {
      return res.status(200).json({
        strengths: ['Website kon niet worden bereikt'],
        weaknesses: ['Website retourneert een foutmelding'],
        opportunities: ['Volledig nieuwe website nodig'],
      });
    }

    const html = await siteResponse.text();

    // Strip HTML to get text content (basic extraction)
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 3000); // Limit for API

    // Check basic technical aspects
    const hasViewport = html.includes('viewport');
    const hasHttps = url.startsWith('https');
    const hasSchemaOrg = html.includes('schema.org');
    const loadsFonts = html.includes('fonts.googleapis.com') || html.includes('font-face');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: `Je bent een webdesign expert van Wamelink Webdesign. Analyseer websites en geef een korte beoordeling in het Nederlands. Wees eerlijk maar constructief — het doel is om verbeterpunten te vinden die je kunt gebruiken in een sales gesprek.

Antwoord UITSLUITEND in JSON:
{
  "strengths": ["max 3 sterke punten"],
  "weaknesses": ["max 3 zwakke punten"],
  "opportunities": ["max 3 kansen voor verbetering"],
  "summary": "Een zin samenvatting van de website"
}`,
        messages: [
          {
            role: 'user',
            content: `Analyseer deze website: ${url}

Technische checks:
- Viewport meta tag: ${hasViewport ? 'Ja' : 'Nee'}
- HTTPS: ${hasHttps ? 'Ja' : 'Nee'}
- Schema.org markup: ${hasSchemaOrg ? 'Ja' : 'Nee'}
- Custom fonts: ${loadsFonts ? 'Ja' : 'Nee'}

Pagina tekst (samengevat):
${textContent}`,
          },
        ],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return res.status(200).json({
        strengths: ['Analyse kon niet worden voltooid'],
        weaknesses: [],
        opportunities: ['Neem contact op voor handmatige beoordeling'],
      });
    }

    return res.status(200).json(JSON.parse(jsonMatch[0]));
  } catch (error) {
    console.error('Website analysis failed:', error);
    return res.status(200).json({
      strengths: ['Website kon niet worden geanalyseerd'],
      weaknesses: ['Mogelijke fout bij laden'],
      opportunities: ['Handmatige beoordeling aanbevolen'],
    });
  }
}
