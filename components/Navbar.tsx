import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 rounded-full px-8 py-3 bg-surface/80 backdrop-blur-[12px] flex justify-between items-center shadow-sm">

      {/* Logo */}
      <Link href="/" className="text-2xl font-headline font-bold text-on-surface">
        The Sunday Script
      </Link>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        <Link href="/" className="font-label text-xs uppercase tracking-widest text-primary border-b-2 border-primary-fixed hover:text-primary-container transition-colors">
          Home
        </Link>
        <Link href="/about" className="font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">
          About
        </Link>
        <Link href="/categories" className="font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">
          Categories
        </Link>
      </div>

      {/* Collaborator Button */}
      <button className="bg-primary text-on-primary px-6 py-2 rounded-full font-label text-sm uppercase tracking-widest hover:bg-primary-container transition-colors">
        Be a Collaborator
      </button>

    </nav>
  );
}
