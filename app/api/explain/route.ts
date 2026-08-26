import { NextRequest, NextResponse } from "next/server";
import { explainTerm, ExplainError } from "@/lib/ai";
import { getCachedExplanation, setCachedExplanation, normalizeKey } from "@/lib/cache";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  let query = "";
  try {
    const body = await request.json();
    if (typeof body?.query === "string") {
      query = body.query.replace(/\s+/g, " ").trim().slice(0, 200);
    }
  } catch {
    query = "";
  }

  if (!query) {
    return NextResponse.json(
      { error: "Type a meme, slang word, phrase, or reference first." },
      { status: 400 }
    );
  }

  const cacheKey = normalizeKey(query);
  const cached = getCachedExplanation(cacheKey);
  if (cached) {
    return NextResponse.json({ ok: true, cached: true, data: cached });
  }

  try {
    const data = await explainTerm(query);
    setCachedExplanation(cacheKey, data);
    return NextResponse.json({ ok: true, cached: false, data });
  } catch (error) {
    if (error instanceof ExplainError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[api/explain] unexpected error:", error);
    return NextResponse.json(
      { error: "Something went wrong on our side. Try again." },
      { status: 500 }
    );
  }
}
