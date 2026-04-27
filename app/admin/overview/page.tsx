"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminShell from "@/app/admin/_components/AdminShell";
import { ToastProvider } from "@/app/admin/_components/Toast";

type Stats = {
  published: number;
  pending_review: number;
  collaborators: number;
  guest_unread: number;
  pending_comments: number;
  pending_collabs: number;
};

type ActivityRow = {
  type: string;
  text: string;
  time: string;
  href?: string;
};

const ICON: Record<string, string> = {
  publish: "✓", submit: "◇", guest: "✉", request: "○", comment: "❝", subscribe: "◊"
};

export default function AdminOverviewPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<ActivityRow[]>([]);
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  useEffect(() => {
    async function load() {
      const [
        { count: published },
        { count: review },
        { count: collabs },
        { count: guestUnread },
        { count: pendingComments },
        { count: pendingCollabs },
      ] = await Promise.all([
        supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "review"),
        supabase.from("collaborators").select("*", { count: "exact", head: true }).eq("status", "approved"),
        supabase.from("guest_posts").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("comments").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("collaborators").select("*", { count: "exact", head: true }).eq("status", "pending"),
      ]);

      setStats({
        published: published ?? 0,
        pending_review: review ?? 0,
        collaborators: collabs ?? 0,
        guest_unread: guestUnread ?? 0,
        pending_comments: pendingComments ?? 0,
        pending_collabs: pendingCollabs ?? 0,
      });

      // Build activity from recent DB events
      const acts: ActivityRow[] = [];

      const { data: recentPosts } = await supabase
        .from("posts")
        .select("title, status, updated_at")
        .order("updated_at", { ascending: false })
        .limit(3);

      recentPosts?.forEach((p) => {
        if (p.status === "published") {
          acts.push({ type: "publish", text: `Published <strong>${p.title}</strong>`, time: fmt(p.updated_at), href: "/admin/posts" });
        } else if (p.status === "review") {
          acts.push({ type: "submit", text: `<strong>${p.title}</strong> is awaiting review`, time: fmt(p.updated_at), href: "/admin/review" });
        }
      });

      const { data: recentGuests } = await supabase
        .from("guest_posts")
        .select("title, author_name, created_at")
        .order("created_at", { ascending: false })
        .limit(2);

      recentGuests?.forEach((g) => {
        acts.push({ type: "guest", text: `New guest submission: <strong>${g.title}</strong> by ${g.author_name}`, time: fmt(g.created_at), href: "/admin/guests" });
      });

      const { data: recentCollabs } = await supabase
        .from("collaborators")
        .select("name, created_at")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(2);

      recentCollabs?.forEach((c) => {
        acts.push({ type: "request", text: `Collaborator request from <strong>${c.name}</strong>`, time: fmt(c.created_at), href: "/admin/collaborators" });
      });

      const { data: recentComments } = await supabase
        .from("comments")
        .select("author_name, created_at")
        .order("created_at", { ascending: false })
        .limit(2);

      recentComments?.forEach((c) => {
        acts.push({ type: "comment", text: `<strong>${c.author_name}</strong> left a reflection`, time: fmt(c.created_at), href: "/admin/reflections" });
      });

      acts.sort((a, b) => 0); // keep insertion order (already roughly time-sorted)
      setActivity(acts.slice(0, 8));
    }
    load();
  }, []);

  function fmt(iso: string) {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  const badges = {
    review: stats?.pending_review ?? 0,
    guests: stats?.guest_unread ?? 0,
    collaborators: stats?.pending_collabs ?? 0,
    reflections: stats?.pending_comments ?? 0,
  };

  return (
    <ToastProvider>
      <AdminShell badges={badges}>
        <div className="a-content__inner">
          <div className="a-page-head">
            <div>
              <div className="a-page-head__eyebrow">{today}</div>
              <h1 className="a-page-head__title">Good morning, Shriparna.</h1>
              <div className="a-page-head__sub">
                {(stats?.pending_review ?? 0) > 0
                  ? `${stats!.pending_review} piece${stats!.pending_review !== 1 ? "s" : ""} waiting for review.`
                  : "Everything is up to date."}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="a-stats">
            {[
              { label: "Posts published", value: stats?.published, sub: "All time", accent: false },
              { label: "Pending review", value: stats?.pending_review, sub: "From collaborators", accent: true },
              { label: "Active collaborators", value: stats?.collaborators, sub: stats ? ((stats.pending_collabs > 0) ? `${stats.pending_collabs} pending request${stats.pending_collabs !== 1 ? "s" : ""}` : "No pending requests") : null, accent: false },
              { label: "Guest submissions", value: stats?.guest_unread, sub: "Pending in inbox", accent: false },
            ].map(({ label, value, sub, accent }) => (
              <div key={label} className={`a-stat ${accent ? "a-stat--accent" : ""}`}>
                <div className="a-stat__label">{label}</div>
                {value == null
                  ? <div className="a-skeleton" style={{ height: 36, width: 56, marginTop: 10, marginBottom: 6 }} />
                  : <div className="a-stat__value">{value}</div>
                }
                <div className="a-stat__sub">{sub ?? <span className="a-skeleton" style={{ height: 12, width: 100, display: "block" }} />}</div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div style={{ display: "flex", gap: 12, marginBottom: 36 }}>
            <button className="a-btn a-btn--ghost" onClick={() => router.push("/admin/posts/new")}>
              ✎ Write new post
            </button>
            {(stats?.pending_review ?? 0) > 0 && (
              <button className="a-btn a-btn--primary" onClick={() => router.push("/admin/review")}>
                Review queue ({stats!.pending_review}) →
              </button>
            )}
          </div>

          {/* Activity */}
          <div className="a-section">
            <div className="a-section__head">
              <h2 className="a-section__title">Recent activity</h2>
            </div>
            <div className="a-activity">
              {activity.length === 0 && (
                <div style={{ padding: "20px 22px", color: "var(--muted)", fontStyle: "italic" }}>
                  No recent activity yet.
                </div>
              )}
              {activity.map((row, i) => {
                const cls =
                  row.type === "publish" ? "a-activity__icon--sage" :
                  row.type === "submit" || row.type === "guest" ? "a-activity__icon--accent" : "";
                return (
                  <div key={i} className="a-activity__row">
                    <div className={`a-activity__icon ${cls}`}>{ICON[row.type] ?? "·"}</div>
                    <div className="a-activity__text" dangerouslySetInnerHTML={{ __html: row.text }} />
                    <span className="a-activity__time">{row.time}</span>
                    {row.href && (
                      <button
                        style={{ fontSize: 12, color: "var(--terracotta)", marginLeft: 14 }}
                        onClick={() => router.push(row.href!)}
                      >
                        Open →
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </AdminShell>
    </ToastProvider>
  );
}
