import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-gray-900"
        >
          Study Notes
        </Link>

        <div className="flex items-center gap-2 sm:gap-6">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          >
            Dashboard
          </Link>

          <Link
            href="/notes"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          >
            Notes
          </Link>

          <Link
            href="/notes/new"
            className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800 sm:px-4"
          >
            <span className="sm:hidden">+ New</span>
            <span className="hidden sm:inline">+ New Note</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}