import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SubjectBadge from "@/components/SubjectBadge";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function NoteDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const noteId = Number(id);

  if (Number.isNaN(noteId)) {
    notFound();
  }

  const note = await prisma.note.findUnique({
    where: {
      id: noteId,
    },
  });

  if (!note) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-(--background)">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">

        {/* Back */}
        <Link
          href="/notes"
          className="animate-fade-up inline-flex items-center text-sm font-medium --muted transition hover:--primary"
        >
          ← Back to notes
        </Link>

        {/* Article */}
        <article className="mt-8 animate-scale-in rounded-2xl border border---border bg-white shadow-sm">

          {/* Header */}
          <header className="px-6 py-8 sm:px-10 sm:py-10">
            <SubjectBadge subject={note.subject} />

            <h1 className="mt-5 text-4xl font-bold tracking-tight --foreground sm:text-5xl">
              {note.title}
            </h1>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm --muted-light">
              <span>
                Created{" "}
                {new Date(note.createdAt).toLocaleDateString()}
              </span>

              {note.updatedAt !== note.createdAt && (
                <span>
                  Updated{" "}
                  {new Date(note.updatedAt).toLocaleDateString()}
                </span>
              )}
            </div>

            {/* Divider */}
            <div className="mt-8 h-px bg-gradient-to-r from---primary/40 via---border to-transparent" />
          </header>

          {/* Content */}
          <div className="px-6 pb-8 sm:px-10 sm:pb-10">
            <div className="max-w-3xl">
              <div className="whitespace-pre-wrap text-base leading-8 --foreground/80">
                {note.content}
              </div>
            </div>
          </div>

          {/* Actions */}
          <footer className="flex flex-col gap-3 border-t border---border px-6 py-6 sm:flex-row sm:items-center sm:px-10">
            <Link
              href={`/notes/${note.id}/edit`}
              className="primary-button"
            >
              Edit Note
            </Link>

            <Link
              href="/notes"
              className="rounded-xl border border---border bg-white px-5 py-3 text-center text-sm font-semibold --foreground transition hover:-translate-y-0.5 hover:bg-(--background) hover:shadow-sm"
            >
              Back to notes
            </Link>
          </footer>
        </article>
      </div>
    </main>
  );
}