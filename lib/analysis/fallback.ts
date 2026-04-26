import { VibeAnalysis } from "@/lib/validations/analysis";

export function getFallbackAnalysis(intendedVibe: string): VibeAnalysis {
  const isDark = intendedVibe.toLowerCase().includes("dark") || intendedVibe.toLowerCase().includes("moody");
  const isBright = intendedVibe.toLowerCase().includes("bright") || intendedVibe.toLowerCase().includes("happy");
  
  return {
    score: 85,
    verdict: `The visual appears to align well with the ${intendedVibe} vibe, showing strong composition and color balance.`,
    intendedVibe: intendedVibe,
    perceivedVibe: isDark ? "Moody and atmospheric" : isBright ? "Vibrant and energetic" : "Balanced and professional",
    insightBullets: [
      "The color palette reinforces the emotional core of the piece.",
      "Compositional elements guide the eye toward the intended focal point.",
      "The overall lighting matches the desired intensity of the vibe."
    ],
    personaReactions: [
      { persona: "Gen Z Trend Chaser", reaction: "The lighting is giving main character energy. Very aesthetic." },
      { persona: "Brand Marketer", reaction: "Clean execution. This would perform well in a sponsored context." },
      { persona: "Indie Artist", reaction: "I appreciate the use of negative space here. It feels intentional." },
      { persona: "Casual Viewer", reaction: "I like the colors! It stands out in a feed." },
      { persona: "Skeptical Critic", reaction: "A bit safe, but technically sound. Does the job." },
      { persona: "Safety-Conscious Community Mod", reaction: "Visuals are clear and appropriate for a wide audience." }
    ],
    improvementSuggestions: [
      "Consider slightly more contrast to make the focal point pop.",
      "Tighten the cropping to remove distracting edge elements.",
      "Adjust the saturation to better match the platform's standard aesthetic."
    ],
    trendSuggestions: [
      "Try adding a subtle grain effect for a more filmic look.",
      "Experiment with asymmetrical typography for a modern edge.",
      "Use a dynamic border to increase engagement on social platforms."
    ]
  };
}
