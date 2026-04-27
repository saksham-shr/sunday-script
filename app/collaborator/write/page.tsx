"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { submitCollaboratorPost } from "@/app/actions/collaborator-post";
import Editor from "@/components/Editor";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Collaborator = { name: string; email: string };

export default function CollaboratorWritePage() {
  const [collab, setCollab] = useState<Collaborator | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/collaborator/login"; return; }

      const { data } = await supabase
        .from("collaborators")
        .select("status, name, email")
        .eq("email", user.email!)
        .maybeSingle();

      if (!data || data.status !== "approved") {
        await supabase.auth.signOut();
        window.location.href = "/collaborator/login";
        return;
      }
      setCollab({ name: data.name, email: data.email });
      setAuthChecked(true);
    }
    load();
  }, []);

  const words = content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;

  async function handleSubmit() {
    if (!collab || saving) return;
    setError("");
    setSaving(true);
    const result = await submitCollaboratorPost({ title, excerpt, content, authorName: collab.name, authorEmail: collab.email });
    setSaving(false);
    if (result.status === "success") setSubmitted(true);
    else setError(result.message);
  }

  if (!authChecked) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cream)" }}>
        <div style={{ fontFamily: "var(--a-mono)", fontSize: 12, color: "var(--muted)" }}>Loading…</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ textAlign: "center", maxWidth: 440 }}>
          <div style={{ fontFamily: "var(--a-serif)", fontSize: 48, color: "var(--terracotta)", fontStyle: "italic", marginBottom: 16 }}>✦</div>
          <h2 style={{ fontFamily: "var(--a-serif)", fontSize: 28, fontWeight: 500, color: "var(--ink)", margin: "0 0 10px" }}>Submitted.</h2>
          <p style={{ color: "var(--muted)", marginBottom: 28, lineHeight: 1.6 }}>
            Your piece is in Shriparna's queue. You'll see it published once she approves it.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button className="a-btn a-btn--ghost" onClick={() => window.location.href = "/collaborator/portal"}>
              ← Back to dashboard
            </button>
            <button className="a-btn a-btn--primary" onClick={() => { setTitle(""); setExcerpt(""); setContent(""); setSubmitted(false); }}>
              Write another piece
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="a-editor">
      {/* Top bar */}
      <div className="a-editor__bar">
        <button className="a-editor__back" onClick={() => window.location.href = "/collaborator/portal"}>
          ← Dashboard
        </button>
        <div className="a-editor__bar-title">
          {title || "New piece"}
        </div>
        <div className="a-editor__bar-actions">
          <span style={{ fontFamily: "var(--a-mono)", fontSize: 11, color: "var(--muted)", alignSelf: "center", marginRight: 8 }}>
            {words} words
          </span>
          <button className="a-btn a-btn--ghost a-btn--sm" onClick={() => window.location.href = "/collaborator/portal"}>
            Cancel
          </button>
          <button
            className="a-btn a-btn--primary a-btn--sm"
            disabled={saving || !title.trim()}
            onClick={handleSubmit}
          >
            {saving ? "Submitting…" : "Submit for review →"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="a-editor__body">
        <div>
          <input
            className="a-editor__title-input"
            placeholder="Give your piece a title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="a-editor__excerpt-input"
            placeholder="A one-sentence excerpt (optional)…"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
          <div style={{ border: "1px solid var(--line)", borderRadius: "var(--a-radius)", overflow: "hidden", background: "var(--paper)", minHeight: 400 }}>
            <Editor content={content} onChange={setContent} placeholder="Write here. Take your time." />
          </div>
          {error && (
            <div className="a-feedback-row" style={{ marginTop: 16 }}>
              <span className="a-feedback-label">Error</span>
              {error}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="a-editor__side">
          <div className="a-editor__side-section">
            <div className="a-editor__side-label">Stats</div>
            <div className="a-editor__stats-row"><span>Words</span><span>{words}</span></div>
            <div className="a-editor__stats-row"><span>Read time</span><span>~{Math.max(1, Math.ceil(words / 200))} min</span></div>
          </div>
          <div className="a-editor__side-section">
            <div className="a-editor__side-label">Writing as</div>
            <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>{collab?.name}</div>
          </div>
          <div className="a-editor__side-section">
            <div className="a-editor__side-label">Notes</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {["400–1200 words works best.", "One clear idea, explored.", "Submit when right — not perfect."].map((note) => (
                <li key={note} style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, paddingLeft: 12, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, color: "var(--terracotta)" }}>—</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
