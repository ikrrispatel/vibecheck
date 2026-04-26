import { prisma } from "@/lib/db/prisma";
import { getHuggingFace, HF_MODEL } from "@/lib/huggingface/client";
import {
  VIBECHECK_SYSTEM_PROMPT,
  buildUserPrompt,
} from "./prompts";
import { vibeAnalysisSchema, type VibeAnalysis, PERSONA_NAMES, type PersonaName } from "@/lib/validations/analysis";
import { getFallbackAnalysis } from "./fallback";

export class AnalysisError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "AnalysisError";
  }
}

interface RunAnalysisInput {
  projectId: string;
  userId: string; // for ownership check
}

/**
 * Runs the full image-vibe analysis pipeline for a project.
 * - Loads project + primary image
 * - Calls HuggingFace with structured prompt
 * - Validates response with Zod
 * - Stores AnalysisResult row
 */
export async function runProjectAnalysis(
  input: RunAnalysisInput
): Promise<{ analysisId: string; analysis: VibeAnalysis }> {
  const project = await prisma.project.findUnique({
    where: { id: input.projectId },
    include: {
      mediaAssets: {
        where: { type: "IMAGE" },
        orderBy: { createdAt: "asc" },
        take: 1,
      },
    },
  });

  if (!project) throw new AnalysisError("Project not found");
  if (project.userId !== input.userId) {
    throw new AnalysisError("Not authorized for this project");
  }


  // Build the user prompt text
  const userPrompt = buildUserPrompt({
    intendedVibe: project.intendedVibe,
    platformContext: project.platformContext,
    targetAudience: project.targetAudience,
    captionContext: project.captionContext,
  });

  const hf = getHuggingFace();
  
  let raw: string;
  try {
    const response = await hf.chatCompletion({
      model: HF_MODEL,
      messages: [
        { role: "system", content: VIBECHECK_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 2048,
      temperature: 0.7,
    });
    raw = response.choices[0].message.content || "";
  } catch (err) {
    console.error("[analysis] HuggingFace API error:", err);
    // Fallback to deterministic response
    const fallback = getFallbackAnalysis(project.intendedVibe);
    const created = await prisma.analysisResult.create({
      data: {
        projectId: project.id,
        score: fallback.score,
        verdict: fallback.verdict,
        intendedVibe: fallback.intendedVibe,
        perceivedVibe: fallback.perceivedVibe,
        insightBullets: fallback.insightBullets,
        personaReactions: fallback.personaReactions,
        improvementSuggestions: fallback.improvementSuggestions,
        trendSuggestions: fallback.trendSuggestions,
        rawModelResponse: { error: "API Failure", fallback: true } as object,
      },
    });
    return { analysisId: created.id, analysis: fallback };
  }
  if (!raw) throw new AnalysisError("Empty model response");

  // Defensive: strip markdown code fences if the model added them
  // despite responseMimeType: application/json. Also trim whitespace.
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(cleaned);
  } catch {
    console.error("[analysis] Model returned non-JSON:", cleaned.slice(0, 500));
    const fallback = getFallbackAnalysis(project.intendedVibe);
    const created = await prisma.analysisResult.create({
      data: {
        projectId: project.id,
        score: fallback.score,
        verdict: fallback.verdict,
        intendedVibe: fallback.intendedVibe,
        perceivedVibe: fallback.perceivedVibe,
        insightBullets: fallback.insightBullets,
        personaReactions: fallback.personaReactions,
        improvementSuggestions: fallback.improvementSuggestions,
        trendSuggestions: fallback.trendSuggestions,
        rawModelResponse: { error: "Invalid JSON", raw: cleaned } as object,
      },
    });
    return { analysisId: created.id, analysis: fallback };
  }

  const rawData = parsedJson as Record<string, unknown>;
  
  // Build persona reactions mapping
  let personaReactions: Array<{ persona: PersonaName; reaction: string }> = [];
  if (Array.isArray(rawData.personas)) {
    const personas = rawData.personas as Array<{ name?: string; reaction?: string }>;
    const validPersonas = new Set(PERSONA_NAMES as unknown as string[]);
    personaReactions = personas
      .filter((p) => p.name && p.reaction && validPersonas.has(p.name))
      .map((p) => ({ persona: p.name as PersonaName, reaction: p.reaction as string }));
  }
  
  // Ensure all required personas are present with default reactions
  for (const persona of PERSONA_NAMES) {
    if (!personaReactions.find((pr) => pr.persona === persona)) {
      personaReactions.push({ persona, reaction: "No reaction available" });
    }
  }
  
  // Ensure exactly 6 personas
  personaReactions = personaReactions.slice(0, 6);

  const mapped: VibeAnalysis = {
    score: (rawData.alignment_score as number) || 0,
    verdict: (rawData.verdict as string) || "No verdict provided",
    intendedVibe: project.intendedVibe,
    perceivedVibe: ((rawData.verdict as string)?.slice(0, 50)) || project.intendedVibe,
    insightBullets: Array.isArray(rawData.perception_summary) ? (rawData.perception_summary as string[]).slice(0, 3) : ["Insight 1", "Insight 2", "Insight 3"],
    personaReactions,
    improvementSuggestions: Array.isArray(rawData.suggested_changes) ? (rawData.suggested_changes as string[]).slice(0, 3) : ["Imp 1", "Imp 2", "Imp 3"],
    trendSuggestions: Array.isArray(rawData.suggested_changes) ? (rawData.suggested_changes as string[]).slice(0, 3) : ["Trend 1", "Trend 2", "Trend 3"]
  };

  const validated = vibeAnalysisSchema.safeParse(mapped);
  if (!validated.success) {
    console.error("[analysis] Schema validation failed:", validated.error.issues);
    const fallback = getFallbackAnalysis(project.intendedVibe);
    const created = await prisma.analysisResult.create({
      data: {
        projectId: project.id,
        score: fallback.score,
        verdict: fallback.verdict,
        intendedVibe: fallback.intendedVibe,
        perceivedVibe: fallback.perceivedVibe,
        insightBullets: fallback.insightBullets,
        personaReactions: fallback.personaReactions,
        improvementSuggestions: fallback.improvementSuggestions,
        trendSuggestions: fallback.trendSuggestions,
        rawModelResponse: { error: "Schema Mismatch", parsed: parsedJson } as object,
      },
    });
    return { analysisId: created.id, analysis: fallback };
  }

  const a = validated.data;

  const created = await prisma.analysisResult.create({
    data: {
      projectId: project.id,
      score: a.score,
      verdict: a.verdict,
      intendedVibe: a.intendedVibe,
      perceivedVibe: a.perceivedVibe,
      insightBullets: a.insightBullets,
      personaReactions: a.personaReactions,
      improvementSuggestions: a.improvementSuggestions,
      trendSuggestions: a.trendSuggestions,
      rawModelResponse: parsedJson as object,
    },
  });

  return { analysisId: created.id, analysis: a };
}
