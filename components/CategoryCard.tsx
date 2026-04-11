import { BookOpen, Leaf, Coffee, Brush, Feather, Sparkles, LucideIcon } from "lucide-react";

// Map icon name (string) → actual icon component
const iconMap: Record<string, LucideIcon> = {
  book: BookOpen,
  leaf: Leaf,
  coffee: Coffee,
  brush: Brush,
  feather: Feather,
  sparkles: Sparkles,
};

type CategoryCardProps = {
  name: string;
  count: number;
  icon: string;
  variant: "pink" | "sage";
};

export default function CategoryCard({ name, count, icon, variant }: CategoryCardProps) {
  // Pick colors based on variant
  const bgColor = variant === "pink" ? "bg-[#F3E8E6]" : "bg-[#E3E8E3]";
  const iconColor = variant === "pink" ? "text-primary" : "text-secondary-container";

  // Look up the icon component from the map
  const Icon = iconMap[icon] ?? BookOpen;  // fallback if icon name is wrong

  return (
    <div className={`group h-[400px] ${bgColor} rounded-lg p-8 flex flex-col justify-between items-center text-center hover:scale-[1.02] transition-transform duration-500 cursor-pointer`}>
      <Icon className={`w-10 h-10 ${iconColor}`} strokeWidth={1.5} />
      <h3 className="text-2xl font-headline tracking-tight">{name}</h3>
      <p className="text-sm font-label uppercase tracking-widest text-on-surface-variant">
        {count} Essays
      </p>
    </div>
  );
}
