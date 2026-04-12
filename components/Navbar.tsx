"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import CollaborateModal from "./CollaborateModal";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/categories", label: "Categories" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 rounded-full px-4 md:px-8 py-3 bg-surface/80 backdrop-blur-[12px] flex justify-between items-center shadow-sm">
        <Link
          href="/"
          className="text-base md:text-2xl font-headline font-bold text-on-surface whitespace-nowrap"
        >
          The Sunday Script
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-label text-xs uppercase tracking-widest transition-colors ${
                  isActive
                    ? "text-primary border-b-2 border-primary-fixed"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Action Buttons Container */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Buy Me A Chai Button — hidden on very small screens */}
          <a
            href="https://buymeachai.ezee.li/thesundayscript"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block shrink-0"
          >
            <Image
              src="https://buymeachai.ezee.li/assets/images/buymeachai-button.png"
              alt="Buy Me A Chai"
              width={200}
              height={56}
              className="h-8 md:h-10 w-auto transition-transform hover:scale-105 active:scale-95"
            />
          </a>

          {/* Collaborate Button — desktop only */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="hidden md:block bg-primary text-on-primary px-6 py-2 rounded-full font-label text-sm uppercase tracking-widest hover:bg-primary-container transition-colors whitespace-nowrap"
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

      {/* Mobile Side Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[60] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Side Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 max-w-[80vw] bg-surface z-[70] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant">
          <span className="font-headline font-bold text-lg text-on-surface">
            The Sunday Script
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 text-on-surface-variant hover:text-on-surface"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 px-4 py-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-label text-sm uppercase tracking-widest px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "text-primary bg-primary-fixed/20"
                    : "text-on-surface-variant hover:text-primary hover:bg-primary-fixed/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Drawer Footer Actions */}
        <div className="mt-auto px-6 py-6 border-t border-outline-variant flex flex-col gap-4">
          <a
            href="https://buymeachai.ezee.li/thesundayscript"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center"
          >
            <Image
              src="https://buymeachai.ezee.li/assets/images/buymeachai-button.png"
              alt="Buy Me A Chai"
              width={200}
              height={56}
              className="h-10 w-auto"
            />
          </a>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsModalOpen(true);
            }}
            className="w-full bg-primary text-on-primary px-6 py-3 rounded-full font-label text-sm uppercase tracking-widest hover:bg-primary-container transition-colors"
          >
            Collaborate
          </button>
        </div>
      </div>

      <CollaborateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
