import Link from "next/link";
import PostCard from "./PostCard";

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
    <section className="mb-32">

      {/* Section Header */}
      <div className="flex items-end justify-between mb-12">
        <div className="space-y-2">
          <span className="font-label text-xs uppercase tracking-widest text-primary font-bold">
            The Latest
          </span>
          <h2 className="text-4xl font-headline italic">Recent Reflections</h2>
        </div>

        <Link
          href="/blog"
          className="font-label text-sm uppercase tracking-widest border-b border-on-surface-variant pb-1 hover:text-primary transition-colors"
        >
          View Archive
        </Link>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
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

    </section>
  );
}
