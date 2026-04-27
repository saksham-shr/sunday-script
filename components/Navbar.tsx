"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import CollaborateModal from "./CollaborateModal";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Essays" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between border-b"
        style={{
          padding: "0 clamp(1.25rem,4vw,3rem)",
          background: "rgba(249,244,238,0.93)",
          backdropFilter: "blur(14px)",
          borderColor: "rgba(215,194,188,0.45)",
        }}
      >
        <Link
          href="/"
          className="font-headline italic text-xl text-on-surface"
        >
          The Sunday Script
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="font-label font-medium uppercase transition-colors"
                style={{
                  fontSize: "0.68rem",
                  letterSpacing: "0.14em",
                  color: isActive ? "var(--color-primary)" : "var(--color-on-surface-variant)",
                  borderBottom: `1.5px solid ${isActive ? "var(--color-primary)" : "transparent"}`,
                  paddingBottom: 2,
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {/* Collaborate — desktop only */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="hidden md:block bg-primary text-on-primary rounded-full font-label font-medium uppercase transition-colors hover:bg-primary-container"
            style={{ fontSize: "0.68rem", letterSpacing: "0.12em", padding: "0.5rem 1.25rem" }}
          >
            Collaborate
          </button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-on-surface"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/35 z-[60] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className="fixed top-0 right-0 h-full bg-surface z-[70] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden"
        style={{
          width: 280,
          transform: isMobileMenuOpen ? "translateX(0)" : "translateX(100%)",
          transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant">
          <span className="font-headline italic text-lg text-on-surface">Menu</span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 text-on-surface-variant"
            aria-label="Close menu"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-4 py-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-[0.85rem] rounded-lg font-label font-medium uppercase transition-colors"
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  color: isActive ? "var(--color-primary)" : "var(--color-on-surface-variant)",
                  background: isActive ? "#f0e6e3" : "transparent",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-6 py-6 border-t border-outline-variant">
          <button
            onClick={() => { setIsMobileMenuOpen(false); setIsModalOpen(true); }}
            className="w-full bg-primary text-on-primary rounded-full font-label font-medium uppercase hover:bg-primary-container transition-colors"
            style={{ fontSize: "0.75rem", letterSpacing: "0.12em", padding: "0.85rem" }}
          >
            Collaborate
          </button>
        </div>
      </div>

      <CollaborateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
