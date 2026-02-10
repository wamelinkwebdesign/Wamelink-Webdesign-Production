import type { VercelRequest, VercelResponse } from '@vercel/node';

// Phase 2: Generate personalized outreach messages via Claude API
// Environment variable needed: ANTHROPIC_API_KEY

interface GenerationRequest {
  lead: {
    companyName: string;
    contactPerson: string;
    email: string;
    website: string;
    industry: string;
    city: string;
    notes: string;
  };
  channel: 'email' | 'linkedin' | 'phone' | 'whatsapp';
  tone: 'formal' | 'friendly' | 'direct';
  language: 'nl' | 'en';
  focusPoint: string;
}

const INDUSTRY_LABELS: Record<string, string> = {
  horeca: 'Horeca',
  retail: 'Retail',
  'zakelijke-dienstverlening': 'Zakelijke Dienstverlening',
  bouw: 'Bouw & Constructie',
  gezondheid: 'Gezondheid & Welzijn',
  technologie: 'Technologie',
  onderwijs: 'Onderwijs',
  creatief: 'Creatieve Sector',
  overig: 'Overig',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  const { lead, channel, tone, language, focusPoint } = req.body as GenerationRequest;

  if (!lead || !channel) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const industryLabel = INDUSTRY_LABELS[lead.industry] || lead.industry;
  const langLabel = language === 'nl' ? 'Nederlands' : 'English';

  const toneInstructions = {
    formal: language === 'nl'
      ? 'Gebruik een formele, professionele toon. Spreek de ontvanger aan met "u".'
      : 'Use a formal, professional tone.',
    friendly: language === 'nl'
      ? 'Gebruik een warme, vriendelijke maar professionele toon. Spreek aan met "u" maar houd het persoonlijk.'
      : 'Use a warm, friendly but professional tone.',
    direct: language === 'nl'
      ? 'Wees direct en to-the-point. Geen omwegen, meteen ter zake.'
      : 'Be direct and to the point. No fluff.',
  };

  const channelInstructions: Record<string, string> = {
    email: language === 'nl'
      ? 'Dit is een e-mail. Genereer een onderwerp (max 60 tekens) en een bericht. Houd het bericht tussen 80-150 woorden.'
      : 'This is an email. Generate a subject line (max 60 chars) and body. Keep the body 80-150 words.',
    linkedin: language === 'nl'
      ? 'Dit is een LinkedIn bericht. Houd het kort (max 100 woorden). Geen onderwerpregel nodig.'
      : 'This is a LinkedIn message. Keep it short (max 100 words). No subject line needed.',
    phone: language === 'nl'
      ? 'Dit is een belscript. Schrijf een kort gespreksleidraad met een opening, kernboodschap en afsluiting.'
      : 'This is a phone call script. Write a brief guide with opening, core message, and closing.',
    whatsapp: language === 'nl'
      ? 'Dit is een WhatsApp bericht. Houd het informeel en kort (max 60 woorden). Geen onderwerpregel.'
      : 'This is a WhatsApp message. Keep it informal and short (max 60 words). No subject line.',
  };

  const systemPrompt = `Je bent een sales copywriter voor Wamelink Webdesign, een premium webdesign bureau in Amsterdam dat gespecialiseerd is in websites voor het Nederlandse MKB. 

De eigenaar is Dennis Wamelink. Het bureau biedt professionele websites, webshops, SEO en online marketing.

Regels:
- ${toneInstructions[tone]}
- ${channelInstructions[channel]}
- Schrijf in het ${langLabel}
- Noem ALTIJD de bedrijfsnaam van de prospect
- Wees specifiek over wat Wamelink Webdesign kan betekenen voor hun branche
- Eindig ALTIJD met een concrete call-to-action (bijv. vrijblijvend gesprek van 15 minuten)
- Gebruik GEEN emoji's in e-mails of LinkedIn berichten
- Klink NIET als een template — maak het persoonlijk

Antwoord UITSLUITEND in JSON formaat:
{
  "subject": "onderwerpregel hier (alleen voor email)",
  "body": "bericht hier"
}`;

  const userPrompt = `Genereer een ${channel} bericht voor:

Bedrijf: ${lead.companyName}
Contactpersoon: ${lead.contactPerson}
Branche: ${industryLabel}
Stad: ${lead.city}
Website: ${lead.website || 'Niet bekend'}
${lead.notes ? `Notities: ${lead.notes}` : ''}
${focusPoint ? `Specifiek focuspunt: ${focusPoint}` : ''}

Maak het bericht persoonlijk en relevant voor hun branche (${industryLabel}) en locatie (${lead.city}).`;

  try {
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
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic API error:', data);
      return res.status(response.status).json({ error: data.error?.message || 'AI generation failed' });
    }

    const text = data.content?.[0]?.text || '';

    // Parse JSON from response (handle potential markdown wrapping)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    const result = JSON.parse(jsonMatch[0]);

    return res.status(200).json({
      subject: result.subject || '',
      body: result.body || '',
    });
  } catch (error) {
    console.error('AI generation failed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
