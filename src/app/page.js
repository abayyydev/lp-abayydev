"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import Swal from "sweetalert2";

export default function LandingPage() {
  // --- STATE DATA DINAMIS ---
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [activeSkill, setActiveSkill] = useState(0);
  const heroRef = useRef(null);

  // --- Typewriter Effect ---
  const [displayRole, setDisplayRole] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  // --- STATE FORM CONTACT ---
  const [msgForm, setMsgForm] = useState({
    name: "",
    email: "",
    project_type: "Web App",
    message: "",
  });

  // --- FETCH DATA DARI BACKEND ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProfile, resSkills, resProjects] = await Promise.all([
          axios.get("https://ukmelrahma.my.id/portofolio-abayyy/profile"),
          axios.get("https://ukmelrahma.my.id/portofolio-abayyy/skills"),
          axios.get("https://ukmelrahma.my.id/portofolio-abayyy/projects"),
        ]);

        setProfile(resProfile.data);
        setSkills(resSkills.data);
        setProjects(resProjects.data);

        // --- TAMBAHAN: Silently Track Visitor ---
        try {
          const loc = await axios.get("https://ipapi.co/json/");

          axios.post("https://ukmelrahma.my.id/portofolio-abayyy/track", {
            page_url: window.location.pathname,
            latitude: loc.data.latitude,
            longitude: loc.data.longitude
          }).catch(() => { });
        } catch (err) {
          axios.post("https://ukmelrahma.my.id/portofolio-abayyy/track", {
            page_url: window.location.pathname,
            latitude: null,
            longitude: null
          }).catch(() => { });
        }

      } catch (error) {
        console.error("Gagal ambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- TYPEWRITER EFFECT ---
  useEffect(() => {
    const role = profile?.role || "Fullstack Developer";
    if (isTyping) {
      if (roleIndex < role.length) {
        const timeout = setTimeout(() => {
          setDisplayRole((prev) => prev + role[roleIndex]);
          setRoleIndex((prev) => prev + 1);
        }, 80);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (roleIndex > 0) {
        const timeout = setTimeout(() => {
          setDisplayRole((prev) => prev.slice(0, -1));
          setRoleIndex((prev) => prev - 1);
        }, 40);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setIsTyping(true), 500);
        return () => clearTimeout(timeout);
      }
    }
  }, [roleIndex, isTyping, profile]);

  // --- INTERSECTION OBSERVER UNTUK ANIMASI SCROLL ---
  useEffect(() => {
    if (!loading) {
      const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15,
      };

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      const elements = document.querySelectorAll(".reveal-on-scroll");
      elements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }
  }, [loading, projects, skills]);

  const handleSendMsg = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://ukmelrahma.my.id/portofolio-abayyy/messages", msgForm);
      Swal.fire({
        title: "Terkirim!",
        text: "Pesan Anda telah saya terima. Saya akan segera membalasnya.",
        icon: "success",
        confirmButtonColor: "#8b5cf6",
        background: "#12121a",
        color: "#f0f0f5",
      });
      setMsgForm({ name: "", email: "", project_type: "Web App", message: "" });
    } catch (error) {
      Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan sistem, pesan tidak terkirim.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        background: "#12121a",
        color: "#f0f0f5",
      });
    }
  };

  // --- ANIMASI SKILL CAROUSEL ---
  useEffect(() => {
    if (skills.length > 0) {
      const interval = setInterval(() => {
        setActiveSkill((prev) => (prev + 1) % skills.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [skills]);

  // --- LOGIKA GROUPING SKILL ---
  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="min-h-screen font-sans bg-[#0a0a0f] text-[#f0f0f5]">

      {/* Import Google Material Symbols */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

      <PublicHeader />

      {/* ================= HERO SECTION ================= */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center  overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a0a0f 0%, #1a1028 35%, #0d1520 65%, #0a0a0f 100%)" }}
      >
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[120px] animate-float-orb"></div>
          <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] animate-float-orb-delayed"></div>
          <div className="absolute bottom-20 left-1/3 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[100px] animate-float-orb-slow"></div>
        </div>

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        ></div>

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* TEXT CONTENT */}
            <div className="order-2 lg:order-1 text-center lg:text-left">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-full mb-8 reveal-on-scroll">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span>
                </span>
                <span className="text-white/50 font-semibold text-xs uppercase tracking-widest">Available for Hire</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-[1.05] mb-6 tracking-tight reveal-on-scroll delay-100">
                <span className="block text-white/90 mb-2">Hello,</span>
                <span className="block">
                  <span className="gradient-text">
                    I&apos;m {profile?.full_name ? profile.full_name.split(" ")[0] : "Developer"}
                  </span>
                </span>
              </h1>

              {/* Typewriter Role */}
              <div className="mb-10 reveal-on-scroll delay-200">
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <span className="material-symbols-outlined text-violet-400 text-2xl">terminal</span>
                  <h2 className="text-xl md:text-2xl font-semibold text-white/40">
                    {displayRole}
                    <span className="inline-block w-[3px] h-6 bg-violet-400 ml-1 animate-blink align-middle"></span>
                  </h2>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start reveal-on-scroll delay-300">
                <a
                  href={`https://wa.me/${profile?.whatsapp}?text=Halo%20Akbar,%20saya%20melihat%20website%20portofolio%20Anda%20dan%20ingin%20berkonsultasi%20mengenai%20pembuatan%20project%20website.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">forum</span>
                    Konsultasi via WA
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </a>

                <a
                  href={profile?.cv_link || "#"}
                  target={profile?.cv_link ? "_blank" : "_self"}
                  onClick={(e) => {
                    if (!profile?.cv_link) {
                      e.preventDefault();
                      Swal.fire({
                        title: "Info",
                        text: "Berkas CV belum tersedia di database.",
                        icon: "info",
                        background: "#12121a",
                        color: "#f0f0f5",
                        confirmButtonColor: "#8b5cf6",
                      });
                    }
                  }}
                  className="group px-8 py-4 bg-white/[0.04] text-white/80 font-bold rounded-2xl border border-white/[0.1] hover:border-violet-500/40 hover:bg-white/[0.08] hover:text-white transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl group-hover:-translate-y-0.5 transition-transform">download</span>
                  <span>Download CV</span>
                </a>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-8 mt-12 justify-center lg:justify-start reveal-on-scroll delay-400">
                <div className="text-center">
                  <div className="text-3xl font-black text-white">{projects.length}<span className="text-violet-400">+</span></div>
                  <div className="text-xs font-semibold text-white/30 uppercase tracking-wider mt-1">Projects</div>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div className="text-center">
                  <div className="text-3xl font-black text-white">{skills.length}<span className="text-cyan-400">+</span></div>
                  <div className="text-xs font-semibold text-white/30 uppercase tracking-wider mt-1">Tech Stack</div>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div className="text-center">
                  <div className="text-3xl font-black text-white">24<span className="text-emerald-400">/7</span></div>
                  <div className="text-xs font-semibold text-white/30 uppercase tracking-wider mt-1">Support</div>
                </div>
              </div>
            </div>

            {/* HERO IMAGE */}
            <div className="relative order-1 lg:order-2 flex justify-center reveal-on-scroll delay-200">
              <div className="relative">
                {/* Decorative Ring */}
                <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-r from-violet-600/20 via-transparent to-cyan-500/20 animate-spin-slow opacity-60"></div>

                {/* Outer Glow */}
                <div className="absolute -inset-8 rounded-[3.5rem] bg-gradient-to-br from-violet-600/10 to-cyan-500/10 blur-2xl"></div>

                {/* Main Image Container */}
                <div className="relative w-72 h-72 md:w-[26rem] md:h-[26rem] bg-white/[0.03] rounded-[2.5rem] p-2 border border-white/[0.08] overflow-hidden group">
                  <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-[#12121a]">
                    <img
                      src={profile?.hero_image || "/img.jpeg"}
                      alt="Profile"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/400?text=No+Image"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/60 via-transparent to-transparent"></div>
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute bottom-6 -left-6 bg-[#12121a]/90 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/[0.08] flex items-center gap-3 animate-float-delayed shadow-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-cyan-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
                      <span className="material-symbols-outlined text-lg">code</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Developer</p>
                      <p className="text-sm font-bold text-white/90">Available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SKILLS MARQUEE */}
          <div className="mt-24 lg:mt-32 reveal-on-scroll delay-400">
            <div className="text-center mb-8">
              <p className="text-white/20 font-semibold tracking-widest uppercase text-xs">Tech Stack & Tools</p>
            </div>
            {skills.length > 0 ? (
              <div className="relative overflow-hidden py-4">
                {/* Gradient Fade Edges */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #0f0d17, transparent)' }}></div>
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #0f0d17, transparent)' }}></div>

                {/* Marquee Track */}
                <div className="flex animate-marquee hover:[animation-play-state:paused]">
                  {[...skills, ...skills].map((skill, index) => (
                    <div
                      key={`${skill.id}-${index}`}
                      className="flex items-center gap-2.5 px-5 py-3 mx-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-violet-500/30 hover:bg-white/[0.06] transition-all duration-300 cursor-default whitespace-nowrap shrink-0"
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="font-semibold text-white/50 text-sm">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-white/20 italic">Belum ada skill yang ditambahkan.</p>
            )}
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none"></div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section id="about" className="py-24 lg:py-32 px-5 bg-[#0a0a0f] relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Image Side */}
            <div className="relative reveal-on-scroll">
              <div className="relative rounded-[2rem] overflow-hidden border border-white/[0.06] group">
                <img src="/foto.jpeg" alt="Working" className="w-full h-auto object-cover aspect-square sm:aspect-[4/3] lg:aspect-square group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-cyan-500/10 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/80 via-transparent to-transparent"></div>
              </div>

              {/* Experience Badge */}
              <div className="absolute -bottom-6 -right-4 md:-right-6 bg-[#12121a] border border-white/[0.08] text-white p-6 md:p-7 rounded-2xl shadow-2xl flex items-center gap-4 animate-float">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500/20 to-cyan-400/20 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-violet-400">verified</span>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-black">{projects.length}<span className="text-violet-400">+</span></div>
                  <div className="text-xs font-semibold text-white/30 uppercase tracking-wider mt-1">Projects Done</div>
                </div>
              </div>
            </div>

            {/* Text Side */}
            <div className="reveal-on-scroll delay-200">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 font-semibold text-xs rounded-full uppercase tracking-wider mb-6">
                <span className="material-symbols-outlined text-sm">person</span>
                About Me
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Turning <span className="gradient-text">Ideas</span> into Digital Reality
              </h2>
              <p className="text-lg text-white/40 mb-10 leading-relaxed">
                {profile?.bio || "I am a passionate developer eager to build highly scalable and visually appealing web applications. With a strong foundation in modern web technologies, I focus on delivering perfect digital experiences."}
              </p>

              {/* Skills Grouped */}
              <div className="space-y-6 bg-white/[0.02] p-7 rounded-2xl border border-white/[0.06]">
                {skills.length > 0 ? (
                  Object.entries(groupedSkills).map(([category, items], idx) => (
                    <div key={idx}>
                      <h4 className="font-bold text-white/50 mb-3 uppercase tracking-wider text-xs flex items-center gap-3">
                        <span className="w-8 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full"></span>
                        {category}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {items.map((skill) => (
                          <span
                            key={skill.id}
                            className="px-3 py-1.5 bg-white/[0.04] text-white/50 font-medium text-xs rounded-lg border border-white/[0.06] hover:bg-white/[0.08] hover:border-violet-500/30 hover:text-violet-300 transition-all flex items-center gap-1.5 cursor-default"
                          >
                            <img src={skill.icon} alt={skill.name} className="w-3.5 h-3.5 object-contain" />
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-white/20">Loading skills...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES SECTION ================= */}
      <section className="py-24 lg:py-32 px-5 bg-[#0a0a0f] relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal-on-scroll">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/[0.06] text-white/40 font-semibold text-xs rounded-full uppercase tracking-wider mb-4">
              <span className="material-symbols-outlined text-sm">design_services</span>
              Layanan Keahlian
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Solusi <span className="gradient-text">Digital</span> Anda
            </h2>
            <p className="text-white/30 max-w-2xl mx-auto text-lg">Membantu mewujudkan bisnis Anda berkembang pesat melalui sistem aplikasi web yang efisien, responsif, dan aman.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="glass-card rounded-2xl p-8 group reveal-on-scroll">
              <div className="w-14 h-14 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl flex items-center justify-center mb-7 group-hover:scale-110 group-hover:bg-violet-500 group-hover:text-white group-hover:border-violet-500 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all duration-400">
                <span className="material-symbols-outlined text-2xl">web</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Company Profile</h3>
              <p className="text-white/30 text-sm mb-7 leading-relaxed">Website branding informatif yang elegan untuk meningkatkan kredibilitas, pasar, dan nilai jual usaha Anda secara online.</p>
              <ul className="space-y-3">
                {['Desain Full Responsif', 'Optimasi SEO Google', 'Integrasi WhatsApp'].map((fitur, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-white/40">
                    <span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
                    {fitur}
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 2 (Highlight) */}
            <div className="relative rounded-2xl p-8 bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.1] shadow-2xl shadow-violet-500/5 md:-translate-y-4 overflow-hidden group reveal-on-scroll delay-100">
              {/* Glow Accent */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl group-hover:bg-violet-500/15 transition-all duration-500"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>

              <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-cyan-500 text-white rounded-xl flex items-center justify-center mb-7 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all duration-400 relative z-10">
                <span className="material-symbols-outlined text-2xl">dashboard</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">Sistem & Dashboard</h3>
              <p className="text-white/30 text-sm mb-7 leading-relaxed relative z-10">Pembuatan aplikasi pemantauan data kustom internal bisnis, kasir (POS), keuangan, hingga rekap pelaporan otomatis.</p>
              <ul className="space-y-3 relative z-10">
                {['Manajemen Relasi DB', 'Ekspor Laporan PDF/Excel', 'Hak Akses Keamanan'].map((fitur, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-white/50">
                    <span className="material-symbols-outlined text-violet-400 text-lg">check_circle</span>
                    {fitur}
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 3 */}
            <div className="glass-card rounded-2xl p-8 group reveal-on-scroll delay-200">
              <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl flex items-center justify-center mb-7 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white group-hover:border-cyan-500 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-400">
                <span className="material-symbols-outlined text-2xl">laptop_mac</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Custom Web App</h3>
              <p className="text-white/30 text-sm mb-7 leading-relaxed">Pengembangan platform sistem belajar mandiri digital (LMS), portal edukasi khusus, sesuai alur logika kebutuhan bisnis.</p>
              <ul className="space-y-3">
                {['Arsitektur Skalabilitas', 'Integrasi API Endpoint', 'Panel Admin Dinamis'].map((fitur, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-white/40">
                    <span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
                    {fitur}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROJECTS SECTION ================= */}
      <section id="projects" className="py-24 lg:py-32 px-5 bg-[#0a0a0f] relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[200px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal-on-scroll">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/[0.06] text-white/40 font-semibold text-xs rounded-full uppercase tracking-wider mb-4">
              <span className="material-symbols-outlined text-sm">folder_open</span>
              Portfolio
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-white/30 max-w-2xl mx-auto text-lg">Beberapa karya aplikasi web pilihan terbaik yang telah selesai saya rancang dan kembangkan.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 6).map((item, index) => {
                let techStackArray = [];
                try { techStackArray = typeof item.tech_stack === "string" ? JSON.parse(item.tech_stack) : item.tech_stack; }
                catch (e) { techStackArray = []; }

                const delayClass = index % 3 === 0 ? "" : index % 3 === 1 ? "delay-100" : "delay-200";

                return (
                  <div
                    key={item.id}
                    className={`group bg-white/[0.02] rounded-2xl overflow-hidden border border-white/[0.06] hover:border-violet-500/30 hover:bg-white/[0.04] transition-all duration-500 transform hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(139,92,246,0.08)] flex flex-col h-full reveal-on-scroll ${delayClass}`}
                  >
                    {/* Project Image */}
                    <div className="relative h-56 overflow-hidden bg-[#12121a]">
                      {item.image_url ? (
                        <>
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-[#0a0a0f]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                            <Link
                              href={`/projects/${item.id}`}
                              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold rounded-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-violet-500/20"
                            >
                              <span className="material-symbols-outlined text-xl">visibility</span>
                              View Details
                            </Link>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-white/20 bg-white/[0.02]">
                          <span className="material-symbols-outlined text-4xl mb-2">image_not_supported</span>
                          <span className="text-sm font-medium">No Image</span>
                        </div>
                      )}
                      {/* Gradient overlay */}
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0a0a0f]/80 to-transparent pointer-events-none"></div>
                    </div>

                    {/* Project Info */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-white/90 mb-2 line-clamp-1 group-hover:text-violet-300 transition-colors">
                        {item.title}
                      </h3>
                      {item.role && (
                        <p className="text-xs font-semibold text-violet-400 mb-3 uppercase tracking-wider">
                          Role: {item.role}
                        </p>
                      )}
                      <p className="text-white/30 text-sm mb-5 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="mt-auto pt-4 border-t border-white/[0.06]">
                        <div className="flex flex-wrap gap-2">
                          {techStackArray.slice(0, 3).map((t, i) => (
                            <span
                              key={i}
                              className="text-[11px] px-2.5 py-1 bg-violet-500/10 text-violet-300/70 border border-violet-500/10 rounded-md font-semibold uppercase tracking-wider"
                            >
                              {t.name}
                            </span>
                          ))}
                          {techStackArray.length > 3 && (
                            <span className="text-[11px] px-2 py-1 text-white/20 font-semibold bg-white/[0.03] rounded-md border border-white/[0.04]">+{techStackArray.length - 3}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-14 reveal-on-scroll">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white/[0.04] border border-white/[0.08] text-white/70 font-bold rounded-2xl hover:bg-white/[0.08] hover:border-violet-500/30 hover:text-white transition-all duration-300"
            >
              View All Projects
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CONTACT & FORM SECTION ================= */}
      <section id="contact" className="py-24 lg:py-32 px-5 bg-[#0a0a0f] relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 reveal-on-scroll">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Let&apos;s Work <span className="gradient-text">Together</span></h2>
            <p className="text-white/30 text-lg max-w-2xl mx-auto">
              Punya ide proyek menarik atau kebutuhan sistem untuk bisnis Anda? Mari diskusikan sekarang.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* KIRI: Info Kontak & Social Media */}
            <div className="lg:col-span-4 space-y-5 reveal-on-scroll">
              <div className="bg-white/[0.02] p-7 rounded-2xl border border-white/[0.06]">
                <h3 className="text-xl font-bold text-white mb-6">Connect</h3>
                <div className="space-y-3">
                  {profile?.instagram_link && (
                    <a href={profile.instagram_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-xl border border-white/[0.04] hover:border-pink-500/30 hover:bg-white/[0.04] transition-all group">
                      <div className="w-11 h-11 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-400 group-hover:scale-110 group-hover:bg-pink-500 group-hover:text-white transition-all">
                        <span className="material-symbols-outlined text-xl">photo_camera</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-white/20 uppercase tracking-wider">Instagram</p>
                        <p className="font-semibold text-white/60 text-sm group-hover:text-pink-300 transition-colors">Follow Me</p>
                      </div>
                    </a>
                  )}

                  {profile?.github_link && (
                    <a href={profile.github_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-xl border border-white/[0.04] hover:border-white/20 hover:bg-white/[0.04] transition-all group">
                      <div className="w-11 h-11 bg-white/[0.06] rounded-xl flex items-center justify-center text-white/50 group-hover:scale-110 group-hover:bg-white group-hover:text-[#0a0a0f] transition-all">
                        <span className="material-symbols-outlined text-xl">terminal</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-white/20 uppercase tracking-wider">GitHub</p>
                        <p className="font-semibold text-white/60 text-sm group-hover:text-white transition-colors">View Code</p>
                      </div>
                    </a>
                  )}

                  {profile?.linkedin_link && (
                    <a href={profile.linkedin_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-xl border border-white/[0.04] hover:border-blue-500/30 hover:bg-white/[0.04] transition-all group">
                      <div className="w-11 h-11 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <span className="material-symbols-outlined text-xl">work</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-white/20 uppercase tracking-wider">LinkedIn</p>
                        <p className="font-semibold text-white/60 text-sm group-hover:text-blue-300 transition-colors">Network Connect</p>
                      </div>
                    </a>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-white/[0.06]">
                  <a
                    href={`mailto:${profile?.email || 'akbarfirdaus009@gmail.com'}`}
                    className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">mail</span>
                    Direct Email
                  </a>
                </div>
              </div>
            </div>

            {/* KANAN: Form Pengiriman Pesan */}
            <div className="lg:col-span-8 reveal-on-scroll delay-200">
              <div className="bg-white/[0.02] p-7 md:p-9 rounded-2xl border border-white/[0.06] relative overflow-hidden">
                {/* Form glow accent */}
                <div className="absolute top-0 right-0 w-60 h-60 bg-violet-500/5 rounded-full blur-[80px] pointer-events-none"></div>

                <h3 className="text-xl font-bold text-white mb-7 flex items-center gap-3 relative z-10">
                  <span className="material-symbols-outlined text-violet-400 text-2xl">edit_document</span>
                  Kirim Pesan
                </h3>

                <form onSubmit={handleSendMsg} className="space-y-5 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-white/30 uppercase tracking-wider mb-2">Nama Anda</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-3.5 text-white/20 text-lg">person</span>
                        <input
                          type="text"
                          placeholder="Masukkan nama lengkap..."
                          className="w-full bg-white/[0.03] p-3.5 pl-11 text-white/90 text-sm rounded-xl border border-white/[0.06] focus:border-violet-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(139,92,246,0.1)] transition-all placeholder:text-white/15"
                          value={msgForm.name}
                          onChange={(e) => setMsgForm({ ...msgForm, name: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/30 uppercase tracking-wider mb-2">Alamat Email</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-3.5 text-white/20 text-lg">mail</span>
                        <input
                          type="email"
                          placeholder="nama@email.com"
                          className="w-full bg-white/[0.03] p-3.5 pl-11 text-white/90 text-sm rounded-xl border border-white/[0.06] focus:border-violet-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(139,92,246,0.1)] transition-all placeholder:text-white/15"
                          value={msgForm.email}
                          onChange={(e) => setMsgForm({ ...msgForm, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">Tipe Proyek</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: "Web App", icon: "language" },
                        { label: "Mobile", icon: "smartphone" },
                        { label: "E-commerce", icon: "shopping_cart" },
                        { label: "Other", icon: "more_horiz" }
                      ].map((type) => (
                        <button
                          key={type.label}
                          type="button"
                          onClick={() => setMsgForm({ ...msgForm, project_type: type.label })}
                          className={`p-3 font-semibold text-sm rounded-xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 ${msgForm.project_type === type.label
                              ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white border-transparent shadow-lg shadow-violet-500/20 scale-[1.02]"
                              : "bg-white/[0.03] text-white/30 border-white/[0.06] hover:border-violet-500/30 hover:bg-white/[0.05] hover:text-white/50"
                            }`}
                        >
                          <span className="material-symbols-outlined text-xl">{type.icon}</span>
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/30 uppercase tracking-wider mb-2">Isi Pesan / Deskripsi Proyek</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-3.5 text-white/20 text-lg">chat</span>
                      <textarea
                        placeholder="Jelaskan kebutuhan website, goals, fitur utama, atau linimasa proyek Anda di sini..."
                        rows="5"
                        className="w-full bg-white/[0.03] p-3.5 pl-11 text-white/90 text-sm rounded-xl border border-white/[0.06] focus:border-violet-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(139,92,246,0.1)] transition-all resize-none leading-relaxed placeholder:text-white/15"
                        value={msgForm.message}
                        onChange={(e) => setMsgForm({ ...msgForm, message: e.target.value })}
                        required
                      ></textarea>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="group w-full py-4 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
                  >
                    <span>Kirim Pesan Sekarang</span>
                    <span className="material-symbols-outlined group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform">send</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}