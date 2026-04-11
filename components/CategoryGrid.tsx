"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import CategoryCard from "./CategoryCard";

type Category = {
  name: string;
  count: number;
  icon: string;
};

type CategoryGridProps = {
  categories: Category[];
};

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    duration: 20,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const showArrows = categories.length > 4;

  return (
    <section className="py-20 px-6 md:px-12 lg:px-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="font-label uppercase tracking-widest text-sm text-on-surface-variant mb-2">
              The Library
            </p>
            <h2 className="text-4xl md:text-5xl font-headline tracking-tight">
              Explore by Category
            </h2>
          </div>
        </div>

        {/* EMPTY STATE */}
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 bg-surface rounded-lg border border-dashed border-outline-variant">
            <BookOpen className="w-12 h-12 text-on-surface-variant mb-4" strokeWidth={1.5} />
            <h3 className="text-2xl font-headline tracking-tight mb-2">
              The library is being curated
            </h3>
            <p className="text-on-surface-variant font-body text-center max-w-md">
              Categories will appear here once they&apos;re added from the admin panel.
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-6">
                {categories.map((category, index) => (
                  <div
                    key={category.name}
                    className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] min-w-0"
                  >
                    <CategoryCard
                      name={category.name}
                      count={category.count}
                      icon={category.icon}
                      variant={index % 2 === 0 ? "pink" : "sage"}
                    />
                  </div>
                ))}
              </div>
            </div>

            {showArrows && (
              <>
                <button
                  onClick={scrollPrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-surface shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={scrollNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-surface shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Next"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
