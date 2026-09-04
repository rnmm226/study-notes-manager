import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-[var(--foreground)] transition hover:opacity-80"
        >
          Study Notes
        </Link>

        <div className="flex items-center gap-1 sm:gap-3">
          <Link
            href="/"
            className="rounded-xl px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
          >
            Dashboard
          </Link>

          <Link
            href="/notes"
            className="rounded-xl px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
          >
            Notes
          </Link>

          <Link
            href="/notes/new"
            className="ml-1 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)] hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="sm:hidden">+ New</span>
            <span className="hidden sm:inline">+ New Note</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}