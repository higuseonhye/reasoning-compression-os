import type { Metadata } from "next";
import { ReasoningView } from "@/components/ReasoningView";
import {
  DEMO_COMPRESSED_AT,
  DEMO_RAW_INPUT,
  DEMO_RESULT,
} from "@/lib/demo-sample";

export const metadata: Metadata = {
  title: "Demo · Reasoning Compression",
  description:
    "Static sample of a reasoning brief for reviews and documentation screenshots.",
  robots: { index: false, follow: false },
};

export default function DemoPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <ReasoningView
        rawInput={DEMO_RAW_INPUT}
        compressedAt={DEMO_COMPRESSED_AT}
        result={DEMO_RESULT}
      />
    </div>
  );
}
