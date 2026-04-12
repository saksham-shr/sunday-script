import Link from "next/link";
import Image from "next/image";

type PostCardProps = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  coverImage: string;
};

export default function PostCard({
  slug,
  title,
  excerpt,
  category,
  author,
  date,
  coverImage,
}: PostCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="group block bg-surface-container-lowest rounded-lg overflow-hidden border border-primary-fixed shadow-sm hover:shadow-xl transition-shadow duration-500"
    >
      {/* Cover Image */}
      <div className="relative h-36 md:h-44 overflow-hidden">
        <Image
          src={coverImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 space-y-3">
        {/* Category Badge */}
        <span className="inline-block bg-primary-fixed/50 text-primary px-3 py-1 rounded-full text-[10px] font-label font-bold uppercase tracking-widest">
          {category}
        </span>

        {/* Title */}
        <h3 className="text-lg md:text-xl lg:text-2xl font-headline leading-snug group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-on-surface-variant font-body text-sm leading-relaxed line-clamp-2 md:line-clamp-3">
          {excerpt}
        </p>

        {/* Footer: Author + Date */}
        <div className="pt-2 md:pt-4 flex items-center justify-between">
          <span className="font-headline italic text-sm text-primary">
            By {author}
          </span>
          <span className="font-label text-[10px] text-on-surface-variant">
            {date}
          </span>
        </div>
      </div>
    </Link>
  );
}
