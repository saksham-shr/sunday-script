"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import AdminShell from "@/app/admin/_components/AdminShell";
import { ToastProvider, useToast } from "@/app/admin/_components/Toast";

type Post = {
  id: string;
  title: string;
  slug: string;
  status: string;
  author_name: string;
  published_at: string | null;
  updated_at: string;
  post_categories: { categories: { name: string } | null }[];
};

const STATUS_BADGE: Record<string, { cls: string; label: string }> = {
  published: { cls: "a-badge--sage", label: "Published" },
  draft: { cls: "a-badge--muted", label: "Draft" },
  review: { cls: "a-badge--terracotta", label: "Under Review" },
};

const FILTERS = ["All", "Published", "Draft", "Under Review"];
const FILTER_MAP: Record<string, string | null> = {
  All: null, Published: "published", Draft: "draft", "Under Review": "review",
};

function PostsTable() {
  const router = useRouter();
  const toast = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState("All");
  const [confirm, setConfirm] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("posts")
      .select("id, title, slug, status, author_name, published_at, updated_at, post_categories(categories(name))")
      .order("updated_at", { ascending: false })
      .then(({ data }) => { setPosts((data as unknown as Post[]) ?? []); setLoading(false); });
  }, []);

  const filtered = posts.filter((p) => {
    const s = FILTER_MAP[filter];
    return s ? p.status === s : true;
  });

  async function deletePost(post: Post) {
    await supabase.from("post_categories").delete().eq("post_id", post.id);
    await supabase.from("posts").delete().eq("id", post.id);
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
    toast(`"${post.title}" deleted.`);
    setConfirm(null);
  }

  function fmtDate(iso: string | null) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <>
      <div className="a-content__inner a-content__inner--wide">
        <div className="a-page-head">
          <div>
            <div className="a-page-head__eyebrow">Library</div>
            <h1 className="a-page-head__title">All posts</h1>
            <div className="a-page-head__sub">Everything published, drafted, and waiting.</div>
          </div>
          <button className="a-btn a-btn--primary" onClick={() => router.push("/admin/posts/new")}>
            ✎ Write new post
          </button>
        </div>

        <div className="a-filterbar">
          {FILTERS.map((f) => (
            <button key={f} className={`a-filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>

        <div className="a-tbl-wrap">
          <table className="a-tbl">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} style={{ color: "var(--muted)", fontStyle: "italic" }}>Loading…</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} style={{ color: "var(--muted)", fontStyle: "italic" }}>No posts found.</td></tr>
              )}
              {filtered.map((p) => {
                const badge = STATUS_BADGE[p.status] ?? { cls: "a-badge--muted", label: p.status };
                const cat = (p.post_categories as unknown as { categories: { name: string } | null }[])[0]?.categories?.name ?? "—";
                return (
                  <tr key={p.id}>
                    <td>
                      <span className="a-tbl__title" onClick={() => router.push(`/admin/posts/${p.id}/edit`)}>
                        {p.title}
                      </span>
                    </td>
                    <td>{p.author_name ?? "Shriparna"}</td>
                    <td style={{ color: "var(--muted)" }}>{cat}</td>
                    <td><span className={`a-badge ${badge.cls}`}>{badge.label}</span></td>
                    <td style={{ fontFamily: "var(--a-mono)", fontSize: 12, color: "var(--muted)" }}>
                      {fmtDate(p.published_at ?? p.updated_at)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button className="a-tbl__action" onClick={() => router.push(`/admin/posts/${p.id}/edit`)}>Edit</button>
                      <button className="a-tbl__action a-tbl__action--danger" onClick={() => setConfirm(p)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {confirm && (
        <div className="a-confirm-overlay" onClick={() => setConfirm(null)}>
          <div className="a-confirm" onClick={(e) => e.stopPropagation()}>
            <h3>Delete &ldquo;{confirm.title}&rdquo;?</h3>
            <p>This cannot be undone. The post and its comments will be removed.</p>
            <div className="a-confirm__actions">
              <button className="a-btn a-btn--ghost a-btn--sm" onClick={() => setConfirm(null)}>Cancel</button>
              <button className="a-btn a-btn--danger a-btn--sm" onClick={() => deletePost(confirm)}>Delete post</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function AdminPostsPage() {
  return (
    <ToastProvider>
      <AdminShell>
        <PostsTable />
      </AdminShell>
    </ToastProvider>
  );
}
