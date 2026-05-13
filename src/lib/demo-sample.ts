import type { ReasoningCompression } from "@/types/reasoning";

/** Fixed timestamp so screenshots and docs stay consistent. */
export const DEMO_COMPRESSED_AT = "2026-05-13T15:00:00.000Z";

export const DEMO_RAW_INPUT = `[Design sync — 22m]

Alex: We're debating whether the MVP should ship with team workspaces or stay single-player until we prove the compression loop.

Jordan: Single-player is faster. I'm worried org features dilute the narrative before we have retention.

Alex: Fair, but our ICP is already teams drowning in Slack. They won't feel the value without shared history.

Jordan: Could we fake "team" with export-only for v1?

Alex: Maybe. We still owe leadership a call on pricing — nobody wants to reopen that.

Sam (late): Ship single-player + shared read-only links. Pricing stays founder-led until Q3. I'll document that unless someone objects by EOD.

[no objections in thread]`;

export const DEMO_RESULT: ReasoningCompression = {
  coreProblem:
    "The team must choose an MVP scope (single-player vs team-oriented features) and related go-to-market positioning, without delaying a decision on pricing ownership that leadership is waiting on.",
  keyTensions: [
    "Speed and narrative focus (single-player first) versus ICP fit (teams in Slack who need shared context).",
    "Avoiding premature org complexity versus delivering a credible “team” story.",
    "Reopening pricing discussions versus keeping executive alignment stable.",
  ],
  ambiguities: [
    "Whether “shared read-only links” fully substitutes for a workspace in the near term.",
    "What “founder-led pricing until Q3” concretely commits the org to.",
    "Whether Sam’s EOD objection window is sufficient for async sign-off.",
  ],
  decisions: [
    {
      decision:
        "Ship single-player for the MVP and add shared read-only links as the lightweight collaboration surface.",
      reasoning:
        "Sam proposed this as a compromise to preserve velocity while still offering a minimal team-adjacent path; the thread shows implicit acceptance when no objections arrived by EOD.",
      confidence: "medium",
    },
    {
      decision:
        "Defer formal pricing committee work; founders own pricing until Q3.",
      reasoning:
        "Explicitly stated to reduce thrash and avoid reopening a sensitive leadership topic before the product loop is proven.",
      confidence: "high",
    },
  ],
  tradeoffs: [
    "Single-player first reduces build surface and sharpens the story, but may under-demo value for highly collaborative buyers.",
    "Read-only links add sharing without permissions complexity, but may not support editing, comments, or trust workflows teams expect.",
    "Delaying structured pricing trades short-term clarity for focus on product–market fit.",
  ],
  nextMoves: [
    "Document the agreed MVP scope, link-sharing behavior, and pricing ownership in a short decision memo.",
    "Confirm no outstanding objections after the EOD window and capture dissent if any appears.",
    "Translate “read-only links” into a concrete UX + security checklist (revocation, expiry, access logs).",
  ],
};
