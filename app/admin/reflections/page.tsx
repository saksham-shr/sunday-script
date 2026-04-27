"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminShell from "@/app/admin/_components/AdminShell";
import { ToastProvider, useToast } from "@/app/admin/_components/Toast";

type Comment = {
  id: string;
  post_id: string;
  author_name: string;
  content: string;
  status: string;
  created_at: string;
  posts?: { title: string } | null;
};

const STATUS_BADGE: Record<string, { cls: string; label: string }> = {
  pending: { cls: "a-badge--terracotta", label: "Pending" },
  approved: { cls: "a-badge--sage", label: "Approved" },
  spam: { cls: "a-badge--danger", label: "Spam" },
};

const FILTERS = ["All", "Pending", "Approved", "Spam"];

function ReflectionsContent() {
  const toast = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("comments")
      .select("id, post_id, author_name, content, status, created_at, posts(title)")
      .order("created_at", { ascending: false })
      .then(({ data }) => { setComments((data as unknown as Comment[]) ?? []); setLoading(false); });
  }, []);

  async function approve(c: Comment) {
    await supabase.from("comments").update({ status: "approved" }).eq("id", c.id);
    setComments((prev) => prev.map((x) => x.id === c.id ? { ...x, status: "approved" } : x));
    toast("Reflection approved.", "success");
  }

  async function markSpam(c: Comment) {
    await supabase.from("comments").update({ status: "spam" }).eq("id", c.id);
    setComments((prev) => prev.map((x) => x.id === c.id ? { ...x, status: "spam" } : x));
    toast("Marked as spam.");
  }

  async function deleteComment(c: Comment) {
    await supabase.from("comments").delete().eq("id", c.id);
    setComments((prev) => prev.filter((x) => x.id !== c.id));
    toast("Reflection deleted.");
  }

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  const filtered = comments.filter((c) => {
    if (filter === "All") return true;
    return c.status === filter.toLowerCase();
  });

  return (
    <div className="a-content__inner a-content__inner--wide">
      <div className="a-page-head">
        <div>
          <div className="a-page-head__eyebrow">The conversation</div>
          <h1 className="a-page-head__title">Reflections</h1>
          <div className="a-page-head__sub">Comments left on articles. Nothing goes live without your nod.</div>
        </div>
      </div>

      <div className="a-filterbar">
        {FILTERS.map((f) => (
          <button key={f} className={`a-filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <div className="a-tbl-wrap">
        <table className="a-tbl">
          <thead>
            <tr>
              <th>Article</th>
              <th>From</th>
              <th>Reflection</th>
              <th>Date</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} style={{ color: "var(--muted)", fontStyle: "italic" }}>Loading…</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} style={{ color: "var(--muted)", fontStyle: "italic" }}>No reflections found.</td></tr>
            )}
            {filtered.map((c) => {
              const badge = STATUS_BADGE[c.status] ?? { cls: "a-badge--muted", label: c.status };
              return (
                <tr key={c.id}>
                  <td style={{ maxWidth: 180 }}>
                    <span className="a-tbl__title">{(c.posts as unknown as { title: string } | null)?.title ?? "—"}</span>
                  </td>
                  <td>{c.author_name}</td>
                  <td style={{ fontStyle: "italic", color: "var(--ink-soft)", maxWidth: 320 }}>
                    &ldquo;{c.content.slice(0, 120)}{c.content.length > 120 ? "…" : ""}&rdquo;
                  </td>
                  <td style={{ fontFamily: "var(--a-mono)", fontSize: 12, color: "var(--muted)" }}>{fmtDate(c.created_at)}</td>
                  <td><span className={`a-badge ${badge.cls}`}>{badge.label}</span></td>
                  <td style={{ textAlign: "right" }}>
                    {c.status !== "approved" && (
                      <button className="a-tbl__action" onClick={() => approve(c)}>Approve</button>
                    )}
                    {c.status !== "spam" && (
                      <button className="a-tbl__action" onClick={() => markSpam(c)}>Spam</button>
                    )}
                    <button className="a-tbl__action a-tbl__action--danger" onClick={() => deleteComment(c)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminReflectionsPage() {
  return (
    <ToastProvider>
      <AdminShell>
        <ReflectionsContent />
      </AdminShell>
    </ToastProvider>
  );
}
