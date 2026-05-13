export type DecisionItem = {
  decision: string;
  reasoning: string;
  confidence: "low" | "medium" | "high";
};

export type ReasoningCompression = {
  coreProblem: string;
  keyTensions: string[];
  ambiguities: string[];
  decisions: DecisionItem[];
  tradeoffs: string[];
  nextMoves: string[];
};

export type SessionPayload = {
  rawInput: string;
  compressedAt: string;
  result: ReasoningCompression;
};

export type HistoryEntry = {
  id: string;
  savedAt: string;
  title: string;
  rawInputPreview: string;
  result: ReasoningCompression;
  outcomeNotes?: string;
  unresolvedAtSave?: string[];
};
