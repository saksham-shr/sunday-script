import type { Metadata } from "next";
import Image from "next/image";
import { Compass, Music, PenLine } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Shriparna — the curator of The Sunday Script. A collector of stories, quiet mornings, and good coffee.",
  alternates: { canonical: "https://thesundayscript.blog/about" },
  openGraph: {
    type: "profile",
    url: "https://thesundayscript.blog/about",
    title: "About Shriparna | The Sunday Script",
    description:
      "Meet Shriparna — the curator of The Sunday Script. A collector of stories, quiet mornings, and good coffee.",
    images: [
      {
        url: "/image.png",
        width: 1200,
        height: 630,
        alt: "Shriparna — The Sunday Script",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Shriparna | The Sunday Script",
    description:
      "Meet Shriparna — the curator of The Sunday Script. A collector of stories, quiet mornings, and good coffee.",
    images: ["/image.png"],
  },
};

export default function AboutPage() {
  return (
    <main className="pt-24 md:pt-32 px-4 md:px-8 lg:px-12 max-w-400 mx-auto">
      {/* ====== HERO ====== */}
      <section className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center mb-16 md:mb-28 lg:mb-40 max-w-6xl mx-auto">
        <div className="space-y-4 md:space-y-6">
          <p className="font-label uppercase tracking-widest text-xs text-on-surface-variant">
            About
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-headline italic text-primary leading-[1.05]">
            Hello, I&rsquo;m<br />Shriparna.
          </h1>
          <p className="text-base lg:text-xl text-on-surface-variant font-body leading-relaxed max-w-md">
            A collector of stories, quiet mornings, and good coffee.
          </p>
        </div>

        <div className="relative w-full max-w-sm mx-auto lg:max-w-lg lg:mx-0">
          <div className="absolute inset-0 translate-x-3 translate-y-3 md:translate-x-4 md:translate-y-4 bg-primary-fixed/40 rounded-2xl"></div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] md:h-105 lg:h-130 lg:aspect-auto">
            <Image
              src="/image.png"
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
      <section className="bg-surface-container-low rounded-xl p-5 sm:p-8 md:p-12 lg:p-20 mb-12 md:mb-20">
        <div className="max-w-3xl mx-auto space-y-5 font-body text-on-surface-variant leading-relaxed text-sm md:text-base">
          <p>
            <span className="float-left font-headline text-5xl md:text-7xl leading-none mr-3 mt-1 md:mt-2 text-primary">
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
          <p className="text-right font-accent text-2xl md:text-3xl text-primary pt-4 md:pt-6">
            Shriparna
          </p>
        </div>
      </section>

      {/* ====== CURRENT OBSESSIONS ====== */}
      <section className="mb-12 md:mb-20">
        <div className="text-center mb-8 md:mb-12 space-y-3 md:space-y-4">
          <h2 className="text-3xl md:text-4xl font-headline italic">Current Obsessions</h2>
          <div className="w-16 h-px bg-outline-variant mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          <div className="bg-[#E3E8E3] rounded-lg p-5 md:p-7 flex flex-col items-center text-center space-y-3 md:space-y-4 hover:scale-[1.02] transition-transform duration-500">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface-container-lowest flex items-center justify-center">
              <Compass className="w-4 h-4 md:w-5 md:h-5 text-primary" strokeWidth={1.5} />
            </div>
            <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
              Current Curiosity
            </span>
            <h3 className="font-headline italic text-xl md:text-2xl">Exploring Random Topics</h3>
            <p className="text-sm text-on-surface-variant font-body leading-relaxed">
              Falling down rabbit holes — from forgotten philosophies to obscure history.
            </p>
          </div>

          <div className="bg-[#F3E8E6] rounded-lg p-5 md:p-7 flex flex-col items-center text-center space-y-3 md:space-y-4 hover:scale-[1.02] transition-transform duration-500">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface-container-lowest flex items-center justify-center">
              <Music className="w-4 h-4 md:w-5 md:h-5 text-primary" strokeWidth={1.5} />
            </div>
            <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
              On Repeat
            </span>
            <h3 className="font-headline italic text-xl md:text-2xl">Lyric Analysis</h3>
            <p className="text-sm text-on-surface-variant font-body leading-relaxed">
              Decoding the poetry hidden in songs and the stories they quietly tell.
            </p>
          </div>

          <div className="bg-[#E3E8E3] rounded-lg p-5 md:p-7 flex flex-col items-center text-center space-y-3 md:space-y-4 hover:scale-[1.02] transition-transform duration-500">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface-container-lowest flex items-center justify-center">
              <PenLine className="w-4 h-4 md:w-5 md:h-5 text-primary" strokeWidth={1.5} />
            </div>
            <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
              The Craft
            </span>
            <h3 className="font-headline italic text-xl md:text-2xl">Writing</h3>
            <p className="text-sm text-on-surface-variant font-body leading-relaxed">
              Shaping thoughts into sentences — the slow, patient art of finding the right words.
            </p>
          </div>
        </div>
      </section>

      {/* ====== GUEST POST CTA ====== */}
      <section className="bg-primary-fixed/40 rounded-xl p-6 md:p-14 lg:p-20 mb-16 md:mb-28 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-headline italic text-on-surface mb-6 md:mb-8">
          Have a story to share? Let&rsquo;s write together.
        </h2>
        <Link
          href="/guest-post"
          className="inline-block bg-primary text-on-primary px-6 md:px-8 py-3 md:py-4 rounded-full font-label text-sm uppercase tracking-widest hover:bg-primary-container transition-colors shadow-lg"
        >
          Pitch a Guest Post
        </Link>
      </section>
    </main>
  );
}
