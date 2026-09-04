import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

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
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Back */}
        <Link
          href="/notes"
          className="mb-6 inline-block text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to notes
        </Link>

        {/* Note */}
        <article className="rounded-xl bg-white p-8 shadow-sm">
          {/* Subject */}
          <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {note.subject}
          </span>

          {/* Title */}
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            {note.title}
          </h1>

          {/* Dates */}
          <div className="mt-3 text-sm text-gray-400">
            Created on{" "}
            {new Date(note.createdAt).toLocaleDateString()}
          </div>

          {/* Content */}
          <div className="mt-8 whitespace-pre-wrap text-base leading-7 text-gray-700">
            {note.content}
          </div>

          {/* Actions */}
          <div className="mt-10 flex gap-3 border-t border-gray-100 pt-6">
            <Link
              href={`/notes/${note.id}/edit`}
              className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
            >
              Edit Note
            </Link>

            <Link
              href="/notes"
              className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Back
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}