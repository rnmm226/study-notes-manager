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

export default function NoteForm({
  mode = "create",
  initialValues,
  noteId,
}: NoteFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(
    initialValues?.title ?? ""
  );
  const [subject, setSubject] = useState(
    initialValues?.subject ?? ""
  );
  const [content, setContent] = useState(
    initialValues?.content ?? ""
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = mode === "edit";

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!title.trim() || !subject.trim() || !content.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        isEdit ? `/api/notes/${noteId}` : "/api/notes",
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            subject: subject.trim(),
            content: content.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            `Failed to ${isEdit ? "update" : "create"} note`
        );
      }

      if (isEdit) {
        router.push(`/notes/${noteId}`);
      } else {
        router.push("/notes");
      }

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card animate-scale-in"
    >
      <div className="space-y-7">

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-semibold text-[var(--foreground)]"
          >
            Title
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="e.g. SQL Joins"
            disabled={saving}
            required
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-light)] focus:border-[var(--primary)] focus:bg-white focus:ring-2 focus:ring-[var(--primary)]/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        {/* Subject */}
        <div>
          <label
            htmlFor="subject"
            className="mb-2 block text-sm font-semibold text-[var(--foreground)]"
          >
            Subject
          </label>

          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(event) =>
              setSubject(event.target.value)
            }
            placeholder="e.g. Database"
            disabled={saving}
            required
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-light)] focus:border-[var(--primary)] focus:bg-white focus:ring-2 focus:ring-[var(--primary)]/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        {/* Content */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="content"
              className="block text-sm font-semibold text-[var(--foreground)]"
            >
              Content
            </label>

            <span className="text-xs text-[var(--muted-light)]">
              {content.length} characters
            </span>
          </div>

          <textarea
            id="content"
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            placeholder="Write your study notes here..."
            disabled={saving}
            required
            rows={12}
            className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-light)] focus:border-[var(--primary)] focus:bg-white focus:ring-2 focus:ring-[var(--primary)]/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="animate-scale-in rounded-xl border border-red-100 bg-red-50 px-4 py-3">
            <p className="text-sm font-semibold text-red-700">
              Something went wrong
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() =>
              router.push(
                isEdit
                  ? `/notes/${noteId}`
                  : "/notes"
              )
            }
            disabled={saving}
            className="rounded-xl border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:-translate-y-0.5 hover:bg-[var(--background)] hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="primary-button disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                {isEdit ? "Saving..." : "Creating..."}
              </>
            ) : (
              <>
                {isEdit ? "Save Changes" : "Create Note"}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}