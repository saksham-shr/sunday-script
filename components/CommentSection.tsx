"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitComment } from "@/app/actions/comments";

type Comment = {
  id: string;
  author_name: string;
  created_at: string;
  content: string;
};

type CommentSectionProps = {
  postId: string;
  comments: Comment[];
};

type FormStatus = "idle" | "loading" | "success" | "error";

export default function CommentSection({
  postId,
  comments,
}: CommentSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    const result = await submitComment({ postId, name, email, content });

    if (result.status === "success") {
      setStatus("success");
      setName("");
      setEmail("");
      setContent("");
    } else {
      setStatus("error");
      setErrorMsg(result.message);
    }
  };

  const resetForm = () => setStatus("idle");

  const formatDate = (iso: string) =>
    new Date(iso)
      .toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
      .toUpperCase();

  return (
    <section id="comments" className="mt-24 max-w-3xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <h2 className="text-3xl md:text-4xl font-headline italic text-on-surface">
          Voices from the Pages
        </h2>
        <span className="font-label uppercase tracking-widest text-xs text-on-surface-variant">
          {comments.length}{" "}
          {comments.length === 1 ? "Reflection" : "Reflections"}
        </span>
      </div>

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="mb-12 py-10 px-6 bg-surface-container-low rounded-2xl text-center border border-dashed border-outline-variant">
          <p className="font-body italic text-on-surface-variant">
            Be the first to leave a reflection.
          </p>
        </div>
      ) : (
        <div className="space-y-4 mb-12">
          {comments.map((c) => (
            <article
              key={c.id}
              className="bg-surface-container-lowest rounded-2xl p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-fixed/40 flex items-center justify-center font-headline text-primary font-bold">
                  {c.author_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-headline font-semibold text-on-surface">
                    {c.author_name}
                  </p>
                  <p className="font-label uppercase tracking-widest text-[10px] text-on-surface-variant">
                    {formatDate(c.created_at)}
                  </p>
                </div>
              </div>
              <p className="text-on-surface-variant font-body leading-relaxed whitespace-pre-wrap">
                {c.content}
              </p>
            </article>
          ))}
        </div>
      )}

      {/* Form / success message */}
      <div className="bg-surface-container-low rounded-2xl p-8 md:p-10">
        {status === "success" ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-primary-fixed/40 flex items-center justify-center">
              <CheckCircle2
                className="w-7 h-7 text-primary"
                strokeWidth={1.5}
              />
            </div>
            <h3 className="text-2xl font-headline italic text-on-surface">
              Thanks for your reflection
            </h3>
            <p className="text-on-surface-variant font-body max-w-md mx-auto">
              Your comment is awaiting review. Once approved, it will appear
              here among the other voices.
            </p>
            <button
              onClick={resetForm}
              className="mt-2 font-label uppercase tracking-widest text-xs text-primary hover:underline"
            >
              Leave another reflection
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-headline italic text-on-surface mb-6">
              Leave a reflection
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={status === "loading"}
                  placeholder="Name"
                  className="bg-surface-container-lowest rounded-full px-6 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-60"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  placeholder="Email"
                  className="bg-surface-container-lowest rounded-full px-6 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-60"
                />
              </div>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={status === "loading"}
                rows={5}
                placeholder="Share your thoughts..."
                className="w-full bg-surface-container-lowest rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none disabled:opacity-60"
              />

              {status === "error" && (
                <p className="text-sm text-red-600 font-body">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="flex items-center justify-center gap-2 bg-primary text-on-primary px-8 py-3 rounded-full font-label text-xs uppercase tracking-widest hover:bg-primary-container transition-colors shadow-lg disabled:opacity-80 disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Publish Reflection"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}


