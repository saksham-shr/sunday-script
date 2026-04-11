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
  phone: string;
  reason: string;
}): Promise<CollaborateResult> {
  // 1. Normalize + validate
  const name = data.name.trim();
  const email = data.email.trim().toLowerCase();
  const phone = data.phone.trim();
  const reason = data.reason.trim();

  if (name.length < 2) {
    return { status: "error", message: "Please enter your full name." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { status: "error", message: "Please enter a valid email." };
  }

  if (reason.length < 20) {
    return {
      status: "error",
      message: "Tell us a bit more — at least 20 characters.",
    };
  }

  // 2. Check if this email already has a request
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

  // 3. Branch based on existing status
  if (existing) {
    if (existing.status === "pending") {
      return { status: "pending_exists" };
    }
    if (existing.status === "approved") {
      return { status: "already_approved" };
    }
    // If rejected → fall through and allow re-application
  }

  // 4. Insert (new applicant OR previously rejected)
  const { error: insertError } = await supabase.from("collaborators").insert({
    name,
    email,
    phone: phone || null,
    reason,
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
