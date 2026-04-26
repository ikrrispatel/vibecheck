import OpenAI from "openai";

export const REKA_MODEL = "reka-flash";

export function getRekaClient() {
  const apiKey = process.env.REKA_API_KEY;
  if (!apiKey) {
    throw new Error("REKA_API_KEY is not configured");
  }

  return new OpenAI({
    apiKey,
    baseURL: "https://api.reka.ai/v1",
  });
}
