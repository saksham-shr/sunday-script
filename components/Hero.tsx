import Image from "next/image";

export default function Hero() {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-32">

      {/* LEFT: Text content */}
      <div className="lg:w-1/2 space-y-6">
        <span className="font-accent text-2xl text-primary">
          Curated by Shrimpy
        </span>

        <h1 className="text-5xl lg:text-7xl leading-tight font-headline italic text-on-surface">
          Stories of Life, <br />
          <span className="text-primary-container">Pages of Literature</span>
        </h1>

        <p className="text-lg lg:text-xl text-on-surface-variant max-w-md font-body font-light leading-relaxed">
          A digital sanctuary where we explore the intersections of human
          experience and the written word. Find solace in every sentence.
        </p>

        <div className="pt-4 flex items-center gap-6">
          <button className="bg-primary text-on-primary px-8 py-4 rounded-xl font-label text-sm uppercase tracking-widest hover:bg-primary-container transition-colors shadow-lg">
            Start Reading
          </button>
          <a href="#" className="text-primary font-headline italic text-lg border-b-2 border-primary-fixed hover:text-primary-container transition-colors">
            The Manifesto →
          </a>
        </div>
      </div>

      {/* RIGHT: Image + Marginalia Quote */}
      <div className="lg:w-1/2 relative">

        {/* Soft glow blob */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary-fixed/30 rounded-full blur-3xl"></div>

        {/* Image container */}
        <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl h-[500px]">
          <Image
            src="/coffee-books.png"
            alt="Coffee and Books"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Marginalia Quote */}
        <div className="absolute -bottom-8 -left-8 lg:-left-16 bg-surface-container-lowest p-8 rounded-lg shadow-sm border-l-4 border-primary-fixed max-w-xs hidden md:block z-20">
          <p className="font-accent text-xl text-on-surface leading-tight">
            "Literature is the safe and traditional way of being alive in someone else's head."
          </p>
        </div>

      </div>

    </section>
  );
}
