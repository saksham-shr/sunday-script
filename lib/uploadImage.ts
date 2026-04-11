import { supabase } from "./supabase";

export async function uploadImageToStorage(file: File): Promise<string | null> {
  // Build a unique filename — timestamp + random + safe name
  const ext = file.name.split(".").pop();
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  // Upload
  const { error } = await supabase.storage
    .from("guest-post-images")
    .upload(safeName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload failed:", error);
    return null;
  }

  // Get public URL
  const { data } = supabase.storage
    .from("guest-post-images")
    .getPublicUrl(safeName);

  return data.publicUrl;
}
