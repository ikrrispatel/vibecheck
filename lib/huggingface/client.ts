import { HfInference } from "@huggingface/inference";

let hf: HfInference | null = null;

export function getHuggingFace(): HfInference {
  if (hf) return hf;
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    throw new Error("HUGGINGFACE_API_KEY is not configured");
  }
  hf = new HfInference(apiKey);
  return hf;
}

export const HF_MODEL = "meta-llama/Llama-3.1-8B-Instruct";
