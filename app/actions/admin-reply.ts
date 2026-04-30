"use server";

import { createAdminClient } from "@/lib/supabase-admin";

export async function submitAdminReply(opts: {
  postId: string;
  parentId: string;
  content: string;
}): Promise<{ ok: boolean; error?: string }> {
  const content = opts.content.trim();
  if (!content) return { ok: false, error: "Reply cannot be empty." };

  const admin = createAdminClient();

  const { error } = await admin.from("comments").insert({
    post_id: opts.postId,
    parent_id: opts.parentId,
    author_name: "Shriparna",
    author_email: "shriparnasharma2008@gmail.com",
    content,
    status: "approved",
    is_admin_reply: true,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
