"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import AdminShell from "@/app/admin/_components/AdminShell";
import { ToastProvider, useToast } from "@/app/admin/_components/Toast";

type GuestPost = {
  id: string;
  title: string;
  author_name: string;
  author_email: string;
  content: string;
  status: string;
  created_at: string;
};

const STATUS_BADGE: Record<string, { cls: string; label: string }> = {
  pending: { cls: "a-badge--terracotta", label: "Pending" },
  approved: { cls: "a-badge--sage", label: "Approved" },
  rejected: { cls: "a-badge--danger", label: "Rejected" },
};

const FILTERS = ["All", "Pending", "Approved", "Rejected"];

function GuestsContent() {
  const toast = useToast();
  const [guests, setGuests] = useState<GuestPost[]>([]);
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("guest_posts")
      .select("id, title, author_name, author_email, content, status, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => { setGuests((data as GuestPost[]) ?? []); setLoading(false); });
  }, []);

  async function approve(g: GuestPost) {
    await supabase.from("guest_posts").update({ status: "approved", reviewed_at: new Date().toISOString() }).eq("id", g.id);
    setGuests((prev) => prev.map((x) => x.id === g.id ? { ...x, status: "approved" } : x));
    toast(`"${g.title}" approved.`, "success");
  }

  async function reject(g: GuestPost) {
    await supabase.from("guest_posts").update({ status: "rejected", reviewed_at: new Date().toISOString() }).eq("id", g.id);
    setGuests((prev) => prev.map((x) => x.id === g.id ? { ...x, status: "rejected" } : x));
    toast("Guest post declined.");
  }

  function wordCount(html: string) {
    return html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  }

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  const filtered = guests.filter((g) => {
    if (filter === "All") return true;
    return g.status === filter.toLowerCase();
  });

  return (
    <div className="a-content__inner">
      <div className="a-page-head">
        <div>
          <div className="a-page-head__eyebrow">Letters from strangers</div>
          <h1 className="a-page-head__title">Guest inbox</h1>
          <div className="a-page-head__sub">One-off pieces from readers. Considered with care.</div>
        </div>
      </div>

      <div className="a-filterbar">
        {FILTERS.map((f) => (
          <button key={f} className={`a-filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      {loading && <div style={{ color: "var(--muted)", fontStyle: "italic" }}>Loading…</div>}
      {!loading && filtered.length === 0 && <div className="a-empty">Nothing here right now.</div>}

      {filtered.map((g) => {
        const open = expanded[g.id];
        const badge = STATUS_BADGE[g.status] ?? { cls: "a-badge--muted", label: g.status };
        const words = wordCount(g.content);

        return (
          <div key={g.id} className="a-guest-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, marginBottom: 6 }}>
              <div>
                <h3 className="a-guest-card__title">{g.title}</h3>
                <div className="a-guest-card__from">
                  From <strong style={{ color: "var(--ink)" }}>{g.author_name}</strong> · {g.author_email}
                </div>
              </div>
              <span className={`a-badge ${badge.cls}`}>{badge.label}</span>
            </div>

            <div style={{ fontFamily: "var(--a-mono)", fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>
              {words} words · received {fmtDate(g.created_at)}
            </div>

            <div className="a-guest-card__actions">
              <button className="a-btn a-btn--ghost a-btn--sm" onClick={() => setExpanded((e) => ({ ...e, [g.id]: !e[g.id] }))}>
                {open ? "Close" : "Read + edit"}
              </button>
              {g.status === "pending" && (
                <>
                  <button className="a-btn a-btn--success a-btn--sm" onClick={() => approve(g)}>Approve</button>
                  <button className="a-btn a-btn--danger a-btn--sm" onClick={() => reject(g)}>Decline</button>
                </>
              )}
            </div>

            {open && (
              <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--line-soft)" }}>
                <div className="a-field__hint" style={{ marginBottom: 8 }}>Refine wording, tighten paragraphs.</div>
                <textarea
                  className="a-textarea"
                  style={{ minHeight: 220, fontFamily: "var(--a-serif)", fontSize: 15, lineHeight: 1.65 }}
                  value={edits[g.id] != null ? edits[g.id] : g.content.replace(/<[^>]+>/g, "")}
                  onChange={(e) => setEdits((s) => ({ ...s, [g.id]: e.target.value }))}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function AdminGuestsPage() {
  return (
    <ToastProvider>
      <AdminShell>
        <GuestsContent />
      </AdminShell>
    </ToastProvider>
  );
}
