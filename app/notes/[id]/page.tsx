import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SubjectBadge from "@/components/SubjectBadge";
import NoteActions from "@/components/NoteActions";

type PageProps = { params: Promise<{ id: string }> };

export default async function NoteDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const noteId = Number(id);
  if (Number.isNaN(noteId)) notFound();

  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (!note) notFound();

  const wordCount = note.content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <main style={{ minHeight: "100vh", background: "var(--background)", padding: "2.5rem 1.5rem" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>

        {/* Back */}
        <Link href="/notes" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", fontWeight: 500, color: "var(--muted)", marginBottom: "2rem" }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back to notes
        </Link>

        {/* Article */}
        <article className="card animate-scale-in" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ height: 4, background: "linear-gradient(90deg, var(--primary) 0%, #a78bfa 100%)" }} />

          <header style={{ padding: "2rem 2.5rem 1.5rem" }}>
            <SubjectBadge subject={note.subject} />
            <h1 className="display-title" style={{ fontSize: "2rem", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.03em", lineHeight: 1.25, marginTop: "1rem" }}>
              {note.title}
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "0.875rem" }}>
              <MetaItem icon="📅" text={`Created ${new Date(note.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`} />
              {note.updatedAt.toString() !== note.createdAt.toString() && (
                <MetaItem icon="✏️" text={`Updated ${new Date(note.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`} />
              )}
              <MetaItem icon="📖" text={`${wordCount} words · ${readTime} min read`} />
            </div>
            <div style={{ marginTop: "1.5rem", height: 1, background: "linear-gradient(90deg, var(--primary), var(--border), transparent)" }} />
          </header>

          {/* Content */}
          <div style={{ padding: "0 2.5rem 2rem", fontSize: "0.9375rem", lineHeight: 1.85, color: "var(--foreground)", opacity: 0.88, whiteSpace: "pre-wrap" }}>
            {note.content}
          </div>

          {/* Footer actions */}
          <footer style={{ borderTop: "1px solid var(--border)", padding: "1.25rem 2.5rem" }}>
            <NoteActions
              noteId={note.id}
              noteTitle={note.title}
              noteContent={note.content}
              noteSubject={note.subject}
              noteCreatedAt={note.createdAt.toISOString()}
              initialIsPublic={note.isPublic}
              initialShareToken={note.shareToken ?? null}
            />
          </footer>
        </article>
      </div>
    </main>
  );
}

function MetaItem({ icon, text }: { icon: string; text: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: "var(--muted-light)" }}>
      <span>{icon}</span>{text}
    </span>
  );
}
