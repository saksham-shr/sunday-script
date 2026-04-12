import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock } from "lucide-react";
import BlogSidebar from "@/components/BlogSidebar";
import CommentSection from "@/components/CommentSection";
import { supabase } from "@/lib/supabase";

const BASE_URL = "https://thesundayscript.blog";

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  author_name: string | null;
  published_at: string | null;
  likes_count: number | null;
  post_categories: {
    categories: { name: string; slug: string } | null;
  }[];
};

type RecommendedRow = {
  slug: string;
  title: string;
  content: string;
};

type CommentRow = {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
};

function calculateReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ─── Per-post metadata ────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const { data } = await supabase
    .from("posts")
    .select("title, excerpt, cover_image, author_name, published_at")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!data) return {};

  const title = data.title;
  const description =
    data.excerpt ?? "Read this essay on The Sunday Script.";
  const url = `${BASE_URL}/blog/${slug}`;
  const image = data.cover_image ?? "/coffee-books.png";

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: "The Sunday Script",
      publishedTime: data.published_at ?? undefined,
      authors: data.author_name ? [data.author_name] : ["Shriparna"],
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: postData } = await supabase
    .from("posts")
    .select(
      `
      id,
      slug,
      title,
      excerpt,
      content,
      cover_image,
      author_name,
      published_at,
      likes_count,
      post_categories (
        categories ( name, slug )
      )
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!postData) {
    notFound();
  }

  const post = postData as unknown as PostRow;
  const category = post.post_categories?.[0]?.categories ?? null;
  const readingTime = calculateReadingTime(post.content);
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const { data: recommendedRaw } = await supabase
    .from("posts")
    .select("slug, title, content")
    .eq("status", "published")
    .neq("id", post.id)
    .order("published_at", { ascending: false })
    .limit(2);

  const recommended = (recommendedRaw ?? []) as RecommendedRow[];

  const { data: commentsRaw } = await supabase
    .from("comments")
    .select("id, author_name, content, created_at")
    .eq("post_id", post.id)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  const comments = (commentsRaw ?? []) as CommentRow[];

  // JSON-LD Article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? "",
    image: post.cover_image ?? `${BASE_URL}/coffee-books.png`,
    datePublished: post.published_at ?? undefined,
    author: {
      "@type": "Person",
      name: post.author_name ?? "Shriparna",
      url: `${BASE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: "The Sunday Script",
      url: BASE_URL,
    },
    url: `${BASE_URL}/blog/${post.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${post.slug}`,
    },
  };

  return (
    <main className="pt-20 md:pt-28 pb-12 md:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Cover image banner */}
      {post.cover_image && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 mb-8 md:mb-14">
          <div className="relative h-40 sm:h-55 md:h-85 lg:h-110 rounded-2xl overflow-hidden">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Article header — centered */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 text-center mb-8 md:mb-14">
        <div className="flex items-center justify-center gap-3 font-label uppercase tracking-widest text-xs text-on-surface-variant mb-4 md:mb-6">
          {category && (
            <Link
              href={`/categories/${category.slug}`}
              className="text-primary hover:underline"
            >
              {category.name}
            </Link>
          )}
          {category && <span>·</span>}
          <span>{formattedDate}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-headline italic leading-tight text-on-surface mb-6 md:mb-8">
          {post.title}
        </h1>

        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-fixed/40 flex items-center justify-center font-headline font-bold text-primary">
            {(post.author_name ?? "S").charAt(0).toUpperCase()}
          </div>
          <div className="text-left">
            <p className="font-accent italic text-primary text-sm">
              by {post.author_name ?? "Shriparna"}
            </p>
            <p className="font-label uppercase tracking-widest text-[10px] text-on-surface-variant flex items-center gap-1.5">
              <Clock className="w-3 h-3" strokeWidth={2} />
              {readingTime} min read
            </p>
          </div>
        </div>
      </div>

      {/* Body layout — 3 columns on desktop */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[60px_1fr_260px] gap-8 lg:gap-12">
          {/* Left: sticky action sidebar */}
          <BlogSidebar
            postId={post.id}
            postTitle={post.title}
            initialLikes={post.likes_count ?? 0}
            commentCount={comments.length}
          />

          {/* Center: article content */}
          <article className="min-w-0 max-w-2xl mx-auto w-full">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Right: recommended sidebar */}
          <aside className="hidden lg:block sticky top-32 self-start">
            <p className="font-label uppercase tracking-widest text-[10px] text-on-surface-variant mb-4">
              Recommended
            </p>
            {recommended.length === 0 ? (
              <p className="text-xs text-on-surface-variant font-body italic">
                No other essays yet.
              </p>
            ) : (
              <ul className="space-y-5">
                {recommended.map((r) => {
                  const minutes = calculateReadingTime(r.content);
                  return (
                    <li key={r.slug}>
                      <Link href={`/blog/${r.slug}`} className="group block">
                        <h4 className="font-headline text-base leading-snug text-on-surface group-hover:text-primary transition-colors">
                          {r.title}
                        </h4>
                        <p className="mt-2 font-label uppercase tracking-widest text-[10px] text-on-surface-variant flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          {minutes} min read
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>
        </div>

        {/* Comments section */}
        <CommentSection postId={post.id} comments={comments} />
      </div>
    </main>
  );
}
