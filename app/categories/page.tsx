import Link from "next/link";
import { BookOpen, Leaf, Coffee, Brush, Feather, Sparkles, type LucideIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Icon map — same pattern as your CategoryCard
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
    <main className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <p className="font-label uppercase tracking-widest text-sm text-on-surface-variant mb-3">
          The Library
        </p>
        <h1 className="text-4xl md:text-6xl font-headline italic text-on-surface mb-6">
          Browse by Category
        </h1>
        <p className="text-lg text-on-surface-variant font-body leading-relaxed">
          Each category is a doorway into a different kind of thought. Pick one
          and wander.
        </p>
      </div>

      {/* Empty state */}
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 bg-surface-container-low rounded-xl border border-dashed border-outline-variant">
          <BookOpen className="w-16 h-16 text-on-surface-variant mb-4" strokeWidth={1.5} />
          <h2 className="text-3xl font-headline italic tracking-tight mb-3">
            The library is being curated
          </h2>
          <p className="text-on-surface-variant font-body text-center max-w-md">
            Categories will appear here once they&apos;re added from the admin
            panel.
          </p>
        </div>
      ) : (
        /* Category grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat, index) => {
            const Icon = iconMap[cat.icon] ?? BookOpen;
            const isPink = index % 2 === 0;
            const bgColor = isPink ? "bg-[#F3E8E6]" : "bg-[#E3E8E3]";
            const iconColor = isPink ? "text-primary" : "text-secondary-container";

            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className={`group relative ${bgColor} rounded-2xl p-8 md:p-10 min-h-[280px] flex flex-col justify-between hover:scale-[1.02] hover:shadow-xl transition-all duration-500`}
              >
                <div className="flex justify-between items-start">
                  <Icon
                    className={`w-10 h-10 ${iconColor}`}
                    strokeWidth={1.5}
                  />
                  <span className="font-label uppercase tracking-widest text-xs text-on-surface-variant">
                    {cat.count} {cat.count === 1 ? "Essay" : "Essays"}
                  </span>
                </div>

                <div>
                  <h2 className="text-3xl font-headline tracking-tight mb-2">
                    {cat.name}
                  </h2>
                  {cat.description && (
                    <p className="text-sm text-on-surface-variant font-body italic line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                  <span className="inline-block mt-4 font-label uppercase tracking-widest text-xs text-primary group-hover:underline">
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
