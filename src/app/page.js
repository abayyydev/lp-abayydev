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
          axios.get("http://localhost:5000/profile"),
          axios.get("http://localhost:5000/skills"),
          axios.get("http://localhost:5000/projects"),
        ]);

        setProfile(resProfile.data);
        setSkills(resSkills.data);
        setProjects(resProjects.data);
      } catch (error) {
        console.error("Gagal ambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
            observer.unobserve(entry.target); // Animasi hanya berjalan sekali
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
      await axios.post("http://localhost:5000/messages", msgForm);
      Swal.fire({
        title: "Terkirim!",
        text: "Pesan Anda telah saya terima. Saya akan segera membalasnya.",
        icon: "success",
        confirmButtonColor: "#2563eb",
      });
      setMsgForm({ name: "", email: "", project_type: "Web App", message: "" });
    } catch (error) {
      Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan sistem, pesan tidak terkirim.",
        icon: "error",
        confirmButtonColor: "#ef4444",
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
    <div className="min-h-screen font-sans bg-slate-50 text-slate-800 selection:bg-blue-200 selection:text-blue-900">
      
      {/* Import Google Material Symbols */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

      <PublicHeader />

      {/* ================= HERO SECTION ================= */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 px-5 overflow-hidden bg-white"
      >
        {/* Background Grid & Blur Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none"></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[30rem] h-[30rem] bg-blue-400/20 rounded-full blur-[120px] mix-blend-multiply animate-blob"></div>
          <div className="absolute top-40 -left-20 w-[30rem] h-[30rem] bg-cyan-300/20 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* TEXT CONTENT */}
            <div className="order-2 lg:order-1 text-center lg:text-left reveal-on-scroll">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-blue-100 text-blue-700 font-bold text-sm rounded-full tracking-wider uppercase mb-8 shadow-[0_4px_20px_-4px_rgba(59,130,246,0.15)]">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                Available for Hire
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-[1.05] mb-6 text-slate-900 tracking-tight">
                <span className="block mb-2 text-slate-800">Hello,</span>
                <span className="relative inline-block pb-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 animate-gradient-x">
                    I'm {profile?.full_name ? profile.full_name.split(" ")[0] : "Developer"}
                  </span>
                </span>
              </h1>

              <div className="mb-10 reveal-on-scroll delay-100">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-500 flex items-center justify-center lg:justify-start gap-3">
                  <span className="material-symbols-outlined text-blue-500 text-4xl">terminal</span>
                  {profile?.role || "Fullstack Developer"}
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start reveal-on-scroll delay-200">
                <a
                  href={`https://wa.me/${profile?.whatsapp}?text=Halo%20Akbar,%20saya%20melihat%20website%20portofolio%20Anda%20dan%20ingin%20berkonsultasi%20mengenai%20pembuatan%20project%20website.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/40 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">forum</span>
                    Konsultasi via WA
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>

                <a
                  href={profile?.cv_link || "#"} 
                  target={profile?.cv_link ? "_blank" : "_self"}
                  onClick={(e) => {
                    if(!profile?.cv_link) {
                      e.preventDefault();
                      Swal.fire("Info", "Berkas CV belum tersedia di database.", "info");
                    }
                  }}
                  className="group px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:text-blue-600 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl group-hover:-translate-y-1 transition-transform">download</span>
                  <span>Download CV</span>
                </a>
              </div>
            </div>

            {/* HERO IMAGE */}
            <div className="relative order-1 lg:order-2 flex justify-center reveal-on-scroll delay-200">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-3xl rotate-12 animate-float opacity-80 shadow-lg"></div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-tr from-amber-400 to-orange-300 rounded-3xl -rotate-12 animate-float-delayed opacity-80 shadow-lg"></div>

                <div className="relative w-72 h-72 md:w-[28rem] md:h-[28rem] bg-white rounded-[2.5rem] p-3 shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden group">
                  <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-slate-100">
                    <img
                      src={profile?.hero_image || "/img.jpeg"}
                      alt="Profile"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/400?text=No+Image"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute bottom-8 -left-8 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-slate-100/50 flex items-center gap-3 animate-float-delayed">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white shadow-inner">
                      <span className="material-symbols-outlined">code</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Developer</p>
                      <p className="text-sm font-black text-slate-700">Available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SKILLS CAROUSEL */}
          <div className="mt-24 lg:mt-32 reveal-on-scroll delay-300">
            <div className="text-center mb-8">
              <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Tech Stack & Tools</p>
            </div>
            {skills.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-4 sm:gap-5 max-w-5xl mx-auto">
                {skills.map((skill, index) => (
                  <div
                    key={skill.id}
                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-500 transform hover:-translate-y-1 hover:shadow-lg hover:border-blue-200 cursor-default ${
                      activeSkill === index ? "ring-2 ring-blue-400 ring-offset-2 scale-105 shadow-md" : ""
                    }`}
                    onMouseEnter={() => setActiveSkill(index)}
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-slate-600 text-sm tracking-tight">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-400 italic">Belum ada skill yang ditambahkan.</p>
            )}
          </div>
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section id="about" className="py-24 px-5 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="relative reveal-on-scroll">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 border border-white">
                <img src="/foto.jpeg" alt="Working" className="w-full h-auto object-cover aspect-square sm:aspect-[4/3] lg:aspect-square hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-cyan-500/10 mix-blend-overlay"></div>
              </div>
              
              {/* Experience Badge */}
              <div className="absolute -bottom-8 -right-4 md:-right-8 bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-2xl flex items-center gap-4 animate-float">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-blue-400">verified</span>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-black">{projects.length}+</div>
                  <div className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider mt-1">Projects Done</div>
                </div>
              </div>
            </div>

            <div className="reveal-on-scroll delay-200">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xs rounded-full uppercase tracking-wider mb-6">
                <span className="material-symbols-outlined text-sm">person</span>
                About Me
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                Turning <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Ideas</span> into Digital Reality
              </h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                {profile?.bio || "I am a passionate developer eager to build highly scalable and visually appealing web applications. With a strong foundation in modern web technologies, I focus on delivering perfect digital experiences."}
              </p>

              <div className="space-y-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                {skills.length > 0 ? (
                  Object.entries(groupedSkills).map(([category, items], idx) => (
                    <div key={idx}>
                      <h4 className="font-extrabold text-slate-800 mb-4 uppercase tracking-wider text-xs flex items-center gap-3">
                        <span className="w-8 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"></span>
                        {category}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {items.map((skill) => (
                          <span
                            key={skill.id}
                            className="px-3 py-1.5 bg-slate-50 text-slate-600 font-bold text-xs rounded-lg border border-slate-100 hover:bg-white hover:border-blue-300 hover:text-blue-600 hover:shadow-md transition-all flex items-center gap-1.5 cursor-default"
                          >
                            <img src={skill.icon} alt={skill.name} className="w-4 h-4 object-contain" />
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400">Loading skills...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES SECTION ================= */}
      <section className="py-24 px-5 bg-white relative border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal-on-scroll">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 text-slate-600 font-bold text-xs rounded-full uppercase tracking-wider mb-4 shadow-sm">
              <span className="material-symbols-outlined text-sm">design_services</span>
              Layanan Keahlian
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Solusi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Digital</span> Anda
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Membantu mewujudkan bisnis Anda berkembang pesat melalui sistem aplikasi web yang efisien, responsif, dan aman.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-2 group reveal-on-scroll">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <span className="material-symbols-outlined text-3xl">web</span>
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-4">Company Profile</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">Website branding informatif yang elegan untuk meningkatkan kredibilitas, pasar, dan nilai jual usaha Anda secara online.</p>
              <ul className="space-y-3">
                {['Desain Full Responsif', 'Optimasi SEO Google', 'Integrasi WhatsApp'].map((fitur, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <span className="material-symbols-outlined text-green-500 text-xl">check_circle</span>
                    {fitur}
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 2 (Highlight) */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-slate-900/20 transform md:-translate-y-4 relative overflow-hidden group reveal-on-scroll delay-100">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-cyan-400/20 transition-colors duration-500"></div>
              <div className="w-16 h-16 bg-slate-800 text-blue-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 relative z-10 border border-slate-700">
                <span className="material-symbols-outlined text-3xl">dashboard</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-4 relative z-10">Sistem & Dashboard</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed relative z-10">Pembuatan aplikasi pemantauan data kustom internal bisnis, kasir (POS), keuangan, hingga rekap pelaporan otomatis.</p>
              <ul className="space-y-3 relative z-10">
                {['Manajemen Relasi DB', 'Ekspor Laporan PDF/Excel', 'Hak Akses Keamanan'].map((fitur, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-300">
                    <span className="material-symbols-outlined text-blue-400 text-xl">check_circle</span>
                    {fitur}
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:border-cyan-100 transition-all duration-300 transform hover:-translate-y-2 group reveal-on-scroll delay-200">
              <div className="w-16 h-16 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
                <span className="material-symbols-outlined text-3xl">laptop_mac</span>
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-4">Custom Web App</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">Pengembangan platform sistem belajar mandiri digital (LMS), portal edukasi khusus, sesuai alur logika kebutuhan bisnis.</p>
              <ul className="space-y-3">
                {['Arsitektur Skalabilitas', 'Integrasi API Endpoint', 'Panel Admin Dinamis'].map((fitur, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <span className="material-symbols-outlined text-green-500 text-xl">check_circle</span>
                    {fitur}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROJECTS SECTION ================= */}
      <section id="projects" className="py-24 px-5 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal-on-scroll">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold text-xs rounded-full uppercase tracking-wider mb-4 shadow-sm">
              <span className="material-symbols-outlined text-sm">folder_open</span>
              Portfolio
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Projects</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Beberapa karya aplikasi web pilihan terbaik yang telah selesai saya rancang dan kembangkan.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.slice(0, 6).map((item, index) => {
                let techStackArray = [];
                try { techStackArray = typeof item.tech_stack === "string" ? JSON.parse(item.tech_stack) : item.tech_stack; } 
                catch (e) { techStackArray = []; }

                // Menambahkan class delay yang dinamis untuk efek cascade
                const delayClass = index % 3 === 0 ? "" : index % 3 === 1 ? "delay-100" : "delay-200";

                return (
                  <div
                    key={item.id}
                    className={`group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full reveal-on-scroll ${delayClass}`}
                  >
                    <div className="relative h-60 overflow-hidden bg-slate-100 p-2">
                      <div className="w-full h-full rounded-2xl overflow-hidden relative">
                        {item.image_url ? (
                          <>
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                              <Link
                                href={`/projects/${item.id}`}
                                className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 hover:bg-blue-600 hover:text-white shadow-lg"
                              >
                                <span className="material-symbols-outlined text-xl">visibility</span>
                                View Details
                              </Link>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-slate-50 border border-slate-100 rounded-2xl">
                            <span className="material-symbols-outlined text-4xl mb-2">image_not_supported</span>
                            <span className="text-sm font-medium">No Image</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-7 flex flex-col flex-grow">
                      <h3 className="text-xl font-black text-slate-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="mt-auto pt-5 border-t border-slate-100">
                        <div className="flex flex-wrap gap-2">
                          {techStackArray.slice(0, 3).map((t, i) => (
                            <span
                              key={i}
                              className="text-[11px] px-3 py-1.5 bg-blue-50/50 text-blue-700 border border-blue-100/50 rounded-lg font-bold flex items-center gap-1 uppercase tracking-wider"
                            >
                              {t.name}
                            </span>
                          ))}
                          {techStackArray.length > 3 && (
                            <span className="text-[11px] px-2 py-1.5 text-slate-400 font-bold bg-slate-50 rounded-lg border border-slate-100">+{techStackArray.length - 3}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-16 reveal-on-scroll">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all duration-300"
            >
              View All Projects
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CONTACT & FORM SECTION ================= */}
      <section id="contact" className="py-24 px-5 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/80 rounded-full blur-[120px] opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-50/80 rounded-full blur-[120px] opacity-60 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 reveal-on-scroll">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Let's Work <span className="text-blue-600">Together</span></h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Punya ide proyek menarik atau kebutuhan sistem untuk bisnis Anda? Mari diskusikan sekarang.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            
            {/* KIRI: Info Kontak & Social Media */}
            <div className="lg:col-span-4 space-y-6 reveal-on-scroll">
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-2xl font-black text-slate-800 mb-6">Connect</h3>
                <div className="space-y-4">
                  {profile?.instagram_link && (
                    <a href={profile.instagram_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-pink-300 hover:shadow-md transition-all group">
                      <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500 group-hover:scale-110 group-hover:bg-pink-500 group-hover:text-white transition-all">
                        <span className="material-symbols-outlined">photo_camera</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Instagram</p>
                        <p className="font-bold text-slate-700 group-hover:text-pink-600 transition-colors">Follow Me</p>
                      </div>
                    </a>
                  )}
                  
                  {profile?.github_link && (
                    <a href={profile.github_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-slate-400 hover:shadow-md transition-all group">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700 group-hover:scale-110 group-hover:bg-slate-800 group-hover:text-white transition-all">
                        <span className="material-symbols-outlined">terminal</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">GitHub</p>
                        <p className="font-bold text-slate-700 group-hover:text-slate-900 transition-colors">View Code</p>
                      </div>
                    </a>
                  )}

                  {profile?.linkedin_link && (
                    <a href={profile.linkedin_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all group">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <span className="material-symbols-outlined">work</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">LinkedIn</p>
                        <p className="font-bold text-slate-700 group-hover:text-blue-700 transition-colors">Network Connect</p>
                      </div>
                    </a>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-slate-200">
                  <a
                    href={`mailto:${profile?.email || 'akbarfirdaus009@gmail.com'}`}
                    className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-blue-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">mail</span>
                    Direct Email
                  </a>
                </div>
              </div>
            </div>

            {/* KANAN: Form Pengiriman Pesan */}
            <div className="lg:col-span-8 reveal-on-scroll delay-200">
              <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/40">
                <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined text-blue-500 text-3xl">edit_document</span>
                  Kirim Pesan
                </h3>
                
                <form onSubmit={handleSendMsg} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Anda</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-4 text-slate-400">person</span>
                        <input
                          type="text"
                          placeholder="Masukkan nama lengkap..."
                          className="w-full bg-slate-50 p-4 pl-12 text-slate-800 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                          value={msgForm.name}
                          onChange={(e) => setMsgForm({ ...msgForm, name: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Alamat Email</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-4 text-slate-400">mail</span>
                        <input
                          type="email"
                          placeholder="nama@email.com"
                          className="w-full bg-slate-50 p-4 pl-12 text-slate-800 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                          value={msgForm.email}
                          onChange={(e) => setMsgForm({ ...msgForm, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Tipe Proyek</label>
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
                          className={`p-3 font-bold text-sm rounded-xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                            msgForm.project_type === type.label
                              ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 scale-105"
                              : "bg-slate-50 text-slate-500 border-slate-200 hover:border-blue-300 hover:bg-white hover:text-blue-600"
                          }`}
                        >
                          <span className="material-symbols-outlined">{type.icon}</span>
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Isi Pesan / Deskripsi Proyek</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-4 text-slate-400">chat</span>
                      <textarea
                        placeholder="Jelaskan kebutuhan website, goals, fitur utama, atau linimasa proyek Anda di sini..."
                        rows="5"
                        className="w-full bg-slate-50 p-4 pl-12 text-slate-800 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none leading-relaxed"
                        value={msgForm.message}
                        onChange={(e) => setMsgForm({ ...msgForm, message: e.target.value })}
                        required
                      ></textarea>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="group w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3"
                  >
                    <span>Kirim Pesan Sekarang</span>
                    <span className="material-symbols-outlined group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">send</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />

      {/* STYLE UNTUK ANIMASI */}
      <style jsx>{`
        /* Intersection Observer Animation Classes */
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.5, 0, 0, 1), transform 0.8s cubic-bezier(0.5, 0, 0, 1);
          will-change: opacity, transform;
        }
        .reveal-on-scroll.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .delay-100 { transition-delay: 100ms; }
        .delay-200 { transition-delay: 200ms; }
        .delay-300 { transition-delay: 300ms; }

        /* Existing Blob / Gradient Animations */
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }

        @keyframes gradient-x {
          0%, 100% { background-size: 200% 200%; background-position: left center; }
          50% { background-size: 200% 200%; background-position: right center; }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-20px) rotate(12deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(-12deg); }
          50% { transform: translateY(-15px) rotate(-12deg); }
        }
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}