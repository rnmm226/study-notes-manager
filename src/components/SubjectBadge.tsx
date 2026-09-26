type SubjectBadgeProps = {
  subject: string;
  size?: "sm" | "md";
};

// Generates a consistent color from the subject string
function getSubjectColor(subject: string): {
  bg: string;
  text: string;
  border: string;
} {
  const colors = [
    { bg: "#ede9ff", text: "#6555e0", border: "#d8d2ff" },
    { bg: "#dbeafe", text: "#1d4ed8", border: "#bfdbfe" },
    { bg: "#d1fae5", text: "#065f46", border: "#a7f3d0" },
    { bg: "#fce7f3", text: "#9d174d", border: "#fbcfe8" },
    { bg: "#fef3c7", text: "#92400e", border: "#fde68a" },
    { bg: "#e0f2fe", text: "#075985", border: "#bae6fd" },
    { bg: "#f3e8ff", text: "#6b21a8", border: "#e9d5ff" },
    { bg: "#ffedd5", text: "#9a3412", border: "#fed7aa" },
    { bg: "#ecfdf5", text: "#14532d", border: "#a7f3d0" },
    { bg: "#fdf4ff", text: "#86198f", border: "#f0abfc" },
  ];
  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function SubjectBadge({ subject, size = "md" }: SubjectBadgeProps) {
  const color = getSubjectColor(subject);

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full font-semibold"
      style={{
        background: color.bg,
        color: color.text,
        border: `1px solid ${color.border}`,
        padding: size === "sm" ? "0.2rem 0.6rem" : "0.25rem 0.75rem",
        fontSize: size === "sm" ? "0.7rem" : "0.75rem",
      }}
    >
      <span
        className="inline-block rounded-full"
        style={{
          width: size === "sm" ? "5px" : "6px",
          height: size === "sm" ? "5px" : "6px",
          background: color.text,
          opacity: 0.7,
          flexShrink: 0,
        }}
      />
      {subject}
    </span>
  );
}
