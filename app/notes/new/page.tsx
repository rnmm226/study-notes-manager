"use client";

import Link from "next/link";
import NoteForm from "@/components/NoteForm";

export default function NewNotePage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--background)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "2.5rem 1.5rem" }}>
      <div style={{ width: "100%", maxWidth: 680 }}>

        {/* Back */}
        <Link href="/notes" style={{
          display: "inline-flex", alignItems: "center", gap: "0.375rem",
          fontSize: "0.875rem", fontWeight: 500, color: "var(--muted)",
          marginBottom: "1.75rem",
        }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back to notes
        </Link>

        {/* Header */}
        <div style={{ marginBottom: "1.75rem" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--primary)", marginBottom: "0.375rem" }}>
            New note
          </p>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.025em" }}>
            Create a Note
          </h1>
          <p style={{ marginTop: "0.375rem", fontSize: "0.9rem", color: "var(--muted)" }}>
            Add a new study note to your collection.
          </p>
        </div>

        <NoteForm />
      </div>
    </main>
  );
}
