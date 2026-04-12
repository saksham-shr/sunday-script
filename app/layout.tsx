import type { Metadata } from "next";
import { Noto_Serif, Inter, Caveat, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BASE_URL = "https://thesundayscript.blog";

const notoSerif = Noto_Serif({
  variable: "--font-headline",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-accent",
  subsets: ["latin"],
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-label",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "The Sunday Script | Stories of Life, Pages of Literature",
    template: "%s | The Sunday Script",
  },
  description:
    "A digital sanctuary where we explore the intersections of human experience and the written word. Find solace in every sentence.",
  keywords: [
    "literature",
    "essays",
    "creative writing",
    "book recommendations",
    "poetry",
    "storytelling",
    "Sunday Script",
    "Shriparna",
    "lyric analysis",
    "slow living",
  ],
  authors: [{ name: "Shriparna", url: `${BASE_URL}/about` }],
  creator: "Shriparna",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "The Sunday Script",
    title: "The Sunday Script | Stories of Life, Pages of Literature",
    description:
      "A digital sanctuary where we explore the intersections of human experience and the written word.",
    images: [
      {
        url: "/coffee-books.png",
        width: 1200,
        height: 630,
        alt: "The Sunday Script — Stories of Life, Pages of Literature",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Sunday Script | Stories of Life, Pages of Literature",
    description:
      "A digital sanctuary where we explore the intersections of human experience and the written word.",
    site: "@ShriparnaSharma",
    creator: "@ShriparnaSharma",
    images: ["/coffee-books.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "The Sunday Script",
  url: BASE_URL,
  description:
    "A digital sanctuary where we explore the intersections of human experience and the written word.",
  author: {
    "@type": "Person",
    name: "Shriparna",
    url: `${BASE_URL}/about`,
    sameAs: ["https://x.com/ShriparnaSharma"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${notoSerif.variable} ${inter.variable} ${caveat.variable} ${beVietnamPro.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-surface text-on-surface">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
