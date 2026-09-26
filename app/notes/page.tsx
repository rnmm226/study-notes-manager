"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import NoteCard from "@/components/NoteCard";
import { NoteCardSkeleton } from "@/components/Skeleton";
import ToastContainer from "@/components/ToastContainer";

type Note = {
  id: number;
  title: string;
  content: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  useEffect(() => {
    async function loadNotes() {
      try {
        const res = await fetch("/api/notes");
        if (!res.ok) throw new Error("Failed to fetch notes");
        setNotes(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    loadNotes();
  }, []);

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to delete note");
      }
      setNotes(prev => prev.filter(n => n.id !== id));
      setToastType("success");
      setToast("Note deleted successfully");
    } catch (err) {
      setToastType("error");
      setToast(err instanceof Error ? err.message : "Failed to delete note");
      throw err;
    }
  }

  const subjects = useMemo(() =>
    ["All", ...Array.from(new Set(notes.map(n => n.subject)))],
    [notes]
  );

  const filteredNotes = useMemo(() => {
    const q = search.toLowerCase().trim();
    return notes.filter(n => {
      const matchSearch = !q ||
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.subject.toLowerCase().includes(q);
      const matchSubject = subjectFilter === "All" || n.subject === subjectFilter;
      return matchSearch && matchSubject;
    });
  }, [notes, search, subjectFilter]);

  const hasFilters = search || subjectFilter !== "All";

  return (
    <>
      <ToastContainer message={toast} type={toastType} onClose={() => setToast("")} />

      <main style={{ minHeight: "100vh", background: "var(--background)" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "3rem 1.5rem" }}>

          {/* Header */}
          <section className="animate-fade-up" style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "1.5rem" }}>
              <div>
                <p style={{ fontSize: "0.8125rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--primary)", marginBottom: "0.5rem" }}>
                  Your collection
                </p>
                <h1 className="display-title" style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.03em" }}>
                  My Notes
                </h1>
                <p style={{ marginTop: "0.5rem", fontSize: "0.9375rem", color: "var(--muted)", maxWidth: "460px" }}>
                  Browse, search, and manage all your study notes.
                </p>
              </div>
              <Link href="/notes/new" className="primary-button" style={{ flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
                New Note
              </Link>
            </div>
          </section>

          {/* Search + Filter */}
          {!loading && notes.length > 0 && (
            <section className="animate-fade-up" style={{ marginBottom: "2rem", animationDelay: "80ms" }}>
              <div
                className="card"
                style={{ padding: "1rem", display: "flex", flexWrap: "wrap", gap: "0.75rem" }}
              >
                {/* Search */}
                <div style={{ position: "relative", flex: "1 1 200px" }}>
                  <svg
                    width="16" height="16" viewBox="0 0 20 20" fill="none"
                    style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted-light)", pointerEvents: "none" }}
                  >
                    <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M14 14l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by title, subject or content…"
                    className="form-input"
                    style={{ paddingLeft: "2.5rem" }}
                  />
                </div>

                {/* Subject select */}
                <select
                  value={subjectFilter}
                  onChange={e => setSubjectFilter(e.target.value)}
                  className="form-input"
                  style={{ flex: "0 1 180px", cursor: "pointer" }}
                >
                  {subjects.map(s => (
                    <option key={s} value={s}>{s === "All" ? "All subjects" : s}</option>
                  ))}
                </select>
              </div>
            </section>
          )}

          {/* Loading */}
          {loading && (
            <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
              {[1, 2, 3, 4].map(i => <NoteCardSkeleton key={i} />)}
            </section>
          )}

          {/* Error */}
          {!loading && error && (
            <section
              className="card animate-scale-in"
              style={{ padding: "1.5rem", background: "var(--danger-light)", border: "1px solid #fca5a5" }}
            >
              <p style={{ fontWeight: 600, color: "#991b1b" }}>Something went wrong</p>
              <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: "#b91c1c" }}>{error}</p>
            </section>
          )}

          {/* Empty state */}
          {!loading && !error && notes.length === 0 && (
            <section className="card animate-scale-in" style={{ textAlign: "center", padding: "4rem 2rem" }}>
              <div style={{
                width: 64, height: 64, borderRadius: 18,
                background: "var(--primary-light)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.75rem", margin: "0 auto 1.5rem",
              }}>
                📝
              </div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--foreground)" }}>No notes yet</h2>
              <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "var(--muted)", maxWidth: "360px", margin: "0.5rem auto 0" }}>
                Your collection is empty. Create your first study note to get started.
              </p>
              <Link href="/notes/new" className="primary-button" style={{ display: "inline-flex", marginTop: "1.75rem" }}>
                Create your first note
              </Link>
            </section>
          )}

          {/* Notes grid */}
          {!loading && !error && notes.length > 0 && (
            <section>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: "1.25rem", gap: "1rem",
              }}>
                <p style={{ fontSize: "0.875rem", color: "var(--muted)", fontWeight: 500 }}>
                  {filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"} found
                </p>
                {hasFilters && (
                  <button
                    type="button"
                    onClick={() => { setSearch(""); setSubjectFilter("All"); }}
                    style={{
                      fontSize: "0.875rem", fontWeight: 600, color: "var(--primary)",
                      background: "none", border: "none", cursor: "pointer", padding: 0,
                    }}
                  >
                    Clear filters ×
                  </button>
                )}
              </div>

              {filteredNotes.length === 0 ? (
                <div className="card animate-scale-in" style={{ textAlign: "center", padding: "3rem 2rem" }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 14,
                    background: "var(--primary-light)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.5rem", margin: "0 auto 1.25rem",
                  }}>🔎</div>
                  <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>No matching notes</h2>
                  <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "var(--muted)" }}>
                    Try a different search term or subject.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSearch(""); setSubjectFilter("All"); }}
                    className="primary-button"
                    style={{ display: "inline-flex", marginTop: "1.5rem" }}
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
                  {filteredNotes.map((note, i) => (
                    <NoteCard key={note.id} note={note} index={i} onDelete={handleDelete} />
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </>
  );
}
