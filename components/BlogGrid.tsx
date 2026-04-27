"use client";

import { useState } from "react";
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

export default function BlogGrid({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState("All");

  const allCats = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
  const filtered = filter === "All" ? posts : posts.filter((p) => p.category === filter);

  if (posts.length === 0) {
    return (
      <div
        style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--color-on-surface-variant)", fontStyle: "italic" }}
        className="font-body"
      >
        No essays published yet. Check back soon.
      </div>
    );
  }

  return (
    <>
      {/* Category filter pills */}
      <div
        className="cat-scroll"
        style={{ display: "flex", gap: "0.6rem", marginBottom: "2.5rem", overflowX: "auto", paddingBottom: "0.75rem" }}
      >
        {allCats.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className="cat-pill font-label font-medium uppercase"
            style={{
              flexShrink: 0,
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              padding: "0.55rem 1.1rem",
              borderRadius: 999,
              cursor: "pointer",
              border: "none",
              background: filter === cat ? "var(--color-primary)" : "#f0e6e3",
              color: filter === cat ? "white" : "var(--color-on-surface-variant)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts grid — first post is featured when showing "All" */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "1.25rem" }}>
        {filtered.map((post, i) => {
          const isFeatured = i === 0 && filter === "All";
          const gradient = CATEGORY_GRADIENTS[post.category] ?? "linear-gradient(140deg,#ffdbd0 0%,#c68774 100%)";

          if (isFeatured) {
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="post-card featured-card"
                style={{
                  display: "flex",
                  background: "#ffffff",
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "1px solid var(--color-outline-variant)",
                  gridColumn: "span 2",
                  minHeight: 220,
                  textDecoration: "none",
                }}
              >
                <div
                  className="img-zoom"
                  style={{ width: "40%", flexShrink: 0, background: gradient, position: "relative" }}
                >
                  {hasRealImage(post.coverImage) && (
                    <Image src={post.coverImage} alt={post.title} fill sizes="40vw" className="object-cover" />
                  )}
                  <div style={{ position: "absolute", bottom: "1rem", left: "1rem", zIndex: 1 }}>
                    <span
                      className="font-label font-semibold uppercase"
                      style={{ fontSize: "0.62rem", letterSpacing: "0.12em", background: "rgba(255,255,255,0.85)", color: "var(--color-primary)", borderRadius: 999, padding: "0.25rem 0.6rem" }}
                    >
                      {post.category}
                    </span>
                  </div>
                </div>
                <div style={{ padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "center", gap: "0.75rem" }}>
                  <div className="font-accent" style={{ fontSize: "0.95rem", color: "var(--color-primary)" }}>Latest Essay</div>
                  <h2
                    className="font-headline italic"
                    style={{ fontSize: "1.5rem", color: "var(--color-on-surface)", lineHeight: 1.3 }}
                  >
                    {post.title}
                  </h2>
                  <p
                    className="font-body font-light"
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--color-on-surface-variant)",
                      lineHeight: 1.7,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {post.excerpt}
                  </p>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "0.25rem" }}>
                    <span className="font-headline italic" style={{ fontSize: "0.85rem", color: "var(--color-primary)" }}>
                      by {post.author}
                    </span>
                    <span className="font-body" style={{ fontSize: "0.65rem", color: "var(--color-on-surface-variant)" }}>
                      {post.date}
                    </span>
                  </div>
                </div>
              </Link>
            );
          }

          return <PostCard key={post.slug} {...post} />;
        })}
      </div>
    </>
  );
}
