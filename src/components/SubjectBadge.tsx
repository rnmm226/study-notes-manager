type SubjectBadgeProps = {
  subject: string;
};

export default function SubjectBadge({
  subject,
}: SubjectBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full bg---primary-light px-3 py-1 text-xs font-semibold --primary">
      {subject}
    </span>
  );
}