import Image from "next/image";
import { Compass, Music, PenLine } from "lucide-react";
import Link from "next/link";

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
      ords have always been my escape. Whether it is through reading,
      listening to music, or analysing the lyrics and metaphors of songs,
      I found a love for language and its ability to transcend normal
      speech.
    </p>
    <p>
      I write whenever my mind becomes too full, and there seems to be
      nowhere else left to put these thoughts except for the blank page
      in front of me or the Google Doc on my computer screen. For some
      reason, the pages of paper and the screen of my computer seem to
      listen to me better than anyone else ever does.
    </p>
    <p>
      Most of my interests lie within the grey area—the analysis of
      lyrics, searching for deeper meaning within lines of poetry, and
      holding onto lyrics that seem to speak to me personally. As such,
      my blog reflects that—I am someone who loves to read, write, and
      think about whatever comes to my mind.
    </p>
    <p>
      Outside of that, you will most likely find me daydreaming, binging
      random variety shows, and romanticizing life too much after
      watching a good rom-com.
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
        <Link
          href="/guest-post"
          className="inline-block bg-primary text-on-primary px-8 py-4 rounded-full font-label text-sm uppercase tracking-widest hover:bg-primary-container transition-colors shadow-lg"
        >
          Pitch a Guest Post
        </Link>
      </section>

    </main>
  );
}
