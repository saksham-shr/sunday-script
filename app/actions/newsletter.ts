"use server";

import { supabase } from "@/lib/supabase";

export type SubscribeResult =
  | { status: "success" }
  | { status: "already" }
  | { status: "error"; message: string };

export async function subscribeToNewsletter(
  email: string
): Promise<SubscribeResult> {
  // 1. Basic server-side validation (never trust the client)
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    return { status: "error", message: "Please enter a valid email." };
  }

  // 2. Try to insert. If the email exists, the UNIQUE constraint throws.
  const { error } = await supabase
    .from("subscribers")
    .insert({ email: trimmed, confirmed: true });

  if (error) {
    // Postgres error code 23505 = unique_violation
    if (error.code === "23505") {
      return { status: "already" };
    }
    return { status: "error", message: "Something went wrong. Try again." };
  }

  return { status: "success" };
}
