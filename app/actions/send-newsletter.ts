"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { sendEmail } from "./send-email";

export async function sendNewsletter(opts: {
  subject: string;
  body: string;
  latestPost?: { title: string; excerpt: string | null; slug: string } | null;
}): Promise<{ ok: boolean; sent: number; error?: string }> {
  const admin = createAdminClient();

  const { data: subs, error } = await admin
    .from("subscribers")
    .select("email")
    .eq("confirmed", true);

  if (error) return { ok: false, sent: 0, error: error.message };
  if (!subs || subs.length === 0) return { ok: false, sent: 0, error: "No confirmed subscribers." };

  const postBlock = opts.latestPost
    ? `
      <div style="margin-top:24px;padding:16px;background:#f5f0e8;border-radius:8px;">
        <p style="font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#888;margin:0 0 6px;">Featured this week</p>
        <p style="font-size:16px;font-weight:600;margin:0 0 4px;color:#1a1a1a;">${opts.latestPost.title}</p>
        ${opts.latestPost.excerpt ? `<p style="font-size:13px;color:#666;font-style:italic;margin:0 0 10px;">${opts.latestPost.excerpt}</p>` : ""}
        <a href="https://thesundayscript.blog/blog/${opts.latestPost.slug}" style="font-size:13px;color:#c0603a;">Read the essay →</a>
      </div>`
    : "";

  const html = `
    <div style="max-width:560px;margin:0 auto;font-family:Georgia,serif;color:#1a1a1a;padding:32px 16px;">
      <p style="font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#888;margin-bottom:24px;">The Sunday Script</p>
      <div style="font-size:16px;line-height:1.75;white-space:pre-wrap;">${opts.body.replace(/\n/g, "<br>")}</div>
      ${postBlock}
      <hr style="margin:32px 0;border:none;border-top:1px solid #e5e0d8;" />
      <p style="font-size:11px;color:#aaa;">You're receiving this because you subscribed at thesundayscript.blog.</p>
    </div>`;

  const result = await sendEmail({
    to: subs.map((s) => s.email),
    subject: opts.subject,
    html,
  });

  if (!result.ok) return { ok: false, sent: 0, error: result.error };
  return { ok: true, sent: subs.length };
}
