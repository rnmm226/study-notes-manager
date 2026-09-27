"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  noteId: number;
  noteTitle: string;
  noteContent: string;
  noteSubject: string;
  noteCreatedAt: string;
  initialIsPublic: boolean;
  initialShareToken: string | null;
};

export default function NoteActions({
  noteId, noteTitle, noteContent, noteSubject, noteCreatedAt,
  initialIsPublic, initialShareToken,
}: Props) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [shareToken, setShareToken] = useState<string | null>(initialShareToken);
  const [shareLoading, setShareLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  /* ── Export as plain text ── */
  function exportText() {
    const content = [
      `# ${noteTitle}`,
      `Subject: ${noteSubject}`,
      `Created: ${new Date(noteCreatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
      "",
      noteContent,
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${noteTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ── Export as PDF (print dialog) ── */
  function exportPDF() {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${noteTitle}</title>
  <style>
    body { font-family: Georgia, serif; max-width: 680px; margin: 3rem auto; color: #18151f; line-height: 1.8; }
    h1 { font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; }
    .meta { color: #6a6478; font-size: 0.875rem; margin-bottom: 2rem; }
    .badge { display: inline-block; background: #ede9ff; color: #5848e8; padding: 2px 10px; border-radius: 999px; font-size: 0.8rem; font-weight: 700; margin-bottom: 1rem; }
    pre { white-space: pre-wrap; font-family: inherit; font-size: 1rem; }
    @media print { body { margin: 1.5cm; } }
  </style>
</head>
<body>
  <div class="badge">${noteSubject}</div>
  <h1>${noteTitle}</h1>
  <div class="meta">Created ${new Date(noteCreatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · Study Notes</div>
  <pre>${noteContent.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
</body>
</html>`;

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  }

  /* ── Toggle share ── */
  async function toggleShare() {
    setShareLoading(true);
    try {
      if (isPublic) {
        await fetch(`/api/notes/${noteId}/share`, { method: "DELETE" });
        setIsPublic(false);
        setShareToken(null);
      } else {
        const res = await fetch(`/api/notes/${noteId}/share`, { method: "POST" });
        const data = await res.json();
        setIsPublic(true);
        setShareToken(data.token);
      }
    } catch { /* noop */ }
    finally { setShareLoading(false); }
  }

  async function copyLink() {
    if (!shareToken) return;
    const url = `${window.location.origin}/notes/public/${shareToken}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
      {/* Edit */}
      <Link href={`/notes/${noteId}/edit`} className="primary-button">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M11.5 2.5a1.41 1.41 0 0 1 2 2L5 13H3v-2L11.5 2.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
        Edit note
      </Link>

      {/* Export Text */}
      <button onClick={exportText} style={outlineBtn}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
        Export .txt
      </button>

      {/* Export PDF */}
      <button onClick={exportPDF} style={outlineBtn}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="11" y2="17"/></svg>
        Export PDF
      </button>

      {/* Share toggle */}
      <button
        onClick={toggleShare}
        disabled={shareLoading}
        style={{
          ...outlineBtn,
          ...(isPublic ? { borderColor: "var(--primary)", color: "var(--primary)", background: "var(--primary-light)" } : {}),
        }}
      >
        {shareLoading ? (
          <span style={{ display: "inline-block", width: 12, height: 12, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.75s linear infinite" }} />
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        )}
        {isPublic ? "Shared" : "Share"}
      </button>

      {/* Copy link (shown when shared) */}
      {isPublic && shareToken && (
        <button onClick={copyLink} style={{ ...outlineBtn, borderColor: copied ? "var(--success)" : "var(--border)", color: copied ? "var(--success)" : "var(--muted)" }}>
          {copied ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          )}
          {copied ? "Copied!" : "Copy link"}
        </button>
      )}

      {/* Back link */}
      <Link href="/notes" style={{ ...outlineBtn, marginLeft: "auto", textDecoration: "none" } as React.CSSProperties}>
        All notes
      </Link>
    </div>
  );
}

const outlineBtn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: "0.375rem",
  padding: "0.65rem 1rem", borderRadius: 10,
  border: "1.5px solid var(--border)", background: "white",
  fontSize: "0.8125rem", fontWeight: 600, color: "var(--foreground)",
  cursor: "pointer", transition: "all 0.18s",
};
