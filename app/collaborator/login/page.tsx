"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Step = "login" | "forgot";

export default function CollaboratorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<Step>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (signInError) {
      setLoading(false);
      setError("Incorrect email or password.");
      return;
    }

    // Verify this email is an approved collaborator
    const { data: collab } = await supabase
      .from("collaborators")
      .select("status")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (!collab || collab.status !== "approved") {
      await supabase.auth.signOut();
      setLoading(false);
      setError(
        collab?.status === "pending"
          ? "Your application is still under review. We'll email you when approved."
          : "This email isn't registered as a collaborator. Please apply first."
      );
      return;
    }

    window.location.href = "/collaborator/portal";
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo: `${window.location.origin}/collaborator/reset-password` }
    );

    setLoading(false);
    if (resetError) {
      setError(resetError.message);
    } else {
      setInfo("Check your inbox — we sent a password reset link.");
      setStep("login");
    }
  }

  return (
    <div className="a-login-shell">
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div className="a-login-brand">
          <div className="a-login-brand__mark">The Sunday Script</div>
          <div className="a-login-brand__sub">Collaborator portal</div>
        </div>

        <div className="a-login-card">
          {step === "login" ? (
            <>
              <h2>Welcome back.</h2>
              <p className="sub">Sign in with the password sent to you when you were approved.</p>
              {info && (
                <div className="a-feedback-row a-feedback-row--success" style={{ marginBottom: 14 }}>
                  {info}
                </div>
              )}
              <form onSubmit={handleLogin}>
                <div className="a-field">
                  <label className="a-field__label">Email address</label>
                  <input
                    className="a-input"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="a-field">
                  <label className="a-field__label">Password</label>
                  <input
                    className="a-input"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    placeholder="••••••••••••"
                  />
                  <div className="a-field__hint">
                    <button
                      type="button"
                      style={{ color: "var(--terracotta)", fontSize: 12 }}
                      onClick={() => { setStep("forgot"); setError(""); setInfo(""); }}
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="a-feedback-row" style={{ marginBottom: 14 }}>
                    {error}
                  </div>
                )}
                <button
                  className="a-btn a-btn--primary a-btn--full a-btn--lg"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Signing in…" : "Sign in →"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2>Reset your password.</h2>
              <p className="sub">Enter your email and we'll send you a reset link.</p>
              <form onSubmit={handleForgot}>
                <div className="a-field">
                  <label className="a-field__label">Email address</label>
                  <input
                    className="a-input"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    placeholder="you@example.com"
                  />
                </div>
                {error && (
                  <div className="a-feedback-row" style={{ marginBottom: 14 }}>
                    {error}
                  </div>
                )}
                <button
                  className="a-btn a-btn--primary a-btn--full a-btn--lg"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Sending…" : "Send reset link →"}
                </button>
                <button
                  type="button"
                  className="a-btn a-btn--ghost a-btn--full"
                  style={{ marginTop: 10 }}
                  onClick={() => { setStep("login"); setError(""); }}
                >
                  ← Back to sign in
                </button>
              </form>
            </>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", fontStyle: "italic", marginTop: 20 }}>
          Not a collaborator yet?{" "}
          <a href="/" style={{ color: "var(--terracotta)" }}>Apply to join →</a>
        </p>
      </div>
    </div>
  );
}
