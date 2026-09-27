"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import SubjectBadge from "@/components/SubjectBadge";

type Note = {
  id: number;
  title: string;
  content: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
};

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notes")
      .then(r => r.json())
      .then(setNotes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  /* ── derived stats ── */
  const subjectMap = notes.reduce<Record<string, number>>((acc, n) => {
    acc[n.subject] = (acc[n.subject] || 0) + 1;
    return acc;
  }, {});
  const subjects = Object.entries(subjectMap).sort((a, b) => b[1] - a[1]);
  const topSubject = subjects[0]?.[0] ?? null;
  const totalWords = notes.reduce(
    (s, n) => s + n.content.trim().split(/\s+/).filter(Boolean).length, 0
  );
  const recentNotes = [...notes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  /* ── bar chart max ── */
  const maxCount = Math.max(...subjects.map(s => s[1]), 1);

  const now = new Date();
  const todayNotes = notes.filter(n => {
    const d = new Date(n.createdAt);
    return d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();
  }).length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", padding: "2rem 2rem 3rem" }}>

      {/* ── Top header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <p style={{ fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--primary)", marginBottom: "0.375rem" }}>
            Overview
          </p>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            Welcome back, {firstName} 👋
          </h1>
          <p style={{ marginTop: "0.375rem", fontSize: "0.9rem", color: "var(--muted)" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <Link href="/notes/new" className="primary-button" style={{ alignSelf: "flex-start" }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
          New Note
        </Link>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <StatCard loading={loading} icon={<NoteIcon />} color="#7c6af7" label="Total Notes" value={notes.length} sub="in your collection" />
        <StatCard loading={loading} icon={<BookIcon />} color="#0ea5e9" label="Subjects" value={subjects.length} sub="topics covered" />
        <StatCard loading={loading} icon={<WordIcon />} color="#16a34a" label="Total Words" value={totalWords.toLocaleString()} sub="across all notes" />
        <StatCard loading={loading} icon={<TodayIcon />} color="#f59e0b" label="Today" value={todayNotes} sub="notes created today" />
      </div>

      {/* ── Main grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem", alignItems: "start" }}>

        {/* Recent notes table */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
            <div>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--foreground)" }}>Recent Notes</h2>
              <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 2 }}>Your latest study notes</p>
            </div>
            <Link href="/notes" style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--primary)" }}>
              View all →
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: "1.5rem" }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "0.875rem 0", borderBottom: "1px solid var(--border)" }}>
                  <div className="animate-pulse" style={{ width: 70, height: 20, borderRadius: 999, background: "#e8e5f0" }} />
                  <div style={{ flex: 1 }}><div className="animate-pulse" style={{ width: "60%", height: 14, borderRadius: 6, background: "#e8e5f0" }} /></div>
                  <div className="animate-pulse" style={{ width: 60, height: 14, borderRadius: 6, background: "#e8e5f0" }} />
                </div>
              ))}
            </div>
          ) : recentNotes.length === 0 ? (
            <div style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
              <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>No notes yet.</p>
              <Link href="/notes/new" className="primary-button" style={{ display: "inline-flex", marginTop: "1rem" }}>Create your first note</Link>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Title</th>
                  <th style={{ textAlign: "right" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentNotes.map(note => (
                  <tr key={note.id}>
                    <td style={{ width: 120 }}>
                      <SubjectBadge subject={note.subject} size="sm" />
                    </td>
                    <td>
                      <Link href={`/notes/${note.id}`} style={{ fontWeight: 600, color: "var(--foreground)", fontSize: "0.875rem", display: "block", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: 320 }}>
                        {note.title}
                      </Link>
                      <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 2, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: 320 }}>
                        {note.content.slice(0, 80)}…
                      </p>
                    </td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--muted-light)" }}>
                        {new Date(note.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Subject breakdown */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--foreground)" }}>By Subject</h2>
              <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 2 }}>Distribution of your notes</p>
            </div>
            <div style={{ padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {loading ? (
                [1,2,3].map(i => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                    <div className="animate-pulse" style={{ width: "50%", height: 12, borderRadius: 6, background: "#e8e5f0" }} />
                    <div className="animate-pulse" style={{ width: "100%", height: 8, borderRadius: 999, background: "#e8e5f0" }} />
                  </div>
                ))
              ) : subjects.length === 0 ? (
                <p style={{ fontSize: "0.875rem", color: "var(--muted)", textAlign: "center", padding: "1rem 0" }}>No subjects yet</p>
              ) : (
                subjects.slice(0, 7).map(([subject, count]) => {
                  const pct = Math.round((count / maxCount) * 100);
                  return (
                    <div key={subject}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                        <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--foreground)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "70%" }}>
                          {subject}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--muted)", flexShrink: 0 }}>
                          {count} {count === 1 ? "note" : "notes"}
                        </span>
                      </div>
                      <div style={{ height: 6, borderRadius: 999, background: "var(--border)", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 999, background: "var(--primary)", transition: "width 0.6s ease" }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Top subject callout */}
          {!loading && topSubject && (
            <div style={{
              borderRadius: "var(--radius)", overflow: "hidden",
              background: "linear-gradient(135deg, var(--primary-dark), var(--primary))",
              padding: "1.25rem 1.5rem",
            }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>
                Most studied
              </p>
              <p style={{ fontSize: "1.25rem", fontWeight: 800, color: "white", letterSpacing: "-0.01em" }}>
                {topSubject}
              </p>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.65)", marginTop: "0.25rem" }}>
                {subjectMap[topSubject]} notes · your top subject
              </p>
              <Link href="/notes" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", marginTop: "1rem", fontSize: "0.8125rem", fontWeight: 600, color: "white", background: "rgba(255,255,255,0.15)", padding: "0.4rem 0.875rem", borderRadius: 8 }}>
                Browse notes →
              </Link>
            </div>
          )}

          {/* Quick actions */}
          <div className="card" style={{ padding: "1.25rem" }}>
            <h2 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.875rem" }}>Quick actions</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                { href: "/notes/new", label: "Create a new note", icon: "✏️" },
                { href: "/notes",     label: "Browse all notes",  icon: "📚" },
              ].map(a => (
                <Link key={a.href} href={a.href} style={{
                  display: "flex", alignItems: "center", gap: "0.625rem",
                  padding: "0.625rem 0.75rem", borderRadius: 10,
                  border: "1px solid var(--border)", background: "var(--background)",
                  fontSize: "0.875rem", fontWeight: 500, color: "var(--foreground)",
                  transition: "border-color 0.15s",
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--primary)"}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)"}
                >
                  <span>{a.icon}</span>{a.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive: stack right col below on small screens */}
      <style>{`
        @media (max-width: 900px) {
          .dash-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Sub-components ── */

function StatCard({ loading, icon, color, label, value, sub }: {
  loading: boolean; icon: React.ReactNode; color: string;
  label: string; value: string | number; sub: string;
}) {
  return (
    <div className="stat-card animate-fade-up">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
        <div>
          <p style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--muted)", marginBottom: "0.625rem" }}>{label}</p>
          {loading ? (
            <div className="animate-pulse" style={{ width: 60, height: 28, borderRadius: 8, background: "#e8e5f0" }} />
          ) : (
            <p style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.02em", lineHeight: 1 }}>
              {value}
            </p>
          )}
          <p style={{ fontSize: "0.75rem", color: "var(--muted-light)", marginTop: "0.375rem" }}>{sub}</p>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function NoteIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>;
}
function BookIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
}
function WordIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>;
}
function TodayIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
}
