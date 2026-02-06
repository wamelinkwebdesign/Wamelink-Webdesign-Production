import { OutreachGenerationRequest } from "../types";

// Outreach service - currently disabled (no API key configured)
// To enable, install @google/genai and configure API_KEY environment variable

export const generateOutreachMessage = async (
  request: OutreachGenerationRequest
): Promise<{ subject: string; body: string }> => {
  const { lead } = request;

  // Return mock data since Gemini is not configured
  return {
    subject: `Website mogelijkheden voor ${lead.companyName}`,
    body: `Beste ${lead.contactPerson},\n\nIk ben Dennis van Wamelink Webdesign. We helpen MKB-bedrijven zoals ${lead.companyName} met professionele websites die resultaat opleveren.\n\nZou u openstaan voor een vrijblijvend gesprek?\n\nMet vriendelijke groet,\nDennis Wamelink`,
  };
};

export const analyzeWebsite = async (
  _url: string
): Promise<{ strengths: string[]; weaknesses: string[]; opportunities: string[] }> => {
  // Return mock data since Gemini is not configured
  return {
    strengths: ['Website exists'],
    weaknesses: ['Could not analyze without API key'],
    opportunities: ['Full redesign potential'],
  };
};
