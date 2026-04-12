import { Feather } from "lucide-react";
import PostCard from "./PostCard";
import Link from "next/link";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  coverImage: string;
};

type RecentPostsProps = {
  posts: Post[];
};

export default function RecentPosts({ posts }: RecentPostsProps) {
  return (
    <section className="py-10 md:py-16 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-6 md:mb-10">
          <div>
            <p className="font-label uppercase tracking-widest text-sm text-on-surface-variant mb-2">
              Latest Essays
            </p>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-headline tracking-tight">
              Recent Writings
            </h2>
          </div>
          {posts.length > 0 && (
            <Link
              href="/blog"
              className="hidden md:inline-block font-label uppercase tracking-widest text-sm text-primary hover:underline"
            >
              View Archive →
            </Link>
          )}
        </div>

        {/* EMPTY STATE */}
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 bg-surface-container-low rounded-lg border border-dashed border-outline-variant">
            <Feather className="w-12 h-12 text-on-surface-variant mb-4" strokeWidth={1.5} />
            <h3 className="text-2xl font-headline tracking-tight mb-2">
              The ink is still drying
            </h3>
            <p className="text-on-surface-variant font-body text-center max-w-md">
              No essays have been published yet. Check back soon for new writings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                category={post.category}
                author={post.author}
                date={post.date}
                coverImage={post.coverImage}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
