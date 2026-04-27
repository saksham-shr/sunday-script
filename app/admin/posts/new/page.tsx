"use client";

import { ToastProvider } from "@/app/admin/_components/Toast";
import PostEditor from "@/app/admin/_components/PostEditor";

export default function NewPostPage() {
  return (
    <ToastProvider>
      <PostEditor />
    </ToastProvider>
  );
}
