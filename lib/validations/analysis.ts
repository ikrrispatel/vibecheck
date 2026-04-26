import { z } from "zod";

export const PERSONA_NAMES = [
  "Gen Z Trend Chaser",
  "Brand Marketer",
  "Indie Artist",
  "Casual Viewer",
  "Skeptical Critic",
  "Safety-Conscious Community Mod",
] as const;

export const personaNameSchema = z.enum(PERSONA_NAMES);
export type PersonaName = z.infer<typeof personaNameSchema>;

export const personaReactionSchema = z.object({
  persona: personaNameSchema,
  reaction: z.string().min(1).max(600),
});

export const vibeAnalysisSchema = z
  .object({
    score: z.number().int().min(0).max(100),
    verdict: z.string().min(1).max(400),
    intendedVibe: z.string().min(1).max(400),
    perceivedVibe: z.string().min(1).max(400),
    insightBullets: z.array(z.string().min(1).max(400)).length(3),
    personaReactions: z.array(personaReactionSchema).length(6),
    improvementSuggestions: z.array(z.string().min(1).max(400)).length(3),
    trendSuggestions: z.array(z.string().min(1).max(400)).length(3),
  })
  .strict()
  .superRefine((data, ctx) => {
    // Ensure all six required personas are present, exactly once.
    const seen = new Set<string>();
    for (const r of data.personaReactions) {
      if (seen.has(r.persona)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate persona: ${r.persona}`,
          path: ["personaReactions"],
        });
      }
      seen.add(r.persona);
    }
    for (const required of PERSONA_NAMES) {
      if (!seen.has(required)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Missing persona: ${required}`,
          path: ["personaReactions"],
        });
      }
    }
  });

export type VibeAnalysis = z.infer<typeof vibeAnalysisSchema>;
export type PersonaReaction = z.infer<typeof personaReactionSchema>;
