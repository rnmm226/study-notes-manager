"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import SubjectBadge from "@/components/SubjectBadge";
import { DashboardStatSkeleton } from "@/components/Skeleton";
import ActivityChart from "@/components/ActivityChart";

type Note = {
  id: number;
  title: string;
  content: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
};

/* ── streak helper ── */
function computeStreak(notes: Note[]): number {
  const days = new Set(
    notes.map(n => new Date(n.createdAt).toISOString().slice(0, 10))
  );
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (days.has(d.toISOString().slice(0, 10))) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notes")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setNotes(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  const subjectMap = notes.reduce<Record<string, number>>((acc, n) => {
    acc[n.subject] = (acc[n.subject] || 0) + 1; return acc;
  }, {});
  const subjects = Object.entries(subjectMap).sort((a, b) => b[1] - a[1]);
  const topSubject = subjects[0]?.[0] ?? null;
  const totalWords = notes.reduce((s, n) => s + n.content.trim().split(/\s+/).filter(Boolean).length, 0);
  const streak = computeStreak(notes);
  const now = new Date();
  const todayNotes = notes.filter(n => {
    const d = new Date(n.createdAt);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  }).length;
  const recentNotes = [...notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);
  const maxCount = Math.max(...subjects.map(s => s[1]), 1);

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", padding: "2rem 2rem 3rem" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <p style={{ fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--primary)", marginBottom: "0.375rem" }}>Overview</p>
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

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {loading ? (
          <><DashboardStatSkeleton /><DashboardStatSkeleton /><DashboardStatSkeleton /><DashboardStatSkeleton /><DashboardStatSkeleton /></>
        ) : (
          <>
            <StatCard icon={<NoteIcon />} color="#7c6af7" label="Total Notes" value={notes.length} sub="in collection" delay={0} />
            <StatCard icon={<BookIcon />} color="#0ea5e9" label="Subjects" value={subjects.length} sub="topics covered" delay={60} />
            <StatCard icon={<WordIcon />} color="#16a34a" label="Total Words" value={totalWords.toLocaleString()} sub="written" delay={120} />
            <StatCard icon={<TodayIcon />} color="#f59e0b" label="Today" value={todayNotes} sub="notes created" delay={180} />
            <StatCard
              icon={<FireIcon />}
              color="#ef4444"
              label="Streak"
              value={`${streak}d`}
              sub={streak > 0 ? "consecutive days 🔥" : "start today!"}
              delay={240}
              highlight={streak >= 3}
            />
          </>
        )}
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.5rem", alignItems: "start" }}>

        {/* Left col */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Activity chart */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--foreground)" }}>Activity</h2>
              <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 2 }}>Notes created over the past 14 weeks</p>
            </div>
            <div style={{ padding: "1.25rem 1.5rem" }}>
              {loading ? (
                <div className="animate-pulse" style={{ height: 100, borderRadius: 8, background: "#e8e5f0" }} />
              ) : (
                <ActivityChart notes={notes} />
              )}
            </div>
          </div>

          {/* Recent notes table */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
              <div>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--foreground)" }}>Recent Notes</h2>
                <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 2 }}>Your latest study notes</p>
              </div>
              <Link href="/notes" style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--primary)" }}>View all →</Link>
            </div>

            {loading ? (
              <div style={{ padding: "1.5rem" }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ display: "flex", gap: "1rem", padding: "0.875rem 0", borderBottom: "1px solid var(--border)" }}>
                    <div className="animate-pulse" style={{ width: 70, height: 20, borderRadius: 999, background: "#e8e5f0" }} />
                    <div style={{ flex: 1 }}><div className="animate-pulse" style={{ width: "60%", height: 14, borderRadius: 6, background: "#e8e5f0" }} /></div>
                  </div>
                ))}
              </div>
            ) : recentNotes.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center" }}>
                <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>No notes yet.</p>
                <Link href="/notes/new" className="primary-button" style={{ display: "inline-flex", marginTop: "1rem" }}>Create your first note</Link>
              </div>
            ) : (
              <table className="data-table">
                <thead><tr><th>Subject</th><th>Title</th><th style={{ textAlign: "right" }}>Date</th></tr></thead>
                <tbody>
                  {recentNotes.map(note => (
                    <tr key={note.id}>
                      <td style={{ width: 120 }}><SubjectBadge subject={note.subject} size="sm" /></td>
                      <td>
                        <Link href={`/notes/${note.id}`} style={{ fontWeight: 600, color: "var(--foreground)", fontSize: "0.875rem", display: "block", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: 320 }}>{note.title}</Link>
                        <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 2, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: 320 }}>{note.content.slice(0, 70)}…</p>
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
        </div>

        {/* Right col */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Subject breakdown */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--foreground)" }}>By Subject</h2>
              <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 2 }}>Note distribution</p>
            </div>
            <div style={{ padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {loading ? [1,2,3].map(i => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  <div className="animate-pulse" style={{ width: "50%", height: 12, borderRadius: 6, background: "#e8e5f0" }} />
                  <div className="animate-pulse" style={{ width: "100%", height: 8, borderRadius: 999, background: "#e8e5f0" }} />
                </div>
              )) : subjects.length === 0 ? (
                <p style={{ fontSize: "0.875rem", color: "var(--muted)", textAlign: "center", padding: "1rem 0" }}>No subjects yet</p>
              ) : subjects.slice(0, 7).map(([subject, count]) => (
                <div key={subject}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--foreground)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "70%" }}>{subject}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--muted)", flexShrink: 0 }}>{count}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 999, background: "var(--border)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.round((count / maxCount) * 100)}%`, borderRadius: 999, background: "var(--primary)", transition: "width 0.6s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top subject callout */}
          {!loading && topSubject && (
            <div style={{ borderRadius: "var(--radius)", background: "linear-gradient(135deg, var(--primary-dark), var(--primary))", padding: "1.25rem 1.5rem" }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.55)", marginBottom: "0.5rem" }}>Most studied</p>
              <p style={{ fontSize: "1.25rem", fontWeight: 800, color: "white" }}>{topSubject}</p>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", marginTop: "0.25rem" }}>{subjectMap[topSubject]} notes</p>
              <Link href="/notes" style={{ display: "inline-flex", marginTop: "1rem", fontSize: "0.8125rem", fontWeight: 600, color: "white", background: "rgba(255,255,255,0.15)", padding: "0.4rem 0.875rem", borderRadius: 8 }}>Browse →</Link>
            </div>
          )}

          {/* Streak callout */}
          {!loading && streak >= 2 && (
            <div style={{ borderRadius: "var(--radius)", background: "linear-gradient(135deg, #dc2626, #f97316)", padding: "1.25rem 1.5rem" }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.55)", marginBottom: "0.5rem" }}>🔥 On a roll!</p>
              <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "white" }}>{streak} day streak</p>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.65)", marginTop: "0.25rem" }}>Keep it up — write a note today!</p>
            </div>
          )}

          {/* Quick actions */}
          <div className="card" style={{ padding: "1.25rem" }}>
            <h2 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.875rem" }}>Quick actions</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                { href: "/notes/new", label: "Create a new note", icon: "✏️" },
                { href: "/notes", label: "Browse all notes", icon: "📚" },
              ].map(a => (
                <Link key={a.href} href={a.href} style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.625rem 0.75rem", borderRadius: 10, border: "1px solid var(--border)", background: "var(--background)", fontSize: "0.875rem", fontWeight: 500, color: "var(--foreground)", transition: "border-color 0.15s" }}
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
    </div>
  );
}

/* ── Stat card ── */
function StatCard({ icon, color, label, value, sub, delay, highlight }: {
  icon: React.ReactNode; color: string; label: string;
  value: string | number; sub: string; delay: number; highlight?: boolean;
}) {
  return (
    <div className="stat-card animate-fade-up" style={{
      animationDelay: `${delay}ms`,
      ...(highlight ? { border: "1.5px solid #fca5a5", background: "#fff5f5" } : {}),
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
        <div>
          <p style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--muted)", marginBottom: "0.625rem" }}>{label}</p>
          <p style={{ fontSize: "1.625rem", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</p>
          <p style={{ fontSize: "0.75rem", color: "var(--muted-light)", marginTop: "0.375rem" }}>{sub}</p>
        </div>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color }}>{icon}</div>
      </div>
    </div>
  );
}

/* ── Icons ── */
function NoteIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>; }
function BookIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>; }
function WordIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>; }
function TodayIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function FireIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c0 1.657-1.343 3-3 3s-3-1.343-3-3c0-1.304.836-2.417 2-2.829"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1-10 10"/><path d="M12 2c1.657 4 3 6.5 3 9a3 3 0 0 1-6 0c0-2.5 1.343-5 3-9z"/></svg>; }
