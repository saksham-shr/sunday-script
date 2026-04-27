"use server";

import { supabase } from "@/lib/supabase";

export type GuestPostResult =
  | { status: "success" }
  | { status: "error"; message: string };

export async function submitGuestPost(data: {
  author_name: string;
  author_email: string;
  title: string;
  content: string;
  cover_image?: string;
}): Promise<GuestPostResult> {
  const author_name = data.author_name.trim();
  const author_email = data.author_email.trim().toLowerCase();
  const title = data.title.trim();
  const content = data.content.trim();

  if (author_name.length < 2)
    return { status: "error", message: "Please enter your name." };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(author_email))
    return { status: "error", message: "Please enter a valid email." };

  if (title.length < 3)
    return { status: "error", message: "Please add a title." };

  // Strip HTML tags for word count check
  const wordCount = content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  if (wordCount < 50)
    return { status: "error", message: "Your piece needs at least 50 words." };

  const { error } = await supabase.from("guest_posts").insert({
    author_name,
    author_email,
    title,
    content,
    cover_image: data.cover_image || null,
    status: "pending",
  });

  if (error) {
    console.error("Guest post insert error:", error);
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  return { status: "success" };
}
