"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function PublicHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "#projects" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      {/* Import Google Material Symbols */}
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
            />

            <header
              className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                isScrolled
                  ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 py-3"
                  : "bg-transparent py-5"
              }`}
            >
              <div className="max-w-7xl mx-auto px-5 md:px-8">
                <div className="flex justify-between items-center">
                  {/* Logo */}
                  <Link href="/" className="group flex items-center gap-3">
        <div className="relative">
          <Image
            src="/logo-terbaru-1.png"
            alt="AbayyyDev"
            width={50}
            height={50}
            className="object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tight">
            <span className="text-slate-800">Abayyy</span>
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Dev
            </span>
          </span>

          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[3px]">
            Full Stack Developer
          </span>
        </div>
      </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 bg-white/80 backdrop-blur-md px-8 py-3 rounded-full border border-slate-100 shadow-sm">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="relative group font-bold text-sm text-slate-600 hover:text-blue-600 transition-colors duration-300"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-full group-hover:left-0 transition-all duration-300 rounded-full"></span>
                </a>
              ))}
            </nav>

            {/* Placeholder untuk menyeimbangkan flex-between di Desktop (Karena tombol admin dihapus) */}
            <div className="hidden md:block w-32">
                <a href="#contact" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center justify-end gap-1 group">
                    Let's Talk 
                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
                </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-50 text-slate-600 border border-slate-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-2xl">
                {isMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl shadow-2xl border-t border-slate-100 animate-slideDown">
            <div className="px-5 py-6">
              <div className="flex flex-col gap-2">
                {menuItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="py-3.5 px-5 rounded-2xl text-slate-700 font-bold text-sm hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100 flex items-center justify-between group"
                  >
                    {item.name}
                    <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
                  </a>
                ))}
              </div>

              {/* Mobile Social Links */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">Connect with me</p>
                <div className="flex justify-center gap-4">
                  {[
                    { name: "GitHub", icon: "code_blocks" },
                    { name: "LinkedIn", icon: "work_history" },
                    { name: "Email", icon: "alternate_email" }
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.name === "Email" ? "#contact" : "#"}
                      className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 hover:shadow-md transition-all group"
                      title={social.name}
                    >
                      <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                        {social.icon}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Spacer agar konten tidak tertutup fixed header */}
      <div className="h-20"></div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}