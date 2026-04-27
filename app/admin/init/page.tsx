"use client";

import { useState } from "react";
import { setupAdminUser } from "@/app/actions/setup-admin";

export default function AdminInitPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "no_key" | "error">("idle");
  const [message, setMessage] = useState("");

  async function run() {
    setStatus("loading");
    const result = await setupAdminUser();
    setMessage(result.message);
    if (result.status === "no_key") {
      setStatus("no_key");
    } else if (result.status === "error") {
      setStatus("error");
    } else {
      setStatus("done");
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--color-surface)" }}
    >
      <div
        className="w-full max-w-lg rounded-2xl shadow-xl p-8"
        style={{ background: "var(--color-surface-container-lowest)", border: "1px solid var(--color-outline-variant)" }}
      >
        <h1 className="font-headline italic mb-2" style={{ fontSize: "1.8rem", color: "var(--color-on-surface)" }}>
          Admin Setup
        </h1>
        <p className="font-body mb-6" style={{ fontSize: "0.85rem", color: "var(--color-on-surface-variant)", lineHeight: 1.65 }}>
          This creates the admin account in Supabase Auth with email confirmation bypassed.
        </p>

        {/* Credentials */}
        <div
          className="font-body rounded-xl p-4 mb-6"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-outline-variant)", fontSize: "0.82rem", lineHeight: 1.8 }}
        >
          <div><strong>Email:</strong> shriparnasharma2008@gmail.com</div>
          <div><strong>Password:</strong> sharma2008shriparna</div>
        </div>

        {/* No service key state */}
        {status === "no_key" && (
          <div
            className="rounded-xl p-4 mb-5 font-body"
            style={{ background: "#fef9c3", border: "1px solid #fde047", fontSize: "0.82rem", lineHeight: 1.7, color: "#713f12" }}
          >
            <strong>SUPABASE_SERVICE_ROLE_KEY is missing from .env.local</strong>
            <br />
            1. Go to your{" "}
            <a
              href="https://supabase.com/dashboard/project/yanmfnkcjomvalkehfut/settings/api"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Supabase API settings
            </a>
            <br />
            2. Copy the <strong>service_role</strong> key (the long one, labelled "secret")
            <br />
            3. Add it to <code>.env.local</code>:<br />
            <code
              className="block mt-2 p-2 rounded"
              style={{ background: "rgba(0,0,0,0.06)", fontSize: "0.75rem", wordBreak: "break-all" }}
            >
              SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
            </code>
            4. Restart the dev server and visit this page again.
          </div>
        )}

        {/* Success state */}
        {status === "done" && (
          <div
            className="rounded-xl p-4 mb-5 font-body"
            style={{ background: "#f0fdf4", border: "1px solid #86efac", fontSize: "0.82rem", color: "#166534" }}
          >
            ✓ {message}
          </div>
        )}

        {/* Error state */}
        {status === "error" && (
          <div
            className="rounded-xl p-4 mb-5 font-body"
            style={{ background: "#fef2f2", border: "1px solid #fecaca", fontSize: "0.82rem", color: "#991b1b" }}
          >
            {message}
          </div>
        )}

        {/* Action buttons */}
        {status !== "done" ? (
          <button
            onClick={run}
            disabled={status === "loading"}
            className="w-full bg-primary text-on-primary rounded-xl py-3 font-label text-sm uppercase tracking-widest hover:bg-primary-container transition-colors disabled:opacity-70"
          >
            {status === "loading" ? "Setting up..." : status === "no_key" ? "Try again" : "Create Admin Account"}
          </button>
        ) : (
          <a
            href="/admin/login"
            className="block w-full text-center bg-primary text-on-primary rounded-xl py-3 font-label text-sm uppercase tracking-widest hover:bg-primary-container transition-colors"
          >
            Go to Admin Login →
          </a>
        )}
      </div>
    </main>
  );
}
