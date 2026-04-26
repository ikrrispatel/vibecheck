import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { AnalysisError, runProjectAnalysis } from "@/lib/analysis/service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * Translate raw errors into user-facing messages.
 * In development, we also include the raw message so the user can debug
 * without having to dig through server logs.
 */
function describeError(err: unknown): { message: string; status: number } {
  const isDev = process.env.NODE_ENV !== "production";
  const raw = err instanceof Error ? err.message : String(err);

  // HuggingFace API key missing
  if (raw.includes("HUGGINGFACE_API_KEY")) {
    return {
      status: 500,
      message:
        "HuggingFace is not configured. Set HUGGINGFACE_API_KEY in your .env file.",
    };
  }

  // HuggingFace authentication or model access
  if (/401|403|404|api.?key|authentication|permission|not.+found/i.test(raw)) {
    return {
      status: 502,
      message:
        "HuggingFace API issue. Check your HUGGINGFACE_API_KEY and model availability.",
    };
  }

  // Rate limit
  if (/rate.?limit|429/i.test(raw)) {
    return {
      status: 429,
      message: "Hit HuggingFace rate limit. Wait a moment and try again.",
    };
  }

  // Schema validation
  if (/schema validation|non-JSON/i.test(raw)) {
    return {
      status: 502,
      message: isDev
        ? `The model returned malformed output. ${raw}`
        : "The model returned an unexpected response. Try again.",
    };
  }

  // Default
  return {
    status: 500,
    message: isDev
      ? `Analysis failed: ${raw}`
      : "Analysis failed. Please try again.",
  };
}

export async function POST(_req: NextRequest, ctx: RouteContext) {
  const user = await requireUser();
  const { id } = await ctx.params;

  try {
    const result = await runProjectAnalysis({ projectId: id, userId: user.id });
    return NextResponse.json(
      { analysisId: result.analysisId, analysis: result.analysis },
      { status: 200 }
    );
  } catch (err) {
    // Always log full error server-side
    console.error("[analyze]", err);

    if (err instanceof AnalysisError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    const { message, status } = describeError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
