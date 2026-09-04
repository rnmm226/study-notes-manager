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

export default function NoteCard({
  note,
  index = 0,
  onDelete,
}: NoteCardProps) {
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

  return (
    <article
      className="card card-hover animate-fade-up"
      style={{
        animationDelay: `${index * 70}ms`,
      }}
    >
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <SubjectBadge subject={note.subject} />

          <time className="shrink-0 text-xs font-medium text-[var(--muted-light)]">
            {new Date(note.createdAt).toLocaleDateString()}
          </time>
        </div>

        {/* Content */}
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
            {note.title}
          </h2>

          <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-[var(--muted)]">
            {note.content}
          </p>
        </div>

        {/* Actions */}
        {!confirmingDelete ? (
          <div className="flex flex-wrap gap-2 border-t border-[var(--border)] pt-4">
            <Link
              href={`/notes/${note.id}`}
              className="rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:-translate-y-0.5 hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              View
            </Link>

            <Link
              href={`/notes/${note.id}/edit`}
              className="rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:-translate-y-0.5 hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              Edit
            </Link>

            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-[var(--danger)] transition hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        ) : (
          <div className="animate-scale-in rounded-xl border border-red-100 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">
              Delete this note?
            </p>

            <p className="mt-1 text-xs text-red-600/80">
              This action cannot be undone.
            </p>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                disabled={deleting}
                className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}