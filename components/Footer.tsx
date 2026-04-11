import Link from "next/link";
import {  Mail, X } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full py-16 px-8 mt-24 bg-surface-container-low">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[1600px] mx-auto">

        {/* Brand */}
        <div className="space-y-6">
          <div className="text-xl font-headline font-bold text-on-surface">
            The Sunday Script
          </div>
          <p className="text-on-surface-variant font-body text-sm leading-relaxed max-w-xs">
            Celebrating the slow beauty of literature and the intricate stories
            that make us human. A sanctuary for the thoughtful mind.
          </p>
        </div>

        {/* Link Columns */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-label text-xs font-bold uppercase tracking-[0.2em] text-on-surface">
              Explore
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-on-surface-variant text-sm hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-on-surface-variant text-sm hover:text-primary transition-colors">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-label text-xs font-bold uppercase tracking-[0.2em] text-on-surface">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/manifesto" className="text-on-surface-variant text-sm hover:text-primary transition-colors">
                  Manifesto
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-on-surface-variant text-sm hover:text-primary transition-colors">
                  Privacy
                </Link>
                </li>
                <li>
                <Link href="/terms" className="text-on-surface-variant text-sm hover:text-primary transition-colors">
                  Terms of Service
                </Link>
                </li>
            </ul>
          </div>
        </div>

        {/* Socials + Copyright */}
        <div className="space-y-6 flex flex-col items-start md:items-end">
          <div className="flex gap-4">
            <a
              href="https://x.com/ShriparnaSharma"
              className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors"
              aria-label="Share"
            >
              <X className="w-4 h-4" />
            </a>
            <a
              href="mailto:shriparnasharma2008@gmail.com"
              className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
          <p className="text-on-surface-variant text-xs md:text-right font-body">
            © 2026 The Sunday Script. A digital sanctuary for life and literature.
          </p>
        </div>

      </div>
    </footer>
  );
}
