"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { ReasoningCompression } from "@/types/reasoning";
import { SESSION_KEY } from "@/lib/storage-keys";

export function InputWorkspace() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onFile = useCallback((file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const v = reader.result;
      if (typeof v === "string") setText(v);
    };
    reader.readAsText(file);
  }, []);

  const compress = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/compress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = (await res.json()) as {
        result?: ReasoningCompression;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Request failed.");
        return;
      }
      if (!data.result) {
        setError("Unexpected response.");
        return;
      }
      const payload = {
        rawInput: text,
        compressedAt: new Date().toISOString(),
        result: data.result,
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
      router.push("/reasoning");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-stone-200/90 bg-[var(--rcos-surface)] p-1 shadow-sm">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a meeting transcript, notes, thread, or AI conversation…"
          className="min-h-[280px] w-full resize-y rounded-lg border-0 bg-transparent px-4 py-4 text-[15px] leading-relaxed text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-0 sm:min-h-[320px]"
          spellCheck
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-stone-600 hover:text-stone-800">
          <span className="rounded-md border border-stone-200 bg-white px-3 py-2 text-stone-700 shadow-sm">
            Upload .txt
          </span>
          <input
            type="file"
            accept=".txt,text/plain"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </label>

        <button
          type="button"
          onClick={() => void compress()}
          disabled={loading || !text.trim()}
          className="inline-flex items-center justify-center rounded-lg bg-stone-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Compressing…" : "Compress reasoning"}
        </button>
      </div>

      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
