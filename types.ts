export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
}

export interface AiConsultationResult {
  sitemap: string[];
  colorPalette: string[];
  vibeDescription: string;
  tagline: string;
}

// Sales Outreach Types

export type LeadStatus = 'new' | 'contacted' | 'replied' | 'meeting' | 'proposal' | 'won' | 'lost';
export type OutreachChannel = 'email' | 'linkedin' | 'phone' | 'whatsapp';
export type Industry =
  | 'horeca'
  | 'retail'
  | 'zakelijke-dienstverlening'
  | 'bouw'
  | 'gezondheid'
  | 'technologie'
  | 'onderwijs'
  | 'creatief'
  | 'overig';

export interface Lead {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  industry: Industry;
  city: string;
  status: LeadStatus;
  notes: string;
  createdAt: string;
  lastContactedAt: string | null;
  nextFollowUp: string | null;
  messages: OutreachMessage[];
}

export interface OutreachMessage {
  id: string;
  leadId: string;
  channel: OutreachChannel;
  subject: string;
  body: string;
  sentAt: string | null;
  status: 'draft' | 'sent' | 'opened' | 'replied';
}

export interface OutreachTemplate {
  id: string;
  name: string;
  channel: OutreachChannel;
  subject: string;
  body: string;
  industry: Industry | 'all';
  language: 'nl' | 'en';
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  templateId: string;
  leadIds: string[];
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdAt: string;
  stats: {
    sent: number;
    opened: number;
    replied: number;
    meetings: number;
  };
}

export interface OutreachGenerationRequest {
  lead: Lead;
  channel: OutreachChannel;
  tone: 'formal' | 'friendly' | 'direct';
  language: 'nl' | 'en';
  focusPoint: string;
}
