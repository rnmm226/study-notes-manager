"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import DashboardPage from "./dashboard/DashboardPage";

export default function HomePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Redirect unauthenticated users away from dashboard actions only
  // but we still show the landing page for non-authenticated visitors

  if (isPending) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid var(--primary-light)", borderTopColor: "var(--primary)", animation: "spin 0.75s linear infinite" }} />
      </div>
    );
  }

  // Logged in → dashboard
  if (session) return <DashboardPage />;

  // Not logged in → landing page
  return (
    <main style={{ minHeight: "100vh", background: "var(--background)" }}>

      {/* ── Minimal top bar ── */}
      <header style={{ borderBottom: "1px solid var(--border)", background: "white", padding: "0 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "white", fontSize: "0.9rem" }}>S</div>
            <span style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--foreground)" }}>Study Notes</span>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Link href="/login" style={{ padding: "0.5rem 1rem", borderRadius: 8, fontSize: "0.875rem", fontWeight: 600, color: "var(--muted)" }}>Sign in</Link>
            <Link href="/register" className="primary-button" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>Get started</Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem 4rem", textAlign: "center" }}>
        <div className="animate-fade-up">
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", borderRadius: 999, background: "var(--primary-light)", padding: "0.375rem 1rem", fontSize: "0.8125rem", fontWeight: 600, color: "var(--primary)", marginBottom: "1.5rem" }}>
            ✦ Your personal study space
          </span>
        </div>

        <h1 className="display-title animate-fade-up" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.04em", lineHeight: 1.1, animationDelay: "80ms", marginBottom: "1.25rem" }}>
          Organize your learning.<br />
          <span style={{ color: "var(--primary)" }}>Study smarter.</span>
        </h1>

        <p className="animate-fade-up" style={{ fontSize: "1.125rem", color: "var(--muted)", maxWidth: 560, margin: "0 auto 2.5rem", lineHeight: 1.7, animationDelay: "160ms" }}>
          Keep all your study notes organized in one simple, beautiful workspace. Create, edit, search and manage your notes effortlessly.
        </p>

        <div className="animate-fade-up" style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", animationDelay: "240ms" }}>
          <Link href="/register" className="primary-button" style={{ padding: "0.8rem 1.75rem", fontSize: "0.9375rem" }}>
            Get Started →
          </Link>
          <Link href="/login" style={{ display: "inline-flex", alignItems: "center", padding: "0.8rem 1.75rem", borderRadius: 10, border: "1.5px solid var(--border)", background: "white", fontSize: "0.9375rem", fontWeight: 600, color: "var(--foreground)" }}>
            Sign In
          </Link>
        </div>

        {/* Preview card */}
        <div className="animate-fade-up" style={{ marginTop: "4rem", animationDelay: "320ms" }}>
          <div style={{ borderRadius: 20, border: "1px solid var(--border)", background: "white", padding: "1.5rem", boxShadow: "0 24px 60px rgba(18,15,31,0.08)", maxWidth: 800, margin: "0 auto" }}>
            <div style={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--background)", padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                  <div style={{ width: 80, height: 10, borderRadius: 999, background: "#ddd8f0", marginBottom: "0.5rem" }} />
                  <div style={{ width: 140, height: 20, borderRadius: 8, background: "#c8c2e0" }} />
                </div>
                <div style={{ width: 100, height: 34, borderRadius: 10, background: "var(--primary-light)" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                {[["Mathematics", "#dbeafe"], ["Physics", "#d1fae5"], ["History", "#fce7f3"]].map(([subj, bg]) => (
                  <div key={subj} style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: "1rem" }}>
                    <div style={{ display: "inline-block", borderRadius: 999, background: bg, padding: "3px 10px", fontSize: "0.7rem", fontWeight: 700, color: "#374151", marginBottom: "0.75rem" }}>{subj}</div>
                    <div style={{ width: "80%", height: 12, borderRadius: 6, background: "#e5e5e5", marginBottom: "0.5rem" }} />
                    <div style={{ width: "100%", height: 8, borderRadius: 6, background: "#f0f0f0" }} />
                    <div style={{ width: "65%", height: 8, borderRadius: 6, background: "#f0f0f0", marginTop: "0.375rem" }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ borderTop: "1px solid var(--border)", background: "white", padding: "4rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--primary)", marginBottom: "0.5rem" }}>Everything you need</p>
            <h2 className="display-title" style={{ fontSize: "2rem", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.03em" }}>A simpler way to study</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {[
              { icon: "✎", title: "Create notes", desc: "Quickly write notes with a title, subject and detailed content." },
              { icon: "◈", title: "Stay organized", desc: "Filter by subject and find anything in seconds." },
              { icon: "✓", title: "Study efficiently", desc: "Spend more time learning, less time searching." },
            ].map(f => (
              <div key={f.title} className="card card-hover" style={{ padding: "1.5rem" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", marginBottom: "1rem" }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--foreground)", marginBottom: "0.5rem" }}>{f.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "var(--primary)", padding: "4rem 2rem", textAlign: "center" }}>
        <h2 className="display-title" style={{ fontSize: "2rem", fontWeight: 800, color: "white", letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>
          Ready to organize your notes?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: "2rem", fontSize: "1rem" }}>
          Create your free account and start building your study workspace.
        </p>
        <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.8rem 2rem", borderRadius: 10, background: "white", fontWeight: 700, fontSize: "0.9375rem", color: "var(--primary)" }}>
          Create your account →
        </Link>
      </section>

      <footer style={{ borderTop: "1px solid var(--border)", background: "white", padding: "1.5rem 2rem", textAlign: "center", fontSize: "0.875rem", color: "var(--muted)" }}>
        © {new Date().getFullYear()} Study Notes Manager
      </footer>
    </main>
  );
}
