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
  const [toastType, setToastType] =
    useState<"success" | "error">("success");
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
  try {
    const response = await fetch(`/api/notes/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);

      throw new Error(
        data?.error || "Failed to delete note"
      );
    }

    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== id)
    );

    setToastType("success");
    setToast("Note deleted successfully");
  } catch (error) {
    setToastType("error");
    setToast(
      error instanceof Error
        ? error.message
        : "Failed to delete note"
    );

    throw error;
  }
}

  const subjects = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(notes.map((note) => note.subject))
      ),
    ];
  }, [notes]);

  const filteredNotes = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return notes.filter((note) => {
      const matchesSearch =
        note.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        note.content
          .toLowerCase()
          .includes(normalizedSearch) ||
        note.subject
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesSubject =
        subjectFilter === "All" ||
        note.subject === subjectFilter;

      return matchesSearch && matchesSubject;
    });
  }, [notes, search, subjectFilter]);

  function clearFilters() {
    setSearch("");
    setSubjectFilter("All");
  }

  return (
    
    <>
    <ToastContainer
      message={toast}
      type={toastType}
      onClose={() => setToast("")}
    />

    <main className="min-h-screen bg-(--background)">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">

        {/* Header */}
        <section className="animate-fade-up">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider --primary">
                Your collection
              </p>

              <h1 className="display-title text-4xl font-bold tracking-tight --foreground sm:text-5xl">
                My Notes
              </h1>

              <p className="mt-3 max-w-2xl text-base leading-7 --muted">
                Browse, search, and manage all your study notes
                in one place.
              </p>
            </div>

            <Link
              href="/notes/new"
              className="primary-button shrink-0"
            >
              + New Note
            </Link>
          </div>
        </section>

        {/* Search & Filter */}
        {!loading && notes.length > 0 && (
          <section className="mt-10 animate-fade-up [animation-delay:100ms]">
            <div className="card p-4 sm:p-5">
              <div className="flex flex-col gap-3 md:flex-row">

                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base --muted-light">
                    🔍
                  </span>

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search notes..."
                    className="w-full rounded-xl border border---border bg-(--background) py-3 pl-11 pr-4 text-sm --foreground outline-none transition placeholder:--muted-light focus:border---primary focus:bg-white focus:ring-2 focus:ring---primary/10"
                  />
                </div>

                <select
                  value={subjectFilter}
                  onChange={(event) =>
                    setSubjectFilter(event.target.value)
                  }
                  className="rounded-xl border border---border bg-(--background) px-4 py-3 text-sm font-medium --foreground outline-none transition focus:border---primary focus:bg-white focus:ring-2 focus:ring---primary/10"
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
            </div>
          </section>
        )}

        {/* Loading */}
        {loading && (
          <section className="mt-10 grid gap-5 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <NoteCardSkeleton key={item} />
            ))}
          </section>
        )}

        {/* Error */}
        {!loading && error && (
          <section className="mt-10 animate-scale-in rounded-2xl border border-red-100 bg-red-50 p-6 text-red-600">
            <p className="font-semibold">
              Something went wrong
            </p>

            <p className="mt-1 text-sm">
              {error}
            </p>
          </section>
        )}

        {/* Empty database */}
        {!loading &&
          !error &&
          notes.length === 0 && (
            <section className="card mt-10 animate-scale-in p-10 text-center sm:p-16">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg---primary-light text-3xl">
                📝
              </div>

              <h2 className="mt-6 text-2xl font-bold --foreground">
                No notes yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 --muted">
                Your collection is empty. Create your first
                study note to get started.
              </p>

              <Link
                href="/notes/new"
                className="primary-button mt-6 inline-flex"
              >
                Create your first note
              </Link>
            </section>
          )}

        {/* Notes */}
        {!loading &&
          !error &&
          notes.length > 0 && (
            <section className="mt-10">

              <div className="mb-5 flex items-center justify-between gap-4">
                <p className="text-sm font-medium --muted">
                  {filteredNotes.length}{" "}
                  {filteredNotes.length === 1
                    ? "note"
                    : "notes"}{" "}
                  found
                </p>

                {(search || subjectFilter !== "All") && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm font-semibold --primary transition hover:--primary-dark"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {/* No results */}
              {filteredNotes.length === 0 && (
                <div className="card animate-scale-in p-10 text-center sm:p-14">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg---primary-light text-2xl">
                    🔎
                  </div>

                  <h2 className="mt-5 text-xl font-bold --foreground">
                    No matching notes
                  </h2>

                  <p className="mt-2 text-sm --muted">
                    Try another search term or subject.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="primary-button mt-6"
                  >
                    Clear filters
                  </button>
                </div>
              )}

              {/* Note cards */}
              {filteredNotes.length > 0 && (
                <div className="grid gap-5 md:grid-cols-2">
                  {filteredNotes.map((note, index) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      index={index}
                      onDelete={handleDelete}
                    />
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