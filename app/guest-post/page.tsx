"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import Editor from "@/components/Editor";
import { submitGuestPost } from "@/app/actions/guest-post";

type Status = "idle" | "loading" | "success" | "error";

export default function GuestPostPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const wordCount = content
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setErrorMsg("");

    const result = await submitGuestPost({ author_name: name, author_email: email, title, content });

    if (result.status === "success") {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg(result.message);
    }
  }

  if (status === "success") {
    return (
      <main className="pt-32 pb-24 px-4 max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary-fixed/40 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-primary" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl md:text-4xl font-headline italic text-on-surface mb-4">
          Thank you for sharing.
        </h1>
        <p className="text-on-surface-variant font-body leading-relaxed">
          Your piece is with Shriparna. If it&apos;s a fit, you&apos;ll hear back within two weeks.
        </p>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-24 px-4 md:px-6 max-w-4xl mx-auto">
      <div className="mb-10">
        <p className="font-label uppercase tracking-widest text-sm text-on-surface-variant mb-2">
          Guest Submission
        </p>
        <h1 className="text-4xl md:text-5xl font-headline italic text-on-surface">
          Pitch a Guest Post
        </h1>
        <p className="mt-4 text-on-surface-variant font-body max-w-xl">
          A one-time piece, considered with care. No account needed. If it&apos;s a fit for the blog, Shriparna will be in touch.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-label uppercase tracking-widest text-xs text-on-surface-variant mb-2">
              Your name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={status === "loading"}
              placeholder="Full name"
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-60"
            />
          </div>
          <div>
            <label className="block font-label uppercase tracking-widest text-xs text-on-surface-variant mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              placeholder="you@somewhere.com"
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-60"
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block font-label uppercase tracking-widest text-xs text-on-surface-variant mb-2">
            Title of your piece
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={status === "loading"}
            placeholder="Give it a name"
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-60"
          />
        </div>

        {/* Rich text editor */}
        <div>
          <label className="block font-label uppercase tracking-widest text-xs text-on-surface-variant mb-2">
            Your piece
          </label>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden min-h-[400px]">
            <Editor
              content={content}
              onChange={setContent}
              placeholder="Write here. Take your time."
            />
          </div>
          <p className="mt-2 text-xs text-on-surface-variant font-label">
            {wordCount} words · 400–1200 works best
          </p>
        </div>

        {status === "error" && (
          <p className="text-sm text-red-600 font-body">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="flex items-center justify-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-full font-label text-sm uppercase tracking-widest hover:bg-primary-container transition-colors shadow-lg disabled:opacity-80 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Send my piece →"
          )}
        </button>
      </form>
    </main>
  );
}
