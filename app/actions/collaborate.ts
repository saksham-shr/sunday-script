"use server";

import { supabase } from "@/lib/supabase";

export type CollaborateResult =
  | { status: "success" }
  | { status: "pending_exists" }
  | { status: "already_approved" }
  | { status: "error"; message: string };

export async function submitCollaboration(data: {
  name: string;
  email: string;
  phone?: string;
  reason: string;
}): Promise<CollaborateResult> {
  const name = data.name.trim();
  const email = data.email.trim().toLowerCase();
  const message = data.reason.trim();

  if (name.length < 2) {
    return { status: "error", message: "Please enter your full name." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { status: "error", message: "Please enter a valid email." };
  }

  if (message.length < 20) {
    return {
      status: "error",
      message: "Tell us a bit more — at least 20 characters.",
    };
  }

  const { data: existing, error: fetchError } = await supabase
    .from("collaborators")
    .select("status")
    .eq("email", email)
    .maybeSingle();

  if (fetchError) {
    console.error("Collaborate fetch error:", fetchError);
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  if (existing) {
    if (existing.status === "pending") return { status: "pending_exists" };
    if (existing.status === "approved") return { status: "already_approved" };
    // rejected → allow re-application, fall through
  }

  const { error: insertError } = await supabase.from("collaborators").insert({
    name,
    email,
    message,
    status: "pending",
  });

  if (insertError) {
    console.error("Collaborate insert error:", insertError);
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  return { status: "success" };
}
