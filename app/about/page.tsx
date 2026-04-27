import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Meet Shriparna — the curator of The Sunday Script. A collector of stories, quiet mornings, and good coffee.",
  alternates: { canonical: "https://thesundayscript.blog/about" },
  openGraph: {
    type: "profile",
    url: "https://thesundayscript.blog/about",
    title: "About Shriparna | The Sunday Script",
    description: "Meet Shriparna — the curator of The Sunday Script. A collector of stories, quiet mornings, and good coffee.",
    images: [{ url: "/image.png", width: 1200, height: 630, alt: "Shriparna — The Sunday Script" }],
  },
};

export default function AboutPage() {
  return (
    <main className="page-wrap" style={{ paddingTop: 64 }}>
      {/* Hero */}
      <section
        className="about-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "5rem",
          alignItems: "center",
          padding: "4rem clamp(1.25rem,4vw,3.5rem)",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div>
          <span
            className="font-label font-semibold uppercase"
            style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--color-on-surface-variant)", display: "block", marginBottom: "1.5rem" }}
          >
            About
          </span>
          <h1
            className="font-headline italic"
            style={{ fontSize: "clamp(3rem,6vw,5.5rem)", color: "var(--color-primary)", lineHeight: 1.05, marginBottom: "1.25rem" }}
          >
            Hello,<br />I&rsquo;m Shriparna.
          </h1>
          <p
            className="font-body font-light"
            style={{ fontSize: "clamp(0.95rem,1.2vw,1.1rem)", color: "var(--color-on-surface-variant)", lineHeight: 1.8, maxWidth: 420, marginBottom: "2rem" }}
          >
            A collector of stories, quiet mornings, and good coffee.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href="/blog"
              className="font-label font-medium uppercase text-on-primary bg-primary hover:bg-primary-container transition-all"
              style={{ fontSize: "0.72rem", letterSpacing: "0.12em", borderRadius: 999, padding: "0.8rem 2rem", boxShadow: "0 4px 20px rgba(134,81,64,0.3)" }}
            >
              Read My Essays
            </Link>
          </div>
        </div>

        {/* Photo */}
        <div style={{ position: "relative" }}>
          <div
            className="absolute bg-primary-fixed"
            style={{ top: 16, left: 16, right: -16, bottom: -16, borderRadius: 20, zIndex: 0 }}
          />
          <div
            className="img-zoom"
            style={{ position: "relative", zIndex: 1, borderRadius: 20, overflow: "hidden", aspectRatio: "4/5", background: "#f0e6e3" }}
          >
            {/* Gradient fallback */}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(155deg,#f0e6e3 0%,#c68774 100%)", zIndex: 0 }}
            />
            <Image
              src="/image.png"
              alt="Shriparna"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top"
              priority
              style={{ zIndex: 1 }}
            />
          </div>
          {/* Handwritten annotation */}
          <div
            className="font-accent absolute bg-surface-container-lowest"
            style={{
              top: -24,
              right: -20,
              fontSize: "1.35rem",
              color: "var(--color-primary)",
              transform: "rotate(3deg)",
              padding: "0.6rem 1rem",
              borderRadius: 8,
              boxShadow: "0 4px 16px rgba(134,81,64,0.1)",
              zIndex: 2,
            }}
          >
            that&rsquo;s me! ↓
          </div>
        </div>
      </section>

      {/* Bio */}
      <section
        style={{ background: "var(--color-surface-container-low)", padding: "4rem clamp(1.25rem,4vw,3.5rem)", margin: "2rem 0" }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div
            className="font-body font-light"
            style={{ fontSize: "1rem", color: "var(--color-on-surface)", lineHeight: 1.9 }}
          >
            <p>
              <span
                className="font-headline"
                style={{ float: "left", fontSize: "clamp(3rem,6vw,5rem)", lineHeight: 1, marginRight: "0.15em", marginTop: "0.05em", color: "var(--color-primary)" }}
              >
                W
              </span>
              ords have always been my escape. Whether it is through reading, listening to music, or analysing the lyrics and metaphors of songs, I found a love for language and its ability to transcend normal speech.
            </p>
            <p style={{ marginTop: "1.25em" }}>
              I write whenever my mind becomes too full, and there seems to be nowhere else left to put these thoughts except for the blank page in front of me. For some reason, the pages of paper seem to listen to me better than anyone else ever does.
            </p>
            <p style={{ marginTop: "1.25em" }}>
              Most of my interests lie within the grey area — the analysis of lyrics, searching for deeper meaning within lines of poetry, and holding onto words that seem to speak to me personally.
            </p>
            <p style={{ marginTop: "1.25em" }}>
              Outside of that, you will most likely find me daydreaming, binging random variety shows, and romanticizing life too much after watching a good rom-com.
            </p>
            <p style={{ textAlign: "right", marginTop: "1.5em" }}>
              <span className="font-accent" style={{ fontSize: "1.8rem", color: "var(--color-primary)" }}>Shriparna</span>
            </p>
          </div>
        </div>
      </section>

      {/* Current Obsessions */}
      <section style={{ padding: "4rem clamp(1.25rem,4vw,3.5rem)" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="font-accent" style={{ fontSize: "1.2rem", color: "var(--color-primary)", display: "block", marginBottom: "0.4rem" }}>
            right now
          </span>
          <h2
            className="font-headline italic"
            style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", color: "var(--color-on-surface)", fontWeight: 400 }}
          >
            Current Obsessions
          </h2>
          <div style={{ width: "3rem", height: "1px", background: "var(--color-outline-variant)", margin: "1rem auto 0" }} />
        </div>

        <div
          className="posts-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", maxWidth: 900, margin: "0 auto" }}
        >
          {[
            { label: "Current Curiosity", title: "Exploring Random Topics", body: "Falling down rabbit holes — from forgotten philosophies to obscure history.", bg: "#e0e6e0" },
            { label: "On Repeat", title: "Lyric Analysis", body: "Decoding the poetry hidden in songs and the stories they quietly tell.", bg: "#f0e6e3" },
            { label: "The Craft", title: "Writing", body: "Shaping thoughts into sentences — the slow, patient art of finding the right words.", bg: "#e0e6e0" },
          ].map((item, i) => (
            <div
              key={i}
              style={{ background: item.bg, borderRadius: 14, padding: "2rem", textAlign: "center" }}
            >
              <span
                className="font-label font-semibold uppercase"
                style={{ fontSize: "0.65rem", letterSpacing: "0.14em", color: "var(--color-on-surface-variant)", display: "block", marginBottom: "0.75rem" }}
              >
                {item.label}
              </span>
              <h3
                className="font-headline italic"
                style={{ fontSize: "1.2rem", color: "var(--color-on-surface)", marginBottom: "0.75rem" }}
              >
                {item.title}
              </h3>
              <p
                className="font-body font-light"
                style={{ fontSize: "0.85rem", color: "var(--color-on-surface-variant)", lineHeight: 1.7 }}
              >
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Guest post CTA */}
      <section
        style={{
          margin: "0 clamp(1.25rem,4vw,3.5rem) 5rem",
          background: "#f0e6e3",
          borderRadius: 20,
          padding: "4rem clamp(1.5rem,4vw,4rem)",
          textAlign: "center",
        }}
      >
        <h2
          className="font-headline italic"
          style={{ fontSize: "clamp(1.75rem,3.5vw,3rem)", color: "var(--color-on-surface)", lineHeight: 1.3, marginBottom: "2rem" }}
        >
          Have a story to share?<br />Let&rsquo;s write together.
        </h2>
        <Link
          href="/guest-post"
          className="font-label font-medium uppercase text-on-primary bg-primary hover:bg-primary-container transition-all"
          style={{ fontSize: "0.72rem", letterSpacing: "0.12em", borderRadius: 999, padding: "0.9rem 2.5rem", boxShadow: "0 4px 20px rgba(134,81,64,0.3)" }}
        >
          Pitch a Guest Post
        </Link>
      </section>
    </main>
  );
}
