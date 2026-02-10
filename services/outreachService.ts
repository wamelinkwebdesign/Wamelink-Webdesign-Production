import { OutreachGenerationRequest } from '../types';

// Updated outreach service - calls real API routes instead of returning mock data

/**
 * Phase 2: Generate a personalized outreach message using Claude AI
 */
export const generateOutreachMessage = async (
  request: OutreachGenerationRequest
): Promise<{ subject: string; body: string }> => {
  try {
    const response = await fetch('/api/generate-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Generatie mislukt');
    }

    return response.json();
  } catch (error: any) {
    console.error('Message generation failed:', error);
    // Fallback to basic template if API fails
    const { lead } = request;
    return {
      subject: `Website mogelijkheden voor ${lead.companyName}`,
      body: `Beste ${lead.contactPerson},\n\nIk ben Dennis van Wamelink Webdesign. We helpen MKB-bedrijven zoals ${lead.companyName} met professionele websites die resultaat opleveren.\n\nZou u openstaan voor een vrijblijvend gesprek?\n\nMet vriendelijke groet,\nDennis Wamelink`,
    };
  }
};

/**
 * Phase 1: Send an email via the Resend API
 */
export const sendEmail = async (
  to: string,
  subject: string,
  body: string
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, body }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Verzenden mislukt' };
    }

    return { success: true, messageId: data.messageId };
  } catch (error: any) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Phase 2 bonus: Analyze a prospect's website
 */
export const analyzeWebsite = async (
  url: string
): Promise<{
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  summary?: string;
}> => {
  try {
    const response = await fetch('/api/analyze-website', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error('Analyse mislukt');
    }

    return response.json();
  } catch (error) {
    console.error('Website analysis failed:', error);
    return {
      strengths: ['Kon niet analyseren'],
      weaknesses: ['API niet beschikbaar'],
      opportunities: ['Handmatige beoordeling nodig'],
    };
  }
};

/**
 * Phase 3: Parse a CSV file for bulk lead import
 */
export const parseCSVForImport = async (
  csvText: string
): Promise<{
  success: boolean;
  leads?: any[];
  totalRows?: number;
  importedCount?: number;
  skippedCount?: number;
  mappedColumns?: Record<string, string>;
  error?: string;
}> => {
  try {
    const response = await fetch('/api/parse-csv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csvText }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error };
    }

    return data;
  } catch (error: any) {
    console.error('CSV parsing failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Phase 5: Find prospects via Google Places
 */
export const findProspects = async (
  city: string,
  industry?: string,
  customQuery?: string,
  maxResults = 20
): Promise<{
  success: boolean;
  results?: any[];
  error?: string;
}> => {
  try {
    const response = await fetch('/api/find-prospects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city, industry, customQuery, maxResults }),
    });

    const data = await response.json();
    if (!response.ok) return { success: false, error: data.error };
    return { success: true, results: data.results };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

/**
 * Phase 5: Score website quality for prospects
 */
export const scoreWebsites = async (
  urls: string[]
): Promise<{
  success: boolean;
  scores?: any[];
  error?: string;
}> => {
  try {
    const response = await fetch('/api/score-websites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls }),
    });

    const data = await response.json();
    if (!response.ok) return { success: false, error: data.error };
    return { success: true, scores: data.scores };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

/**
 * Phase 4: Schedule automated follow-up sequences
 */
export const scheduleFollowUps = async (
  lead: {
    id: string;
    companyName: string;
    contactPerson: string;
    email: string;
    industry: string;
    city: string;
    website: string;
  },
  steps: Array<{
    dayOffset: number;
    channel: 'email' | 'linkedin' | 'phone' | 'whatsapp';
    tone: 'formal' | 'friendly' | 'direct';
    focusPoint: string;
  }>
): Promise<{
  success: boolean;
  scheduledFollowUps?: Array<{
    step: number;
    scheduledDate: string;
    channel: string;
  }>;
  error?: string;
}> => {
  try {
    const response = await fetch('/api/schedule-followups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leadId: lead.id,
        companyName: lead.companyName,
        contactPerson: lead.contactPerson,
        email: lead.email,
        industry: lead.industry,
        city: lead.city,
        website: lead.website,
        steps,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error };
    }

    return { success: true, scheduledFollowUps: data.scheduledFollowUps };
  } catch (error: any) {
    console.error('Follow-up scheduling failed:', error);
    return { success: false, error: error.message };
  }
};
