import Image from "next/image";

export default function Hero() {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 mb-16 md:mb-24 lg:mb-32">

      {/* LEFT: Text content */}
      <div className="w-full lg:w-3/5 space-y-4 md:space-y-6 text-center lg:text-left">

        <span className="font-accent text-xl sm:text-2xl text-primary block">
          Curated by Shriparna
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl leading-tight font-headline italic text-on-surface">
          Stories of Life,{" "}
          <span className="text-primary-container">Pages of Literature</span>
        </h1>

        <p className="text-base sm:text-lg xl:text-xl text-on-surface-variant max-w-md mx-auto lg:mx-0 font-body font-light leading-relaxed">
          A digital sanctuary where we explore the intersections of human
          experience and the written word. Find solace in every sentence.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
          <button className="w-full sm:w-auto bg-primary text-on-primary px-6 md:px-8 py-3 md:py-4 rounded-xl font-label text-xs md:text-sm uppercase tracking-widest hover:bg-primary-container transition-colors shadow-lg">
            Start Reading
          </button>
          <a href="#" className="text-primary font-headline italic text-base md:text-lg border-b-2 border-primary-fixed hover:text-primary-container transition-colors">
            The Manifesto →
          </a>
        </div>
      </div>

      {/* RIGHT: Image + Marginalia Quote */}
      <div className="w-full lg:w-2/5 relative mt-8 lg:mt-0">

        {/* Soft glow blob */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary-fixed/30 rounded-full blur-3xl"></div>

        {/* Image container — responsive heights */}
        <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px]">
          <Image
            src="/coffee-books.png"
            alt="Coffee and Books"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Marginalia Quote — only on medium+ screens */}
        <div className="absolute -bottom-6 -left-4 md:-bottom-8 md:-left-8 lg:-left-16 bg-surface-container-lowest p-5 md:p-8 rounded-lg shadow-sm border-l-4 border-primary-fixed max-w-[220px] md:max-w-xs hidden md:block z-20">
          <p className="font-accent text-base md:text-xl text-on-surface leading-tight">
            &ldquo;Literature is the safe and traditional way of being alive in someone else&rsquo;s head.&rdquo;
          </p>
        </div>

      </div>

    </section>
  );
}
