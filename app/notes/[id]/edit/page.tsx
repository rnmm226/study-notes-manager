"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import NoteForm from "@/components/NoteForm";

type Note = {
  id: number;
  title: string;
  content: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
};

export default function EditNotePage() {
  const params = useParams();
  const id = params.id as string;

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadNote() {
      try {
        const response = await fetch(`/api/notes/${id}`);

        if (!response.ok) {
          throw new Error("Note not found");
        }

        const data = await response.json();
        setNote(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load note"
        );
      } finally {
        setLoading(false);
      }
    }

    loadNote();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-(--background)">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-gray-200" />

          <div className="mt-8 h-96 animate-pulse rounded-2xl bg-white" />
        </div>
      </main>
    );
  }

  if (error || !note) {
    return (
      <main className="min-h-screen bg-(--background)">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <div className="card animate-scale-in">
            <h1 className="text-2xl font-bold --foreground">
              Note not found
            </h1>

            <p className="mt-2 text-sm --muted">
              {error || "This note does not exist."}
            </p>

            <Link
              href="/notes"
              className="primary-button mt-6 inline-flex"
            >
              Back to notes
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-(--background)">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        <section className="mb-8 animate-fade-up">
          <Link
            href={`/notes/${note.id}`}
            className="mb-6 inline-flex text-sm font-medium --muted transition hover:--primary"
          >
            ← Back to note
          </Link>

          <p className="mb-3 text-sm font-semibold uppercase tracking-wider --primary">
            Edit
          </p>

          <h1 className="display-title text-4xl font-bold tracking-tight --foreground sm:text-5xl">
            Edit Note
          </h1>

          <p className="mt-3 text-base leading-7 --muted">
            Update your study note and save your changes.
          </p>
        </section>

        <NoteForm
          mode="edit"
          noteId={String(note.id)}
          initialValues={{
            title: note.title,
            subject: note.subject,
            content: note.content,
          }}
        />
      </div>
    </main>
  );
}