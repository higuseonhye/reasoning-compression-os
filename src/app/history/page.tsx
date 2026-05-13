"use client";

import { useCallback, useEffect, useState } from "react";
import { HistoryListView } from "@/components/HistoryListView";
import type { HistoryEntry } from "@/types/reasoning";
import { HISTORY_KEY } from "@/lib/storage-keys";

function load(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is HistoryEntry => {
      if (!x || typeof x !== "object") return false;
      const e = x as Partial<HistoryEntry>;
      return typeof e.id === "string" && !!e.result && typeof e.result === "object";
    });
  } catch {
    return [];
  }
}

function save(entries: HistoryEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
}

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  const refresh = useCallback(() => {
    setEntries(load());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateOutcome = (id: string, notes: string) => {
    const next = entries.map((e) =>
      e.id === id ? { ...e, outcomeNotes: notes } : e,
    );
    setEntries(next);
    save(next);
  };

  const remove = (id: string) => {
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    save(next);
  };

  return (
    <HistoryListView
      entries={entries}
      onRemove={remove}
      onOutcomeBlur={updateOutcome}
    />
  );
}
