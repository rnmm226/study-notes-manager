"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const NAV = [
  {
    href: "/",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    href: "/notes",
    label: "My Notes",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>
      </svg>
    ),
  },
  {
    href: "/notes/new",
    label: "New Note",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
    accent: true,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  const w = collapsed ? "var(--sidebar-width-collapsed)" : "var(--sidebar-width)";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const firstName = session?.user?.name?.split(" ")[0] ?? "";
  const initials = session?.user?.name
    ? session.user.name.split(" ").map((p: string) => p[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 40,
            background: "rgba(0,0,0,0.5)",
          }}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(v => !v)}
        style={{
          position: "fixed", top: "1rem", left: "1rem", zIndex: 60,
          width: 38, height: 38, borderRadius: 10,
          background: "var(--sidebar-bg)", border: "1px solid var(--sidebar-border)",
          color: "white", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        className="lg-hide"
        aria-label="Toggle menu"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        style={{
          width: w,
          minWidth: w,
          height: "100vh",
          position: "sticky",
          top: 0,
          background: "var(--sidebar-bg)",
          borderRight: "1px solid var(--sidebar-border)",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.22s ease, min-width 0.22s ease",
          overflow: "hidden",
          zIndex: 50,
          flexShrink: 0,
        }}
        className="sidebar-desktop sidebar-scroll"
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? "1.25rem 0" : "1.25rem 1.25rem",
          borderBottom: "1px solid var(--sidebar-border)",
          minHeight: 64, gap: "0.5rem",
        }}>
          {!collapsed && (
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: "var(--primary)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.875rem", fontWeight: 800, color: "white", flexShrink: 0,
              }}>S</div>
              <span style={{ color: "white", fontWeight: 700, fontSize: "0.9375rem", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
                Study Notes
              </span>
            </Link>
          )}
          {collapsed && (
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: "var(--primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.875rem", fontWeight: 800, color: "white",
            }}>S</div>
          )}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sidebar-text)", padding: 4, borderRadius: 6, lineHeight: 0 }}
              aria-label="Collapse sidebar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
          )}
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              style={{ position: "absolute", top: 20, right: -1, background: "var(--sidebar-bg)", border: "1px solid var(--sidebar-border)", borderLeft: "none", cursor: "pointer", color: "var(--sidebar-text)", padding: "4px 3px", borderRadius: "0 6px 6px 0", lineHeight: 0 }}
              aria-label="Expand sidebar"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0.75rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem", overflowY: "auto" }}>

          {!collapsed && (
            <p style={{ fontSize: "0.6875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.28)", padding: "0.5rem 0.5rem 0.25rem", whiteSpace: "nowrap" }}>
              Menu
            </p>
          )}

          {NAV.map(item => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                style={{
                  display: "flex", alignItems: "center",
                  gap: collapsed ? 0 : "0.75rem",
                  justifyContent: collapsed ? "center" : "flex-start",
                  padding: collapsed ? "0.625rem" : "0.625rem 0.75rem",
                  borderRadius: 10,
                  color: active ? "var(--sidebar-text-active)" : "var(--sidebar-text)",
                  background: active
                    ? item.accent ? "rgba(124,106,247,0.25)" : "var(--sidebar-active)"
                    : "transparent",
                  transition: "background 0.15s, color 0.15s",
                  whiteSpace: "nowrap",
                  position: "relative",
                }}
                onMouseEnter={e => {
                  if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "var(--sidebar-hover)";
                }}
                onMouseLeave={e => {
                  if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                }}
              >
                <span style={{ flexShrink: 0, color: active ? (item.accent ? "var(--primary)" : "white") : "var(--sidebar-text)" }}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span style={{ fontSize: "0.875rem", fontWeight: active ? 600 : 500 }}>
                    {item.label}
                  </span>
                )}
                {active && !collapsed && (
                  <span style={{
                    marginLeft: "auto", width: 6, height: 6, borderRadius: "50%",
                    background: item.accent ? "var(--primary)" : "rgba(255,255,255,0.4)",
                    flexShrink: 0,
                  }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User area */}
        <div style={{
          borderTop: "1px solid var(--sidebar-border)",
          padding: collapsed ? "0.875rem 0" : "0.875rem 0.875rem",
          display: "flex", alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: "0.625rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", minWidth: 0 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, var(--primary), #a78bfa)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.75rem", fontWeight: 700, color: "white",
            }}>
              {initials}
            </div>
            {!collapsed && (
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "white", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                  {firstName}
                </p>
                <p style={{ fontSize: "0.6875rem", color: "var(--sidebar-text)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginTop: 1 }}>
                  {session?.user?.email ?? ""}
                </p>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={handleSignOut}
              title="Sign out"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sidebar-text)", padding: 6, borderRadius: 8, lineHeight: 0, flexShrink: 0 }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "white"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "var(--sidebar-text)"}
              aria-label="Sign out"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      <aside
        style={{
          position: "fixed", top: 0, left: 0, bottom: 0,
          width: "var(--sidebar-width)",
          background: "var(--sidebar-bg)",
          borderRight: "1px solid var(--sidebar-border)",
          display: "flex", flexDirection: "column",
          zIndex: 50,
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease",
        }}
        className="sidebar-mobile"
      >
        {/* same content: logo + nav + user */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem", borderBottom: "1px solid var(--sidebar-border)", minHeight: 64 }}>
          <Link href="/" onClick={() => setMobileOpen(false)} style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem", fontWeight: 800, color: "white" }}>S</div>
            <span style={{ color: "white", fontWeight: 700, fontSize: "0.9375rem" }}>Study Notes</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sidebar-text)", lineHeight: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <nav style={{ flex: 1, padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {NAV.map(item => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "0.625rem 0.75rem", borderRadius: 10,
                  color: active ? "white" : "var(--sidebar-text)",
                  background: active ? "var(--sidebar-active)" : "transparent",
                  fontWeight: active ? 600 : 500, fontSize: "0.875rem",
                }}
              >
                {item.icon}{item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ borderTop: "1px solid var(--sidebar-border)", padding: "0.875rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "white" }}>{initials}</div>
            <div>
              <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "white" }}>{firstName}</p>
              <p style={{ fontSize: "0.6875rem", color: "var(--sidebar-text)" }}>{session?.user?.email ?? ""}</p>
            </div>
          </div>
          <button onClick={handleSignOut} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sidebar-text)", padding: 6, borderRadius: 8, lineHeight: 0 }} aria-label="Sign out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      <style>{`
        .sidebar-desktop { display: flex !important; }
        .sidebar-mobile  { display: flex; }
        .lg-hide { display: flex; }
        @media (min-width: 1024px) {
          .lg-hide { display: none !important; }
          .sidebar-mobile { display: none !important; }
        }
        @media (max-width: 1023px) {
          .sidebar-desktop { display: none !important; }
        }
      `}</style>
    </>
  );
}
