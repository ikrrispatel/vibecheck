import { prisma } from "@/lib/db/prisma";
import { getStorage } from "@/lib/uploads/storage";
import { getRekaClient, REKA_MODEL } from "@/lib/reka/client";
import {
  VIBECHECK_SYSTEM_PROMPT,
  buildUserPrompt,
} from "./prompts";
import { vibeAnalysisSchema, type VibeAnalysis } from "@/lib/validations/analysis";
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
 * - Calls Reka AI with structured prompt + image
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

  let imageBase64 = "";
  let imageMime = "";
  const primaryImage = project.mediaAssets[0];
  
  if (primaryImage) {
    console.log(`[analysis] loading_image: path="${primaryImage.filePath}" url="${primaryImage.fileUrl}"`);
    const storage = getStorage();
    try {
      const buffer = await storage.readBuffer(primaryImage.filePath);
      imageBase64 = buffer.toString("base64");
      imageMime = primaryImage.mimeType;
      console.log(`[analysis] image_loaded_successfully: size=${buffer.length} bytes`);
    } catch (err: any) {
      console.error(`[analysis] IMAGE_READ_FAILURE: Could not read file at "${primaryImage.filePath}". Reason: ${err.message}`);
      // We continue but the lack of imageBase64 will trigger a constrained prompt
    }
  } else {
    console.log("[analysis] no_primary_image_found: proceeding in text-only mode");
  }
  
  // EMERGENCY HEURISTIC MODE: Use deterministic fallback as primary for stability
  console.log("[analysis] mode=heuristic_fallback");
  const fallback = getFallbackAnalysis(
    project.intendedVibe,
    project.title,
    project.platformContext || "",
    project.targetAudience || "",
    project.captionContext || ""
  );

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
      rawModelResponse: { mode: "emergency_heuristic_fallback" } as object,
    },
  });

  return { analysisId: created.id, analysis: fallback };
}
