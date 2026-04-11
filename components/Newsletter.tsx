"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { subscribeToNewsletter } from "@/app/actions/newsletter";

type Status = "idle" | "loading" | "success" | "already" | "error";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Guard: don't fire while a request is in flight
    if (status === "loading") return;

    // Guard: don't re-fire after success/already
    if (status === "success" || status === "already") return;

    setStatus("loading");
    setErrorMessage("");

    const result = await subscribeToNewsletter(email);

    if (result.status === "success") {
      setStatus("success");
      setEmail("");
    } else if (result.status === "already") {
      setStatus("already");
    } else {
      setStatus("error");
      setErrorMessage(result.message);
    }
  }

  // Button label + icon change based on status
  const buttonContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Joining...
          </>
        );
      case "success":
        return (
          <>
            <CheckCircle2 className="w-4 h-4" />
            Subscribed
          </>
        );
      case "already":
        return (
          <>
            <Mail className="w-4 h-4" />
            Already Subscribed
          </>
        );
      default:
        return "Join the Circle";
    }
  };

  const isLocked =
    status === "loading" || status === "success" || status === "already";

  return (
    <section className="relative overflow-hidden bg-surface-container-low rounded-xl p-12 lg:p-24 mb-32 flex flex-col items-center text-center">
      {/* Decorative blur blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed opacity-20 blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-container opacity-20 blur-3xl -ml-32 -mb-32"></div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl space-y-8">
        <span className="font-label text-sm font-bold uppercase tracking-widest text-on-surface-variant">
          Weekly Muse
        </span>

        <h2 className="text-4xl lg:text-5xl font-headline italic">
          A Sunday morning invitation.
        </h2>

        <p className="text-on-surface-variant font-body italic">
          Receive our most thoughtful essays and book recommendations directly
          in your inbox every Sunday morning.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 w-full"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLocked}
            placeholder="Enter your email address"
            className="flex-grow bg-surface-container-lowest border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 focus:outline-none placeholder:font-label placeholder:text-on-surface-variant text-sm disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isLocked}
            className="flex items-center justify-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-xl font-label text-sm uppercase tracking-widest hover:bg-primary-container transition-colors shadow-lg whitespace-nowrap disabled:opacity-80 disabled:cursor-not-allowed"
          >
            {buttonContent()}
          </button>
        </form>

        {/* Error message */}
        {status === "error" && (
          <p className="text-sm text-red-600 font-body">{errorMessage}</p>
        )}

        {/* Success message */}
        {status === "success" && (
          <p className="text-sm text-primary font-body italic">
            Welcome to the circle. Check your inbox on Sunday. ✨
          </p>
        )}

        {/* Already subscribed message */}
        {status === "already" && (
          <p className="text-sm text-on-surface-variant font-body italic">
            You&apos;re already part of the circle. See you Sunday.
          </p>
        )}
      </div>
    </section>
  );
}
