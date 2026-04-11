"use server";

import { supabase } from "@/lib/supabase";

export type CommentResult =
  | { status: "success" }
  | { status: "error"; message: string };

export async function submitComment(data: {
  postId: string;
  name: string;
  email: string;
  content: string;
}): Promise<CommentResult> {
  const name = data.name.trim();
  const email = data.email.trim().toLowerCase();
  const content = data.content.trim();

  if (name.length < 2) {
    return { status: "error", message: "Please enter your name." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { status: "error", message: "Please enter a valid email." };
  }

  if (content.length < 5) {
    return { status: "error", message: "Your reflection is a bit too short." };
  }

  if (content.length > 2000) {
    return {
      status: "error",
      message: "Please keep reflections under 2000 characters.",
    };
  }

  const { error } = await supabase.from("comments").insert({
    post_id: data.postId,
    author_name: name,
    author_email: email,
    content,
    status: "pending",
  });

  if (error) {
    console.error("Comment insert error:", error);
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  return { status: "success" };
}
