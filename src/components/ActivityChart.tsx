"use client";

type Props = {
  notes: { createdAt: string }[];
};

export default function ActivityChart({ notes }: Props) {
  // Build last 10 weeks × 7 days grid
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const WEEKS = 14;
  const totalDays = WEEKS * 7;

  // Count notes per day
  const countByDay = new Map<string, number>();
  notes.forEach(n => {
    const d = new Date(n.createdAt);
    d.setHours(0, 0, 0, 0);
    const key = d.toISOString().slice(0, 10);
    countByDay.set(key, (countByDay.get(key) || 0) + 1);
  });

  // Build cells: newest last
  const cells: { date: Date; count: number }[] = [];
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    cells.push({ date: d, count: countByDay.get(key) || 0 });
  }

  const max = Math.max(...cells.map(c => c.count), 1);

  function getColor(count: number) {
    if (count === 0) return "#f0eef8";
    const intensity = count / max;
    if (intensity < 0.25) return "#c4b8fc";
    if (intensity < 0.5)  return "#a78bfa";
    if (intensity < 0.75) return "#7c6af7";
    return "#5848e8";
  }

  // Month labels (show first week of each month)
  const months: { label: string; colIndex: number }[] = [];
  cells.forEach((cell, i) => {
    if (cell.date.getDate() <= 7) {
      const col = Math.floor(i / 7);
      const label = cell.date.toLocaleDateString("en-US", { month: "short" });
      if (!months.length || months[months.length - 1].label !== label) {
        months.push({ label, colIndex: col });
      }
    }
  });

  const DAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", ""];

  return (
    <div>
      <div style={{ overflowX: "auto", paddingBottom: "0.5rem" }}>
        {/* Month labels */}
        <div style={{ display: "flex", gap: 3, marginBottom: 4, paddingLeft: 32 }}>
          {Array.from({ length: WEEKS }, (_, col) => {
            const m = months.find(m => m.colIndex === col);
            return (
              <div key={col} style={{ width: 12, fontSize: "0.65rem", color: "var(--muted-light)", flexShrink: 0 }}>
                {m?.label ?? ""}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 0 }}>
          {/* Day labels */}
          <div style={{ display: "flex", flexDirection: "column", gap: 3, marginRight: 4 }}>
            {DAY_LABELS.map((d, i) => (
              <div key={i} style={{ height: 12, width: 24, fontSize: "0.6rem", color: "var(--muted-light)", display: "flex", alignItems: "center" }}>
                {d}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display: "flex", gap: 3 }}>
            {Array.from({ length: WEEKS }, (_, col) => (
              <div key={col} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {Array.from({ length: 7 }, (_, row) => {
                  const cell = cells[col * 7 + row];
                  if (!cell) return <div key={row} style={{ width: 12, height: 12 }} />;
                  return (
                    <div
                      key={row}
                      title={`${cell.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}: ${cell.count} note${cell.count !== 1 ? "s" : ""}`}
                      style={{
                        width: 12, height: 12, borderRadius: 3,
                        background: getColor(cell.count),
                        transition: "transform 0.15s",
                        cursor: cell.count > 0 ? "pointer" : "default",
                      }}
                      onMouseEnter={e => { if (cell.count > 0) (e.currentTarget as HTMLDivElement).style.transform = "scale(1.4)"; }}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = "scale(1)"}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "0.625rem", justifyContent: "flex-end" }}>
        <span style={{ fontSize: "0.7rem", color: "var(--muted-light)" }}>Less</span>
        {["#f0eef8", "#c4b8fc", "#a78bfa", "#7c6af7", "#5848e8"].map(c => (
          <div key={c} style={{ width: 12, height: 12, borderRadius: 3, background: c }} />
        ))}
        <span style={{ fontSize: "0.7rem", color: "var(--muted-light)" }}>More</span>
      </div>
    </div>
  );
}
