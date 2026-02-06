import { AiConsultationResult } from "../types";

// Gemini AI service - currently disabled (no API key configured)
// To enable, install @google/genai and configure API_KEY environment variable

export const generateProjectConcept = async (_userIdea: string): Promise<AiConsultationResult> => {
  // Return mock data since Gemini is not configured
  console.warn("Gemini API not configured. Returning mock data.");
  return {
    sitemap: ["Home", "About Us", "Services", "Contact"],
    colorPalette: ["#000000", "#FFFFFF", "#FF4500"],
    vibeDescription: "A fallback minimalist design because the API is not configured.",
    tagline: "Design without limits."
  };
};
