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
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-medium text-gray-500">
            Study Notes Manager
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Welcome back 👋
          </h1>

          <p className="mt-3 text-gray-600">
            Organize your study notes and keep your knowledge
            in one place.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Total Notes */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Notes
            </p>

            <p className="mt-2 text-4xl font-bold text-gray-900">
              {loading ? "..." : notes.length}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Notes in your collection
            </p>
          </div>

          {/* Total Subjects */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Subjects
            </p>

            <p className="mt-2 text-4xl font-bold text-gray-900">
              {loading ? "..." : subjects.length}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Different subjects
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/notes"
            className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            View All Notes
          </Link>

          <Link
            href="/notes/new"
            className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            + New Note
          </Link>
        </div>

        {/* Recent Notes */}
        <section className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Notes
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your latest study notes.
              </p>
            </div>

            {notes.length > 5 && (
              <Link
                href="/notes"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                View all →
              </Link>
            )}
          </div>

          {loading && (
            <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
              Loading notes...
            </div>
          )}

          {!loading && recentNotes.length === 0 && (
            <div className="rounded-xl bg-white p-10 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                No notes yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Start by creating your first study note.
              </p>

              <Link
                href="/notes/new"
                className="mt-5 inline-block rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
              >
                Create your first note
              </Link>
            </div>
          )}

          {!loading && recentNotes.length > 0 && (
            <div className="grid gap-4">
              {recentNotes.map((note) => (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className="block rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        {note.subject}
                      </span>

                      <h3 className="mt-3 text-lg font-semibold text-gray-900">
                        {note.title}
                      </h3>

                      <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                        {note.content}
                      </p>
                    </div>

                    <span className="shrink-0 text-sm text-gray-400">
                      {new Date(
                        note.createdAt
                      ).toLocaleDateString()}
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