"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import SubjectBadge from "@/components/SubjectBadge";
import { DashboardStatSkeleton } from "@/components/Skeleton";

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
    async function loadNotes() {
      try {
        const response = await fetch("/api/notes");
        if (!response.ok) throw new Error("Failed to fetch notes");
        const data = await response.json();
        setNotes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadNotes();
  }, []);

  const subjects = Array.from(new Set(notes.map(n => n.subject)));
  const recentNotes = notes.slice(0, 4);

  // Most active subject
  const subjectCounts = notes.reduce<Record<string, number>>((acc, n) => {
    acc[n.subject] = (acc[n.subject] || 0) + 1;
    return acc;
  }, {});
  const topSubject = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "3rem 1.5rem" }}>

        {/* Header */}
        <section className="animate-fade-up" style={{ marginBottom: "2.5rem" }}>
          <p style={{ fontSize: "0.8125rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--primary)", marginBottom: "0.5rem" }}>
            Dashboard
          </p>
          <h1 className="display-title" style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
            Hey, {firstName} 👋
          </h1>
          <p style={{ marginTop: "0.625rem", fontSize: "1rem", color: "var(--muted)", maxWidth: "500px" }}>
            Here&apos;s an overview of your study collection.
          </p>
        </section>

        {/* Stats */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.75rem" }}>
          {loading ? (
            <>
              <DashboardStatSkeleton />
              <DashboardStatSkeleton />
              <DashboardStatSkeleton />
            </>
          ) : (
            <>
              <StatCard
                label="Total Notes"
                value={notes.length}
                sub="in your collection"
                icon="📝"
                delay={0}
              />
              <StatCard
                label="Subjects"
                value={subjects.length}
                sub="topics covered"
                icon="📚"
                delay={80}
              />
              <StatCard
                label="Top Subject"
                value={topSubject ?? "—"}
                sub={topSubject ? `${subjectCounts[topSubject]} notes` : "no notes yet"}
                icon="🏆"
                delay={160}
                small
              />
            </>
          )}
        </section>

        {/* Quick actions */}
        <section
          className="animate-fade-up"
          style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "3rem", animationDelay: "200ms" }}
        >
          <Link href="/notes/new" className="primary-button">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
            New Note
          </Link>
          <Link
            href="/notes"
            className="rounded-xl text-sm font-semibold transition"
            style={{
              padding: "0.7rem 1.25rem",
              border: "1.5px solid var(--border)",
              background: "white",
              color: "var(--foreground)",
              boxShadow: "var(--shadow-sm)",
              textDecoration: "none",
            }}
          >
            Browse all notes →
          </Link>
        </section>

        {/* Recent notes */}
        <section className="animate-fade-up" style={{ animationDelay: "250ms" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "1.25rem", gap: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.01em" }}>
                Recent notes
              </h2>
              <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: "var(--muted)" }}>
                Your latest study notes
              </p>
            </div>
            {notes.length > 4 && (
              <Link href="/notes" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--primary)", textDecoration: "none" }}>
                View all →
              </Link>
            )}
          </div>

          {loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="animate-pulse"
                  style={{ height: "88px", borderRadius: "14px", border: "1px solid var(--border)", background: "white" }}
                />
              ))}
            </div>
          )}

          {!loading && recentNotes.length === 0 && (
            <div
              className="card animate-scale-in"
              style={{ textAlign: "center", padding: "3.5rem 2rem" }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 16, background: "var(--primary-light)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.5rem", margin: "0 auto 1.25rem",
              }}>
                📝
              </div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>
                No notes yet
              </h3>
              <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "var(--muted)", maxWidth: "300px", margin: "0.5rem auto 0" }}>
                Start building your study collection by creating your first note.
              </p>
              <Link href="/notes/new" className="primary-button" style={{ display: "inline-flex", marginTop: "1.5rem" }}>
                Create your first note
              </Link>
            </div>
          )}

          {!loading && recentNotes.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {recentNotes.map((note, i) => (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className="card card-hover animate-fade-up"
                  style={{
                    display: "block",
                    padding: "1.125rem 1.5rem",
                    textDecoration: "none",
                    animationDelay: `${i * 60}ms`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                        <SubjectBadge subject={note.subject} size="sm" />
                        <time style={{ fontSize: "0.75rem", color: "var(--muted-light)", flexShrink: 0 }}>
                          {new Date(note.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </time>
                      </div>
                      <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--foreground)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                        {note.title}
                      </h3>
                      <p style={{ marginTop: "0.25rem", fontSize: "0.8125rem", color: "var(--muted)", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {note.content}
                      </p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0, color: "var(--muted-light)", marginTop: "2px" }}>
                      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label, value, sub, icon, delay, small,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: string;
  delay: number;
  small?: boolean;
}) {
  return (
    <div
      className="card card-hover animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--muted)", marginBottom: "0.75rem" }}>
            {label}
          </p>
          <p style={{
            fontSize: small ? "1.25rem" : "2rem",
            fontWeight: 800,
            color: "var(--foreground)",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}>
            {value}
          </p>
          <p style={{ fontSize: "0.75rem", color: "var(--muted-light)", marginTop: "0.375rem" }}>
            {sub}
          </p>
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: "var(--primary-light)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.125rem", flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
}
