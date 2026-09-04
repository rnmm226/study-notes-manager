"use client";

import Link from "next/link";
import NoteForm from "@/components/NoteForm";

export default function NewNotePage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">

        {/* Header */}
        <section className="mb-8 animate-fade-up">
          <Link
            href="/notes"
            className="mb-6 inline-flex items-center text-sm font-medium text-[var(--muted)] transition hover:text-[var(--primary)]"
          >
            ← Back to notes
          </Link>

          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
            Your collection
          </p>

          <h1 className="display-title text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
            Create a Note
          </h1>

          <p className="mt-3 max-w-xl text-base leading-7 text-[var(--muted)]">
            Add a new study note to keep your knowledge
            organized and easy to find.
          </p>
        </section>

        {/* Form */}
        <NoteForm />
      </div>
    </main>
  );
}