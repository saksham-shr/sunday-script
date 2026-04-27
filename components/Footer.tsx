import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--color-surface-container-low)",
        borderTop: "1px solid var(--color-outline-variant)",
        padding: "3.5rem clamp(1.25rem,4vw,3rem)",
      }}
    >
      <div
        className="footer-grid"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "3rem", maxWidth: 1100, margin: "0 auto" }}
      >
        {/* Brand */}
        <div>
          <div
            className="font-headline italic"
            style={{ fontSize: "1.2rem", color: "var(--color-on-surface)", marginBottom: "0.75rem" }}
          >
            The Sunday Script
          </div>
          <p
            className="font-body"
            style={{ fontSize: "0.85rem", color: "var(--color-on-surface-variant)", lineHeight: 1.7, maxWidth: 260 }}
          >
            Celebrating the slow beauty of literature and the intricate stories that make us human.
          </p>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: "3rem" }}>
          <div>
            <div
              className="font-label font-semibold uppercase"
              style={{ fontSize: "0.65rem", letterSpacing: "0.16em", color: "var(--color-on-surface)", marginBottom: "1rem" }}
            >
              Explore
            </div>
            {[
              { href: "/about", label: "About" },
              { href: "/blog", label: "Essays" },
              { href: "/categories", label: "Categories" },
            ].map(({ href, label }) => (
              <div key={href} style={{ marginBottom: "0.5rem" }}>
                <Link
                  href={href}
                  className="font-body hover:text-primary transition-colors"
                  style={{ fontSize: "0.85rem", color: "var(--color-on-surface-variant)", textDecoration: "none" }}
                >
                  {label}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Sign-off */}
        <div style={{ textAlign: "right" }}>
          <div
            className="font-accent"
            style={{ fontSize: "1.5rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}
          >
            See you Sunday.
          </div>
          <p
            className="font-body"
            style={{ fontSize: "0.75rem", color: "var(--color-on-surface-variant)" }}
          >
            © 2026 The Sunday Script
          </p>
        </div>
      </div>
    </footer>
  );
}
