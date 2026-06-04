import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    // Tambahkan suppressHydrationWarning di sini
    <html lang="en" suppressHydrationWarning>
      {/* Tambahkan juga di body untuk berjaga-jaga */}
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}