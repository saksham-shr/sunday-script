"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle2, Clock, UserCheck, Loader2 } from "lucide-react";
import { submitCollaboration } from "@/app/actions/collaborate";

type CollaborateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ResultState = "idle" | "success" | "pending_exists" | "already_approved";

export default function CollaborateModal({
  isOpen,
  onClose,
}: CollaborateModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(false);
  const [resultState, setResultState] = useState<ResultState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Close on Escape key + lock body scroll
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setName("");
        setEmail("");
        setPhone("");
        setReason("");
        setResultState("idle");
        setErrorMsg("");
        setLoading(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMsg("");

    const result = await submitCollaboration({ name, email, phone, reason });

    if (result.status === "success") {
      setResultState("success");
    } else if (result.status === "pending_exists") {
      setResultState("pending_exists");
    } else if (result.status === "already_approved") {
      setResultState("already_approved");
    } else {
      setErrorMsg(result.message);
    }

    setLoading(false);
  }

  if (!isOpen) return null;

  // Helper: pick the right icon, title, and message for each result state
  const getResultContent = () => {
    switch (resultState) {
      case "success":
        return {
          Icon: CheckCircle2,
          title: "Thanks for your interest",
          message:
            "We've received your request. On approval, you'll receive an email with access to publish on The Sunday Script.",
        };
      case "pending_exists":
        return {
          Icon: Clock,
          title: "Already in review",
          message:
            "We've already received a request from this email. Sit tight — we'll get back to you soon.",
        };
      case "already_approved":
        return {
          Icon: UserCheck,
          title: "You're already in",
          message:
            "This email is already an approved collaborator. Check your inbox for your access details.",
        };
      default:
        return null;
    }
  };

  const resultContent = getResultContent();

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-surface rounded-2xl shadow-2xl p-8 md:p-10 max-h-[90vh] overflow-y-auto"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
        >
          <X className="w-5 h-5 text-on-surface-variant" />
        </button>

        {resultContent ? (
          /* ---------- RESULT VIEW (success / pending / approved) ---------- */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary-fixed/30 flex items-center justify-center">
              <resultContent.Icon
                className="w-8 h-8 text-primary"
                strokeWidth={1.5}
              />
            </div>
            <h2 className="text-3xl font-headline italic text-on-surface">
              {resultContent.title}
            </h2>
            <p className="text-on-surface-variant font-body leading-relaxed max-w-sm mx-auto">
              {resultContent.message}
            </p>
            <button
              onClick={onClose}
              className="mt-4 bg-primary text-on-primary px-8 py-3 rounded-xl font-label text-sm uppercase tracking-widest hover:bg-primary-container transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          /* ---------- FORM VIEW ---------- */
          <>
            <div className="mb-6">
              <p className="font-label uppercase tracking-widest text-xs text-on-surface-variant mb-2">
                Join the circle
              </p>
              <h2 className="text-3xl font-headline italic text-on-surface">
                Collaborate with us
              </h2>
              <p className="mt-3 text-on-surface-variant font-body text-sm">
                Tell us about yourself and why you&apos;d like to contribute.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-label uppercase tracking-widest text-xs text-on-surface-variant mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  placeholder="Your full name"
                  className="w-full bg-surface-container-lowest rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-60"
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
                  disabled={loading}
                  placeholder="you@example.com"
                  className="w-full bg-surface-container-lowest rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block font-label uppercase tracking-widest text-xs text-on-surface-variant mb-2">
                  Phone{" "}
                  <span className="normal-case text-on-surface-variant/60">
                    (optional)
                  </span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                  placeholder="+91 98765 43210"
                  className="w-full bg-surface-container-lowest rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block font-label uppercase tracking-widest text-xs text-on-surface-variant mb-2">
                  Why do you want to join?
                </label>
                <textarea
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={loading}
                  rows={4}
                  placeholder="Share what you'd like to write about..."
                  className="w-full bg-surface-container-lowest rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none disabled:opacity-60"
                />
              </div>

              {errorMsg && (
                <p className="text-sm text-red-600 font-body">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-4 rounded-xl font-label text-sm uppercase tracking-widest hover:bg-primary-container transition-colors disabled:opacity-80 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
