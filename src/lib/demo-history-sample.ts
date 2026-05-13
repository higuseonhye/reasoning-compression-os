import type { HistoryEntry } from "@/types/reasoning";
import { DEMO_RAW_INPUT, DEMO_RESULT } from "@/lib/demo-sample";

export const DEMO_HISTORY_ENTRIES: HistoryEntry[] = [
  {
    id: "demo-history-1",
    savedAt: "2026-05-13T16:30:00.000Z",
    title:
      "The team must choose an MVP scope (single-player vs team-oriented features)…",
    rawInputPreview:
      DEMO_RAW_INPUT.length > 400
        ? `${DEMO_RAW_INPUT.slice(0, 397)}…`
        : DEMO_RAW_INPUT,
    result: DEMO_RESULT,
    unresolvedAtSave: DEMO_RESULT.ambiguities,
    outcomeNotes:
      "Shipped read-only links in beta; pricing still founder-led. Team workspaces punted to Q4.",
  },
  {
    id: "demo-history-2",
    savedAt: "2026-05-10T09:15:00.000Z",
    title: "Reduce ambiguity on incident response ownership before the audit window.",
    rawInputPreview:
      "War room notes: on-call rotation vs dedicated incident commander…",
    result: {
      coreProblem:
        "Clarify who owns comms, technical mitigation, and customer updates during a sev-1 before the compliance audit.",
      keyTensions: [
        "Rotating on-call keeps load fair but weakens rehearsal depth.",
        "A dedicated commander improves coherence but can bottleneck decisions.",
      ],
      ambiguities: [
        "Whether marketing should post externally before engineering confirms scope.",
      ],
      decisions: [
        {
          decision:
            "Incident commander is always the current platform lead; on-call executes.",
          reasoning:
            "Stated explicitly in the retro: single throat to coordinate updates.",
          confidence: "high",
        },
      ],
      tradeoffs: [
        "Central command vs faster parallel workstreams from domain experts.",
      ],
      nextMoves: [
        "Publish a one-page runbook and run a tabletop exercise next Tuesday.",
      ],
    },
    unresolvedAtSave: [
      "Whether marketing should post externally before engineering confirms scope.",
    ],
    outcomeNotes: "",
  },
];
