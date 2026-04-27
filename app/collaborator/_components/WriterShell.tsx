"use client";

import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const NAV = [
  { key: "portal", label: "My dashboard", icon: "◐", href: "/collaborator/portal" },
  { key: "write", label: "Write a piece", icon: "✎", href: "/collaborator/write" },
];

export default function WriterShell({
  children,
  writerName,
  writerInitial = "W",
}: {
  children: React.ReactNode;
  writerName: string;
  writerInitial?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/collaborator/login");
  }

  const activeKey = NAV.find((n) => pathname.startsWith(n.href))?.key ?? "";

  return (
    <div className="a-shell">
      <aside className="a-sidebar">
        <div className="a-sidebar__brand">
          <div className="a-sidebar__brand-mark">The Sunday Script</div>
          <div className="a-sidebar__brand-sub">Writer portal</div>
        </div>

        <nav className="a-sidebar__nav">
          {NAV.map((item) => (
            <button
              key={item.key}
              className={`a-nav-item ${activeKey === item.key ? "active" : ""}`}
              onClick={() => router.push(item.href)}
            >
              <span className="a-nav-item__icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="a-sidebar__user">
          <div className="a-sidebar__avatar" style={{ background: "var(--sage)" }}>
            {writerInitial}
          </div>
          <div>
            <div className="a-sidebar__user-name">{writerName}</div>
            <div className="a-sidebar__user-role">Collaborator</div>
          </div>
          <button className="a-sidebar__logout" onClick={handleLogout} title="Sign out">
            ↪
          </button>
        </div>
      </aside>

      <main className="a-content">{children}</main>
    </div>
  );
}
