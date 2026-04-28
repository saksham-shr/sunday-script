"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import AdminShell from "@/app/admin/_components/AdminShell";
import { ToastProvider, useToast } from "@/app/admin/_components/Toast";

type Post = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  author_name: string | null;
  updated_at: string;
  post_categories: { categories: { name: string } | null }[];
};

function ReviewContent() {
  const toast = useToast();
  const [queue, setQueue] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackOpen, setFeedbackOpen] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase
      .from("posts")
      .select("id, title, excerpt, content, author_name, updated_at, post_categories(categories(name))")
      .eq("status", "review")
      .order("updated_at", { ascending: false })
      .then(({ data }) => {
        setQueue((data as unknown as Post[]) ?? []);
        setLoading(false);
      });
  }, []);

  async function publish(post: Post) {
    await supabase.from("posts").update({ status: "published", published_at: new Date().toISOString() }).eq("id", post.id);
    setQueue((prev) => prev.filter((p) => p.id !== post.id));
    toast("Post published successfully.", "success");
  }

  async function requestRevisions(post: Post) {
    await supabase.from("posts").update({ status: "draft" }).eq("id", post.id);
    setQueue((prev) => prev.filter((p) => p.id !== post.id));
    toast("Revisions requested.", "success");
    setFeedbackOpen((f) => ({ ...f, [post.id]: false }));
  }

  function wordCount(html: string | null) {
    return (html ?? "").replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  }

  return (
    <div className="a-content__inner">
      <div className="a-page-head">
        <div>
          <div className="a-page-head__eyebrow">Awaiting your eyes</div>
          <h1 className="a-page-head__title">Review queue</h1>
          <div className="a-page-head__sub">
            {loading ? "Loading…" : queue.length === 0
              ? "The desk is clear."
              : `${queue.length} piece${queue.length !== 1 ? "s" : ""} from your collaborators.`}
          </div>
        </div>
      </div>

      {!loading && queue.length === 0 && (
        <div className="a-empty">No pieces waiting. The desk is clear.</div>
      )}

      {queue.map((p) => {
        const words = wordCount(p.content);
        const readMin = Math.max(1, Math.round(words / 200));
        const cat = (p.post_categories as unknown as { categories: { name: string } | null }[])[0]?.categories?.name;
        const isOpen = feedbackOpen[p.id];

        return (
          <div key={p.id} className="a-review-card">
            <h3 className="a-review-card__title">{p.title}</h3>
            <div className="a-review-card__meta">
              <span>By <strong style={{ color: "var(--ink)", fontWeight: 500 }}>{p.author_name ?? "Shriparna"}</strong></span>
              <span>·</span>
              <span>{new Date(p.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              {cat && <span className="a-badge a-badge--muted">{cat}</span>}
            </div>
            {p.excerpt && (
              <div className="a-review-card__excerpt">{p.excerpt}</div>
            )}
            <div className="a-review-card__stats">
              <span>{words} words</span>
              <span>·</span>
              <span>{readMin} min read</span>
            </div>
            <div className="a-review-card__actions">
              <button className="a-btn a-btn--primary" onClick={() => publish(p)}>Publish now</button>
              <button className="a-btn a-btn--ghost" onClick={() => setFeedbackOpen((f) => ({ ...f, [p.id]: !f[p.id] }))}>
                {isOpen ? "Cancel" : "Request revisions"}
              </button>
            </div>
            {isOpen && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--line-soft)" }}>
                <div className="a-field">
                  <label className="a-field__label">A note for {p.author_name?.split(" ")[0] ?? "them"}</label>
                  <textarea
                    className="a-textarea"
                    placeholder="What would you like them to revisit?"
                    value={feedback[p.id] ?? ""}
                    onChange={(e) => setFeedback((f) => ({ ...f, [p.id]: e.target.value }))}
                  />
                </div>
                <button className="a-btn a-btn--primary a-btn--sm" onClick={() => requestRevisions(p)}>
                  Send feedback
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function AdminReviewPage() {
  return (
    <ToastProvider>
      <AdminShell>
        <ReviewContent />
      </AdminShell>
    </ToastProvider>
  );
}
