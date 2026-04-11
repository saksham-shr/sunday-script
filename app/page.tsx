import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import RecentPosts from "@/components/RecentPosts";
import Newsletter from "@/components/Newsletter";


const categories = [
  { name: "The Classics", count: 42, icon: "book" },
  { name: "Nature's Verse", count: 28, icon: "leaf" },
  { name: "Morning Rituals", count: 15, icon: "coffee" },
  { name: "Art of Living", count: 33, icon: "brush" },
  { name: "Poetry Corner", count: 19, icon: "feather" },
  { name: "Philosophy", count: 24, icon: "sparkles" },
];

const recentPosts = [
  {
    slug: "epistolary-art-of-living",
    title: "The Epistolary Art of Living",
    excerpt: "In an age of instant gratification, the slow movement of ink on paper offers a profound connection to our inner selves and those we love.",
    category: "Philosophy",
    author: "Marcus Aurelius",
    date: "June 12, 2024",
    coverImage: "/posts/letters.jpg",
  },
  {
    slug: "silence-between-words",
    title: "The Silence Between the Words",
    excerpt: "Why the most important things are often left unsaid, and how we can learn to appreciate the quiet spaces in our daily narratives.",
    category: "Minimalism",
    author: "Clara Reeves",
    date: "June 08, 2024",
    coverImage: "/posts/window.jpg",
  },
  {
    slug: "odysseys-in-paper-and-ink",
    title: "Odysseys in Paper and Ink",
    excerpt: "Tracing the maps of fictional worlds that taught us more about our own reality than any history book ever could.",
    category: "Literature",
    author: "Julian Thorne",
    date: "June 01, 2024",
    coverImage: "/posts/library.jpg",
  },
];

export default function Home() {
  return (
    <main className="pt-32 px-6 lg:px-12 max-w-[1600px] mx-auto">
      <Hero />
      <CategoryGrid categories={categories} />
      <RecentPosts posts={recentPosts} />
      <Newsletter />
      
    </main>
  );
}
