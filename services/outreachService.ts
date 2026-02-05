import { GoogleGenAI, Type } from "@google/genai";
import { OutreachGenerationRequest } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const INDUSTRY_LABELS: Record<string, string> = {
  horeca: 'Horeca',
  retail: 'Retail',
  'zakelijke-dienstverlening': 'Zakelijke Dienstverlening',
  bouw: 'Bouw & Constructie',
  gezondheid: 'Gezondheidszorg',
  technologie: 'Technologie',
  onderwijs: 'Onderwijs',
  creatief: 'Creatieve Sector',
  overig: 'Overig',
};

export const generateOutreachMessage = async (
  request: OutreachGenerationRequest
): Promise<{ subject: string; body: string }> => {
  const { lead, channel, tone, language, focusPoint } = request;
  const industryLabel = INDUSTRY_LABELS[lead.industry] || lead.industry;

  if (!apiKey) {
    return {
      subject: `Website mogelijkheden voor ${lead.companyName}`,
      body: `Beste ${lead.contactPerson},\n\nIk ben Dennis van Wamelink Webdesign. We helpen MKB-bedrijven zoals ${lead.companyName} met professionele websites die resultaat opleveren.\n\nZou u openstaan voor een vrijblijvend gesprek?\n\nMet vriendelijke groet,\nDennis Wamelink`,
    };
  }

  const toneMap = {
    formal: language === 'nl' ? 'formeel en professioneel' : 'formal and professional',
    friendly: language === 'nl' ? 'vriendelijk en benaderbaar' : 'friendly and approachable',
    direct: language === 'nl' ? 'direct en to-the-point' : 'direct and to-the-point',
  };

  const channelContext = {
    email: language === 'nl'
      ? 'een zakelijke e-mail met onderwerpregel en volledige berichttekst'
      : 'a business email with subject line and full message body',
    linkedin: language === 'nl'
      ? 'een kort LinkedIn-bericht (max 300 tekens)'
      : 'a short LinkedIn message (max 300 characters)',
    phone: language === 'nl'
      ? 'een telefoonscript voor een koud belletje (kort en krachtig)'
      : 'a cold call phone script (short and effective)',
    whatsapp: language === 'nl'
      ? 'een kort en informeel WhatsApp-bericht'
      : 'a short and informal WhatsApp message',
  };

  const prompt = `You are writing sales outreach for Wamelink Webdesign, a premium web design agency in Amsterdam, Netherlands.

Target: ${lead.contactPerson} at ${lead.companyName}, a ${industryLabel} business in ${lead.city}.
${lead.website ? `Their current website: ${lead.website}` : 'They may not have a website yet.'}

Channel: Write ${channelContext[channel]}.
Tone: ${toneMap[tone]}.
Language: ${language === 'nl' ? 'Dutch (Nederlands)' : 'English'}.
Focus: ${focusPoint || 'general website improvement and online presence'}.

Key selling points of Wamelink Webdesign:
- Premium Swiss-style design aesthetic
- SEO-optimized websites that rank well in Google
- Mobile-first responsive design
- Fast loading speeds
- Located in Amsterdam, serving Dutch SMBs
- Contact: Dennis Wamelink, +31 6 510 959 19, dennis@wamelinkwebdesign.nl

Write a compelling, personalized ${channel} message. Make it specific to their industry (${industryLabel}) and city (${lead.city}). Do NOT be generic. ${language === 'nl' ? 'Schrijf in het Nederlands.' : 'Write in English.'}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: {
              type: Type.STRING,
              description: "Email subject line (empty string for non-email channels)",
            },
            body: {
              type: Type.STRING,
              description: "The full message body",
            },
          },
          required: ["subject", "body"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text);
  } catch (error) {
    console.error("Outreach generation error:", error);
    throw error;
  }
};

export const analyzeWebsite = async (
  url: string
): Promise<{ strengths: string[]; weaknesses: string[]; opportunities: string[] }> => {
  if (!apiKey) {
    return {
      strengths: ['Website exists'],
      weaknesses: ['Could not analyze without API key'],
      opportunities: ['Full redesign potential'],
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the website at ${url} from a web design agency perspective. What are the strengths, weaknesses, and opportunities for improvement? Be specific and actionable. Focus on design, UX, SEO, mobile experience, and conversion optimization. Keep each point to one sentence. Respond in Dutch.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Current website strengths (2-3 points)",
            },
            weaknesses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Areas that need improvement (3-5 points)",
            },
            opportunities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Opportunities for improvement that Wamelink can offer (3-5 points)",
            },
          },
          required: ["strengths", "weaknesses", "opportunities"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text);
  } catch (error) {
    console.error("Website analysis error:", error);
    throw error;
  }
};
