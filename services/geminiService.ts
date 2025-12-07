import { GoogleGenAI } from "@google/genai";

export const getMotivation = async (completionRate: number): Promise<string> => {
  // Safety check for environment variables to prevent crashes in strict browser environments
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;

  if (!apiKey) return "Keep going, you're doing great!";

  try {
    // Initialize inside the function to avoid top-level execution errors
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Give me a very short, cute, one-sentence motivational quote for a habit tracker user who has completed ${Math.round(completionRate)}% of their tasks today. Act like a supportive potato character.`,
    });
    return response.text || "You got this, spud!";
  } catch (error: any) {
    // Handle Rate Limiting (429) specifically to avoid polluting console with expected errors on free tier
    if (error?.status === 429 || error?.code === 429 || error?.message?.includes('429')) {
      console.warn("Gemini quota exceeded (429). Using fallback motivation.");
      return "You're doing great, sweet potato!";
    }
    
    console.error("Gemini motivation error:", error);
    return "Small steps lead to big changes!";
  }
};