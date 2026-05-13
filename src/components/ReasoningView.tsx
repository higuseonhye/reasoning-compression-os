"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { HistoryEntry, ReasoningCompression } from "@/types/reasoning";
import { HISTORY_KEY, SESSION_KEY } from "@/lib/storage-keys";

type Props = {
  rawInput: string;
  compressedAt: string;
  result: ReasoningCompression;
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
      {children}
    </h2>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm italic text-stone-500">Nothing surfaced here.</p>
    );
  }
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex gap-2 text-[15px] leading-relaxed text-stone-800"
        >
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-stone-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function readHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is HistoryEntry =>
        !!x &&
        typeof x === "object" &&
        "id" in x &&
        "result" in x &&
        typeof (x as HistoryEntry).id === "string",
    );
  } catch {
    return [];
  }
}

function writeHistory(entries: HistoryEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
}

export function ReasoningView({ rawInput, compressedAt, result }: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  const title = useMemo(() => {
    const line = result.coreProblem.split("\n")[0]?.trim() ?? "Session";
    return line.length > 72 ? `${line.slice(0, 69)}…` : line;
  }, [result.coreProblem]);

  const saveToHistory = () => {
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      savedAt: new Date().toISOString(),
      title,
      rawInputPreview:
        rawInput.length > 400 ? `${rawInput.slice(0, 397)}…` : rawInput,
      result,
      unresolvedAtSave: result.ambiguities,
    };
    const next = [entry, ...readHistory()];
    writeHistory(next);
    setSaved(true);
  };

  const newSession = () => {
    sessionStorage.removeItem(SESSION_KEY);
    router.push("/");
  };

  return (
    <div className="space-y-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs text-stone-500">
            Compressed{" "}
            <time dateTime={compressedAt}>
              {new Date(compressedAt).toLocaleString()}
            </time>
          </p>
          <h1 className="mt-2 text-2xl font-medium tracking-tight text-stone-900">
            Reasoning brief
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={saveToHistory}
            disabled={saved}
            className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm text-stone-800 shadow-sm transition hover:border-stone-300 disabled:cursor-default disabled:opacity-60"
          >
            {saved ? "Saved to history" : "Save to decision history"}
          </button>
          <button
            type="button"
            onClick={newSession}
            className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-stone-800"
          >
            New input
          </button>
          <Link
            href="/history"
            className="rounded-lg px-4 py-2 text-sm text-stone-700 underline-offset-4 hover:underline"
          >
            Open history
          </Link>
        </div>
      </div>

      <section className="space-y-4">
        <SectionTitle>Core problem</SectionTitle>
        <p className="max-w-2xl text-[17px] leading-8 text-stone-800">
          {result.coreProblem}
        </p>
      </section>

      <section className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-4">
          <SectionTitle>Key tensions</SectionTitle>
          <BulletList items={result.keyTensions} />
        </div>
        <div className="space-y-4">
          <SectionTitle>Ambiguities</SectionTitle>
          <BulletList items={result.ambiguities} />
        </div>
      </section>

      <section className="space-y-6">
        <SectionTitle>Decisions & reasoning</SectionTitle>
        {result.decisions.length === 0 ? (
          <p className="text-sm italic text-stone-500">
            No explicit decisions detected.
          </p>
        ) : (
          <div className="space-y-6">
            {result.decisions.map((d, i) => (
              <div
                key={i}
                className="rounded-xl border border-stone-200/90 bg-[var(--rcos-surface)] p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[15px] font-medium text-stone-900">
                    {d.decision}
                  </p>
                  <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-0.5 text-xs font-medium capitalize text-stone-600">
                    {d.confidence} confidence
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">
                  {d.reasoning}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-4">
          <SectionTitle>Tradeoffs</SectionTitle>
          <BulletList items={result.tradeoffs} />
        </div>
        <div className="space-y-4">
          <SectionTitle>Next moves</SectionTitle>
          <BulletList items={result.nextMoves} />
        </div>
      </section>

      <details className="rounded-xl border border-stone-200/80 bg-stone-50/50 p-4">
        <summary className="cursor-pointer text-sm font-medium text-stone-700">
          Source material
        </summary>
        <pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap break-words text-xs leading-relaxed text-stone-600">
          {rawInput}
        </pre>
      </details>
    </div>
  );
}
