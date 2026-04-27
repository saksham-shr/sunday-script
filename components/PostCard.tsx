import Link from "next/link";
import Image from "next/image";

type PostCardProps = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  coverImage: string;
  readTime?: number;
  featured?: boolean;
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  Literature: "linear-gradient(140deg,#ffdbd0 0%,#c68774 100%)",
  "Life Musings": "linear-gradient(140deg,#fdf0e8 0%,#e8c0a0 100%)",
  "Lyric Analysis": "linear-gradient(140deg,#e0e6e0 0%,#8faa90 100%)",
  Poetry: "linear-gradient(140deg,#e8e8f2 0%,#9090c0 100%)",
  "Book Reviews": "linear-gradient(140deg,#f2ede6 0%,#c8a878 100%)",
  "Random Thoughts": "linear-gradient(140deg,#f5ede8 0%,#d49888 100%)",
};

function getGradient(category: string) {
  return CATEGORY_GRADIENTS[category] ?? "linear-gradient(140deg,#ffdbd0 0%,#c68774 100%)";
}

const hasRealImage = (src: string) =>
  src && src !== "/placeholder.jpg" && src !== "" && !src.includes("placeholder");

export default function PostCard({
  slug,
  title,
  excerpt,
  category,
  author,
  date,
  coverImage,
  readTime,
}: PostCardProps) {
  const useImage = hasRealImage(coverImage);

  return (
    <Link
      href={`/blog/${slug}`}
      className="post-card block overflow-hidden"
      style={{
        background: "#ffffff",
        borderRadius: 14,
        border: "1px solid var(--color-outline-variant)",
        textDecoration: "none",
      }}
    >
      {/* Image / gradient area */}
      <div className="img-zoom" style={{ height: 160, position: "relative", background: getGradient(category) }}>
        {useImage && (
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        )}
        {/* Category badge */}
        <div style={{ position: "absolute", bottom: "0.75rem", left: "0.75rem", zIndex: 1 }}>
          <span
            className="font-label font-semibold uppercase"
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.12em",
              background: "rgba(255,255,255,0.85)",
              color: "var(--color-primary)",
              borderRadius: 999,
              padding: "0.25rem 0.6rem",
            }}
          >
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "1.25rem" }}>
        <h3
          className="font-headline italic"
          style={{ fontSize: "1.1rem", color: "var(--color-on-surface)", lineHeight: 1.35, marginBottom: "0.5rem" }}
        >
          {title}
        </h3>
        <p
          className="font-body font-light"
          style={{
            fontSize: "0.82rem",
            color: "var(--color-on-surface-variant)",
            lineHeight: 1.7,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            marginBottom: "0.9rem",
          }}
        >
          {excerpt}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="font-headline italic" style={{ fontSize: "0.82rem", color: "var(--color-primary)" }}>
            by {author}
          </span>
          <span className="font-body" style={{ fontSize: "0.65rem", color: "var(--color-on-surface-variant)" }}>
            {readTime ? `${readTime} min` : date}
          </span>
        </div>
      </div>
    </Link>
  );
}
