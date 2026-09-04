export function NoteCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200" />
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
        </div>

        <div>
          <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />

          <div className="mt-3 space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        <div className="flex gap-2 border-t border-[var(--border)] pt-4">
          <div className="h-9 w-20 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-9 w-20 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-9 w-20 animate-pulse rounded-xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export function NoteDetailSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
      <div className="px-6 py-8 sm:px-10 sm:py-10">
        <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200" />

        <div className="mt-5 h-12 w-3/4 animate-pulse rounded-lg bg-gray-200" />

        <div className="mt-5 h-4 w-48 animate-pulse rounded bg-gray-200" />

        <div className="mt-8 h-px bg-[var(--border)]" />
      </div>

      <div className="px-6 pb-8 sm:px-10 sm:pb-10">
        <div className="max-w-3xl space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
        </div>
      </div>

      <div className="border-t border-[var(--border)] px-6 py-6 sm:px-10">
        <div className="h-11 w-28 animate-pulse rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}