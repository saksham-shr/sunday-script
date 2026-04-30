"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitComment } from "@/app/actions/comments";

type Comment = {
  id: string;
  author_name: string;
  created_at: string;
  content: string;
  parent_id: string | null;
  is_admin_reply: boolean;
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

  // Separate top-level comments from admin replies
  const topLevel = comments.filter((c) => !c.parent_id);
  const repliesMap: Record<string, Comment[]> = {};
  comments
    .filter((c) => c.parent_id)
    .forEach((r) => {
      if (!repliesMap[r.parent_id!]) repliesMap[r.parent_id!] = [];
      repliesMap[r.parent_id!].push(r);
    });

  const topLevelCount = topLevel.length;

  return (
    <section id="comments" className="mt-12 md:mt-20 max-w-3xl mx-auto">
      <div className="flex items-end justify-between mb-6 md:mb-10">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-headline italic text-on-surface">
          Voices from the Pages
        </h2>
        <span className="font-label uppercase tracking-widest text-xs text-on-surface-variant">
          {topLevelCount}{" "}
          {topLevelCount === 1 ? "Reflection" : "Reflections"}
        </span>
      </div>

      {/* Comments list */}
      {topLevel.length === 0 ? (
        <div className="mb-8 md:mb-12 py-8 px-4 md:px-6 bg-surface-container-low rounded-2xl text-center border border-dashed border-outline-variant">
          <p className="font-body italic text-on-surface-variant">
            Be the first to leave a reflection.
          </p>
        </div>
      ) : (
        <div className="space-y-3 mb-8 md:mb-12">
          {topLevel.map((c) => {
            const replies = repliesMap[c.id] ?? [];
            return (
              <div key={c.id}>
                {/* Reader comment */}
                <article className="bg-surface-container-lowest rounded-2xl p-4 md:p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary-fixed/40 flex items-center justify-center font-headline text-primary font-bold text-sm">
                      {c.author_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-headline font-semibold text-on-surface text-sm md:text-base">
                        {c.author_name}
                      </p>
                      <p className="font-label uppercase tracking-widest text-[10px] text-on-surface-variant">
                        {formatDate(c.created_at)}
                      </p>
                    </div>
                  </div>
                  <p className="text-on-surface-variant font-body text-sm leading-relaxed whitespace-pre-wrap">
                    {c.content}
                  </p>
                </article>

                {/* Admin replies — indented below */}
                {replies.map((r) => (
                  <div key={r.id} className="ml-6 md:ml-10 mt-2">
                    <article className="bg-primary-fixed/10 border-l-2 border-primary rounded-r-2xl rounded-bl-2xl p-4 md:p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center font-headline text-on-primary font-bold text-xs">
                          S
                        </div>
                        <div>
                          <p className="font-headline font-semibold text-primary text-sm">
                            {r.author_name}
                            <span className="ml-2 font-label text-[9px] uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              Author
                            </span>
                          </p>
                          <p className="font-label uppercase tracking-widest text-[10px] text-on-surface-variant">
                            {formatDate(r.created_at)}
                          </p>
                        </div>
                      </div>
                      <p className="text-on-surface font-body text-sm leading-relaxed whitespace-pre-wrap">
                        {r.content}
                      </p>
                    </article>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Submission form */}
      <div className="bg-surface-container-low rounded-2xl p-5 md:p-8 lg:p-10">
        {status === "success" ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-primary-fixed/40 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl md:text-2xl font-headline italic text-on-surface">
              Thanks for your reflection
            </h3>
            <p className="text-on-surface-variant font-body text-sm max-w-md mx-auto">
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
            <h3 className="text-xl md:text-2xl font-headline italic text-on-surface mb-5 md:mb-6">
              Leave a reflection
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={status === "loading"}
                  placeholder="Name"
                  className="bg-surface-container-lowest rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-60"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  placeholder="Email"
                  className="bg-surface-container-lowest rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-60"
                />
              </div>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={status === "loading"}
                rows={4}
                placeholder="Share your thoughts..."
                className="w-full bg-surface-container-lowest rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none disabled:opacity-60"
              />

              {status === "error" && (
                <p className="text-sm text-red-600 font-body">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="flex items-center justify-center gap-2 bg-primary text-on-primary px-6 md:px-8 py-3 rounded-full font-label text-xs uppercase tracking-widest hover:bg-primary-container transition-colors shadow-lg disabled:opacity-80 disabled:cursor-not-allowed"
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
