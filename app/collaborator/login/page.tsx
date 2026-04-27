"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Step = "email" | "otp";

export default function CollaboratorLoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<Step>("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: true },
    });

    setLoading(false);
    if (otpError) setError(otpError.message);
    else setStep("otp");
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: otp.trim(),
      type: "email",
    });

    if (verifyError) {
      setLoading(false);
      setError(verifyError.message);
      return;
    }

    const { data: collaborator } = await supabase
      .from("collaborators")
      .select("status")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    setLoading(false);

    if (!collaborator || collaborator.status !== "approved") {
      await supabase.auth.signOut();
      setError(
        collaborator?.status === "pending"
          ? "Your application is still under review. We'll email you when approved."
          : "This email isn't registered as a collaborator. Please apply first."
      );
      return;
    }

    window.location.href = "/collaborator/portal";
  }

  return (
    <div className="a-login-shell">
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div className="a-login-brand">
          <div className="a-login-brand__mark">The Sunday Script</div>
          <div className="a-login-brand__sub">Collaborator portal</div>
        </div>

        <div className="a-login-card">
          {step === "email" ? (
            <>
              <h2>Welcome back.</h2>
              <p className="sub">Enter your email and we'll send you a one-time sign-in code.</p>
              <form onSubmit={sendOtp}>
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
                  {loading ? "Sending code…" : "Send code →"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2>Check your email.</h2>
              <p className="sub">
                We sent a 6-digit code to <strong>{email}</strong>.
              </p>
              <form onSubmit={verifyOtp}>
                <div className="a-field">
                  <label className="a-field__label">One-time code</label>
                  <input
                    className="a-input"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    disabled={loading}
                    placeholder="123456"
                    style={{ textAlign: "center", fontSize: 22, letterSpacing: "0.3em" }}
                  />
                  <div className="a-field__hint">
                    Sent to {email} ·{" "}
                    <button
                      type="button"
                      style={{ color: "var(--terracotta)", fontSize: 12 }}
                      onClick={() => { setStep("email"); setOtp(""); setError(""); }}
                    >
                      change email
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
                  {loading ? "Verifying…" : "Verify & enter →"}
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
