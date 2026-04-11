"use client";

import { useState } from "react";
import Editor from "@/components/Editor";

export default function GuestPostPage() {
  const [content, setContent] = useState("");

  return (
    <main className="pt-32 pb-24 px-4 md:px-6 max-w-4xl mx-auto">
      <div className="mb-10 px-4 md:px-12">
        <p className="font-label uppercase tracking-widest text-sm text-on-surface-variant mb-2">
          Guest Submission
        </p>
        <h1 className="text-4xl md:text-5xl font-headline italic text-on-surface">
          Pitch a Guest Post
        </h1>
        <p className="mt-4 text-on-surface-variant font-body">
          Share your story. Drag images right into the editor, or use the + menu.
          If approved, it will be published on The Sunday Script.
        </p>
      </div>

      <Editor
        content={content}
        onChange={setContent}
        placeholder="Once upon a Sunday..."
      />
    </main>
  );
}
