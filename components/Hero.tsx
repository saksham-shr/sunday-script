import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="hero-grid grid items-center"
      style={{
        minHeight: "92vh",
        gridTemplateColumns: "1fr 1fr",
        gap: "4rem",
        padding: "5rem clamp(1.25rem,4vw,3.5rem) 4rem",
      }}
    >
      {/* Left: text */}
      <div>
        <span
          className="font-label font-semibold uppercase"
          style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--color-on-surface-variant)" }}
        >
          A digital sanctuary · est. 2024
        </span>

        <div style={{ margin: "1.25rem 0 1.75rem" }}>
          <div
            className="font-headline italic font-normal leading-none"
            style={{ fontSize: "clamp(2rem,3.5vw,3rem)", color: "var(--color-on-surface-variant)" }}
          >
            The
          </div>
          <div
            className="font-headline font-bold"
            style={{ fontSize: "clamp(3.5rem,7vw,6.5rem)", color: "var(--color-on-surface)", lineHeight: 0.95, letterSpacing: "-0.02em" }}
          >
            Sunday
          </div>
          <div
            className="font-headline italic font-normal"
            style={{ fontSize: "clamp(3.5rem,7vw,6.5rem)", color: "var(--color-primary)", lineHeight: 0.95, letterSpacing: "-0.02em" }}
          >
            Script.
          </div>
        </div>

        <div style={{ width: "3rem", height: "1px", background: "var(--color-outline-variant)", margin: "1.75rem 0" }} />

        <p
          className="font-body font-light leading-[1.8]"
          style={{ fontSize: "clamp(0.95rem,1.2vw,1.1rem)", color: "var(--color-on-surface-variant)", maxWidth: 420 }}
        >
          Where we explore the intersections of human experience and the written word. Find solace in every sentence.
        </p>

        <div className="font-accent" style={{ fontSize: "1.4rem", color: "var(--color-primary)", marginTop: "1.25rem" }}>
          Curated by Shriparna →
        </div>

        <div style={{ marginTop: "2rem", display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
          <Link
            href="/blog"
            className="font-label font-medium uppercase text-on-primary bg-primary hover:bg-primary-container transition-all"
            style={{ fontSize: "0.72rem", letterSpacing: "0.12em", borderRadius: 999, padding: "0.8rem 2rem", boxShadow: "0 4px 20px rgba(134,81,64,0.3)" }}
          >
            Start Reading
          </Link>
          <Link
            href="/about"
            className="font-headline italic transition-colors hover:text-primary-container"
            style={{ fontSize: "1.05rem", color: "var(--color-primary)", borderBottom: "1px solid var(--color-primary-fixed)", paddingBottom: 2 }}
          >
            About Shriparna
          </Link>
        </div>
      </div>

      {/* Right: decorative literary composition */}
      <div className="hero-image relative hidden lg:block">
        {/* Offset shadow block */}
        <div
          className="absolute bg-primary-fixed"
          style={{ top: 20, left: 20, right: -16, bottom: -16, borderRadius: 20, zIndex: 0 }}
        />
        {/* Literary canvas */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            borderRadius: 20,
            overflow: "hidden",
            aspectRatio: "4/5",
            background: "linear-gradient(155deg,#865140 0%,#9e6652 40%,#c68774 100%)",
          }}
        >
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,219,208,0.1)" }} />
          <div style={{ position: "absolute", bottom: -50, left: -50, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,219,208,0.08)" }} />
          <div style={{ position: "absolute", top: "38%", right: "12%", width: 90, height: 90, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)" }} />

          {/* Quote composition */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2.5rem", textAlign: "center" }}>
            <div className="font-headline" style={{ fontSize: "6rem", color: "rgba(255,219,208,0.2)", lineHeight: 0.7, marginBottom: "0.5rem", userSelect: "none" }}>
              &ldquo;
            </div>
            <p className="font-headline italic" style={{ fontSize: "clamp(1rem,1.4vw,1.3rem)", color: "rgba(255,255,255,0.92)", lineHeight: 1.65, maxWidth: 280 }}>
              Words are how we reach through time and touch someone we&rsquo;ve never met.
            </p>
            <div style={{ width: "3rem", height: "1px", background: "rgba(255,219,208,0.4)", margin: "1.5rem auto" }} />
            <div className="font-label font-semibold uppercase" style={{ fontSize: "0.6rem", letterSpacing: "0.22em", color: "rgba(255,219,208,0.65)" }}>
              The Sunday Script
            </div>

            {/* Floating word tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", marginTop: "2rem" }}>
              {["literature", "poetry", "life", "music", "books"].map((w) => (
                <span
                  key={w}
                  className="font-label"
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    background: "rgba(255,255,255,0.12)",
                    color: "rgba(255,219,208,0.8)",
                    borderRadius: 999,
                    padding: "0.3rem 0.75rem",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Floating quote card */}
        <div
          className="absolute bg-surface-container-lowest"
          style={{
            bottom: -28,
            left: -28,
            padding: "1rem 1.25rem",
            borderRadius: 10,
            maxWidth: 210,
            zIndex: 2,
            borderLeft: "3px solid var(--color-primary)",
            boxShadow: "0 8px 32px rgba(134,81,64,0.12)",
          }}
        >
          <p className="font-accent" style={{ fontSize: "1.05rem", color: "var(--color-on-surface)", lineHeight: 1.45 }}>
            &ldquo;Literature is the safe way of being alive in someone else&rsquo;s head.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
