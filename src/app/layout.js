import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import VisitorTracker from '@/components/VisitorTracker';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata = {
  title: "AbayyyDev - Portfolio",
  description: "Web Developer Portfolio",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <VisitorTracker />
        {children}
        
        {/* 2. Letakkan komponen Analytics di bagian paling bawah dalam body */}
        <Analytics />
      </body>
    </html>
  );
}