import SkeletonBlock from "@/components/SkeletonBlock";

export default function CategoriesLoading() {
  return (
    <main style={{ paddingTop: 64 }}>
      {/* Header */}
      <div style={{ padding: "3.5rem clamp(1.25rem,4vw,3rem) 2rem", maxWidth: 1200, margin: "0 auto" }}>
        <SkeletonBlock style={{ height: 13, width: 90, marginBottom: 14 }} />
        <SkeletonBlock className="skeleton--title" style={{ height: 48, width: 260, marginBottom: 10 }} />
        <SkeletonBlock className="skeleton--text" style={{ width: 380 }} />
      </div>

      {/* Bento grid */}
      <div style={{ padding: "0 clamp(1.25rem,4vw,3rem) 5rem", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #ede8e1", borderRadius: 16, padding: "2rem 1.75rem", display: "flex", flexDirection: "column", gap: 14 }}>
              <SkeletonBlock className="skeleton--pill" style={{ height: 22, width: 52 }} />
              <SkeletonBlock className="skeleton--title" style={{ height: 28, width: "75%" }} />
              <SkeletonBlock className="skeleton--text" style={{ width: "90%" }} />
              <SkeletonBlock className="skeleton--text" style={{ width: "65%" }} />
              <SkeletonBlock className="skeleton--pill" style={{ height: 24, width: 70, marginTop: 8 }} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
