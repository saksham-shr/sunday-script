"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import WriterShell from "@/app/collaborator/_components/WriterShell";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Post = {
  id: string;
  title: string;
  status: string;
  updated_at: string;
  published_at: string | null;
  word_count: number | null;
};

type Collaborator = { name: string; email: string };

const STATUS_BADGE: Record<string, { cls: string; label: string }> = {
  published: { cls: "a-badge--sage", label: "Published" },
  review: { cls: "a-badge--terracotta", label: "Under review" },
  draft: { cls: "a-badge--muted", label: "Draft" },
  revisions: { cls: "a-badge--amber", label: "Revisions needed" },
};

function fmt(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function CollaboratorPortal() {
  const [collab, setCollab] = useState<Collaborator | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [authChecked, setAuthChecked] = useState(false);
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/collaborator/login"; return; }

      const { data: collabData } = await supabase
        .from("collaborators")
        .select("status, name, email")
        .eq("email", user.email!)
        .maybeSingle();

      if (!collabData || collabData.status !== "approved") {
        await supabase.auth.signOut();
        window.location.href = "/collaborator/login";
        return;
      }

      setCollab({ name: collabData.name, email: collabData.email });

      const { data: myPosts } = await supabase
        .from("posts")
        .select("id, title, status, updated_at, published_at, word_count")
        .eq("author_name", collabData.name)
        .order("updated_at", { ascending: false });

      setPosts((myPosts as Post[]) ?? []);
      setAuthChecked(true);
    }
    load();
  }, []);

  if (!authChecked) {
    return (
      <div className="a-shell" style={{ minHeight: "100vh", alignItems: "center", justifyContent: "center", display: "flex" }}>
        <div style={{ fontFamily: "var(--a-mono)", fontSize: 12, color: "var(--muted)", letterSpacing: ".1em" }}>Loading…</div>
      </div>
    );
  }

  const drafts = posts.filter((p) => p.status === "draft");
  const submitted = posts.filter((p) => p.status === "review");
  const published = posts.filter((p) => p.status === "published");
  const revisions = posts.filter((p) => p.status === "revisions");

  return (
    <WriterShell writerName={collab!.name} writerInitial={collab!.name[0]?.toUpperCase()}>
      <div className="a-content__inner a-content__inner--wide">
        {/* Page head */}
        <div className="a-page-head">
          <div>
            <div className="a-page-head__eyebrow">{today}</div>
            <h1 className="a-page-head__title">Good morning, {collab!.name.split(" ")[0]}.</h1>
            <div className="a-page-head__sub">Here's where your writing lives.</div>
          </div>
          <button className="a-btn a-btn--primary" onClick={() => window.location.href = "/collaborator/write"}>
            ✎ Write new piece
          </button>
        </div>

        {/* Stats */}
        <div className="a-stats" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="a-stat">
            <div className="a-stat__label">Posts published</div>
            <div className="a-stat__value">{published.length}</div>
            <div className="a-stat__sub">All time</div>
          </div>
          <div className="a-stat a-stat--accent">
            <div className="a-stat__label">Under review</div>
            <div className="a-stat__value">{submitted.length}</div>
            <div className="a-stat__sub">Under Shriparna's eyes</div>
          </div>
          <div className="a-stat">
            <div className="a-stat__label">Drafts in progress</div>
            <div className="a-stat__value">{drafts.length}</div>
            <div className="a-stat__sub">Quietly waiting</div>
          </div>
        </div>

        {/* Main grid */}
        <div className="a-writer-grid">
          <div>
            {/* Revisions needed */}
            {revisions.length > 0 && (
              <div className="a-section">
                <div className="a-section__head">
                  <h2 className="a-section__title">Revisions requested</h2>
                </div>
                {revisions.map((p) => (
                  <div key={p.id} className="a-draft-card" style={{ borderLeftColor: "var(--amber)", borderLeftWidth: 3 }}>
                    <div className="a-draft-card__body">
                      <div className="a-draft-card__title">{p.title}</div>
                      <div className="a-draft-card__meta">Last updated {fmt(p.updated_at)}</div>
                    </div>
                    <span className="a-badge a-badge--amber">Revisions needed</span>
                    <button className="a-btn a-btn--primary a-btn--sm" onClick={() => window.location.href = `/collaborator/write/${p.id}`}>
                      Edit →
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Continue writing */}
            <div className="a-section">
              <div className="a-section__head">
                <h2 className="a-section__title">Continue writing</h2>
                <button className="a-btn a-btn--ghost a-btn--sm" onClick={() => window.location.href = "/collaborator/write"}>
                  ✎ Start a new piece
                </button>
              </div>
              {drafts.length === 0 ? (
                <div className="a-empty">No drafts. The page is blank — and that's a good place to start.</div>
              ) : (
                drafts.map((p) => (
                  <div key={p.id} className="a-draft-card">
                    <div className="a-draft-card__body">
                      <div className="a-draft-card__title">{p.title}</div>
                      <div className="a-draft-card__meta">
                        {p.word_count ? `${p.word_count} words · ` : ""}last edited {fmt(p.updated_at)}
                      </div>
                    </div>
                    <button className="a-btn a-btn--primary a-btn--sm" onClick={() => window.location.href = `/collaborator/write/${p.id}`}>
                      Continue →
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Submitted */}
            <div className="a-section">
              <div className="a-section__head">
                <h2 className="a-section__title">Submitted posts</h2>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>Awaiting review</span>
              </div>
              {submitted.length === 0 ? (
                <div className="a-empty">Nothing submitted right now.</div>
              ) : (
                submitted.map((p) => (
                  <div key={p.id} className="a-draft-card">
                    <div className="a-draft-card__body">
                      <div className="a-draft-card__title">{p.title}</div>
                      <div className="a-draft-card__meta">Submitted {fmt(p.updated_at)} · awaiting Shriparna's review</div>
                    </div>
                    <span className="a-badge a-badge--terracotta">Under review</span>
                  </div>
                ))
              )}
            </div>

            {/* Published */}
            <div className="a-section">
              <div className="a-section__head">
                <h2 className="a-section__title">Published</h2>
              </div>
              {published.length === 0 ? (
                <div className="a-empty">Your first published piece will appear here.</div>
              ) : (
                published.map((p) => (
                  <div key={p.id} className="a-draft-card">
                    <div className="a-draft-card__body">
                      <div className="a-draft-card__title">{p.title}</div>
                      <div className="a-draft-card__meta">Published {fmt(p.published_at)}</div>
                    </div>
                    <span className="a-badge a-badge--sage">Published</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Guidelines sidebar */}
          <aside className="a-guidelines-card">
            <h3 className="a-guidelines-card__title">Writer's notes</h3>
            <ul className="a-guidelines-card__list">
              <li>Keep it honest, keep it human.</li>
              <li>400–1200 words works best.</li>
              <li>One idea, explored fully.</li>
              <li>Submit when it feels right — not perfect.</li>
            </ul>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 8 }}>
              Questions? <a href="mailto:shriparnasharma2008@gmail.com" style={{ color: "var(--terracotta)" }}>Reach Shriparna →</a>
            </div>
          </aside>
        </div>
      </div>
    </WriterShell>
  );
}
