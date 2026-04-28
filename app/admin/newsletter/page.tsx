"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import AdminShell from "@/app/admin/_components/AdminShell";
import { ToastProvider, useToast } from "@/app/admin/_components/Toast";

type Subscriber = { id: string; email: string; confirmed: boolean; created_at: string };
type Post = { title: string; excerpt: string | null };

function NewsletterContent() {
  const toast = useToast();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [latest, setLatest] = useState<Post | null>(null);
  const [subject, setSubject] = useState("This week, a small confession.");
  const [body, setBody] = useState(
    "Dear reader,\n\nIt's been one of those weeks where everything I tried to write came out a little too tidy. So instead, I'm sending you a small confession and a piece I almost didn't publish.\n\nWith warmth,\nShriparna"
  );
  const [includeLatest, setIncludeLatest] = useState(true);
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("subscribers").select("id, email, confirmed, created_at").order("created_at", { ascending: false }),
      supabase.from("posts").select("title, excerpt").eq("status", "published").order("published_at", { ascending: false }).limit(1).maybeSingle(),
    ]).then(([{ data: subs }, { data: post }]) => {
      setSubscribers((subs as Subscriber[]) ?? []);
      setLatest(post as Post | null);
      setLoading(false);
    });
  }, []);

  function exportCSV() {
    const rows = ["email,confirmed,joined", ...subscribers.map((s) => `${s.email},${s.confirmed},${s.created_at.slice(0, 10)}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "subscribers.csv"; a.click();
    URL.revokeObjectURL(url);
    toast("Subscribers exported as CSV.");
  }

  async function removeSubscriber(id: string, email: string) {
    await supabase.from("subscribers").delete().eq("id", id);
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
    toast(`${email} removed.`);
  }

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  const active = subscribers.filter((s) => s.confirmed);

  return (
    <div className="a-content__inner a-content__inner--wide">
      <div className="a-page-head">
        <div>
          <div className="a-page-head__eyebrow">The Sunday letter</div>
          <h1 className="a-page-head__title">Newsletter</h1>
          <div className="a-page-head__sub">Your readers, and a letter to write.</div>
        </div>
      </div>

      {/* Subscribers */}
      <div className="a-section">
        <div className="a-section__head">
          <h2 className="a-section__title">
            Subscribers
            <span style={{ fontFamily: "var(--a-mono)", fontSize: 14, color: "var(--muted)", marginLeft: 8 }}>
              · {subscribers.length}
            </span>
          </h2>
          <button className="a-btn a-btn--ghost a-btn--sm" onClick={exportCSV}>↓ Export CSV</button>
        </div>
        <div className="a-tbl-wrap">
          <table className="a-tbl">
            <thead>
              <tr><th>Email</th><th>Joined</th><th>Status</th><th style={{ textAlign: "right" }}>Actions</th></tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={4} style={{ color: "var(--muted)", fontStyle: "italic" }}>Loading…</td></tr>}
              {!loading && subscribers.length === 0 && (
                <tr><td colSpan={4} style={{ color: "var(--muted)", fontStyle: "italic" }}>No subscribers yet.</td></tr>
              )}
              {subscribers.map((s) => (
                <tr key={s.id}>
                  <td>{s.email}</td>
                  <td style={{ fontFamily: "var(--a-mono)", fontSize: 12, color: "var(--muted)" }}>{fmtDate(s.created_at)}</td>
                  <td>
                    <span className={`a-badge ${s.confirmed ? "a-badge--sage" : "a-badge--muted"}`}>
                      {s.confirmed ? "Confirmed" : "Unconfirmed"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button className="a-tbl__action a-tbl__action--danger" onClick={() => removeSubscriber(s.id, s.email)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compose */}
      <div className="a-section">
        <div className="a-section__head">
          <h2 className="a-section__title">Compose</h2>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>Live preview as you write</span>
        </div>
        <div className="a-nl-grid">
          <div>
            <div className="a-field">
              <label className="a-field__label">Subject</label>
              <input className="a-input" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="a-field">
              <label className="a-field__label">Body</label>
              <textarea
                className="a-textarea"
                style={{ minHeight: 200, fontFamily: "var(--a-serif)", fontSize: 15, lineHeight: 1.6 }}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
            {latest && (
              <div className="a-toggle">
                <div>
                  <div className="a-toggle__label">Include latest post</div>
                  <div className="a-toggle__sub">Auto-pulls &ldquo;{latest.title}&rdquo;</div>
                </div>
                <div className={`a-toggle__switch ${includeLatest ? "on" : ""}`} onClick={() => setIncludeLatest((v) => !v)} />
              </div>
            )}
            <button
              className="a-btn a-btn--primary a-btn--lg"
              style={{ marginTop: 18 }}
              onClick={() => setConfirm(true)}
              disabled={active.length === 0}
            >
              Send to {active.length} subscriber{active.length !== 1 ? "s" : ""} →
            </button>
            {active.length === 0 && !loading && (
              <p style={{ marginTop: 8, fontSize: 12, color: "var(--muted)" }}>No confirmed subscribers yet.</p>
            )}
          </div>

          {/* Preview */}
          <div className="a-nl-preview">
            <div className="a-nl-preview__from">From Shriparna · The Sunday Script</div>
            <h3 className="a-nl-preview__subject">{subject || "Your subject line"}</h3>
            <div className="a-nl-preview__body">{body}</div>
            {includeLatest && latest && (
              <div style={{ marginTop: 18, padding: "16px", background: "var(--cream-deep)", borderRadius: "var(--a-radius)" }}>
                <div style={{ fontFamily: "var(--a-mono)", fontSize: 10, letterSpacing: ".14em", color: "var(--muted)", textTransform: "uppercase" }}>
                  Featured this week
                </div>
                <div style={{ fontFamily: "var(--a-serif)", fontSize: 15, fontWeight: 500, marginTop: 6, color: "var(--ink)" }}>
                  {latest.title}
                </div>
                {latest.excerpt && (
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 5, fontStyle: "italic" }}>{latest.excerpt}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {confirm && (
        <div className="a-confirm-overlay" onClick={() => setConfirm(false)}>
          <div className="a-confirm" onClick={(e) => e.stopPropagation()}>
            <h3>Send to {active.length} readers?</h3>
            <p>The letter will go out within the hour. You won&apos;t be able to unsend.</p>
            <div className="a-confirm__actions">
              <button className="a-btn a-btn--ghost a-btn--sm" onClick={() => setConfirm(false)}>Cancel</button>
              <button className="a-btn a-btn--primary a-btn--sm" onClick={() => { setConfirm(false); toast("Newsletter sent to all subscribers.", "success"); }}>
                Send the letter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminNewsletterPage() {
  return (
    <ToastProvider>
      <AdminShell>
        <NewsletterContent />
      </AdminShell>
    </ToastProvider>
  );
}
