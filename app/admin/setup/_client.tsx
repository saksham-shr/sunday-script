"use client";

import { useState } from "react";
import type { SetupResult } from "@/app/actions/setup-admin";

interface Props {
  adminResult: SetupResult;
  rlsSql: string;
}

export default function SetupClient({ adminResult, rlsSql }: Props) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(rlsSql).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const adminOk = adminResult.status === "created" || adminResult.status === "updated" || adminResult.status === "exists";

  return (
    <main style={{ minHeight: "100vh", background: "var(--color-surface)", padding: "40px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "var(--font-headline)", fontStyle: "italic", fontSize: "2rem", marginBottom: 4 }}>
          One-time Setup
        </h1>
        <p style={{ color: "var(--color-on-surface-variant)", fontSize: "0.85rem", marginBottom: 32 }}>
          Run this once to prepare your database. These operations are safe to repeat.
        </p>

        {/* Step 1 — Admin account */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 12 }}>1. Admin account</h2>
          <div
            style={{
              padding: "16px 20px",
              borderRadius: 12,
              border: `1px solid ${adminOk ? "#86efac" : adminResult.status === "no_key" ? "#fde047" : "#fecaca"}`,
              background: adminOk ? "#f0fdf4" : adminResult.status === "no_key" ? "#fef9c3" : "#fef2f2",
              fontSize: "0.85rem",
              lineHeight: 1.7,
              color: adminOk ? "#166534" : adminResult.status === "no_key" ? "#713f12" : "#991b1b",
            }}
          >
            {adminOk ? (
              <>
                ✓ {adminResult.message}
                <div style={{ marginTop: 8, padding: "8px 12px", background: "rgba(0,0,0,0.05)", borderRadius: 8 }}>
                  <div><strong>Email:</strong> shriparnasharma2008@gmail.com</div>
                  <div><strong>Password:</strong> sharma2008shriparna</div>
                </div>
              </>
            ) : (
              adminResult.message
            )}
          </div>
        </section>

        {/* Step 2 — RLS */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 4 }}>2. Row Level Security</h2>
          <p style={{ fontSize: "0.82rem", color: "var(--color-on-surface-variant)", marginBottom: 12 }}>
            Copy this SQL and run it in the{" "}
            <a
              href="https://supabase.com/dashboard/project/yanmfnkcjomvalkehfut/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--color-primary)", textDecoration: "underline" }}
            >
              Supabase SQL Editor ↗
            </a>
            . This enables RLS and creates all access policies.
          </p>

          <div style={{ position: "relative" }}>
            <pre
              style={{
                background: "#1e1e2e",
                color: "#cdd6f4",
                borderRadius: 12,
                padding: "20px 20px 20px 20px",
                fontSize: "0.72rem",
                lineHeight: 1.6,
                overflowX: "auto",
                maxHeight: 420,
                overflowY: "auto",
              }}
            >
              {rlsSql}
            </pre>
            <button
              onClick={copy}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                padding: "6px 14px",
                borderRadius: 8,
                border: "none",
                background: copied ? "#22c55e" : "rgba(255,255,255,0.12)",
                color: "#fff",
                fontSize: "0.75rem",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              {copied ? "Copied!" : "Copy SQL"}
            </button>
          </div>

          <a
            href="https://supabase.com/dashboard/project/yanmfnkcjomvalkehfut/sql/new"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: 12,
              padding: "10px 20px",
              background: "var(--color-primary)",
              color: "#fff",
              borderRadius: 10,
              fontSize: "0.82rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Open SQL Editor →
          </a>
        </section>

        {/* Done */}
        <div style={{ borderTop: "1px solid var(--color-outline-variant)", paddingTop: 24, textAlign: "center" }}>
          <a
            href="/admin/login"
            style={{
              display: "inline-block",
              padding: "12px 28px",
              background: "var(--color-primary)",
              color: "#fff",
              borderRadius: 12,
              fontWeight: 600,
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            Go to Admin Login →
          </a>
        </div>
      </div>
    </main>
  );
}
