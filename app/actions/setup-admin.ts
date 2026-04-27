"use server";

import { createAdminClient } from "@/lib/supabase-admin";

export type SetupResult =
  | { status: "created"; message: string }
  | { status: "updated"; message: string }
  | { status: "exists"; message: string }
  | { status: "no_key"; message: string }
  | { status: "error"; message: string };

const ADMIN_EMAIL = "shriparnasharma2008@gmail.com";
const ADMIN_PASSWORD = "sharma2008shriparna";

export async function setupAdminUser(): Promise<SetupResult> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      status: "no_key",
      message: "SUPABASE_SERVICE_ROLE_KEY is not set in .env.local",
    };
  }

  try {
    const admin = createAdminClient();

    // Check if the user already exists by listing users (search by email)
    const { data: listData, error: listError } = await admin.auth.admin.listUsers();
    if (listError) throw listError;

    const existing = listData.users.find(
      (u) => u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
    );

    if (existing) {
      // User exists — update password and ensure they're confirmed
      const { error: updateError } = await admin.auth.admin.updateUserById(
        existing.id,
        {
          password: ADMIN_PASSWORD,
          email_confirm: true,
        }
      );
      if (updateError) throw updateError;
      return {
        status: "updated",
        message: `Admin account updated. Email confirmed and password set. You can now sign in at /admin/login.`,
      };
    }

    // Create new admin user, bypassing email confirmation
    const { data, error } = await admin.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
    });

    if (error) throw error;

    return {
      status: "created",
      message: `Admin account created (${data.user.email}). You can now sign in at /admin/login.`,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { status: "error", message };
  }
}
