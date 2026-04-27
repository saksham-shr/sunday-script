import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse essays by category on The Sunday Script. From literature and poetry to life, music, and lyric analysis.",
  alternates: { canonical: "https://thesundayscript.blog/categories" },
};

type CategoryRow = {
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  post_categories: { count: number }[];
};

export default async function CategoriesPage() {
  const { data: categoriesRaw } = await supabase
    .from("categories")
    .select("name, slug, icon, description, post_categories ( count )")
    .order("name", { ascending: true });

  const categories = ((categoriesRaw ?? []) as unknown as CategoryRow[]).map((cat) => ({
    name: cat.name,
    slug: cat.slug,
    description: cat.description ?? "",
    count: cat.post_categories?.[0]?.count ?? 0,
    bg: "",
  }));

  return (
    <main className="page-wrap" style={{ paddingTop: 64 }}>
      <div style={{ padding: "4rem clamp(1.25rem,4vw,3.5rem) 3rem", maxWidth: 720, textAlign: "left" }}>
        <span className="font-accent" style={{ fontSize: "1.2rem", color: "var(--color-primary)", display: "block", marginBottom: "0.4rem" }}>
          the library
        </span>
        <h1
          className="font-headline italic"
          style={{ fontSize: "clamp(2.5rem,5vw,4rem)", color: "var(--color-on-surface)", fontWeight: 400, lineHeight: 1.1, marginBottom: "1rem" }}
        >
          Browse by Category
        </h1>
        <p className="font-body font-light" style={{ fontSize: "0.95rem", color: "var(--color-on-surface-variant)", lineHeight: 1.8 }}>
          Each category is a doorway into a different kind of thought. Pick one and wander.
        </p>
      </div>

      {categories.length === 0 ? (
        <div style={{ padding: "4rem clamp(1.25rem,4vw,3.5rem)", color: "var(--color-on-surface-variant)", fontStyle: "italic" }} className="font-body">
          No categories yet.
        </div>
      ) : (
        <div style={{ padding: "0 clamp(1.25rem,4vw,3.5rem)", paddingBottom: "5rem" }}>
          <div
            className="bento-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}
          >
            {categories.map((cat, i) => {
              const bg = i % 2 === 0 ? "#f0e6e3" : "#e0e6e0";
              const tall = i === 0 || i === categories.length - 1;
              return (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="cat-pill post-card"
                  style={{
                    background: bg,
                    borderRadius: 16,
                    padding: "2rem",
                    minHeight: tall ? 300 : 220,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    border: "1px solid transparent",
                    textDecoration: "none",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span
                      className="font-label font-semibold uppercase"
                      style={{ fontSize: "0.65rem", letterSpacing: "0.1em", color: "var(--color-on-surface-variant)", background: "rgba(255,255,255,0.5)", borderRadius: 999, padding: "0.3rem 0.75rem" }}
                    >
                      {cat.count} {cat.count === 1 ? "essay" : "essays"}
                    </span>
                    <span className="font-body" style={{ fontSize: "0.75rem", color: "var(--color-primary)" }}>→</span>
                  </div>
                  <div>
                    <h2
                      className="font-headline"
                      style={{ fontSize: "clamp(1.3rem,2vw,1.75rem)", color: "var(--color-on-surface)", lineHeight: 1.2, marginBottom: "0.5rem" }}
                    >
                      {cat.name}
                    </h2>
                    {cat.description && (
                      <p
                        className="font-body font-light italic"
                        style={{ fontSize: "0.82rem", color: "var(--color-on-surface-variant)", lineHeight: 1.65 }}
                      >
                        {cat.description}
                      </p>
                    )}
                    <span
                      className="font-label font-medium uppercase"
                      style={{ display: "inline-block", marginTop: "0.75rem", fontSize: "0.68rem", letterSpacing: "0.12em", color: "var(--color-primary)", borderBottom: "1px solid var(--color-primary-fixed)", paddingBottom: 1 }}
                    >
                      Explore
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
