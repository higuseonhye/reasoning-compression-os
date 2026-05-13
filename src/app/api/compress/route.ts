import OpenAI from "openai";
import { NextResponse } from "next/server";
import type { ReasoningCompression } from "@/types/reasoning";

const SYSTEM = `You are a reasoning compression engine for teams. Your job is not to add opinions or generic advice. Extract structure from the user's text only.

Output valid JSON matching this shape exactly (no markdown fences, no commentary):
{
  "coreProblem": "string — the actual problem under discussion, one tight paragraph",
  "keyTensions": ["string", ...],
  "ambiguities": ["string", ...],
  "decisions": [{ "decision": "string", "reasoning": "string — why, grounded in the text", "confidence": "low" | "medium" | "high" }],
  "tradeoffs": ["string", ...],
  "nextMoves": ["string", ...]
}

Rules:
- Be concise. Prefer short bullets over paragraphs inside arrays.
- If something is missing in the source, use an empty array or a neutral coreProblem stating what is unclear.
- keyTensions: disagreements, competing priorities, or unresolved pulls.
- tradeoffs: explicit cost/benefit or path comparisons (may overlap slightly with tensions; keep items distinct when possible).
- decisions: only commitments or conclusions stated or strongly implied; if none, empty array.
- confidence reflects how explicit the text is about the decision.
- nextMoves: concrete next steps implied or logically required; avoid fluff.`;

function normalizeConfidence(
  v: unknown,
): "low" | "medium" | "high" {
  if (v === "low" || v === "medium" || v === "high") return v;
  return "medium";
}

function parsePayload(raw: unknown): ReasoningCompression | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const coreProblem =
    typeof o.coreProblem === "string" ? o.coreProblem.trim() : "";
  const keyTensions = Array.isArray(o.keyTensions)
    ? o.keyTensions.filter((x): x is string => typeof x === "string")
    : [];
  const ambiguities = Array.isArray(o.ambiguities)
    ? o.ambiguities.filter((x): x is string => typeof x === "string")
    : [];
  const tradeoffs = Array.isArray(o.tradeoffs)
    ? o.tradeoffs.filter((x): x is string => typeof x === "string")
    : [];
  const nextMoves = Array.isArray(o.nextMoves)
    ? o.nextMoves.filter((x): x is string => typeof x === "string")
    : [];
  const decisionsRaw = Array.isArray(o.decisions) ? o.decisions : [];
  const decisions = decisionsRaw
    .map((d) => {
      if (!d || typeof d !== "object") return null;
      const r = d as Record<string, unknown>;
      const decision = typeof r.decision === "string" ? r.decision.trim() : "";
      const reasoning =
        typeof r.reasoning === "string" ? r.reasoning.trim() : "";
      if (!decision) return null;
      return {
        decision,
        reasoning: reasoning || "Not stated explicitly in the source.",
        confidence: normalizeConfidence(r.confidence),
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (!coreProblem && keyTensions.length === 0 && ambiguities.length === 0) {
    return null;
  }

  return {
    coreProblem:
      coreProblem ||
      "The source material did not surface a clear core problem; add more context.",
    keyTensions,
    ambiguities,
    decisions,
    tradeoffs,
    nextMoves,
  };
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing OPENAI_API_KEY on the server." },
      { status: 500 },
    );
  }

  const openai = new OpenAI({ apiKey });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const text =
    body &&
    typeof body === "object" &&
    "text" in body &&
    typeof (body as { text: unknown }).text === "string"
      ? (body as { text: string }).text.trim()
      : "";

  if (!text) {
    return NextResponse.json(
      { error: "Provide non-empty text to compress." },
      { status: 400 },
    );
  }

  if (text.length > 120_000) {
    return NextResponse.json(
      { error: "Input is too long for this MVP (max ~120k characters)." },
      { status: 400 },
    );
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  try {
    const completion = await openai.chat.completions.create({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: `Compress the following material into the JSON schema:\n\n---\n${text}\n---`,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "No content returned from the model." },
        { status: 502 },
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "Model returned invalid JSON." },
        { status: 502 },
      );
    }

    const result = parsePayload(parsed);
    if (!result) {
      return NextResponse.json(
        { error: "Could not normalize model output." },
        { status: 502 },
      );
    }

    return NextResponse.json({ result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
