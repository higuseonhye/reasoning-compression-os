import Link from "next/link";

const linkClass =
  "text-sm text-stone-600 transition-colors hover:text-stone-900";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-[var(--rcos-bg)]">
      <header className="border-b border-stone-200/80 bg-[var(--rcos-surface)]">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="text-sm font-medium tracking-tight text-stone-900"
          >
            Reasoning Compression
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className={linkClass}>
              Input
            </Link>
            <Link href="/demo" className={linkClass}>
              Demo
            </Link>
            <Link href="/history" className={linkClass}>
              Decision history
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-stone-200/60 py-6 text-center text-xs text-stone-500">
        High-signal reasoning briefs — not another generic summarizer.
      </footer>
    </div>
  );
}
