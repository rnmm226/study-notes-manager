"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type NoteFormProps = {
  mode?: "create" | "edit";
  initialValues?: {
    title: string;
    subject: string;
    content: string;
  };
  noteId?: string;
};

export default function NoteForm({ mode = "create", initialValues, noteId }: NoteFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [subject, setSubject] = useState(initialValues?.subject ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = mode === "edit";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!title.trim() || !subject.trim() || !content.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(isEdit ? `/api/notes/${noteId}` : "/api/notes", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          subject: subject.trim(),
          content: content.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${isEdit ? "update" : "create"} note`);
      }

      router.push(isEdit ? `/notes/${noteId}` : "/notes");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card animate-scale-in" style={{ padding: "2rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Title */}
        <div>
          <label htmlFor="title" style={labelStyle}>
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. SQL Joins explained"
            disabled={saving}
            required
            className="form-input"
          />
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" style={labelStyle}>
            Subject
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="e.g. Database, Math, Chemistry…"
            disabled={saving}
            required
            className="form-input"
          />
        </div>

        {/* Content */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <label htmlFor="content" style={labelStyle}>
              Content
            </label>
            <span style={{ fontSize: "0.75rem", color: "var(--muted-light)" }}>
              {content.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          <textarea
            id="content"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write your study notes here…"
            disabled={saving}
            required
            rows={14}
            className="form-input"
            style={{ resize: "vertical", lineHeight: "1.7" }}
          />
        </div>

        {/* Error */}
        {error && (
          <div
            className="animate-scale-in rounded-xl px-4 py-3"
            style={{
              background: "var(--danger-light)",
              border: "1px solid #fca5a5",
            }}
          >
            <p className="text-sm font-semibold" style={{ color: "#991b1b" }}>
              {error}
            </p>
          </div>
        )}

        {/* Actions */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: "0.75rem",
            borderTop: "1px solid var(--border)",
            paddingTop: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() => router.push(isEdit ? `/notes/${noteId}` : "/notes")}
            disabled={saving}
            className="rounded-xl text-sm font-semibold transition"
            style={{
              padding: "0.7rem 1.25rem",
              border: "1.5px solid var(--border)",
              background: "white",
              color: "var(--foreground)",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="primary-button"
          >
            {saving ? (
              <>
                <span
                  className="animate-spin"
                  style={{
                    display: "inline-block",
                    width: "14px",
                    height: "14px",
                    border: "2px solid rgba(255,255,255,0.35)",
                    borderTopColor: "white",
                    borderRadius: "50%",
                  }}
                />
                {isEdit ? "Saving…" : "Creating…"}
              </>
            ) : (
              isEdit ? "Save changes" : "Create note"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "0.5rem",
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "var(--foreground)",
};
