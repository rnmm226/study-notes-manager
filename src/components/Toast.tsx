"use client";

type ToastProps = {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
};

export default function Toast({
  message,
  type = "success",
  onClose,
}: ToastProps) {
  return (
    <div
      className={`toast ${
        type === "success"
          ? "border-green-200 bg-white"
          : "border-red-200 bg-white"
      }`}
      role="status"
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          type === "success"
            ? "bg-green-100 text-green-600"
            : "bg-red-100 text-red-600"
        }`}
      >
        {type === "success" ? "✓" : "!"}
      </div>

      <p className="flex-1 text-sm font-semibold text-[var(--foreground)]">
        {message}
      </p>

      <button
        type="button"
        onClick={onClose}
        className="rounded-lg px-2 py-1 text-lg leading-none text-[var(--muted-light)] transition hover:bg-gray-100 hover:text-[var(--foreground)]"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}