"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Note = {
  id: number;
  title: string;
  content: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
};

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotes() {
      try {
        const response = await fetch("/api/notes");

        if (!response.ok) {
          throw new Error("Failed to fetch notes");
        }

        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadNotes();
  }, []);

  const subjects = Array.from(
    new Set(notes.map((note) => note.subject))
  );

  const recentNotes = notes.slice(0, 5);

  return (
    <main className="min-h-screen bg-(--background)">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">

        {/* Hero */}
        <section className="animate-fade-up">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider --primary">
              Study Notes Manager
            </p>

            <h1 className="display-title text-4xl font-bold tracking-tight --foreground sm:text-5xl">
              Welcome back 👋
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 --muted sm:text-lg">
              Organize your study notes, keep your knowledge
              structured, and find what you need quickly.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-10 grid gap-5 sm:grid-cols-2">
          <div className="card card-hover animate-fade-up">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium --muted">
                  Total Notes
                </p>

                <p className="mt-3 text-4xl font-bold tracking-tight --foreground">
                  {loading ? "..." : notes.length}
                </p>

                <p className="mt-2 text-sm --muted-light">
                  Notes in your collection
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg---primary-light text-xl">
                📝
              </div>
            </div>
          </div>

          <div className="card card-hover animate-fade-up [animation-delay:100ms]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium --muted">
                  Subjects
                </p>

                <p className="mt-3 text-4xl font-bold tracking-tight --foreground">
                  {loading ? "..." : subjects.length}
                </p>

                <p className="mt-2 text-sm --muted-light">
                  Different subjects
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg---primary-light text-xl">
                📚
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="mt-7 flex flex-wrap gap-3 animate-fade-up [animation-delay:150ms]">
          <Link
            href="/notes"
            className="primary-button"
          >
            View All Notes →
          </Link>

          <Link
            href="/notes/new"
            className="rounded-xl border border---border bg-white px-5 py-3 text-sm font-semibold --foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            + Create Note
          </Link>
        </section>

        {/* Recent Notes */}
        <section className="mt-14 animate-fade-up [animation-delay:200ms]">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight --foreground">
                Recent Notes
              </h2>

              <p className="mt-1 text-sm --muted">
                Your latest study notes.
              </p>
            </div>

            {notes.length > 5 && (
              <Link
                href="/notes"
                className="text-sm font-semibold --primary transition hover:--primary-dark"
              >
                View all →
              </Link>
            )}
          </div>

          {loading && (
            <div className="grid gap-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-2xl border border---border bg-white"
                />
              ))}
            </div>
          )}

          {!loading && recentNotes.length === 0 && (
            <div className="card animate-scale-in p-10 text-center sm:p-14">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg---primary-light text-2xl">
                📝
              </div>

              <h3 className="mt-5 text-xl font-bold --foreground">
                No notes yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 --muted">
                Start building your study collection by creating
                your first note.
              </p>

              <Link
                href="/notes/new"
                className="primary-button mt-6 inline-flex"
              >
                Create your first note
              </Link>
            </div>
          )}

          {!loading && recentNotes.length > 0 && (
            <div className="grid gap-4">
              {recentNotes.map((note, index) => (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className="card card-hover block animate-fade-up"
                  style={{
                    animationDelay: `${index * 70}ms`,
                  }}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <span className="inline-flex rounded-full bg---primary-light px-3 py-1 text-xs font-semibold --primary">
                        {note.subject}
                      </span>

                      <h3 className="mt-3 truncate text-lg font-bold --foreground">
                        {note.title}
                      </h3>

                      <p className="mt-1 line-clamp-2 text-sm leading-6 --muted">
                        {note.content}
                      </p>
                    </div>

                    <span className="shrink-0 text-xs font-medium --muted-light">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
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