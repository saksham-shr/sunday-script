"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";

export type CollaboratorPostResult =
  | { status: "success" }
  | { status: "error"; message: string };

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function calcReadTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function submitCollaboratorPost(data: {
  title: string;
  content: string;
  excerpt?: string;
  authorName: string;
  authorEmail: string;
}): Promise<CollaboratorPostResult> {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "Not authenticated." };

  // Verify the logged-in user is an approved collaborator
  const { data: collab } = await supabase
    .from("collaborators")
    .select("status, name")
    .eq("email", user.email!)
    .maybeSingle();

  if (!collab || collab.status !== "approved") {
    return { status: "error", message: "Your account is not an approved collaborator." };
  }

  const title = data.title.trim();
  const content = data.content.trim();

  if (!title) return { status: "error", message: "Title is required." };
  if (!content || content.replace(/<[^>]+>/g, "").trim().split(/\s+/).length < 50) {
    return { status: "error", message: "Your piece needs at least 50 words." };
  }

  // Generate a unique slug
  let slug = slugify(title);
  const { data: existing } = await supabase.from("posts").select("id").eq("slug", slug).maybeSingle();
  if (existing) slug = `${slug}-${Date.now()}`;

  const { error } = await supabase.from("posts").insert({
    title,
    content,
    slug,
    excerpt: data.excerpt?.trim() || null,
    author_name: collab.name || data.authorName,
    status: "review",
    word_count: content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length,
    read_time: calcReadTime(content),
  });

  if (error) {
    console.error("Collaborator post insert error:", error);
    return { status: "error", message: "Failed to submit. Please try again." };
  }

  return { status: "success" };
}
