"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReasoningView } from "@/components/ReasoningView";
import type { SessionPayload } from "@/types/reasoning";
import { SESSION_KEY } from "@/lib/storage-keys";

export default function ReasoningPage() {
  const router = useRouter();
  const [payload, setPayload] = useState<SessionPayload | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) {
        router.replace("/");
        return;
      }
      const parsed = JSON.parse(raw) as SessionPayload;
      if (!parsed?.result) {
        router.replace("/");
        return;
      }
      setPayload(parsed);
    } catch {
      router.replace("/");
    }
  }, [router]);

  if (!payload) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-24 text-center text-sm text-stone-500 sm:px-6">
        Loading…
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <ReasoningView
        rawInput={payload.rawInput}
        compressedAt={payload.compressedAt}
        result={payload.result}
      />
      <p className="mt-16 text-center text-sm text-stone-500">
        Missing a session?{" "}
        <Link href="/" className="text-stone-800 underline-offset-4 hover:underline">
          Go to input
        </Link>
      </p>
    </div>
  );
}
