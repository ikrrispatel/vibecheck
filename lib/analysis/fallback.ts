import { VibeAnalysis } from "@/lib/validations/analysis";

/**
 * Emergency Heuristic Analysis Mode
 * Provides deterministic, varied, and content-aware results without external AI.
 */

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function getFallbackAnalysis(
  intendedVibe: string, 
  title: string = "", 
  platform: string = "", 
  audience: string = "", 
  caption: string = ""
): VibeAnalysis {
  const combined = `${title}|${intendedVibe}|${platform}|${audience}|${caption}`;
  const hash = simpleHash(combined);
  
  // Deterministic score between 40 and 80
  const score = 40 + (hash % 41);
  
  const vibe = intendedVibe.toLowerCase();
  
  // Category mapping
  let cat: 'MEME' | 'LUXURY' | 'CINEMATIC' | 'COZY' | 'ENERGY' | 'FACTS' | 'DEFAULT' = 'DEFAULT';
  if (/funny|meme|chaotic|brainrot/.test(vibe)) cat = 'MEME';
  else if (/premium|luxury|elegant/.test(vibe)) cat = 'LUXURY';
  else if (/dark|mysterious|cinematic/.test(vibe)) cat = 'CINEMATIC';
  else if (/cozy|nostalgic/.test(vibe)) cat = 'COZY';
  else if (/high energy|gaming|rebellious|intense/.test(vibe)) cat = 'ENERGY';
  else if (/facts|educational|knowledge|info/.test(vibe)) cat = 'FACTS';

  const data = {
    MEME: {
      perceived: "Chaotic & High-Energy",
      verdict: score > 67 ? "Strong absurdity that stops the scroll with raw energy." : "Meme signal is present but composition feels a bit too structured.",
      insights: [
        "Visual exaggeration creates immediate emotional friction.",
        "Deliberately unpolished aesthetic signals authenticity to the target feed.",
        "Scroll-stopping power is high due to the unexpected focal point."
      ],
      suggestions: [
        "Push the saturation even further to lean into the brainrot aesthetic.",
        "Use more aggressive cropping to isolate the funniest visual element.",
        "Reduce lighting polish to maintain a 'low-fi' authentic feel."
      ],
      personas: [
        { name: "Gen Z Trend Chaser", reaction: "Literal brainrot energy. This is going to clear the feed." },
        { name: "Brand Marketer", reaction: "Risky but the chaotic signal is undeniably strong for engagement." },
        { name: "Indie Artist", reaction: "I hate how much I like the deliberate lack of hierarchy here." },
        { name: "Casual Viewer", reaction: "I don't know what this is but I stopped scrolling." },
        { name: "Skeptical Critic", reaction: "Peak absurdity. It's either genius or a total mess." },
        { name: "Safety-Conscious Community Mod", reaction: "Signal is chaotic but clear. No immediate red flags." }
      ]
    },
    LUXURY: {
      perceived: "Refined & Premium",
      verdict: score > 67 ? "Excellent use of negative space and typographic restraint." : "Feels premium but the visual hierarchy is slightly cluttered for a luxury brief.",
      insights: [
        "Minimalist composition reinforces a sense of high-end exclusivity.",
        "Typography is used with significant restraint, allowing the visual to breathe.",
        "Color palette is muted and sophisticated, avoiding cheap 'loud' signals."
      ],
      suggestions: [
        "Increase negative space around the focal point for more elegance.",
        "Use a thinner, more refined typeface to match the premium signal.",
        "Desaturate secondary colors to keep the focus on the primary subject."
      ],
      personas: [
        { name: "Gen Z Trend Chaser", reaction: "Old money aesthetic. Very clean, very demure." },
        { name: "Brand Marketer", reaction: "This positions the product perfectly in the high-end segment." },
        { name: "Indie Artist", reaction: "The balance of tones is masterfully handled here." },
        { name: "Casual Viewer", reaction: "Looks expensive. I'd definitely click this." },
        { name: "Skeptical Critic", reaction: "A bit safe, but the technical execution is flawless." },
        { name: "Safety-Conscious Community Mod", reaction: "Very professional and trustworthy visual signaling." }
      ]
    },
    CINEMATIC: {
      perceived: "Moody & Atmospheric",
      verdict: score > 67 ? "Compelling use of shadows and high-contrast tension." : "The mood is there, but the focal point gets lost in the shadows.",
      insights: [
        "Heavy use of shadow creates immediate narrative tension.",
        "High-contrast lighting guides the eye toward the primary emotional signal.",
        "Composition feels wide and epic, mimicking large-format cinematography."
      ],
      suggestions: [
        "Deepen the blacks to increase the overall atmospheric tension.",
        "Add a subtle directional light to pull the subject out of the background.",
        "Tighten the aspect ratio to force a more claustrophobic, moody feel."
      ],
      personas: [
        { name: "Gen Z Trend Chaser", reaction: "Main character energy. This looks like a movie frame." },
        { name: "Brand Marketer", reaction: "Strong storytelling potential. Very high production value feel." },
        { name: "Indie Artist", reaction: "The lighting setup is brave. I love the texture in the shadows." },
        { name: "Casual Viewer", reaction: "Ooh, spooky/moody. It's really eye-catching." },
        { name: "Skeptical Critic", reaction: "A bit clichéd, but it nails the atmospheric brief." },
        { name: "Safety-Conscious Community Mod", reaction: "Clear signal, though perhaps a bit dark for some displays." }
      ]
    },
    COZY: {
      perceived: "Warm & Nostalgic",
      verdict: score > 67 ? "Instantly familiar warmth with soft, welcoming visual signals." : "A bit too clinical for a cozy brief; needs more warmth and softness.",
      insights: [
        "Soft-focus elements create a sense of comfort and familiarity.",
        "Warm color temperature reinforces the nostalgic emotional core.",
        "Composition is intimate, bringing the viewer close to the subject."
      ],
      suggestions: [
        "Soften the edges of your focal point to reduce visual harshness.",
        "Introduce warmer amber or orange tones into the highlight areas.",
        "Use a shallower depth of field to create a dreamier, cozy feel."
      ],
      personas: [
        { name: "Gen Z Trend Chaser", reaction: "Vibey. Makes me want to go buy a candle and read." },
        { name: "Brand Marketer", reaction: "Very relatable. This builds great emotional trust." },
        { name: "Indie Artist", reaction: "Soft lighting is notoriously hard to get right. This works." },
        { name: "Casual Viewer", reaction: "Makes me feel happy. Very nice colors." },
        { name: "Skeptical Critic", reaction: "Maybe a little too sweet, but it communicates the vibe well." },
        { name: "Safety-Conscious Community Mod", reaction: "Very safe, welcoming, and clear signal." }
      ]
    },
    ENERGY: {
      perceived: "Intense & Aggressive",
      verdict: score > 67 ? "Aggressive framing and high-energy contrast drive immediate action." : "Lacks the 'punch' needed for an intense brief; needs more motion.",
      insights: [
        "Dutch angles or aggressive framing create a sense of urgent motion.",
        "High-key contrast ensures the signal doesn't get lost in the feed.",
        "Visual energy is maximized through sharp lines and vibrant saturation."
      ],
      suggestions: [
        "Tilt the frame slightly to create more dynamic visual energy.",
        "Add motion blur to the secondary elements to emphasize speed.",
        "Use more saturated accent colors to make the call-to-action pop."
      ],
      personas: [
        { name: "Gen Z Trend Chaser", reaction: "Hype. This is definitely going to pop on the explore page." },
        { name: "Brand Marketer", reaction: "Great for a launch. The energy is exactly what we need." },
        { name: "Indie Artist", reaction: "The composition is a bit frantic, but that's clearly the intent." },
        { name: "Casual Viewer", reaction: "Whoa, that's intense. I definitely stopped." },
        { name: "Skeptical Critic", reaction: "A little loud for my taste, but it's hard to ignore." },
        { name: "Safety-Conscious Community Mod", reaction: "Intense signal but everything is legible and appropriate." }
      ]
    },
    FACTS: {
      perceived: "Clear & Authoritative",
      verdict: score > 67 ? "Strong information hierarchy with high readability and trust." : "The layout is a bit messy; the core information is hard to find.",
      insights: [
        "Strict information hierarchy guides the viewer through the key facts.",
        "Clean, legible typography builds immediate authority and trust.",
        "Composition is balanced and logical, avoiding distracting elements."
      ],
      suggestions: [
        "Increase the font size of the primary headline for better hierarchy.",
        "Use a more structured grid to align the data points more clearly.",
        "Reduce background noise to keep the focus entirely on the facts."
      ],
      personas: [
        { name: "Gen Z Trend Chaser", reaction: "I actually learned something. Clean design too." },
        { name: "Brand Marketer", reaction: "Excellent for educational content. Very credible feel." },
        { name: "Indie Artist", reaction: "Simple, effective, and well-balanced. Good grid work." },
        { name: "Casual Viewer", reaction: "Easy to read. I like when things are this clear." },
        { name: "Skeptical Critic", reaction: "Functional and efficient. It doesn't over-promise visually." },
        { name: "Safety-Conscious Community Mod", reaction: "Highly appropriate and clear information signaling." }
      ]
    },
    DEFAULT: {
      perceived: "Balanced & Professional",
      verdict: score > 67 ? "A solid, well-rounded visual that communicates clearly." : "Needs more specific visual signal to really differentiate from the noise.",
      insights: [
        "Composition follows standard rules for a professional look.",
        "Color balance is maintained across the entire visual field.",
        "Visual hierarchy is present but could be more intentional."
      ],
      suggestions: [
        "Find a more unique focal point to stand out from the noise.",
        "Commit more strongly to a specific color palette direction.",
        "Try a more daring composition to increase scroll-stopping power."
      ],
      personas: [
        { name: "Gen Z Trend Chaser", reaction: "It's clean. Not exactly a trend-setter, but it works." },
        { name: "Brand Marketer", reaction: "Solid professional work. Reliable for most platforms." },
        { name: "Indie Artist", reaction: "Standard execution. Good technical foundation." },
        { name: "Casual Viewer", reaction: "Looks nice. I'd probably stop for a second." },
        { name: "Skeptical Critic", reaction: "A bit safe, but technically sound. Does the job." },
        { name: "Safety-Conscious Community Mod", reaction: "Visuals are clear and appropriate for a wide audience." }
      ]
    }
  };

  const selected = data[cat];

  // Adjust verdict for score band
  let finalVerdict = selected.verdict;
  if (score < 55) {
    finalVerdict = `Mismatch detected: the visual lacks the clear "${intendedVibe}" signal needed to connect with the target audience.`;
  } else if (score < 68) {
    finalVerdict = `Partial alignment: the visual captures the essence of "${intendedVibe}" but requires more specific execution to truly pop.`;
  }

  return {
    score,
    verdict: finalVerdict,
    intendedVibe: intendedVibe,
    perceivedVibe: selected.perceived,
    insightBullets: selected.insights,
    personaReactions: selected.personas.map(p => ({ persona: p.name as any, reaction: p.reaction })),
    improvementSuggestions: selected.suggestions,
    trendSuggestions: [
      "Amplify the lighting contrast to create more depth.",
      "Experiment with asymmetrical framing for a modern look.",
      "Add a subtle grain texture to reduce the digital clinical feel."
    ]
  };
}
