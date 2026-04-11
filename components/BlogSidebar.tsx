"use client";

import { useState, useSyncExternalStore } from "react";
import { Heart, Share2, MessageCircle, Check } from "lucide-react";
import { likePost, unlikePost } from "@/app/actions/likes";

type BlogSidebarProps = {
  postId: string;
  postTitle: string;
  initialLikes: number;
  commentCount: number;
};

const LIKED_POSTS_KEY = "sunday-script-liked-posts";

/* -------------------------------------------------------------
   External store for liked posts.
   Lives at module scope — survives component re-mounts,
   and gives React 19 a proper subscribe/snapshot pair.
------------------------------------------------------------- */
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function notify() {
  listeners.forEach((l) => l());
}

function getLikedPosts(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(LIKED_POSTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setLikedPersisted(postId: string, liked: boolean) {
  const current = getLikedPosts();
  const next = liked
    ? [...new Set([...current, postId])]
    : current.filter((id) => id !== postId);
  try {
    localStorage.setItem(LIKED_POSTS_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  notify();
}

/* -------------------------------------------------------------
   X (formerly Twitter) logo — lucide removed it, so we inline it
------------------------------------------------------------- */
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function BlogSidebar({
  postId,
  postTitle,
  initialLikes,
  commentCount,
}: BlogSidebarProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isPending, setIsPending] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // React 19-compliant way to read liked state from localStorage
  const isLiked = useSyncExternalStore(
    subscribe,
    () => getLikedPosts().includes(postId),
    () => false // server snapshot — always "not liked" during SSR
  );

  const handleLike = async () => {
    if (isPending) return;
    setIsPending(true);

    const wasLiked = isLiked;
    const previousLikes = likes;
    const optimisticLikes = wasLiked ? likes - 1 : likes + 1;

    // Optimistic UI: update immediately
    setLikes(optimisticLikes);
    setLikedPersisted(postId, !wasLiked);

    const result = wasLiked
      ? await unlikePost(postId)
      : await likePost(postId);

    if (result.success) {
      setLikes(result.count);
    } else {
      // Roll back on failure
      setLikes(previousLikes);
      setLikedPersisted(postId, wasLiked);
    }

    setIsPending(false);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch {
      console.error("Clipboard API not available");
    }
  };

  const handleTwitter = () => {
    const url = window.location.href;
    const text = `"${postTitle}" — on The Sunday Script`;
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}`;
    window.open(intent, "_blank", "noopener,noreferrer");
  };

  const scrollToComments = () => {
    document
      .getElementById("comments")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const iconBtn =
    "w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors";

  return (
    <aside className="hidden lg:flex sticky top-32 self-start flex-col items-center gap-2 py-4">
      {/* Like */}
      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          onClick={handleLike}
          disabled={isPending}
          aria-label={isLiked ? "Unlike" : "Like"}
          className={`${iconBtn} ${
            isLiked ? "text-primary hover:text-primary" : ""
          } disabled:opacity-50`}
        >
          <Heart
            className={`w-5 h-5 transition-transform ${
              isLiked ? "fill-primary scale-110" : ""
            }`}
            strokeWidth={1.75}
          />
        </button>
        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
          {likes}
        </span>
      </div>

      {/* Share */}
      <div className="relative">
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share"
          className={iconBtn}
        >
          <Share2 className="w-5 h-5" strokeWidth={1.75} />
        </button>

        {showToast && (
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-on-surface text-surface px-3 py-1.5 rounded-full font-label uppercase tracking-widest text-[10px] whitespace-nowrap shadow-lg animate-in fade-in slide-in-from-left-2 duration-200">
            <Check className="w-3 h-3" />
            Link Copied
          </div>
        )}
      </div>

      {/* Comments */}
      <button
        type="button"
        onClick={scrollToComments}
        aria-label="Comments"
        className={`${iconBtn} relative`}
      >
        <MessageCircle className="w-5 h-5" strokeWidth={1.75} />
        {commentCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center">
            {commentCount}
          </span>
        )}
      </button>

      {/* X / Twitter */}
      <button
        type="button"
        onClick={handleTwitter}
        aria-label="Share on X"
        className={iconBtn}
      >
        <XIcon className="w-4 h-4" />
      </button>
    </aside>
  );
}
