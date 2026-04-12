import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <main className="pt-24 md:pt-32 pb-24 px-4 md:px-6 max-w-2xl mx-auto text-center">
      <BookOpen className="w-14 h-14 md:w-20 md:h-20 text-on-surface-variant mx-auto mb-5 md:mb-6" strokeWidth={1.5} />
      <p className="font-label uppercase tracking-widest text-sm text-on-surface-variant mb-2 md:mb-3">
        404
      </p>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline italic text-on-surface mb-4 md:mb-6">
        Lost in the stacks
      </h1>
      <p className="text-base md:text-lg text-on-surface-variant font-body leading-relaxed mb-8 md:mb-10">
        The page you were looking for seems to have wandered off the shelf.
      </p>
      <Link
        href="/"
        className="inline-block bg-primary text-on-primary px-6 md:px-8 py-3 md:py-4 rounded-full font-label text-sm uppercase tracking-widest hover:bg-primary-container transition-colors shadow-lg"
      >
        Return Home
      </Link>
    </main>
  );
}
