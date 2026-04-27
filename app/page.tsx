import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import RecentPosts from "@/components/RecentPosts";
import Newsletter from "@/components/Newsletter";
import { supabase } from "@/lib/supabase";

type CategoryRow = {
  name: string;
  slug: string;
  icon: string | null;
  post_categories: { count: number }[];
};

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  author_name: string | null;
  published_at: string | null;
  post_categories: {
    categories: { name: string } | null;
  }[];
};

export default async function Home() {
  const { data: categoriesRaw } = await supabase
    .from("categories")
    .select("name, slug, icon, post_categories ( count )");

  const categories = ((categoriesRaw ?? []) as unknown as CategoryRow[]).map((cat) => ({
    name: cat.name,
    slug: cat.slug,
    icon: cat.icon ?? "book",
    count: cat.post_categories?.[0]?.count ?? 0,
  }));

  const { data: postsRaw } = await supabase
    .from("posts")
    .select(`
      id, slug, title, excerpt, cover_image, author_name, published_at,
      post_categories ( categories ( name ) )
    `)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);

  const recentPosts = ((postsRaw ?? []) as unknown as PostRow[]).map((post) => ({
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
      <Hero />
      <CategoryGrid categories={categories} />
      <RecentPosts posts={recentPosts} />
      <Newsletter />
    </main>
  );
}
