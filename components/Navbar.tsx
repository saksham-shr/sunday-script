"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import CollaborateModal from "./CollaborateModal";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/categories", label: "Categories" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 rounded-full px-4 md:px-8 py-3 bg-surface/80 backdrop-blur-[12px] flex justify-between items-center shadow-sm">
        <Link
          href="/"
          className="text-lg md:text-2xl font-headline font-bold text-on-surface whitespace-nowrap"
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
          {/* Buy Me A Chai Button */}
          <a
            href="https://buymeachai.ezee.li/thesundayscript"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Image
              src="https://buymeachai.ezee.li/assets/images/buymeachai-button.png"
              alt="Buy Me A Chai"
              width={200}
              height={56}
              className="h-8 md:h-10 w-auto transition-transform hover:scale-105 active:scale-95"
            />
          </a>

          {/* Collaborate Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-on-primary px-3 py-1.5 md:px-6 md:py-2 rounded-full font-label text-[10px] md:text-sm uppercase tracking-widest hover:bg-primary-container transition-colors whitespace-nowrap"
          >
            Collaborate
          </button>
        </div>
      </nav>

      <CollaborateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}