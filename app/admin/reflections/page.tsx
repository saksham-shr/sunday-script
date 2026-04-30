"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import AdminShell from "@/app/admin/_components/AdminShell";
import { ToastProvider, useToast } from "@/app/admin/_components/Toast";
import { submitAdminReply } from "@/app/actions/admin-reply";

type Comment = {
  id: string;
  post_id: string;
  author_name: string;
  content: string;
  status: string;
  created_at: string;
  is_admin_reply: boolean;
  parent_id: string | null;
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
  const [replyOpen, setReplyOpen] = useState<Record<string, boolean>>({});
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [replying, setReplying] = useState<Record<string, boolean>>({});

  useEffect(() => {
    supabase
      .from("comments")
      .select("id, post_id, author_name, content, status, created_at, is_admin_reply, parent_id, posts(title)")
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

  async function handleReply(c: Comment) {
    const content = replyText[c.id]?.trim();
    if (!content) return;
    setReplying((r) => ({ ...r, [c.id]: true }));

    const result = await submitAdminReply({ postId: c.post_id, parentId: c.id, content });

    setReplying((r) => ({ ...r, [c.id]: false }));
    if (!result.ok) { toast(`Failed: ${result.error}`); return; }

    // Add reply optimistically to the list
    const newReply: Comment = {
      id: crypto.randomUUID(),
      post_id: c.post_id,
      author_name: "Shriparna",
      content,
      status: "approved",
      created_at: new Date().toISOString(),
      is_admin_reply: true,
      parent_id: c.id,
      posts: c.posts,
    };
    setComments((prev) => {
      const idx = prev.findIndex((x) => x.id === c.id);
      const next = [...prev];
      next.splice(idx + 1, 0, newReply);
      return next;
    });
    setReplyOpen((r) => ({ ...r, [c.id]: false }));
    setReplyText((r) => ({ ...r, [c.id]: "" }));
    toast("Reply published.", "success");
  }

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  // Only show top-level comments in the filter; replies are shown inline
  const topLevel = comments.filter((c) => !c.parent_id);
  const repliesMap: Record<string, Comment[]> = {};
  comments.filter((c) => c.parent_id).forEach((r) => {
    if (!repliesMap[r.parent_id!]) repliesMap[r.parent_id!] = [];
    repliesMap[r.parent_id!].push(r);
  });

  const filtered = topLevel.filter((c) => {
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
              const replies = repliesMap[c.id] ?? [];
              const isReplyOpen = replyOpen[c.id];

              return (
                <>
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
                      {c.status === "approved" && (
                        <button
                          className="a-tbl__action"
                          style={{ color: "var(--terracotta)" }}
                          onClick={() => setReplyOpen((r) => ({ ...r, [c.id]: !r[c.id] }))}
                        >
                          {isReplyOpen ? "Cancel" : "Reply"}
                        </button>
                      )}
                      {c.status !== "spam" && (
                        <button className="a-tbl__action" onClick={() => markSpam(c)}>Spam</button>
                      )}
                      <button className="a-tbl__action a-tbl__action--danger" onClick={() => deleteComment(c)}>Delete</button>
                    </td>
                  </tr>

                  {/* Inline reply form */}
                  {isReplyOpen && (
                    <tr key={`${c.id}-reply-form`}>
                      <td colSpan={6} style={{ padding: "0 16px 16px", background: "var(--cream-deep)" }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "flex-end", paddingTop: 12 }}>
                          <div style={{ fontSize: 11, fontFamily: "var(--a-mono)", color: "var(--terracotta)", marginBottom: 4, whiteSpace: "nowrap" }}>
                            Shriparna →
                          </div>
                          <textarea
                            className="a-textarea"
                            style={{ minHeight: 72, flex: 1, fontSize: 14, fontFamily: "var(--a-serif)" }}
                            placeholder={`Reply to ${c.author_name}…`}
                            value={replyText[c.id] ?? ""}
                            onChange={(e) => setReplyText((t) => ({ ...t, [c.id]: e.target.value }))}
                          />
                          <button
                            className="a-btn a-btn--primary a-btn--sm"
                            disabled={replying[c.id]}
                            onClick={() => handleReply(c)}
                          >
                            {replying[c.id] ? "Posting…" : "Post reply"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Existing admin replies shown inline */}
                  {replies.map((r) => (
                    <tr key={r.id} style={{ background: "var(--cream-deep)" }}>
                      <td />
                      <td style={{ color: "var(--terracotta)", fontFamily: "var(--a-mono)", fontSize: 11 }}>↳ Shriparna</td>
                      <td colSpan={2} style={{ fontStyle: "italic", color: "var(--ink-soft)", fontSize: 13 }}>
                        &ldquo;{r.content.slice(0, 140)}{r.content.length > 140 ? "…" : ""}&rdquo;
                      </td>
                      <td><span className="a-badge a-badge--sage">Published</span></td>
                      <td style={{ textAlign: "right" }}>
                        <button className="a-tbl__action a-tbl__action--danger" onClick={() => deleteComment(r)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </>
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
