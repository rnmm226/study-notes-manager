"use client";

import Link from "next/link";
import { useState } from "react";
import SubjectBadge from "./SubjectBadge";

type Note = {
  id: number;
  title: string;
  content: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
};

type NoteCardProps = {
  note: Note;
  index?: number;
  onDelete: (id: number) => Promise<void>;
};

export default function NoteCard({ note, index = 0, onDelete }: NoteCardProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    try {
      setDeleting(true);
      await onDelete(note.id);
    } finally {
      setDeleting(false);
      setConfirmingDelete(false);
    }
  }

  const wordCount = note.content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <article
      className="card card-hover animate-fade-up flex flex-col"
      style={{
        animationDelay: `${index * 60}ms`,
        padding: "1.25rem 1.5rem",
        minHeight: "200px",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <SubjectBadge subject={note.subject} />
        <time
          className="shrink-0 text-xs font-medium"
          style={{ color: "var(--muted-light)" }}
        >
          {new Date(note.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </time>
      </div>

      {/* Body */}
      <div className="flex-1">
        <h2
          className="text-lg font-bold leading-snug tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          {note.title}
        </h2>
        <p
          className="mt-2 line-clamp-3 text-sm leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          {note.content}
        </p>
      </div>

      {/* Footer */}
      <div
        className="mt-4 pt-4"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        {!confirmingDelete ? (
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: "var(--muted-light)" }}>
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </span>
            <div className="flex items-center gap-1.5">
              <Link
                href={`/notes/${note.id}`}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
                style={{
                  color: "var(--foreground)",
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--primary)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--primary)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--foreground)";
                }}
              >
                View
              </Link>
              <Link
                href={`/notes/${note.id}/edit`}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
                style={{
                  color: "var(--primary)",
                  background: "var(--primary-light)",
                  border: "1px solid transparent",
                }}
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
                style={{ color: "var(--danger)", background: "transparent" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--danger-light)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div
            className="animate-scale-in rounded-xl p-3.5"
            style={{
              background: "var(--danger-light)",
              border: "1px solid #fca5a5",
            }}
          >
            <p className="text-sm font-semibold" style={{ color: "#991b1b" }}>
              Delete this note?
            </p>
            <p className="mt-0.5 text-xs" style={{ color: "#b91c1c" }}>
              This cannot be undone.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                disabled={deleting}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50"
                style={{
                  background: "white",
                  border: "1px solid #fca5a5",
                  color: "#374151",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition disabled:opacity-50"
                style={{ background: "var(--danger)" }}
              >
                {deleting ? "Deleting…" : "Yes, delete"}
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
