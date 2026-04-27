import "@/app/admin/admin.css";
import { Playfair_Display, DM_Sans } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--admin-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--admin-sans",
  display: "swap",
});

export default function CollaboratorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`admin-root ${playfair.variable} ${dmSans.variable}`}>
      {children}
    </div>
  );
}
