"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
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
    slidesToScroll: 1,
    duration: 20,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="mb-32">

      {/* Title */}
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-4xl font-headline italic">Explore the Library</h2>
        <div className="w-16 h-px bg-outline-variant mx-auto"></div>
      </div>

      {/* Carousel wrapper */}
      <div className="relative">

        {/* Viewport — the "window" you see through */}
        <div className="overflow-hidden" ref={emblaRef}>

          {/* Container — the long strip of cards */}
          <div className="flex gap-8 py-12">
            {categories.map((category, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={category.name}
                  className={`flex-[0_0_100%] md:flex-[0_0_calc(50%-16px)] lg:flex-[0_0_calc(25%-24px)] ${
                    !isEven ? "lg:mt-12" : ""
                  }`}
                >
                  <CategoryCard
                    name={category.name}
                    count={category.count}
                    icon={category.icon}
                    variant={isEven ? "pink" : "sage"}
                  />
                </div>
              );
            })}
          </div>

        </div>

        {/* Navigation Arrows — only show if more than 4 */}
        {categories.length > 4 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-surface-container-lowest shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors z-10"
              aria-label="Previous"
            >
              ←
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-surface-container-lowest shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors z-10"
              aria-label="Next"
            >
              →
            </button>
          </>
        )}

      </div>

    </section>
  );
}
