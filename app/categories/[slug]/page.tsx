import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Leaf, Coffee, Brush, Feather, Sparkles, type LucideIcon } from "lucide-react";
import PostCard from "@/components/PostCard";
import { supabase } from "@/lib/supabase";

const iconMap: Record<string, LucideIcon> = {
  book: BookOpen,
  leaf: Leaf,
  coffee: Coffee,
  brush: Brush,
  feather: Feather,
  sparkles: Sparkles,
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
};

type PostRow = {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  author_name: string | null;
  published_at: string | null;
};

export default async function SingleCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Fetch the category
  const { data: category } = await supabase
    .from("categories")
    .select("id, name, slug, icon, description")
    .eq("slug", slug)
    .maybeSingle<CategoryRow>();

  if (!category) {
    notFound();
  }

  // 2. Fetch posts in this category
  //    Go through the join table to get post IDs, then fetch those posts
  const { data: joinRows } = await supabase
    .from("post_categories")
    .select("post_id")
    .eq("category_id", category.id);

  const postIds = (joinRows ?? []).map((row) => row.post_id);

  let posts: PostRow[] = [];

  if (postIds.length > 0) {
    const { data: postsRaw } = await supabase
      .from("posts")
      .select("slug, title, excerpt, cover_image, author_name, published_at")
      .in("id", postIds)
      .eq("status", "published")
      .order("published_at", { ascending: false });

    posts = (postsRaw ?? []) as PostRow[];
  }

  // 3. Transform for PostCard
  const transformedPosts = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    category: category.name,
    author: post.author_name ?? "Shriparna",
    date: post.published_at
      ? new Date(post.published_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "",
    coverImage: post.cover_image ?? "/placeholder.jpg",
  }));

  const Icon = iconMap[category.icon ?? "book"] ?? BookOpen;

  return (
    <main className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Back link */}
      <Link
        href="/categories"
        className="inline-flex items-center gap-2 font-label uppercase tracking-widest text-xs text-on-surface-variant hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        All Categories
      </Link>

      {/* Category header */}
      <div className="mb-16 max-w-3xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary-fixed/30 flex items-center justify-center">
            <Icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-label uppercase tracking-widest text-xs text-on-surface-variant mb-1">
              Category
            </p>
            <h1 className="text-4xl md:text-5xl font-headline italic text-on-surface">
              {category.name}
            </h1>
          </div>
        </div>

        {category.description && (
          <p className="text-lg text-on-surface-variant font-body leading-relaxed">
            {category.description}
          </p>
        )}

        <p className="mt-4 font-label uppercase tracking-widest text-xs text-on-surface-variant">
          {transformedPosts.length}{" "}
          {transformedPosts.length === 1 ? "Essay" : "Essays"}
        </p>
      </div>

      {/* Posts grid or empty state */}
      {transformedPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 bg-surface-container-low rounded-xl border border-dashed border-outline-variant">
          <Feather className="w-16 h-16 text-on-surface-variant mb-4" strokeWidth={1.5} />
          <h2 className="text-3xl font-headline italic tracking-tight mb-3">
            Nothing here yet
          </h2>
          <p className="text-on-surface-variant font-body text-center max-w-md">
            No essays have been published in this category. Check back soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {transformedPosts.map((post) => (
            <PostCard key={post.slug} {...post} />
          ))}
        </div>
      )}
    </main>
  );
}
