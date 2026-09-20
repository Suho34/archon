import { createGoogleGenerativeAI } from "@ai-sdk/google";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

export const google = createGoogleGenerativeAI({
  apiKey: apiKey || "",
});

export const MAIN_MODEL_ID = "gemma-4-31b-it";
export const FALLBACK_MODEL_ID = "gemini-3.5-flash-lite";

export const mainModel = google(MAIN_MODEL_ID);
export const fallbackModel = google(FALLBACK_MODEL_ID);

export function hasGoogleApiKey(): boolean {
  return Boolean(apiKey && apiKey.trim().length > 0);
}
