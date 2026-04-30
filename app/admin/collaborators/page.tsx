"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import AdminShell from "@/app/admin/_components/AdminShell";
import { ToastProvider, useToast } from "@/app/admin/_components/Toast";
import { approveCollaborator } from "@/app/actions/approve-collaborator";

type Collaborator = {
  id: string;
  name: string;
  email: string;
  message: string | null;
  status: string;
  created_at: string;
};

function CollaboratorsContent() {
  const toast = useToast();
  const [tab, setTab] = useState<"pending" | "approved">("pending");
  const [pending, setPending] = useState<Collaborator[]>([]);
  const [approved, setApproved] = useState<Collaborator[]>([]);
  const [declineOpen, setDeclineOpen] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("collaborators").select("*").eq("status", "pending").order("created_at", { ascending: false }),
      supabase.from("collaborators").select("*").eq("status", "approved").order("created_at", { ascending: false }),
    ]).then(([{ data: p }, { data: a }]) => {
      setPending((p as Collaborator[]) ?? []);
      setApproved((a as Collaborator[]) ?? []);
      setLoading(false);
    });
  }, []);

  async function approve(c: Collaborator) {
    toast(`Approving ${c.name}…`);
    const result = await approveCollaborator(c.id, c.name, c.email);
    if (!result.ok) {
      toast(`Failed: ${result.error}`);
      return;
    }
    setPending((prev) => prev.filter((x) => x.id !== c.id));
    setApproved((prev) => [{ ...c, status: "approved" }, ...prev]);
    toast(`${c.name} approved — welcome email sent.`, "success");
  }

  async function decline(c: Collaborator) {
    await supabase.from("collaborators").update({ status: "rejected" }).eq("id", c.id);
    setPending((prev) => prev.filter((x) => x.id !== c.id));
    toast("Decline sent.");
    setDeclineOpen((d) => ({ ...d, [c.id]: false }));
  }

  async function remove(c: Collaborator) {
    await supabase.from("collaborators").update({ status: "rejected" }).eq("id", c.id);
    setApproved((prev) => prev.filter((x) => x.id !== c.id));
    toast(`${c.name} removed.`);
  }

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return (
    <div className="a-content__inner">
      <div className="a-page-head">
        <div>
          <div className="a-page-head__eyebrow">People</div>
          <h1 className="a-page-head__title">Collaborators</h1>
          <div className="a-page-head__sub">Everyone who writes alongside you, and everyone hoping to.</div>
        </div>
      </div>

      <div className="a-tabs">
        <button className={`a-tab-btn ${tab === "pending" ? "active" : ""}`} onClick={() => setTab("pending")}>
          Pending requests <span style={{ fontFamily: "var(--a-mono)", fontSize: 11, marginLeft: 4 }}>({pending.length})</span>
        </button>
        <button className={`a-tab-btn ${tab === "approved" ? "active" : ""}`} onClick={() => setTab("approved")}>
          Approved <span style={{ fontFamily: "var(--a-mono)", fontSize: 11, marginLeft: 4 }}>({approved.length})</span>
        </button>
      </div>

      {loading && <div style={{ color: "var(--muted)", fontStyle: "italic" }}>Loading…</div>}

      {tab === "pending" && !loading && (
        <>
          {pending.length === 0 && <div className="a-empty">No pending requests.</div>}
          {pending.map((c) => (
            <div key={c.id} className="a-letter">
              <div className="a-letter__head">
                <div className="a-letter__avatar">{c.name[0]}</div>
                <div style={{ flex: 1 }}>
                  <h3 className="a-letter__name">{c.name}</h3>
                  <div className="a-letter__contact">{c.email}</div>
                </div>
                <div className="a-letter__date">Received · {fmtDate(c.created_at)}</div>
              </div>
              {c.message && (
                <div className="a-letter__row">
                  <div className="a-letter__row-label">Why Sunday Script</div>
                  <div className="a-letter__row-body a-letter__row-body--quote">"{c.message}"</div>
                </div>
              )}
              <div className="a-letter__actions">
                <button className="a-btn a-btn--success" onClick={() => approve(c)}>✓ Approve</button>
                <button className="a-btn a-btn--danger" onClick={() => setDeclineOpen((d) => ({ ...d, [c.id]: !d[c.id] }))}>
                  {declineOpen[c.id] ? "Cancel" : "Decline"}
                </button>
              </div>
              {declineOpen[c.id] && (
                <div style={{ marginTop: 12 }}>
                  <button className="a-btn a-btn--danger a-btn--sm" onClick={() => decline(c)}>
                    Confirm decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {tab === "approved" && !loading && (
        <>
          {approved.length === 0 && <div className="a-empty">No approved collaborators yet.</div>}
          {approved.length > 0 && (
            <>
              <div style={{ padding: "10px 16px", marginBottom: 16, background: "var(--cream-deep)", borderRadius: "var(--a-radius)", fontSize: 12, color: "var(--muted)", fontFamily: "var(--a-mono)" }}>
                Approved collaborators sign in with their email + password at <strong style={{ color: "var(--ink)" }}>/collaborator/login</strong>. A temporary password is emailed on approval.
              </div>
              <div className="a-tbl-wrap">
                <table className="a-tbl">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Joined</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approved.map((c) => (
                      <tr key={c.id}>
                        <td className="a-tbl__title">{c.name}</td>
                        <td style={{ color: "var(--muted)" }}>{c.email}</td>
                        <td style={{ fontFamily: "var(--a-mono)", fontSize: 12, color: "var(--muted)" }}>{fmtDate(c.created_at)}</td>
                        <td style={{ textAlign: "right" }}>
                          <button className="a-tbl__action a-tbl__action--danger" onClick={() => remove(c)}>Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default function AdminCollaboratorsPage() {
  return (
    <ToastProvider>
      <AdminShell>
        <CollaboratorsContent />
      </AdminShell>
    </ToastProvider>
  );
}
