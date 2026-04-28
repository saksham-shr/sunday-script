"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";
import AdminShell from "@/app/admin/_components/AdminShell";
import { ToastProvider, useToast } from "@/app/admin/_components/Toast";

type Category = { id: string; name: string; slug: string; description: string | null; icon: string | null };

const ACCENT_COLORS = ["#C4622D", "#3B6D3B", "#B8860B", "#7A6691"];
const ICON_OPTIONS = ["book", "leaf", "coffee", "brush", "feather", "sparkles"];

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

function SettingsContent() {
  const toast = useToast();
  const [tab, setTab] = useState<"categories" | "account">("categories");

  // Categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCat, setNewCat] = useState({ name: "", description: "", icon: "book" });
  const [catsLoading, setCatsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ name: "", description: "", icon: "book" });

  // Account
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  useEffect(() => {
    supabase.from("categories").select("id, name, slug, description, icon").order("name").then(({ data }) => {
      setCategories((data as Category[]) ?? []);
      setCatsLoading(false);
    });
  }, []);

  async function addCategory() {
    if (!newCat.name.trim()) { toast("Please enter a category name."); return; }
    const slug = slugify(newCat.name);
    const { data, error } = await supabase.from("categories").insert({
      name: newCat.name.trim(),
      slug,
      description: newCat.description.trim() || null,
      icon: newCat.icon,
    }).select().single();
    if (error) { toast("Failed: " + (error.message.includes("unique") ? "slug already exists." : error.message)); return; }
    setCategories((prev) => [...prev, data as Category].sort((a, b) => a.name.localeCompare(b.name)));
    setNewCat({ name: "", description: "", icon: "book" });
    toast("Category added.", "success");
  }

  async function saveEdit(id: string) {
    const slug = slugify(editValues.name);
    const { error } = await supabase.from("categories").update({
      name: editValues.name.trim(),
      slug,
      description: editValues.description.trim() || null,
      icon: editValues.icon,
    }).eq("id", id);
    if (error) { toast("Failed to save."); return; }
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, name: editValues.name.trim(), slug, description: editValues.description.trim() || null, icon: editValues.icon } : c));
    setEditingId(null);
    toast("Category updated.", "success");
  }

  async function deleteCategory(id: string, name: string) {
    if (!confirm(`Delete "${name}"? Posts in this category will be uncategorised.`)) return;
    await supabase.from("post_categories").delete().eq("category_id", id);
    await supabase.from("categories").delete().eq("id", id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast(`"${name}" removed.`);
  }

  async function changePassword() {
    if (newPwd !== confirmPwd) { toast("Passwords don't match."); return; }
    if (newPwd.length < 6) { toast("Password must be at least 6 characters."); return; }
    const { error } = await supabase.auth.updateUser({ password: newPwd });
    if (error) { toast("Failed: " + error.message); return; }
    toast("Password updated.", "success");
    setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
  }

  return (
    <div className="a-content__inner">
      <div className="a-page-head">
        <div>
          <div className="a-page-head__eyebrow">Configuration</div>
          <h1 className="a-page-head__title">Settings</h1>
          <div className="a-page-head__sub">Categories, account, and site dials.</div>
        </div>
      </div>

      <div className="a-tabs">
        <button className={`a-tab-btn ${tab === "categories" ? "active" : ""}`} onClick={() => setTab("categories")}>Categories</button>
        <button className={`a-tab-btn ${tab === "account" ? "active" : ""}`} onClick={() => setTab("account")}>Account</button>
      </div>

      {/* ---- Categories ---- */}
      {tab === "categories" && (
        <div>
          <div className="a-card" style={{ padding: 0, marginBottom: 24 }}>
            {catsLoading && <div style={{ padding: "16px 18px", color: "var(--muted)", fontStyle: "italic" }}>Loading…</div>}
            {!catsLoading && categories.length === 0 && (
              <div style={{ padding: "16px 18px", color: "var(--muted)", fontStyle: "italic" }}>No categories yet.</div>
            )}
            {categories.map((c) => {
              const isEditing = editingId === c.id;
              return (
                <div key={c.id} className="a-cat-row">
                  <div className="a-cat-row__swatch" style={{ background: "#C4622D" }} />
                  {isEditing ? (
                    <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, alignItems: "center" }}>
                      <input className="a-input" value={editValues.name} onChange={(e) => setEditValues((v) => ({ ...v, name: e.target.value }))} placeholder="Name" />
                      <input className="a-input" value={editValues.description} onChange={(e) => setEditValues((v) => ({ ...v, description: e.target.value }))} placeholder="Description" />
                      <select className="a-select" style={{ width: 110 }} value={editValues.icon} onChange={(e) => setEditValues((v) => ({ ...v, icon: e.target.value }))}>
                        {ICON_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ) : (
                    <>
                      <div className="a-cat-row__name">{c.name}</div>
                      <div className="a-cat-row__desc">{c.description ?? ""}</div>
                      <div style={{ fontFamily: "var(--a-mono)", fontSize: 11, color: "var(--muted)", marginRight: 8 }}>{c.icon}</div>
                    </>
                  )}
                  {isEditing ? (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="a-btn a-btn--success a-btn--sm" onClick={() => saveEdit(c.id)}>Save</button>
                      <button className="a-btn a-btn--ghost a-btn--sm" onClick={() => setEditingId(null)}>Cancel</button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="a-tbl__action" onClick={() => { setEditingId(c.id); setEditValues({ name: c.name, description: c.description ?? "", icon: c.icon ?? "book" }); }}>Edit</button>
                      <button className="a-tbl__action a-tbl__action--danger" onClick={() => deleteCategory(c.id, c.name)}>Delete</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add category */}
          <div className="a-card">
            <div style={{ fontFamily: "var(--a-serif)", fontSize: 16, fontWeight: 500, marginBottom: 14, color: "var(--ink)" }}>
              Add a category
            </div>
            <div className="a-field">
              <label className="a-field__label">Name</label>
              <input className="a-input" value={newCat.name} onChange={(e) => setNewCat((v) => ({ ...v, name: e.target.value }))} placeholder="e.g. Field Notes" />
            </div>
            <div className="a-field">
              <label className="a-field__label">Description</label>
              <input className="a-input" value={newCat.description} onChange={(e) => setNewCat((v) => ({ ...v, description: e.target.value }))} placeholder="What fits here?" />
            </div>
            <div className="a-field">
              <label className="a-field__label">Icon</label>
              <select className="a-select" value={newCat.icon} onChange={(e) => setNewCat((v) => ({ ...v, icon: e.target.value }))}>
                {ICON_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <button className="a-btn a-btn--primary" onClick={addCategory}>Add category</button>
          </div>
        </div>
      )}

      {/* ---- Account ---- */}
      {tab === "account" && (
        <div className="a-card">
          <div style={{ fontFamily: "var(--a-serif)", fontSize: 16, fontWeight: 500, marginBottom: 14, color: "var(--ink)" }}>
            Change password
          </div>
          <div className="a-field">
            <label className="a-field__label">Current password</label>
            <input className="a-input" type="password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="a-field">
              <label className="a-field__label">New password</label>
              <input className="a-input" type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
            </div>
            <div className="a-field">
              <label className="a-field__label">Confirm new password</label>
              <input className="a-input" type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} />
            </div>
          </div>
          <button className="a-btn a-btn--primary a-btn--sm" onClick={changePassword}>Update password</button>

          <hr className="a-divider" />

          <div style={{ fontFamily: "var(--a-serif)", fontSize: 16, fontWeight: 500, marginBottom: 6, color: "var(--ink)" }}>
            Supabase auth email
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 0 }}>
            To change your login email, update it directly in your Supabase Auth dashboard.
          </p>
        </div>
      )}
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <ToastProvider>
      <AdminShell>
        <SettingsContent />
      </AdminShell>
    </ToastProvider>
  );
}
