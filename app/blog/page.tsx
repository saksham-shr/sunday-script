import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import BlogGrid from "@/components/BlogGrid";

export const metadata: Metadata = {
  title: "All Essays",
  description: "Browse every essay, reflection, and weekly pick published on The Sunday Script.",
  alternates: { canonical: "https://thesundayscript.blog/blog" },
};

type PostRow = {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  author_name: string | null;
  published_at: string | null;
  post_categories: { categories: { name: string } | null }[];
};

export default async function BlogPage() {
  const { data: postsRaw } = await supabase
    .from("posts")
    .select(`slug, title, excerpt, cover_image, author_name, published_at,
      post_categories ( categories ( name ) )`)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const posts = ((postsRaw ?? []) as unknown as PostRow[]).map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    category: post.post_categories[0]?.categories?.name ?? "Uncategorized",
    author: post.author_name ?? "Shriparna",
    date: post.published_at
      ? new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : "",
    coverImage: post.cover_image ?? "/placeholder.jpg",
  }));

  return (
    <main className="page-wrap" style={{ paddingTop: 64 }}>
      {/* Header */}
      <div style={{ padding: "4rem clamp(1.25rem,4vw,3.5rem) 3rem", maxWidth: 760 }}>
        <span className="font-accent" style={{ fontSize: "1.2rem", color: "var(--color-primary)", display: "block", marginBottom: "0.4rem" }}>
          the archive
        </span>
        <h1
          className="font-headline italic"
          style={{ fontSize: "clamp(2.5rem,5vw,4rem)", color: "var(--color-on-surface)", fontWeight: 400, lineHeight: 1.1, marginBottom: "1rem" }}
        >
          All Essays
        </h1>
        <p className="font-body font-light" style={{ fontSize: "0.95rem", color: "var(--color-on-surface-variant)", lineHeight: 1.75 }}>
          Every piece published on The Sunday Script — essays, reflections, and weekly picks.
        </p>
      </div>

      {/* Posts grid with filter */}
      <div style={{ padding: "0 clamp(1.25rem,4vw,3.5rem)", paddingBottom: "5rem" }}>
        <BlogGrid posts={posts} />
      </div>
    </main>
  );
}
