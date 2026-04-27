import Link from "next/link";
import Image from "next/image";
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

const CATEGORY_GRADIENTS: Record<string, string> = {
  Literature: "linear-gradient(140deg,#ffdbd0 0%,#c68774 100%)",
  "Life Musings": "linear-gradient(140deg,#fdf0e8 0%,#e8c0a0 100%)",
  "Lyric Analysis": "linear-gradient(140deg,#e0e6e0 0%,#8faa90 100%)",
  Poetry: "linear-gradient(140deg,#e8e8f2 0%,#9090c0 100%)",
  "Book Reviews": "linear-gradient(140deg,#f2ede6 0%,#c8a878 100%)",
  "Random Thoughts": "linear-gradient(140deg,#f5ede8 0%,#d49888 100%)",
};

const hasRealImage = (src: string) =>
  src && src !== "/placeholder.jpg" && src !== "" && !src.includes("placeholder");

export default function RecentPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <section style={{ padding: "0 clamp(1.25rem,4vw,3.5rem)", marginBottom: "5rem" }}>
        <div style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--color-on-surface-variant)", fontStyle: "italic", fontFamily: "var(--font-body)" }}>
          No essays published yet. Check back soon.
        </div>
      </section>
    );
  }

  const featured = posts[0];
  const rest = posts.slice(1, 3);
  const featuredGradient = CATEGORY_GRADIENTS[featured.category] ?? "linear-gradient(140deg,#ffdbd0 0%,#c68774 100%)";

  return (
    <section style={{ padding: "0 clamp(1.25rem,4vw,3.5rem)", marginBottom: "5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "2.5rem" }}>
        <div>
          <span
            className="font-label font-semibold uppercase"
            style={{ fontSize: "0.65rem", letterSpacing: "0.18em", color: "var(--color-on-surface-variant)", display: "block", marginBottom: "0.4rem" }}
          >
            Latest
          </span>
          <h2
            className="font-headline"
            style={{ fontSize: "clamp(1.6rem,2.5vw,2.25rem)", color: "var(--color-on-surface)", fontWeight: 400 }}
          >
            Recent Writings
          </h2>
        </div>
        <Link
          href="/blog"
          className="font-label font-medium uppercase"
          style={{
            fontSize: "0.68rem",
            letterSpacing: "0.14em",
            color: "var(--color-primary)",
            textDecoration: "none",
            borderBottom: "1px solid var(--color-primary-fixed)",
          }}
        >
          View Archive →
        </Link>
      </div>

      {/* Featured post — wide card */}
      <Link
        href={`/blog/${featured.slug}`}
        className="post-card featured-card"
        style={{
          display: "flex",
          gap: 0,
          background: "#ffffff",
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid var(--color-outline-variant)",
          marginBottom: "1.25rem",
          textDecoration: "none",
        }}
      >
        {/* Image area */}
        <div
          className="img-zoom"
          style={{ width: "44%", flexShrink: 0, background: featuredGradient, minHeight: 280, position: "relative" }}
        >
          {hasRealImage(featured.coverImage) && (
            <Image
              src={featured.coverImage}
              alt={featured.title}
              fill
              sizes="44vw"
              className="object-cover"
            />
          )}
          <div style={{ position: "absolute", bottom: "1.25rem", left: "1.25rem", zIndex: 1 }}>
            <span
              className="font-label font-semibold uppercase"
              style={{ fontSize: "0.65rem", letterSpacing: "0.14em", background: "rgba(255,255,255,0.85)", color: "var(--color-primary)", borderRadius: 999, padding: "0.3rem 0.75rem" }}
            >
              {featured.category}
            </span>
          </div>
        </div>
        {/* Content */}
        <div style={{ padding: "2.5rem", display: "flex", flexDirection: "column", justifyContent: "center", gap: "1rem" }}>
          <div className="font-accent" style={{ fontSize: "1rem", color: "var(--color-primary)" }}>Featured Essay</div>
          <h3
            className="font-headline italic"
            style={{ fontSize: "clamp(1.4rem,2.2vw,2rem)", color: "var(--color-on-surface)", lineHeight: 1.3 }}
          >
            {featured.title}
          </h3>
          <p
            className="font-body font-light"
            style={{ fontSize: "0.9rem", color: "var(--color-on-surface-variant)", lineHeight: 1.75 }}
          >
            {featured.excerpt}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.5rem" }}>
            <span className="font-headline italic" style={{ fontSize: "0.9rem", color: "var(--color-primary)" }}>
              by {featured.author}
            </span>
            <span className="font-body" style={{ fontSize: "0.68rem", color: "var(--color-on-surface-variant)", letterSpacing: "0.06em" }}>
              {featured.date}
            </span>
          </div>
          <div
            className="font-label font-medium uppercase"
            style={{
              alignSelf: "flex-start",
              fontSize: "0.68rem",
              letterSpacing: "0.12em",
              color: "var(--color-primary)",
              border: "1px solid var(--color-outline-variant)",
              borderRadius: 999,
              padding: "0.5rem 1.25rem",
              marginTop: "0.25rem",
            }}
          >
            Read Essay
          </div>
        </div>
      </Link>

      {/* Two smaller cards */}
      {rest.length > 0 && (
        <div className="posts-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          {rest.map((post) => (
            <PostCard key={post.slug} {...post} />
          ))}
        </div>
      )}
    </section>
  );
}
