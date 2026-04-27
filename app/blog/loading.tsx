import SkeletonBlock from "@/components/SkeletonBlock";

function CardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #ede8e1",
        borderRadius: 12,
        overflow: "hidden",
        gridColumn: featured ? "span 2" : undefined,
        display: featured ? "grid" : "block",
        gridTemplateColumns: featured ? "1fr 1fr" : undefined,
      }}
    >
      <SkeletonBlock className="skeleton--image" style={{ height: featured ? 320 : 190, borderRadius: 0 }} />
      <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: 12 }}>
        <SkeletonBlock className="skeleton--pill" style={{ height: 20, width: 80 }} />
        <SkeletonBlock className="skeleton--title" style={{ height: featured ? 38 : 26, width: "88%" }} />
        {featured && <SkeletonBlock className="skeleton--title" style={{ height: 38, width: "65%" }} />}
        <SkeletonBlock className="skeleton--text" style={{ width: "95%" }} />
        <SkeletonBlock className="skeleton--text" style={{ width: "70%" }} />
        <SkeletonBlock className="skeleton--text" style={{ height: 12, width: 120, marginTop: 8 }} />
      </div>
    </div>
  );
}

export default function BlogLoading() {
  return (
    <main style={{ paddingTop: 64 }}>
      {/* Header */}
      <div style={{ padding: "3.5rem clamp(1.25rem,4vw,3rem) 2rem", maxWidth: 1200, margin: "0 auto" }}>
        <SkeletonBlock style={{ height: 13, width: 80, marginBottom: 14 }} />
        <SkeletonBlock className="skeleton--title" style={{ height: 48, width: 280, marginBottom: 10 }} />
        <SkeletonBlock className="skeleton--text" style={{ width: 340 }} />
      </div>

      {/* Filter pills */}
      <div style={{ padding: "0 clamp(1.25rem,4vw,3rem)", display: "flex", gap: 8, marginBottom: 28 }}>
        {[60, 80, 90, 75, 95].map((w, i) => (
          <SkeletonBlock key={i} className="skeleton--pill" style={{ height: 32, width: w }} />
        ))}
      </div>

      {/* Grid */}
      <div style={{ padding: "0 clamp(1.25rem,4vw,3rem) 5rem", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
          <CardSkeleton featured />
          {[0, 1, 2, 3].map((i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    </main>
  );
}
