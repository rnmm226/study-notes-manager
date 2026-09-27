"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import NoteCard from "@/components/NoteCard";
import { NoteCardSkeleton } from "@/components/Skeleton";
import ToastContainer from "@/components/ToastContainer";
import SubjectBadge from "@/components/SubjectBadge";

type Note = {
  id: number;
  title: string;
  content: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
};

type View = "grid" | "list";

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [view, setView] = useState<View>("grid");
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  useEffect(() => {
    fetch("/api/notes")
      .then(r => { if (!r.ok) throw new Error("Failed"); return r.json(); })
      .then(setNotes)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: number) {
    try {
      const r = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error((await r.json().catch(() => null))?.error || "Failed");
      setNotes(prev => prev.filter(n => n.id !== id));
      setToastType("success"); setToast("Note deleted");
    } catch (e) {
      setToastType("error"); setToast(e instanceof Error ? e.message : "Failed");
      throw e;
    }
  }

  const subjects = useMemo(() =>
    ["All", ...Array.from(new Set(notes.map(n => n.subject)))], [notes]);

  const subjectCounts = useMemo(() =>
    notes.reduce<Record<string, number>>((a, n) => {
      a[n.subject] = (a[n.subject] || 0) + 1; return a;
    }, {}), [notes]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return notes.filter(n => {
      const ms = !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.subject.toLowerCase().includes(q);
      const mf = subjectFilter === "All" || n.subject === subjectFilter;
      return ms && mf;
    });
  }, [notes, search, subjectFilter]);

  return (
    <>
      <ToastContainer message={toast} type={toastType} onClose={() => setToast("")} />

      {/* Single-column layout — no internal sidebar */}
      <main style={{ minHeight: "100vh", background: "var(--background)", padding: "2rem 2.5rem" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem" }}>
          <div>
            <h1 style={{ fontSize: "1.625rem", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.025em" }}>
              {subjectFilter === "All" ? "All Notes" : subjectFilter}
            </h1>
            <p style={{ fontSize: "0.8375rem", color: "var(--muted)", marginTop: "0.2rem" }}>
              {loading ? "Loading…" : `${filtered.length} ${filtered.length === 1 ? "note" : "notes"}`}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <div style={{ display: "flex", borderRadius: 8, border: "1px solid var(--border)", overflow: "hidden", background: "white" }}>
              <ViewBtn active={view === "grid"} onClick={() => setView("grid")} title="Grid">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor"/></svg>
              </ViewBtn>
              <ViewBtn active={view === "list"} onClick={() => setView("list")} title="List">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="14" height="2.5" rx="1.25" fill="currentColor"/><rect x="1" y="6.75" width="14" height="2.5" rx="1.25" fill="currentColor"/><rect x="1" y="11.5" width="14" height="2.5" rx="1.25" fill="currentColor"/></svg>
              </ViewBtn>
            </div>
            <Link href="/notes/new" className="primary-button" style={{ fontSize: "0.8125rem", padding: "0.55rem 1rem" }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
              New Note
            </Link>
          </div>
        </div>

        {/* ── Search + subject pills ── */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.75rem", alignItems: "center" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 240px", maxWidth: 360 }}>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted-light)", pointerEvents: "none" }}>
              <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M14 14l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search notes…" className="form-input"
              style={{ paddingLeft: "2.5rem", background: "white" }}
            />
          </div>

          {/* Subject pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
            {subjects.map(s => {
              const active = subjectFilter === s;
              return (
                <button key={s} onClick={() => setSubjectFilter(s)} style={{
                  display: "inline-flex", alignItems: "center", gap: "0.375rem",
                  padding: "0.375rem 0.75rem", borderRadius: 999, border: "1.5px solid",
                  fontSize: "0.8125rem", fontWeight: active ? 600 : 500,
                  cursor: "pointer", transition: "all 0.15s",
                  background: active ? "var(--primary)" : "white",
                  borderColor: active ? "var(--primary)" : "var(--border)",
                  color: active ? "white" : "var(--muted)",
                }}>
                  {s === "All" ? "All" : s}
                  <span style={{
                    fontSize: "0.7rem", fontWeight: 600,
                    background: active ? "rgba(255,255,255,0.25)" : "var(--border)",
                    color: active ? "white" : "var(--muted)",
                    borderRadius: 999, padding: "0 5px", lineHeight: "16px",
                  }}>
                    {s === "All" ? notes.length : (subjectCounts[s] ?? 0)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Error ── */}
        {!loading && error && (
          <div style={{ padding: "1rem 1.25rem", borderRadius: "var(--radius)", background: "var(--danger-light)", border: "1px solid #fca5a5", marginBottom: "1.5rem" }}>
            <p style={{ fontWeight: 600, color: "#991b1b", fontSize: "0.875rem" }}>Error: {error}</p>
          </div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.125rem" }}>
            {[1,2,3,4,5,6].map(i => <NoteCardSkeleton key={i} />)}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && notes.length === 0 && (
          <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.625rem", margin: "0 auto 1.25rem" }}>📝</div>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>No notes yet</h2>
            <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "var(--muted)" }}>Start building your collection.</p>
            <Link href="/notes/new" className="primary-button" style={{ display: "inline-flex", marginTop: "1.5rem" }}>Create your first note</Link>
          </div>
        )}

        {/* ── No results ── */}
        {!loading && !error && notes.length > 0 && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.375rem", margin: "0 auto 1rem" }}>🔎</div>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--foreground)" }}>No matching notes</h2>
            <p style={{ marginTop: "0.375rem", fontSize: "0.875rem", color: "var(--muted)" }}>Try a different search or subject.</p>
            <button onClick={() => { setSearch(""); setSubjectFilter("All"); }} className="primary-button" style={{ display: "inline-flex", marginTop: "1.25rem" }}>
              Clear filters
            </button>
          </div>
        )}

        {/* ── Grid ── */}
        {!loading && !error && filtered.length > 0 && view === "grid" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.125rem" }}>
            {filtered.map((note, i) => (
              <NoteCard key={note.id} note={note} index={i} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {/* ── List ── */}
        {!loading && !error && filtered.length > 0 && view === "list" && (
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Title</th>
                  <th>Preview</th>
                  <th style={{ textAlign: "right" }}>Date</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map(note => (
                  <tr key={note.id}>
                    <td style={{ width: 110 }}><SubjectBadge subject={note.subject} size="sm" /></td>
                    <td style={{ fontWeight: 600, maxWidth: 200 }}>
                      <Link href={`/notes/${note.id}`} style={{ color: "var(--foreground)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", display: "block", maxWidth: 200 }}>{note.title}</Link>
                    </td>
                    <td style={{ color: "var(--muted)", fontSize: "0.8125rem", maxWidth: 260 }}>
                      <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", display: "block", maxWidth: 260 }}>{note.content.slice(0, 80)}</span>
                    </td>
                    <td style={{ textAlign: "right", color: "var(--muted-light)", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                      {new Date(note.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td style={{ width: 110, textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "0.375rem", justifyContent: "flex-end" }}>
                        <Link href={`/notes/${note.id}`} style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--primary)", padding: "3px 8px", borderRadius: 6, background: "var(--primary-light)" }}>View</Link>
                        <Link href={`/notes/${note.id}/edit`} style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--muted)", padding: "3px 8px", borderRadius: 6, background: "var(--background)" }}>Edit</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}

function ViewBtn({ active, onClick, title, children }: {
  active: boolean; onClick: () => void; title: string; children: React.ReactNode;
}) {
  return (
    <button onClick={onClick} title={title} style={{
      padding: "0.4rem 0.55rem", border: "none", cursor: "pointer", lineHeight: 0,
      background: active ? "var(--primary-light)" : "transparent",
      color: active ? "var(--primary)" : "var(--muted-light)",
      transition: "background 0.15s",
    }}>
      {children}
    </button>
  );
}
