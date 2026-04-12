import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Leaf, Coffee, Brush, Feather, Sparkles, type LucideIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Browse essays by category on The Sunday Script. From literature and poetry to life, music, and lyric analysis.",
  alternates: { canonical: "https://thesundayscript.blog/categories" },
  openGraph: {
    type: "website",
    url: "https://thesundayscript.blog/categories",
    title: "Browse Categories | The Sunday Script",
    description:
      "Browse essays by category on The Sunday Script. From literature and poetry to life, music, and lyric analysis.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Categories | The Sunday Script",
    description:
      "Browse essays by category on The Sunday Script. From literature and poetry to life, music, and lyric analysis.",
  },
};

const iconMap: Record<string, LucideIcon> = {
  book: BookOpen,
  leaf: Leaf,
  coffee: Coffee,
  brush: Brush,
  feather: Feather,
  sparkles: Sparkles,
};

type CategoryRow = {
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  post_categories: { count: number }[];
};

export default async function CategoriesPage() {
  const { data: categoriesRaw } = await supabase
    .from("categories")
    .select(`
      name,
      slug,
      icon,
      description,
      post_categories ( count )
    `)
    .order("name", { ascending: true });

  const categories = ((categoriesRaw ?? []) as unknown as CategoryRow[]).map(
    (cat) => ({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon ?? "book",
      description: cat.description ?? "",
      count: cat.post_categories?.[0]?.count ?? 0,
    })
  );

  return (
    <main className="pt-24 md:pt-32 pb-12 md:pb-24 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 md:mb-14 text-center max-w-3xl mx-auto">
        <p className="font-label uppercase tracking-widest text-sm text-on-surface-variant mb-2 md:mb-3">
          The Library
        </p>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-headline italic text-on-surface mb-4 md:mb-6">
          Browse by Category
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant font-body leading-relaxed">
          Each category is a doorway into a different kind of thought. Pick one
          and wander.
        </p>
      </div>

      {/* Empty state */}
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 md:py-24 px-6 bg-surface-container-low rounded-xl border border-dashed border-outline-variant">
          <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-on-surface-variant mb-4" strokeWidth={1.5} />
          <h2 className="text-2xl md:text-3xl font-headline italic tracking-tight mb-3">
            The library is being curated
          </h2>
          <p className="text-on-surface-variant font-body text-center max-w-md text-sm md:text-base">
            Categories will appear here once they&apos;re added from the admin
            panel.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {categories.map((cat, index) => {
            const Icon = iconMap[cat.icon] ?? BookOpen;
            const isPink = index % 2 === 0;
            const bgColor = isPink ? "bg-[#F3E8E6]" : "bg-[#E3E8E3]";
            const iconColor = isPink ? "text-primary" : "text-secondary-container";

            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className={`group relative ${bgColor} rounded-2xl p-5 md:p-7 lg:p-9 min-h-45 md:min-h-60 flex flex-col justify-between hover:scale-[1.02] hover:shadow-xl transition-all duration-500`}
              >
                <div className="flex justify-between items-start">
                  <Icon
                    className={`w-8 h-8 md:w-10 md:h-10 ${iconColor}`}
                    strokeWidth={1.5}
                  />
                  <span className="font-label uppercase tracking-widest text-xs text-on-surface-variant">
                    {cat.count} {cat.count === 1 ? "Essay" : "Essays"}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-headline tracking-tight mb-1 md:mb-2">
                    {cat.name}
                  </h2>
                  {cat.description && (
                    <p className="text-sm text-on-surface-variant font-body italic line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                  <span className="inline-block mt-3 md:mt-4 font-label uppercase tracking-widest text-xs text-primary group-hover:underline">
                    Explore →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
