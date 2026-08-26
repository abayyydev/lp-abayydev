"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();
  const [profile, setProfile] = useState(null);

  // Mengambil data profil dari backend khusus untuk footer
  useEffect(() => {
    axios
      .get("https://ukmelrahma.my.id/portofolio-abayyy/profile")
      .then((res) => {
        if (res.data) setProfile(res.data);
      })
      .catch((err) => console.error("Gagal mengambil data profil", err));
  }, []);

  const footerLinks = {
    "Quick Links": [
      { name: "Home", href: "/" },
      { name: "Projects", href: "#projects" },
      { name: "About", href: "#about" },
      { name: "Contact", href: "#contact" },
    ],
    Services: [
      { name: "Web Development", href: "#" },
      { name: "Mobile Apps", href: "#" },
      { name: "UI/UX Design", href: "#" },
      { name: "Consultation", href: "#" },
    ],
    Resources: [
      { name: "Blog", href: "#" },
      { name: "Case Studies", href: "#" },
      { name: "Documentation", href: "#" },
      { name: "Support", href: "#" },
    ],
  };

  // Sosial media sekarang DINAMIS mengikuti link dari database Profile
  const socialLinks = [
    { name: "GitHub", icon: "code_blocks", href: profile?.github_link || "#", hoverColor: "hover:bg-white hover:text-[#0a0a0f] hover:border-white/30" },
    { name: "LinkedIn", icon: "work_history", href: profile?.linkedin_link || "#", hoverColor: "hover:bg-blue-500 hover:text-white hover:border-blue-500/50" },
    { name: "Twitter", icon: "alternate_email", href: "#", hoverColor: "hover:bg-sky-500 hover:text-white hover:border-sky-500/50" },
    { name: "Instagram", icon: "photo_camera", href: profile?.instagram_link || "#", hoverColor: "hover:bg-pink-500 hover:text-white hover:border-pink-500/50" },
  ];

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
      />

      <footer className="relative bg-[#0a0a0f] pt-24 pb-10 overflow-hidden border-t border-white/[0.04]">
        
        {/* Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/5 rounded-full blur-[120px]"></div>
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-600/5 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
          
          {/* CTA Section */}
          <div className="relative rounded-[2rem] p-8 md:p-12 text-center mb-20 overflow-hidden border border-white/[0.08] bg-white/[0.02]">
            {/* Animated gradient border effect */}
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-violet-600/20 via-cyan-500/20 to-violet-600/20 animate-gradient-shift opacity-50" style={{ backgroundSize: '200% 200%' }}></div>
            <div className="absolute inset-[1px] rounded-[2rem] bg-[#0a0a0f]"></div>
            
            {/* Glow accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-5 tracking-tight">
                Ready to Start Your <span className="gradient-text">Project</span>?
              </h2>
              <p className="text-white/30 text-lg mb-9 max-w-2xl mx-auto font-medium leading-relaxed">
                Let&apos;s create something amazing together. I&apos;m available for new
                projects, collaborations, and tech consultations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="#contact"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold rounded-2xl hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">chat</span>
                  Get In Touch
                </a>
                
                {/* TAMPILAN EMAIL DINAMIS DARI DATABASE */}
                <a
                  href={`mailto:${profile?.email || "akbarfirdaus009@gmail.com"}`}
                  className="w-full sm:w-auto px-8 py-4 border border-white/[0.1] text-white/60 font-bold rounded-2xl hover:bg-white/[0.05] hover:border-white/20 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl">mail</span>
                  <span className="truncate max-w-[200px] sm:max-w-none text-sm">
                    {profile?.email}
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-14">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-block mb-6 group">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 bg-white rounded-xl border border-white/15 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-violet-400/50 group-hover:shadow-[0_0_24px_rgba(139,92,246,0.25)]">
                    <Image
                      src="/logo-terbaru-1.png"
                      alt="AbayyyDev Logo"
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight">
                      <span className="text-white">Abayyy</span>
                      <span className="gradient-text">Dev</span>
                    </h3>
                    <p className="text-[9px] font-semibold text-white/20 uppercase tracking-widest mt-0.5">
                      Full Stack Developer
                    </p>
                  </div>
                </div>
              </Link>
              <p className="text-white/25 mb-7 max-w-sm leading-relaxed text-sm">
                Creating digital experiences that are fast, beautiful, and
                functional. Specializing in modern web technologies and
                innovative solutions.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${social.hoverColor}`}
                    title={social.name}
                  >
                    <span className="material-symbols-outlined text-[18px]">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-bold text-white/70 text-sm mb-5 uppercase tracking-wider">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-white/25 hover:text-violet-400 transition-colors flex items-center gap-2 group font-medium text-sm"
                      >
                        <span className="material-symbols-outlined text-[14px] text-white/10 group-hover:text-violet-400 transition-colors">chevron_right</span>
                        <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Section */}
          <div className="mb-10 p-7 bg-white/[0.02] rounded-2xl border border-white/[0.06] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/5 rounded-full blur-[60px] pointer-events-none"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center relative z-10">
              <div>
                <h4 className="text-lg font-bold text-white mb-1.5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-xl">mark_email_unread</span>
                  Stay Updated
                </h4>
                <p className="text-white/25 text-sm">
                  Subscribe to my newsletter for the latest projects and tech insights. No spam, I promise.
                </p>
              </div>
              <form className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-lg">mail</span>
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/[0.06] text-white/80 text-sm rounded-xl focus:border-violet-500/50 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(139,92,246,0.1)] transition-all placeholder:text-white/15"
                  />
                </div>
                <button
                  type="submit"
                  className="px-7 py-3.5 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Subscribe
                  <span className="material-symbols-outlined text-base group-hover:translate-x-0.5 transition-transform">send</span>
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-7 border-t border-white/[0.04]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/20 text-sm font-medium">
                &copy; {currentYear} AbayyyDev. All rights reserved.
              </p>

              <div className="flex items-center gap-6 text-sm font-medium text-white/20">
                <a href="#" className="hover:text-violet-400 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-violet-400 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-violet-400 transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-white/[0.04] border border-white/[0.08] text-white/40 rounded-xl hover:bg-gradient-to-r hover:from-violet-600 hover:to-cyan-500 hover:text-white hover:-translate-y-1 hover:border-transparent hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-300 flex items-center justify-center z-40 group"
          aria-label="Back to top"
        >
          <span className="material-symbols-outlined text-xl group-hover:animate-bounce">arrow_upward</span>
        </button>
      </footer>
    </>
  );
}