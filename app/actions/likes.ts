"use server";

import { supabase } from "@/lib/supabase";

export async function likePost(postId: string) {
  const { data, error } = await supabase.rpc("increment_post_likes", {
    target_post_id: postId,
  });

  if (error) {
    console.error("Like failed:", error);
    return { success: false, count: 0 };
  }

  return { success: true, count: data as number };
}

export async function unlikePost(postId: string) {
  const { data, error } = await supabase.rpc("decrement_post_likes", {
    target_post_id: postId,
  });

  if (error) {
    console.error("Unlike failed:", error);
    return { success: false, count: 0 };
  }

  return { success: true, count: data as number };
}
