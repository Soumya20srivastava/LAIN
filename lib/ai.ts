import type { Explanation, ExplanationStatus, UsageExample } from "./types";
import { buildMessages } from "./prompts";

const BASE_URL = process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1";
const MODEL = process.env.OPENROUTER_MODEL?.trim().replace(/^["']|["']$/g, "") || "stealth/ox-alpha";
const TIMEOUT_MS = 60_000;

const VALID_STATUSES: ExplanationStatus[] = [
  "current",
  "outdated",
  "ironic",
  "offensive",
  "context-dependent",
];

export class ExplainError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "ExplainError";
    this.status = status;
  }
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function asStringArray(value: unknown, min: number, max: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim())
    .slice(0, max)
    .filter((item, index, arr) => arr.indexOf(item) === index || index < min);
}

function parseExplanation(raw: string): Explanation {
  let text = raw.trim();
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch) text = fenceMatch[1];

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new ExplainError("The AI returned an unreadable response.", 502);
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(text.slice(start, end + 1));
  } catch {
    throw new ExplainError("The AI returned malformed data.", 502);
  }

  const rawExamples = Array.isArray(parsed.examples) ? parsed.examples : [];
  const examples: UsageExample[] = rawExamples
    .map((item) => {
      const obj = (item ?? {}) as Record<string, unknown>;
      return { text: asString(obj.text), context: asString(obj.context) };
    })
    .filter((item) => item.text.length > 0)
    .slice(0, 3);

  const statusCandidate = asString(parsed.status).toLowerCase() as ExplanationStatus;
  const status = VALID_STATUSES.includes(statusCandidate) ? statusCandidate : "context-dependent";

  const explanation: Explanation = {
    term: asString(parsed.term, "Unknown"),
    category: asString(parsed.category, "other").toLowerCase(),
    summary: asString(parsed.summary),
    meaning: asString(parsed.meaning),
    origin: asString(parsed.origin),
    popularity: asString(parsed.popularity),
    usage: asString(parsed.usage),
    tone: asString(parsed.tone),
    status,
    statusNote: asString(parsed.statusNote),
    examples,
    related: asStringArray(parsed.related, 2, 5),
  };

  if (!explanation.meaning && !explanation.summary) {
    throw new ExplainError("The AI returned an empty explanation.", 502);
  }
  if (!explanation.summary) explanation.summary = explanation.meaning.slice(0, 140);

  return explanation;
}

export async function explainTerm(query: string): Promise<Explanation> {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim().replace(/^["']|["']$/g, "");
  if (!apiKey) {
    throw new ExplainError(
      "Server is not configured yet: set OPENROUTER_API_KEY in your hosting environment variables (Netlify: Site configuration > Environment variables), then redeploy.",
      503
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "LAIN",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: buildMessages(query),
        temperature: 0.6,
        max_tokens: 2000,
      }),
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timer);
    if (error instanceof Error && error.name === "AbortError") {
      throw new ExplainError("The AI took too long to respond. Try again.", 504);
    }
    throw new ExplainError("Could not reach OpenRouter. Check your internet connection.", 502);
  }
  clearTimeout(timer);

  if (!response.ok) {
    let detail = "";
    try {
      const body = await response.json();
      detail = typeof body?.error?.message === "string" ? body.error.message : "";
    } catch {}

    if (response.status === 401) {
      throw new ExplainError("OpenRouter rejected the API key. Re-check OPENROUTER_API_KEY in your hosting environment variables (no spaces, quotes, or truncation), then redeploy.", 401);
    }
    if (response.status === 402) {
      throw new ExplainError("The OpenRouter account behind this key is out of credits.", 402);
    }
    if (response.status === 404) {
      throw new ExplainError(
        `Model "${MODEL}" was not found on OpenRouter. Set OPENROUTER_MODEL in your hosting environment variables to a valid model id.`,
        404
      );
    }
    if (response.status === 429) {
      throw new ExplainError("Rate limited by OpenRouter. Wait a moment and try again.", 429);
    }
    throw new ExplainError(detail || `OpenRouter returned an error (${response.status}).`, 502);
  }

  const payload = await response.json().catch(() => null);
  const content: string | undefined = payload?.choices?.[0]?.message?.content;
  if (!content) {
    throw new ExplainError("The AI returned an empty response.", 502);
  }

  return parseExplanation(content);
}
