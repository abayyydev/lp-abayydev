import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import VisitorTracker from '@/components/VisitorTracker';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata = {
  title: "AbayyyDev — Fullstack Developer Portfolio",
  description: "Professional portfolio of AbayyyDev — Fullstack Web Developer specializing in modern web technologies, custom systems, and digital solutions.",
  keywords: "web developer, fullstack, portfolio, react, next.js, node.js",
  openGraph: {
    title: "AbayyyDev — Fullstack Developer Portfolio",
    description: "Professional portfolio showcasing modern web development projects and digital solutions.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="bg-[#0a0a0f] text-[#f0f0f5] antialiased" suppressHydrationWarning>
        <VisitorTracker />
        {children}
        
        {/* 2. Letakkan komponen Analytics di bagian paling bawah dalam body */}
        <Analytics />
      </body>
    </html>
  );
}