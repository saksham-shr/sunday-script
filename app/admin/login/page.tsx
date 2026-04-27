"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/admin/overview");
    router.refresh();
  }

  return (
    <div className="a-login-shell">
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div className="a-login-brand">
          <div className="a-login-brand__mark">The Sunday Script</div>
          <div className="a-login-brand__sub">Back-office</div>
        </div>

        <div className="a-login-card">
          <h2>Welcome back.</h2>
          <p className="sub">Sign in to your back-office to continue.</p>

          <form onSubmit={handleSubmit}>
            <div className="a-field">
              <label className="a-field__label">Email</label>
              <input
                className="a-input"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
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
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--line-soft)", display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "var(--muted)" }}>
            <div>Want to contribute? <a href="/" style={{ color: "var(--terracotta)", fontWeight: 500 }}>Request collaborator access →</a></div>
            <div>Have a one-off piece? <a href="/guest-post" style={{ color: "var(--terracotta)", fontWeight: 500 }}>Submit a guest piece →</a></div>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", fontStyle: "italic", marginTop: 20 }}>
          Admin login is restricted to site owners only.
        </p>
      </div>
    </div>
  );
}
