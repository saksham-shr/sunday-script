"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);

  // Supabase puts the recovery token in the URL hash — wait for the session to be set
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    if (password !== confirm) { setError("Passwords don't match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }

    setLoading(true);
    setError("");

    const { error: updateError } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (updateError) {
      setError(updateError.message);
    } else {
      setDone(true);
    }
  }

  if (done) {
    return (
      <div className="a-login-shell">
        <div style={{ width: "100%", maxWidth: 440 }}>
          <div className="a-login-brand">
            <div className="a-login-brand__mark">The Sunday Script</div>
          </div>
          <div className="a-login-card">
            <h2>Password updated.</h2>
            <p className="sub">You can now sign in with your new password.</p>
            <a
              href="/collaborator/login"
              className="a-btn a-btn--primary a-btn--full a-btn--lg"
              style={{ display: "block", textAlign: "center", marginTop: 18 }}
            >
              Go to login →
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="a-login-shell">
        <div style={{ width: "100%", maxWidth: 440 }}>
          <div className="a-login-brand">
            <div className="a-login-brand__mark">The Sunday Script</div>
          </div>
          <div className="a-login-card">
            <p className="sub" style={{ textAlign: "center" }}>Verifying reset link…</p>
            <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginTop: 12 }}>
              If nothing happens,{" "}
              <a href="/collaborator/login" style={{ color: "var(--terracotta)" }}>
                request a new link
              </a>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="a-login-shell">
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div className="a-login-brand">
          <div className="a-login-brand__mark">The Sunday Script</div>
          <div className="a-login-brand__sub">Set a new password</div>
        </div>
        <div className="a-login-card">
          <h2>Choose a new password.</h2>
          <p className="sub">Pick something you'll remember. At least 8 characters.</p>
          <form onSubmit={handleSubmit}>
            <div className="a-field">
              <label className="a-field__label">New password</label>
              <input
                className="a-input"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="••••••••••••"
              />
            </div>
            <div className="a-field">
              <label className="a-field__label">Confirm password</label>
              <input
                className="a-input"
                type="password"
                required
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={loading}
                placeholder="••••••••••••"
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
              {loading ? "Saving…" : "Save new password →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
