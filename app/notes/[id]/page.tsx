import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SubjectBadge from "@/components/SubjectBadge";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function NoteDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const noteId = Number(id);

  if (Number.isNaN(noteId)) notFound();

  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (!note) notFound();

  const wordCount = note.content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <main style={{ minHeight: "100vh", background: "var(--background)" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem 1.5rem" }}>

        {/* Breadcrumb */}
        <Link
          href="/notes"
          className="animate-fade-up"
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.375rem",
            fontSize: "0.875rem", fontWeight: 500, color: "var(--muted)",
            textDecoration: "none", marginBottom: "2rem",
            transition: "color 0.15s",
          }}
          onMouseEnter={undefined}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to notes
        </Link>

        {/* Article */}
        <article className="card animate-scale-in" style={{ padding: 0, overflow: "hidden" }}>

          {/* Accent bar */}
          <div style={{ height: "4px", background: "linear-gradient(90deg, var(--primary) 0%, #a78bfa 100%)" }} />

          {/* Header */}
          <header style={{ padding: "2rem 2.5rem 1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <SubjectBadge subject={note.subject} />
            </div>

            <h1
              className="display-title"
              style={{
                fontSize: "2rem", fontWeight: 800, color: "var(--foreground)",
                letterSpacing: "-0.03em", lineHeight: 1.25,
              }}
            >
              {note.title}
            </h1>

            {/* Meta */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "1rem" }}>
              <MetaItem icon="📅" text={`Created ${new Date(note.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`} />
              {note.updatedAt.toString() !== note.createdAt.toString() && (
                <MetaItem icon="✏️" text={`Updated ${new Date(note.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`} />
              )}
              <MetaItem icon="📖" text={`${wordCount} words · ${readTime} min read`} />
            </div>

            <div style={{ marginTop: "1.75rem", height: "1px", background: "linear-gradient(90deg, var(--primary), var(--border), transparent)" }} />
          </header>

          {/* Content */}
          <div style={{ padding: "0 2.5rem 2rem" }}>
            <div
              style={{
                fontSize: "0.9375rem",
                lineHeight: 1.85,
                color: "var(--foreground)",
                opacity: 0.85,
                whiteSpace: "pre-wrap",
                maxWidth: "680px",
              }}
            >
              {note.content}
            </div>
          </div>

          {/* Footer actions */}
          <footer
            style={{
              display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center",
              borderTop: "1px solid var(--border)",
              padding: "1.25rem 2.5rem",
            }}
          >
            <Link href={`/notes/${note.id}/edit`} className="primary-button">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M11.5 2.5a1.41 1.41 0 0 1 2 2L5 13H3v-2L11.5 2.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
              </svg>
              Edit note
            </Link>
            <Link
              href="/notes"
              style={{
                display: "inline-flex", alignItems: "center",
                padding: "0.7rem 1.25rem", borderRadius: "10px",
                border: "1.5px solid var(--border)", background: "white",
                fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)",
                textDecoration: "none", transition: "all 0.18s ease",
              }}
            >
              All notes
            </Link>
          </footer>
        </article>
      </div>
    </main>
  );
}

function MetaItem({ icon, text }: { icon: string; text: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: "var(--muted-light)" }}>
      <span style={{ fontSize: "0.875rem" }}>{icon}</span>
      {text}
    </span>
  );
}
