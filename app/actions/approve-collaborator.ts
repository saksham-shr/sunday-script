"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { sendEmail } from "./send-email";

function generateTempPassword(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#";
  let pw = "";
  for (let i = 0; i < 14; i++) {
    pw += chars[Math.floor(Math.random() * chars.length)];
  }
  return pw;
}

export async function approveCollaborator(
  id: string,
  name: string,
  email: string
): Promise<{ ok: boolean; error?: string }> {
  const admin = createAdminClient();
  const tempPassword = generateTempPassword();

  // Create Supabase auth user (or update password if they already exist)
  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
  });

  if (createError) {
    // User already exists from a previous attempt — just reset their password
    if (createError.message.toLowerCase().includes("already registered") ||
        createError.message.toLowerCase().includes("already been registered")) {
      const { data: { users } } = await admin.auth.admin.listUsers();
      const existing = users.find((u) => u.email === email);
      if (existing) {
        await admin.auth.admin.updateUserById(existing.id, { password: tempPassword });
      }
    } else {
      return { ok: false, error: createError.message };
    }
  }

  // Mark collaborator as approved
  const { error: updateError } = await admin
    .from("collaborators")
    .update({ status: "approved" })
    .eq("id", id);

  if (updateError) return { ok: false, error: updateError.message };

  // Send welcome email with temporary password
  await sendEmail({
    to: email,
    subject: "You're in — welcome to The Sunday Script",
    replyTo: "shriparnasharma2008@gmail.com",
    html: `
      <div style="max-width:520px;margin:0 auto;font-family:Georgia,serif;color:#1a1a1a;padding:32px 16px;">
        <p style="font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#888;margin-bottom:24px;">The Sunday Script</p>
        <p style="font-size:16px;line-height:1.7;">Dear ${name},</p>
        <p style="font-size:16px;line-height:1.7;">
          I'm so glad to have you here. Your application stood out and I'd love to see your voice on these pages.
        </p>
        <p style="font-size:16px;line-height:1.7;">
          Here are your login details for the collaborator portal:
        </p>
        <div style="margin:24px 0;padding:20px;background:#f5f0e8;border-radius:8px;border-left:3px solid #c0603a;">
          <p style="margin:0 0 8px;font-size:13px;color:#888;font-family:monospace;letter-spacing:.08em;text-transform:uppercase;">Login URL</p>
          <p style="margin:0 0 16px;font-size:15px;"><a href="https://thesundayscript.blog/collaborator/login" style="color:#c0603a;">thesundayscript.blog/collaborator/login</a></p>
          <p style="margin:0 0 8px;font-size:13px;color:#888;font-family:monospace;letter-spacing:.08em;text-transform:uppercase;">Email</p>
          <p style="margin:0 0 16px;font-size:15px;font-family:monospace;">${email}</p>
          <p style="margin:0 0 8px;font-size:13px;color:#888;font-family:monospace;letter-spacing:.08em;text-transform:uppercase;">Temporary password</p>
          <p style="margin:0;font-size:18px;font-family:monospace;font-weight:bold;letter-spacing:.1em;">${tempPassword}</p>
        </div>
        <p style="font-size:15px;line-height:1.7;color:#666;">
          Please change your password after your first login — there's a link in your portal.
        </p>
        <p style="font-size:16px;line-height:1.7;margin-top:24px;">
          Can't wait to read what you write.<br/>
          With warmth,<br/>Shriparna
        </p>
        <hr style="margin:32px 0;border:none;border-top:1px solid #e5e0d8;" />
        <p style="font-size:11px;color:#aaa;">Reply to this email if you have any questions.</p>
      </div>`,
  });

  return { ok: true };
}
