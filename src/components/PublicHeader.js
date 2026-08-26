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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

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
            ? "bg-[#0a0a0f]/80 backdrop-blur-2xl border-b border-white/[0.06] py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-white/15 bg-white flex items-center justify-center transition-all duration-300 group-hover:border-violet-400/50 group-hover:shadow-[0_0_24px_rgba(139,92,246,0.25)]">
                <Image
                  src="/logo-terbaru-1.png"
                  alt="AbayyyDev"
                  width={44}
                  height={44}
                  className="object-contain p-0.5 transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight leading-tight">
                  <span className="text-white">Abayyy</span>
                  <span className="gradient-text">Dev</span>
                </span>
                <span className="text-[9px] text-white/30 font-semibold uppercase tracking-[3px]">
                  Fullstack Dev
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] backdrop-blur-xl px-2 py-1.5 rounded-full border border-white/[0.06]">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="relative px-5 py-2.5 font-medium text-sm text-white/60 hover:text-white rounded-full hover:bg-white/[0.06] transition-all duration-300 group"
                >
                  {item.name}
                  <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-violet-500 to-cyan-400 group-hover:w-4 transition-all duration-300 rounded-full"></span>
                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold text-sm rounded-full hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>Let&apos;s Talk</span>
                <span className="material-symbols-outlined text-base group-hover:translate-x-0.5 transition-transform">
                  arrow_right_alt
                </span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden relative w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.08] hover:border-violet-500/30 transition-all"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-xl">
                {isMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`md:hidden fixed inset-0 top-[60px] bg-[#0a0a0f]/95 backdrop-blur-2xl transition-all duration-400 ${
            isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="px-6 py-8 h-full flex flex-col">
            <div className="flex flex-col gap-2">
              {menuItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="py-4 px-6 rounded-2xl text-white/80 font-medium text-lg hover:bg-white/[0.05] hover:text-white transition-all border border-transparent hover:border-white/[0.06] flex items-center justify-between group"
                  style={{ transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms' }}
                >
                  <span>{item.name}</span>
                  <span className="material-symbols-outlined text-sm text-white/20 group-hover:text-violet-400 group-hover:translate-x-1 transition-all">
                    chevron_right
                  </span>
                </a>
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="mt-auto pb-8">
              <a
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
                className="w-full py-4 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20"
              >
                <span className="material-symbols-outlined text-xl">chat</span>
                Get In Touch
              </a>

              {/* Mobile Social Links */}
              <div className="mt-6 pt-6 border-t border-white/[0.06]">
                <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-4 text-center">
                  Connect with me
                </p>
                <div className="flex justify-center gap-3">
                  {[
                    { name: "GitHub", icon: "code_blocks" },
                    { name: "LinkedIn", icon: "work_history" },
                    { name: "Email", icon: "alternate_email" },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.name === "Email" ? "#contact" : "#"}
                      className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/40 hover:bg-white/[0.08] hover:text-violet-400 hover:border-violet-500/30 transition-all"
                      title={social.name}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {social.icon}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer agar konten tidak tertutup fixed header */}
      <div className="h-20"></div>
    </>
  );
}