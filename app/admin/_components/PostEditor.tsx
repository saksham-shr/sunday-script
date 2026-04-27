"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useToast } from "./Toast";

type Category = { id: string; name: string };

type PostEditorProps = {
  postId?: string;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PostEditor({ postId }: PostEditorProps) {
  const router = useRouter();
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState("draft");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const isEdit = !!postId;

  useEffect(() => {
    supabase.from("categories").select("id, name").order("name").then(({ data }) => {
      setCategories((data as Category[]) ?? []);
    });

    if (postId) {
      Promise.all([
        supabase.from("posts").select("*").eq("id", postId).single(),
        supabase.from("post_categories").select("category_id").eq("post_id", postId),
      ]).then(([{ data: post }, { data: cats }]) => {
        if (post) {
          setTitle(post.title ?? "");
          setSlug(post.slug ?? "");
          setExcerpt(post.excerpt ?? "");
          setContent(post.content ?? "");
          setCoverImage(post.cover_image ?? "");
          setStatus(post.status ?? "draft");
        }
        setCategoryIds((cats ?? []).map((c: { category_id: string }) => c.category_id));
        setLoaded(true);
      });
    } else {
      setLoaded(true);
    }
  }, [postId]);

  // Auto-slug from title (new posts only)
  useEffect(() => {
    if (!isEdit && title) setSlug(slugify(title));
  }, [title, isEdit]);

  const words = content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  const readMin = Math.max(1, Math.round(words / 200));

  async function save(saveStatus: string) {
    if (!title.trim()) { toast("Please add a title."); return; }
    setSaving(true);

    const payload = {
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      excerpt: excerpt.trim() || null,
      content,
      cover_image: coverImage.trim() || null,
      status: saveStatus,
      author_name: "Shriparna",
      updated_at: new Date().toISOString(),
      published_at: saveStatus === "published" ? new Date().toISOString() : undefined,
    };

    let id = postId;

    if (isEdit) {
      const { error } = await supabase.from("posts").update(payload).eq("id", postId!);
      if (error) { toast("Failed to save. " + error.message); setSaving(false); return; }
    } else {
      const { data, error } = await supabase.from("posts").insert(payload).select("id").single();
      if (error) { toast("Failed to save. " + error.message); setSaving(false); return; }
      id = data.id;
    }

    // Sync categories
    if (id) {
      await supabase.from("post_categories").delete().eq("post_id", id);
      if (categoryIds.length > 0) {
        await supabase.from("post_categories").insert(
          categoryIds.map((cid) => ({ post_id: id, category_id: cid }))
        );
      }
    }

    setSaving(false);
    if (saveStatus === "published") {
      toast("Post published successfully.", "success");
      router.push("/admin/posts");
    } else {
      toast("Draft saved.", "success");
      if (!isEdit && id) router.replace(`/admin/posts/${id}/edit`);
    }
  }

  function toggleCategory(id: string) {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  if (!loaded) {
    return (
      <div className="a-editor">
        <div className="a-editor__bar">
          <button className="a-editor__back" onClick={() => router.push("/admin/posts")}>← Posts</button>
        </div>
        <div style={{ padding: 40, color: "var(--muted)", fontStyle: "italic" }}>Loading…</div>
      </div>
    );
  }

  return (
    <div className="a-editor">
      {/* Top bar */}
      <div className="a-editor__bar">
        <button className="a-editor__back" onClick={() => router.push("/admin/posts")}>← Back to posts</button>
        <div className="a-editor__bar-title">{title || "Untitled draft"}</div>
        <div className="a-editor__bar-actions">
          <button className="a-btn a-btn--ghost a-btn--sm" onClick={() => save("draft")} disabled={saving}>
            Save draft
          </button>
          <button className="a-btn a-btn--primary a-btn--sm" onClick={() => save("published")} disabled={saving}>
            {saving ? "Saving…" : "Publish"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="a-editor__body">
        <div style={{ minWidth: 0 }}>
          <input
            className="a-editor__title-input"
            placeholder="Your title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="a-editor__excerpt-input"
            placeholder="A brief excerpt…"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
          <textarea
            className="a-editor__content"
            placeholder="Begin… (HTML is supported)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* Side panel */}
        <aside className="a-editor__side">
          <div className="a-editor__side-section">
            <div className="a-editor__side-label">Status</div>
            <select className="a-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="review">Under Review</option>
            </select>
          </div>

          <div className="a-editor__side-section">
            <div className="a-editor__side-label">Slug</div>
            <input className="a-input" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="url-slug" />
          </div>

          <div className="a-editor__side-section">
            <div className="a-editor__side-label">Categories</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
              {categories.map((c) => (
                <label key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={categoryIds.includes(c.id)}
                    onChange={() => toggleCategory(c.id)}
                    style={{ accentColor: "var(--terracotta)" }}
                  />
                  {c.name}
                </label>
              ))}
              {categories.length === 0 && <span style={{ fontSize: 12, color: "var(--muted)" }}>No categories yet.</span>}
            </div>
          </div>

          <div className="a-editor__side-section">
            <div className="a-editor__side-label">Cover image URL</div>
            <input className="a-input" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://…" />
          </div>

          <div className="a-editor__side-section">
            <div className="a-editor__side-label">At a glance</div>
            <div className="a-editor__stats-row"><span>Words</span><span>{words}</span></div>
            <div className="a-editor__stats-row"><span>Read time</span><span>{readMin} min</span></div>
            <div className="a-editor__stats-row"><span>Characters</span><span>{content.length}</span></div>
          </div>

          {isEdit && (
            <div className="a-editor__side-section">
              <button
                style={{ fontSize: 12, color: "var(--danger)", cursor: "pointer" }}
                onClick={async () => {
                  if (!confirm("Delete this post?")) return;
                  await supabase.from("post_categories").delete().eq("post_id", postId!);
                  await supabase.from("posts").delete().eq("id", postId!);
                  router.push("/admin/posts");
                }}
              >
                Delete this post
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
