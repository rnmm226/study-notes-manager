function Bone({ w, h, radius = 8 }: { w: string; h: number; radius?: number }) {
  return (
    <div
      className="animate-pulse"
      style={{
        width: w,
        height: h,
        borderRadius: radius,
        background: "#ebe8f0",
      }}
    />
  );
}

export function NoteCardSkeleton() {
  return (
    <div className="card" style={{ padding: "1.25rem 1.5rem", minHeight: "200px", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Bone w="80px" h={22} radius={999} />
        <Bone w="72px" h={14} />
      </div>
      <div style={{ flex: 1 }}>
        <Bone w="70%" h={20} />
        <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Bone w="100%" h={13} />
          <Bone w="85%" h={13} />
          <Bone w="60%" h={13} />
        </div>
      </div>
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
        <Bone w="56px" h={30} radius={8} />
        <Bone w="56px" h={30} radius={8} />
        <Bone w="56px" h={30} radius={8} />
      </div>
    </div>
  );
}

export function NoteDetailSkeleton() {
  return (
    <div className="card" style={{ overflow: "hidden", padding: 0 }}>
      <div style={{ padding: "2rem 2.5rem" }}>
        <Bone w="80px" h={24} radius={999} />
        <div style={{ marginTop: "1.25rem" }}>
          <Bone w="70%" h={36} />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <Bone w="200px" h={16} />
        </div>
        <div style={{ marginTop: "1.5rem", height: "1px", background: "var(--border)" }} />
      </div>
      <div style={{ padding: "0 2.5rem 2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          <Bone w="100%" h={15} />
          <Bone w="100%" h={15} />
          <Bone w="88%" h={15} />
          <Bone w="95%" h={15} />
          <Bone w="65%" h={15} />
        </div>
      </div>
      <div style={{ borderTop: "1px solid var(--border)", padding: "1.25rem 2.5rem", display: "flex", gap: "0.75rem" }}>
        <Bone w="120px" h={40} radius={10} />
        <Bone w="120px" h={40} radius={10} />
      </div>
    </div>
  );
}

export function DashboardStatSkeleton() {
  return (
    <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <Bone w="80px" h={14} />
        <Bone w="50px" h={36} />
        <Bone w="100px" h={12} />
      </div>
      <Bone w="44px" h={44} radius={12} />
    </div>
  );
}
