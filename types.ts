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
