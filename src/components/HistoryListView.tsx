"use client";

import Link from "next/link";
import type { HistoryEntry } from "@/types/reasoning";

type Props = {
  entries: HistoryEntry[];
  readOnly?: boolean;
  onRemove?: (id: string) => void;
  onOutcomeBlur?: (id: string, notes: string) => void;
};

export function HistoryListView({
  entries,
  readOnly = false,
  onRemove,
  onOutcomeBlur,
}: Props) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-stone-900">
            Decision history
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-600">
            A lightweight log of what was decided, why, and what stayed open.
            Stored locally in your browser for this MVP.
          </p>
        </div>
        <Link
          href="/"
          className="text-sm font-medium text-stone-800 underline-offset-4 hover:underline"
        >
          New compression
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-[var(--rcos-surface)] px-6 py-16 text-center">
          <p className="text-sm text-stone-600">
            Nothing saved yet. Run a compression and use{" "}
            <span className="font-medium text-stone-800">
              Save to decision history
            </span>{" "}
            on the reasoning brief.
          </p>
        </div>
      ) : (
        <ul className="space-y-8">
          {entries.map((e) => (
            <li
              key={e.id}
              className="rounded-xl border border-stone-200/90 bg-[var(--rcos-surface)] p-6 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs text-stone-500">
                    Saved {new Date(e.savedAt).toLocaleString()}
                  </p>
                  <h2 className="mt-1 text-lg font-medium text-stone-900">
                    {e.title}
                  </h2>
                </div>
                {!readOnly && onRemove ? (
                  <button
                    type="button"
                    onClick={() => onRemove(e.id)}
                    className="self-start text-xs text-stone-500 underline-offset-4 hover:text-red-700 hover:underline"
                  >
                    Remove
                  </button>
                ) : null}
              </div>

              <div className="mt-6 grid gap-8 lg:grid-cols-2">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                    Decisions
                  </h3>
                  <ul className="mt-3 space-y-3">
                    {e.result.decisions.length === 0 ? (
                      <li className="text-sm italic text-stone-500">None</li>
                    ) : (
                      e.result.decisions.map((d, i) => (
                        <li key={i} className="text-sm text-stone-800">
                          <span className="font-medium">{d.decision}</span>
                          <span className="text-stone-500"> — </span>
                          <span className="text-stone-600">{d.reasoning}</span>
                          <span className="ml-2 text-xs capitalize text-stone-500">
                            ({d.confidence})
                          </span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                    Unresolved at save
                  </h3>
                  <ul className="mt-3 list-disc space-y-1.5 pl-4 text-sm text-stone-700">
                    {(e.unresolvedAtSave ?? []).length === 0 ? (
                      <li className="italic text-stone-500">None captured</li>
                    ) : (
                      (e.unresolvedAtSave ?? []).map((a, i) => (
                        <li key={i}>{a}</li>
                      ))
                    )}
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor={`outcome-${e.id}`}
                  className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500"
                >
                  Later outcome / notes
                </label>
                <textarea
                  id={`outcome-${e.id}`}
                  defaultValue={e.outcomeNotes ?? ""}
                  readOnly={readOnly}
                  onBlur={(ev) => {
                    if (!readOnly && onOutcomeBlur) {
                      onOutcomeBlur(e.id, ev.target.value);
                    }
                  }}
                  placeholder="What happened next? What would you do differently?"
                  className="mt-2 min-h-[88px] w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none read-only:bg-stone-50 read-only:text-stone-700"
                />
              </div>

              <details className="mt-4">
                <summary className="cursor-pointer text-xs text-stone-500">
                  Input preview
                </summary>
                <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-stone-600">
                  {e.rawInputPreview}
                </p>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
