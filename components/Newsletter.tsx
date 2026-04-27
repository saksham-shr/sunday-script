"use client";

import { useState } from "react";
import { subscribeToNewsletter } from "@/app/actions/newsletter";

type Status = "idle" | "loading" | "success" | "already" | "error";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading" || status === "success" || status === "already") return;
    setStatus("loading");
    setErrorMessage("");
    const result = await subscribeToNewsletter(email);
    if (result.status === "success") { setStatus("success"); setEmail(""); }
    else if (result.status === "already") { setStatus("already"); }
    else { setStatus("error"); setErrorMessage(result.message); }
  }

  return (
    <section
      style={{ margin: "0 clamp(1.25rem,4vw,3.5rem) 5rem", borderRadius: 20, overflow: "hidden", position: "relative" }}
    >
      <div
        style={{ background: "var(--color-primary)", padding: "4rem clamp(1.5rem,5vw,5rem)", position: "relative", overflow: "hidden" }}
      >
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,219,208,0.12)" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,219,208,0.08)" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 580, margin: "0 auto", textAlign: "center" }}>
          <span
            className="font-label font-semibold uppercase"
            style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,219,208,0.7)", display: "block", marginBottom: "1rem" }}
          >
            Weekly Muse
          </span>
          <h2
            className="font-accent"
            style={{ fontSize: "clamp(2.2rem,4vw,3.5rem)", color: "white", lineHeight: 1.2, marginBottom: "1rem", fontWeight: 600 }}
          >
            A Sunday morning invitation.
          </h2>
          <p
            className="font-body font-light"
            style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.75, marginBottom: "2rem" }}
          >
            Receive our most thoughtful essays and book recommendations directly in your inbox every Sunday morning.
          </p>

          {status === "success" || status === "already" ? (
            <div className="font-accent" style={{ fontSize: "1.5rem", color: "var(--color-primary-fixed)" }}>
              {status === "success"
                ? "Welcome to the circle. See you Sunday. ✨"
                : "You're already part of the circle. See you Sunday."}
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                placeholder="your@email.com"
                style={{
                  flex: "1 1 240px",
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 999,
                  padding: "0.85rem 1.5rem",
                  color: "white",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="font-label font-medium uppercase hover:bg-primary-fixed transition-colors"
                style={{
                  fontSize: "0.72rem",
                  letterSpacing: "0.12em",
                  color: "var(--color-primary)",
                  background: "white",
                  border: "none",
                  borderRadius: 999,
                  padding: "0.85rem 2rem",
                  cursor: "pointer",
                  flexShrink: 0,
                  opacity: status === "loading" ? 0.8 : 1,
                }}
              >
                {status === "loading" ? "Joining..." : "Join the Circle"}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="font-body" style={{ marginTop: "0.75rem", fontSize: "0.85rem", color: "rgba(255,200,180,0.9)" }}>
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
