"use client";

import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const NAV = [
  { key: "overview", label: "Overview", icon: "◐", href: "/admin/overview" },
  { key: "posts", label: "Posts", icon: "❒", href: "/admin/posts" },
  { key: "review", label: "Review queue", icon: "◇", href: "/admin/review" },
  { key: "collaborators", label: "Collaborators", icon: "○", href: "/admin/collaborators" },
  { key: "guests", label: "Guest inbox", icon: "✉", href: "/admin/guests" },
  { key: "reflections", label: "Reflections", icon: "❝", href: "/admin/reflections" },
  { key: "newsletter", label: "Newsletter", icon: "◊", href: "/admin/newsletter" },
  { key: "settings", label: "Settings", icon: "✦", href: "/admin/settings" },
];

type BadgeCounts = Partial<Record<string, number>>;

export default function AdminShell({
  children,
  badges = {},
}: {
  children: React.ReactNode;
  badges?: BadgeCounts;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const activeKey = NAV.find((n) => pathname.startsWith(n.href))?.key ?? "";

  return (
    <div className="a-shell">
      {/* Sidebar */}
      <aside className="a-sidebar">
        <div className="a-sidebar__brand">
          <div className="a-sidebar__brand-mark">The Sunday Script</div>
          <div className="a-sidebar__brand-sub">Back-office</div>
        </div>

        <nav className="a-sidebar__nav">
          {NAV.map((item) => {
            const count = badges[item.key] ?? 0;
            return (
              <button
                key={item.key}
                className={`a-nav-item ${activeKey === item.key ? "active" : ""}`}
                onClick={() => router.push(item.href)}
              >
                <span className="a-nav-item__icon">{item.icon}</span>
                <span>{item.label}</span>
                {count > 0 && (
                  <span className="a-nav-item__badge">{count}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="a-sidebar__user">
          <div className="a-sidebar__avatar">S</div>
          <div>
            <div className="a-sidebar__user-name">Shriparna</div>
            <div className="a-sidebar__user-role">Admin</div>
          </div>
          <button className="a-sidebar__logout" onClick={handleLogout} title="Logout">
            ↪
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="a-content">{children}</main>
    </div>
  );
}
