import SkeletonBlock from "@/components/SkeletonBlock";

function PostCardSkeleton() {
  return (
    <div style={{ background: "#fff", border: "1px solid #ede8e1", borderRadius: 12, overflow: "hidden" }}>
      <SkeletonBlock className="skeleton--image" style={{ height: 200, borderRadius: 0 }} />
      <div style={{ padding: "1.25rem 1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: 10 }}>
        <SkeletonBlock className="skeleton--pill" style={{ height: 20, width: 80 }} />
        <SkeletonBlock className="skeleton--title" style={{ width: "85%" }} />
        <SkeletonBlock className="skeleton--text" style={{ width: "95%" }} />
        <SkeletonBlock className="skeleton--text" style={{ width: "60%" }} />
      </div>
    </div>
  );
}

export default function HomeLoading() {
  return (
    <main style={{ paddingTop: 64 }}>
      {/* Hero skeleton */}
      <section style={{ padding: "clamp(3rem,8vw,6rem) clamp(1.25rem,4vw,3rem)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <SkeletonBlock style={{ height: 14, width: 100 }} />
          <SkeletonBlock className="skeleton--title" style={{ height: 52, width: "90%" }} />
          <SkeletonBlock className="skeleton--title" style={{ height: 52, width: "70%" }} />
          <SkeletonBlock className="skeleton--text" style={{ width: "80%" }} />
          <SkeletonBlock className="skeleton--text" style={{ width: "55%" }} />
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <SkeletonBlock className="skeleton--pill" style={{ height: 44, width: 140 }} />
            <SkeletonBlock className="skeleton--pill" style={{ height: 44, width: 110 }} />
          </div>
        </div>
        <SkeletonBlock className="skeleton--image" style={{ height: 380, borderRadius: 16 }} />
      </section>

      {/* Category strip skeleton */}
      <div style={{ padding: "1rem clamp(1.25rem,4vw,3rem)", display: "flex", gap: 10 }}>
        {[100, 90, 110, 85, 95, 105].map((w, i) => (
          <SkeletonBlock key={i} className="skeleton--pill" style={{ height: 34, width: w }} />
        ))}
      </div>

      {/* Recent posts skeleton */}
      <section style={{ padding: "3rem clamp(1.25rem,4vw,3rem)", maxWidth: 1200, margin: "0 auto" }}>
        <SkeletonBlock className="skeleton--title" style={{ height: 36, width: 220, marginBottom: 28 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {[0, 1, 2].map((i) => <PostCardSkeleton key={i} />)}
        </div>
      </section>
    </main>
  );
}
