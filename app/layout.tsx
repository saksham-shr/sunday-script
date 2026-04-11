import type { Metadata } from "next";
import { Noto_Serif, Inter, Caveat, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  title: "Sunday Script | Stories of Life, Pages of Literature",
  description: "A digital sanctuary where we explore the intersections of human experience and the written word.",
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
        <Navbar />
        
        {children}
        <Footer />
      </body>
    </html>
  );
}
