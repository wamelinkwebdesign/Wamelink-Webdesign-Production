import { GoogleGenAI, Type } from "@google/genai";
import { AiConsultationResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateProjectConcept = async (userIdea: string): Promise<AiConsultationResult> => {
  if (!apiKey) {
    // Fallback mock for demo if no key provided (though environment should have it)
    console.warn("No API Key found. Returning mock data.");
    return {
      sitemap: ["Home", "About Us", "Services", "Contact"],
      colorPalette: ["#000000", "#FFFFFF", "#FF4500"],
      vibeDescription: "A fallback minimalist design because the API key is missing.",
      tagline: "Design without limits."
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The user wants a website concept for: "${userIdea}". 
      Act as a high-end Swiss design agency director. 
      Provide a creative concept including a sitemap, a suggested color palette (hex codes), a 'vibe' description (mood, style), and a catchy tagline.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sitemap: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of recommended pages",
            },
            colorPalette: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-5 hex color codes",
            },
            vibeDescription: {
              type: Type.STRING,
              description: "A short paragraph describing the aesthetic feel.",
            },
            tagline: {
              type: Type.STRING,
              description: "A short, punchy marketing tagline.",
            },
          },
          required: ["sitemap", "colorPalette", "vibeDescription", "tagline"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as AiConsultationResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};