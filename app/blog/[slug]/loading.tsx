import SkeletonBlock from "@/components/SkeletonBlock";

export default function PostLoading() {
  return (
    <main style={{ paddingTop: 64 }}>
      {/* Cover image */}
      <SkeletonBlock className="skeleton--image" style={{ height: "min(50vh, 480px)", borderRadius: 0 }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem clamp(1.25rem,4vw,3rem)", display: "grid", gridTemplateColumns: "1fr 280px", gap: 48, alignItems: "start" }}>
        {/* Article */}
        <article>
          {/* Meta */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <SkeletonBlock className="skeleton--pill" style={{ height: 22, width: 90 }} />
            <SkeletonBlock className="skeleton--pill" style={{ height: 22, width: 70 }} />
          </div>

          {/* Title */}
          <SkeletonBlock className="skeleton--title" style={{ height: 52, width: "95%", marginBottom: 12 }} />
          <SkeletonBlock className="skeleton--title" style={{ height: 52, width: "72%", marginBottom: 20 }} />

          {/* Byline */}
          <div style={{ display: "flex", gap: 16, marginBottom: 36 }}>
            <SkeletonBlock className="skeleton--pill" style={{ height: 14, width: 120 }} />
            <SkeletonBlock className="skeleton--pill" style={{ height: 14, width: 90 }} />
          </div>

          <SkeletonBlock style={{ height: 1, marginBottom: 36 }} />

          {/* Body paragraphs */}
          {[95, 88, 100, 82, 91, 70, 96, 85, 60].map((w, i) => (
            <SkeletonBlock key={i} className="skeleton--text" style={{ width: `${w}%`, marginBottom: 14, height: "1.1em" }} />
          ))}
          <div style={{ margin: "28px 0" }} />
          {[92, 78, 100, 65, 88, 74].map((w, i) => (
            <SkeletonBlock key={i} className="skeleton--text" style={{ width: `${w}%`, marginBottom: 14, height: "1.1em" }} />
          ))}
        </article>

        {/* Sidebar */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 88 }}>
          <SkeletonBlock style={{ height: 120, borderRadius: 12 }} />
          <SkeletonBlock style={{ height: 80, borderRadius: 12 }} />
          <SkeletonBlock style={{ height: 100, borderRadius: 12 }} />
        </aside>
      </div>
    </main>
  );
}
