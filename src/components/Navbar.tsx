"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderColor: "var(--border)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl text-white text-base font-bold"
            style={{ background: "var(--primary)" }}
          >
            S
          </div>
          <span
            className="hidden text-base font-bold tracking-tight sm:block"
            style={{ color: "var(--foreground)" }}
          >
            Study Notes
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {session && (
            <>
              <NavLink href="/" active={isActive("/") && pathname === "/"}>
                Dashboard
              </NavLink>
              <NavLink href="/notes" active={pathname.startsWith("/notes")}>
                Notes
              </NavLink>
            </>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Link
                href="/notes/new"
                className="primary-button text-xs sm:text-sm px-3 py-2 sm:px-4"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
                <span className="hidden sm:inline">New Note</span>
                <span className="sm:hidden">New</span>
              </Link>

              <button
                onClick={handleSignOut}
                className="rounded-xl px-3 py-2 text-xs font-semibold transition"
                style={{ color: "var(--muted)" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--background)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--foreground)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)";
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl px-3 py-2 text-sm font-semibold transition"
                style={{ color: "var(--muted)" }}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="primary-button text-sm px-4 py-2"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="relative rounded-xl px-3.5 py-2 text-sm font-medium transition-colors"
      style={{
        color: active ? "var(--primary)" : "var(--muted)",
        background: active ? "var(--primary-light)" : "transparent",
      }}
    >
      {children}
      {active && (
        <span
          className="absolute bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full"
          style={{ background: "var(--primary)" }}
        />
      )}
    </Link>
  );
}
