import { InputWorkspace } from "@/components/InputWorkspace";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-12 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
          Input workspace
        </p>
        <h1 className="text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl">
          Turn noise into a reasoning brief
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-stone-600 sm:text-[15px]">
          Paste or upload raw material — transcripts, threads, brainstorms. The
          model extracts tensions, ambiguities, decisions, and next moves in a
          format meant for alignment, not dopamine.
        </p>
      </header>
      <InputWorkspace />
    </div>
  );
}
