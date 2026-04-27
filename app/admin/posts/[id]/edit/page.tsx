"use client";

import { use } from "react";
import { ToastProvider } from "@/app/admin/_components/Toast";
import PostEditor from "@/app/admin/_components/PostEditor";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <ToastProvider>
      <PostEditor postId={id} />
    </ToastProvider>
  );
}
