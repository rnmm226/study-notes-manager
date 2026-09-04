"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

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

  useEffect(() => {
    async function loadNotes() {
      try {
        const response = await fetch("/api/notes");

        if (!response.ok) {
          throw new Error("Failed to fetch notes");
        }

        const data = await response.json();

        setNotes(data);
        setError("");
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }

    loadNotes();
  }, []);

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      setNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== id)
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete note"
      );
    }
  }

  // Get unique subjects
  const subjects = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(notes.map((note) => note.subject))
      ),
    ];
  }, [notes]);

  // Filter notes
  const filteredNotes = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return notes.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(normalizedSearch) ||
        note.content.toLowerCase().includes(normalizedSearch) ||
        note.subject.toLowerCase().includes(normalizedSearch);

      const matchesSubject =
        subjectFilter === "All" ||
        note.subject === subjectFilter;

      return matchesSearch && matchesSubject;
    });
  }, [notes, search, subjectFilter]);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Notes
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your study notes.
            </p>
          </div>

          <Link
            href="/notes/new"
            className="rounded-lg bg-gray-900 px-5 py-3 text-center text-sm font-medium text-white hover:bg-gray-800"
          >
            + New Note
          </Link>
        </div>

        {/* Search & Filter */}
        {!loading && notes.length > 0 && (
          <div className="mb-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="🔍 Search notes..."
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-900"
            />

            <select
              value={subjectFilter}
              onChange={(event) =>
                setSubjectFilter(event.target.value)
              }
              className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-900"
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject === "All"
                    ? "All Subjects"
                    : subject}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
            Loading notes...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl bg-red-50 p-6 text-red-600">
            {error}
          </div>
        )}

        {/* Empty database */}
        {!loading && !error && notes.length === 0 && (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              No notes yet
            </h2>

            <p className="mt-2 text-gray-500">
              Create your first study note.
            </p>

            <Link
              href="/notes/new"
              className="mt-6 inline-block rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
            >
              Create Note
            </Link>
          </div>
        )}

        {/* No search results */}
        {!loading &&
          !error &&
          notes.length > 0 &&
          filteredNotes.length === 0 && (
            <div className="rounded-xl bg-white p-12 text-center shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">
                No matching notes
              </h2>

              <p className="mt-2 text-gray-500">
                Try another search or subject.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSubjectFilter("All");
                }}
                className="mt-6 rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
              >
                Clear Filters
              </button>
            </div>
          )}

        {/* Notes */}
        {!loading &&
          !error &&
          filteredNotes.length > 0 && (
            <>
              <p className="mb-4 text-sm text-gray-500">
                {filteredNotes.length}{" "}
                {filteredNotes.length === 1 ? "note" : "notes"} found
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-xl bg-white p-6 shadow-sm"
                  >
                    {/* Subject */}
                    <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {note.subject}
                    </span>

                    {/* Title */}
                    <h2 className="mt-4 text-xl font-bold text-gray-900">
                      {note.title}
                    </h2>

                    {/* Content */}
                    <p className="mt-3 line-clamp-4 whitespace-pre-wrap text-gray-600">
                      {note.content}
                    </p>

                    {/* Date */}
                    <p className="mt-4 text-xs text-gray-400">
                      Created:{" "}
                      {new Date(
                        note.createdAt
                      ).toLocaleDateString()}
                    </p>

                    {/* Actions */}
                    <div className="mt-6 flex gap-3">
                      <Link
                        href={`/notes/${note.id}`}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        View
                      </Link>

                      <Link
                        href={`/notes/${note.id}/edit`}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(note.id)
                        }
                        className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
      </div>
    </main>
  );
}