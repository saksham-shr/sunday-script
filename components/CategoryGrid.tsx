import Link from "next/link";

type Category = {
  name: string;
  slug: string;
  count: number;
  icon: string;
};

type CategoryGridProps = {
  categories: Category[];
};

export default function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) return null;

  return (
    <section style={{ padding: "0 clamp(1.25rem,4vw,3.5rem)", marginBottom: "5rem" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <span className="font-accent" style={{ fontSize: "1.2rem", color: "var(--color-primary)", display: "block", marginBottom: "0.25rem" }}>
            explore by theme
          </span>
          <h2
            className="font-headline"
            style={{ fontSize: "clamp(1.6rem,2.5vw,2.25rem)", color: "var(--color-on-surface)", fontWeight: 400 }}
          >
            Categories
          </h2>
        </div>
        <Link
          href="/categories"
          className="font-label font-medium uppercase"
          style={{
            fontSize: "0.68rem",
            letterSpacing: "0.14em",
            color: "var(--color-primary)",
            background: "none",
            border: "1px solid var(--color-outline-variant)",
            borderRadius: 999,
            padding: "0.45rem 1rem",
            textDecoration: "none",
          }}
        >
          View all
        </Link>
      </div>

      <div className="cat-scroll" style={{ display: "flex", gap: "0.75rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
        {categories.map((cat, i) => {
          const bg = i % 2 === 0 ? "#f0e6e3" : "#e0e6e0";
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="cat-pill"
              style={{
                flexShrink: 0,
                background: bg,
                border: "none",
                borderRadius: 999,
                padding: "0.65rem 1.4rem",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                textDecoration: "none",
              }}
            >
              <span className="font-headline" style={{ fontSize: "0.95rem", color: "var(--color-on-surface)" }}>
                {cat.name}
              </span>
              <span
                className="font-body"
                style={{
                  fontSize: "0.65rem",
                  color: "var(--color-on-surface-variant)",
                  background: "rgba(0,0,0,0.06)",
                  borderRadius: 999,
                  padding: "0.1rem 0.5rem",
                }}
              >
                {cat.count}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
