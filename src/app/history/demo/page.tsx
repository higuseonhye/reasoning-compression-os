import type { Metadata } from "next";
import { HistoryListView } from "@/components/HistoryListView";
import { DEMO_HISTORY_ENTRIES } from "@/lib/demo-history-sample";

export const metadata: Metadata = {
  title: "Decision history (demo) · Reasoning Compression",
  description: "Static sample of the decision history screen for reviews and screenshots.",
  robots: { index: false, follow: false },
};

export default function HistoryDemoPage() {
  return (
    <HistoryListView entries={DEMO_HISTORY_ENTRIES} readOnly />
  );
}
