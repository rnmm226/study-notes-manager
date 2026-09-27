import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

type Props = { params: Promise<{ token: string }> };

export default async function PublicNotePage({ params }: Props) {
  const { token } = await params;

  const note = await prisma.note.findUnique({ where: { shareToken: token } });
  if (!note || !note.isPublic) notFound();

  const wordCount = note.content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <main style={{ minHeight: "100vh", background: "#fafaf9", padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: 740, margin: "0 auto" }}>

        {/* Banner */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", padding: "0.75rem 1.25rem", borderRadius: 12, background: "var(--primary-light)", border: "1px solid #d8d2ff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "white", fontSize: "0.8rem" }}>S</div>
            <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--primary-dark)" }}>Study Notes</span>
          </div>
          <Link href="/register" style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--primary)", background: "white", padding: "0.375rem 0.875rem", borderRadius: 8, border: "1px solid #d8d2ff" }}>
            Create your own →
          </Link>
        </div>

        {/* Article */}
        <article style={{ background: "white", borderRadius: 18, border: "1px solid var(--border)", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ height: 4, background: "linear-gradient(90deg, var(--primary) 0%, #a78bfa 100%)" }} />

          <header style={{ padding: "2rem 2.5rem 1.5rem" }}>
            {/* Subject badge */}
            <span style={{ display: "inline-block", borderRadius: 999, padding: "0.25rem 0.875rem", fontSize: "0.75rem", fontWeight: 700, background: "var(--primary-light)", color: "var(--primary-dark)", marginBottom: "1rem" }}>
              {note.subject}
            </span>

            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.03em", lineHeight: 1.25, marginBottom: "1rem" }}>
              {note.title}
            </h1>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              <Meta icon="📅" text={new Date(note.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} />
              <Meta icon="📖" text={`${wordCount} words · ${readTime} min read`} />
              <Meta icon="🔗" text="Public note" />
            </div>

            <div style={{ marginTop: "1.5rem", height: 1, background: "linear-gradient(90deg, var(--primary), var(--border), transparent)" }} />
          </header>

          <div style={{ padding: "0 2.5rem 2.5rem", fontSize: "0.9375rem", lineHeight: 1.85, color: "var(--foreground)", whiteSpace: "pre-wrap" }}>
            {note.content}
          </div>
        </article>

        <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.8125rem", color: "var(--muted)" }}>
          Shared via{" "}
          <Link href="/" style={{ fontWeight: 600, color: "var(--primary)" }}>Study Notes</Link>
          {" "}· This note is read-only
        </p>
      </div>
    </main>
  );
}

function Meta({ icon, text }: { icon: string; text: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: "var(--muted-light)" }}>
      <span>{icon}</span>{text}
    </span>
  );
}
