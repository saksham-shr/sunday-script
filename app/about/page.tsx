import Image from "next/image";
import { Compass, Music, PenLine } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="pt-32 px-6 lg:px-12 max-w-[1600px] mx-auto">

      {/* ====== HERO ====== */}
      <section className="flex flex-col lg:flex-row items-center gap-12 mb-24">

        {/* LEFT: Intro */}
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-5xl lg:text-7xl font-headline italic text-primary leading-tight">
            Hello, I&rsquo;m<br />Shriparna.
          </h1>
          <p className="text-lg text-on-surface-variant font-body max-w-md">
            A collector of stories, quiet mornings, and good coffee.
          </p>
        </div>

        {/* RIGHT: Portrait */}
        <div className="lg:w-1/2 relative">
          <div className="absolute -top-6 -left-6 w-full h-full bg-primary-fixed/40 rounded-xl"></div>
          <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl h-[550px]">
            <Image
              src="/about.png"
              alt="Shriparna"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

      </section>

      {/* ====== BIO ====== */}
      <section className="bg-surface-container-low rounded-xl p-12 lg:p-24 mb-24">
        <div className="max-w-3xl mx-auto space-y-6 font-body text-on-surface-variant leading-relaxed">
          <p>
            <span className="float-left font-headline text-7xl leading-none mr-3 mt-2 text-primary">
              W
            </span>
            ords have always been my way of navigating the world. From the dusty
            shelves of my grandmother&rsquo;s library to the bustling literary circles
            of Paris, my journey has been one of constant discovery. I believe
            that every life is a collection of essays, some messy and unedited,
            others polished and profound.
          </p>
          <p>
            In these digital pages, I seek to bridge the gap between classic
            literature and modern living. It is a space for those who find solace
            in the scent of old paper but embrace the fluidity of contemporary
            thought. We explore the intersection of life&rsquo;s simple pleasures—a
            perfectly brewed tea, the golden hour light—and the complex
            narratives that define our humanity.
          </p>
          <p>
            When I&rsquo;m not writing, you&rsquo;ll likely find me wandering through
            independent bookstores or tending to my overgrown rose garden. This
            blog is my sanctuary, and I am honored that you&rsquo;ve chosen to spend a
            small part of your day here with me.
          </p>
          <p className="text-right font-accent text-3xl text-primary pt-6">
            Shriparna
          </p>
        </div>
      </section>

      {/* ====== CURRENT OBSESSIONS ====== */}
      <section className="mb-24">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl font-headline italic">Current Obsessions</h2>
          <div className="w-16 h-px bg-outline-variant mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Obsession 1: Exploring */}
          <div className="bg-[#E3E8E3] rounded-lg p-8 flex flex-col items-center text-center space-y-4 hover:scale-[1.02] transition-transform duration-500">
            <div className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center">
              <Compass className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
              Current Curiosity
            </span>
            <h3 className="font-headline italic text-2xl">Exploring Random Topics</h3>
            <p className="text-sm text-on-surface-variant font-body leading-relaxed">
              Falling down rabbit holes — from forgotten philosophies to obscure history.
            </p>
          </div>

          {/* Obsession 2: Lyrics */}
          <div className="bg-[#F3E8E6] rounded-lg p-8 flex flex-col items-center text-center space-y-4 hover:scale-[1.02] transition-transform duration-500">
            <div className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center">
              <Music className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
              On Repeat
            </span>
            <h3 className="font-headline italic text-2xl">Lyric Analysis</h3>
            <p className="text-sm text-on-surface-variant font-body leading-relaxed">
              Decoding the poetry hidden in songs and the stories they quietly tell.
            </p>
          </div>

          {/* Obsession 3: Writing */}
          <div className="bg-[#E3E8E3] rounded-lg p-8 flex flex-col items-center text-center space-y-4 hover:scale-[1.02] transition-transform duration-500">
            <div className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center">
              <PenLine className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
              The Craft
            </span>
            <h3 className="font-headline italic text-2xl">Writing</h3>
            <p className="text-sm text-on-surface-variant font-body leading-relaxed">
              Shaping thoughts into sentences — the slow, patient art of finding the right words.
            </p>
          </div>

        </div>
      </section>

      {/* ====== GUEST POST CTA ====== */}
      <section className="bg-primary-fixed/40 rounded-xl p-12 lg:p-24 mb-32 text-center">
        <h2 className="text-3xl lg:text-5xl font-headline italic text-on-surface mb-8">
          Have a story to share? Let&rsquo;s write together.
        </h2>
        <button className="bg-primary text-on-primary px-8 py-4 rounded-full font-label text-sm uppercase tracking-widest hover:bg-primary-container transition-colors shadow-lg">
          Pitch a Guest Post
        </button>
      </section>

    </main>
  );
}
