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
  
  // --- STATE FORM CONTACT (Sesuai dengan tabel database 'messages') ---
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
      }, 3000);
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
    <div className="min-h-screen font-sans bg-gradient-to-b from-white via-slate-50 to-white text-slate-800">
      
      {/* Import Google Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
      />

      <PublicHeader />

      {/* ================= HERO SECTION ================= */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-28 px-5 overflow-hidden bg-gradient-to-br from-white via-blue-50/50 to-cyan-50/50"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full blur-[100px] opacity-40"></div>
          <div className="absolute top-1/2 left-10 w-96 h-96 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full blur-[100px] opacity-30"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* TEXT CONTENT */}
            <div className="z-10 order-2 lg:order-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-blue-100 text-blue-700 font-bold text-sm rounded-full tracking-wider uppercase mb-8 shadow-sm">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                Available for Hire
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] mb-8 text-slate-900">
                <span className="block mb-2">Hello,</span>
                <span className="relative inline-block pb-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 animate-gradient-x">
                    I'm{" "}
                    {profile?.full_name
                      ? profile.full_name.split(" ")[0]
                      : "Developer"}
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full opacity-30"></span>
                </span>
              </h1>

              <div className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-600 flex items-center justify-center lg:justify-start gap-3">
                  <span className="material-symbols-outlined text-blue-500 text-3xl">terminal</span>
                  {profile?.role || "Fullstack Developer"}
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                {/* Tombol WhatsApp (Fokus ke Jualan / Pelanggan) */}
                <a
                  href="https://wa.me/6281234567890?text=Halo%20Akbar,%20saya%20melihat%20website%20portofolio%20Anda%20dan%20ingin%20berkonsultasi%20mengenai%20pembuatan%20proyek%20website."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative px-8 py-4 bg-green-500 text-white font-bold rounded-2xl shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">forum</span>
                    Konsultasi via WA
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>

                {/* Tombol Download CV (Fokus ke HRD - Sementara Placeholder) */}
                {/* Tombol Download CV (Otomatis Render dari Database) */}
                <button
                  onClick={() => {
                    if (!profile?.cv_html) {
                      Swal.fire("Belum Tersedia", "CV belum di-generate di Admin Panel.", "info");
                      return;
                    }
                    
                    try {
                      // Parse data JSON dari database
                      const cvData = JSON.parse(profile.cv_html);
                      
                      // Buka window baru untuk mencetak
                      const printWindow = window.open("", "_blank");
                      
                      // Susun ulang HTML CV
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>CV_${profile.full_name || "Developer"}</title>
                            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                            <style>
                              @media print {
                                body { -webkit-print-color-adjust: exact; background: white; }
                                @page { size: A4 portrait; margin: 15mm; }
                              }
                              body { font-family: 'Inter', sans-serif; background: #f8fafc; padding: 20px; }
                              .cv-container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
                            </style>
                          </head>
                          <body onload="setTimeout(() => { window.print(); window.close(); }, 500)">
                            <div class="cv-container">
                              <div class="text-center border-b-2 border-gray-800 pb-4 mb-6">
                                <h1 class="text-3xl font-black uppercase tracking-wide text-gray-900">${profile.full_name || "NAMA LENGKAP"}</h1>
                                <p class="text-blue-600 font-bold uppercase tracking-wider text-sm mt-1">${profile.role || "JABATAN"}</p>
                                <p class="text-xs text-gray-500 mt-2">
                                  ${profile.linkedin_link ? `LinkedIn` : ""} | ${profile.github_link ? `GitHub` : ""} | Dibuat dari Portofolio Resmi
                                </p>
                              </div>

                              ${cvData.summary ? `
                              <div class="mb-6">
                                <h2 class="text-sm font-black uppercase text-gray-900 tracking-wider border-b border-gray-300 pb-1 mb-2">Ringkasan Profesional</h2>
                                <p class="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">${cvData.summary}</p>
                              </div>` : ""}

                              ${cvData.experiences && cvData.experiences.length > 0 ? `
                              <div class="mb-6">
                                <h2 class="text-sm font-black uppercase text-gray-900 tracking-wider border-b border-gray-300 pb-1 mb-2">Pengalaman Kerja</h2>
                                ${cvData.experiences.map(exp => `
                                  <div class="mb-3">
                                    <div class="flex justify-between font-bold text-xs text-gray-800">
                                      <span>${exp.company} ${exp.role ? `— ${exp.role}` : ""}</span>
                                      <span>${exp.period}</span>
                                    </div>
                                    <div class="text-xs text-gray-600 mt-1 whitespace-pre-wrap pl-3 border-l-2 border-gray-200 leading-relaxed">${exp.description}</div>
                                  </div>
                                `).join('')}
                              </div>` : ""}

                              ${cvData.educations && cvData.educations.length > 0 ? `
                              <div>
                                <h2 class="text-sm font-black uppercase text-gray-900 tracking-wider border-b border-gray-300 pb-1 mb-2">Pendidikan</h2>
                                ${cvData.educations.map(edu => `
                                  <div class="mb-3">
                                    <div class="flex justify-between font-bold text-xs text-gray-800">
                                      <span>${edu.school} ${edu.degree ? `— ${edu.degree}` : ""}</span>
                                      <span>${edu.period}</span>
                                    </div>
                                    ${edu.gpa ? `<p class="text-[11px] text-gray-500 mt-0.5">IPK: ${edu.gpa}</p>` : ""}
                                  </div>
                                `).join('')}
                              </div>` : ""}
                            </div>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                    } catch (e) {
                      Swal.fire("Error", "Gagal memproses data CV.", "error");
                    }
                  }}
                  className="group px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl group-hover:-translate-y-1 transition-transform">
                    print
                  </span>
                  <span>Print / Save CV</span>
                </button>
              </div>
            </div>

            {/* HERO IMAGE */}
            <div className="relative order-1 lg:order-2 flex justify-center">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-3xl rotate-12 animate-float opacity-80"></div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-tr from-cyan-400 to-blue-300 rounded-3xl -rotate-12 animate-float-delayed opacity-80"></div>

                <div className="relative w-80 h-80 md:w-[28rem] md:h-[28rem] bg-white rounded-[2.5rem] p-4 shadow-2xl shadow-blue-900/10 border border-slate-100 overflow-hidden">
                  <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-slate-100">
                    <img
                      src={profile?.hero_image || "/img.jpeg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400?text=No+Image";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  <div className="absolute bottom-10 -left-6 bg-white px-5 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-float-delayed">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                      <span className="material-symbols-outlined">code</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Developer</p>
                      <p className="text-sm font-black text-slate-700">Available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SKILLS CAROUSEL */}
          <div className="mt-20 lg:mt-32">
            <div className="text-center mb-8">
              <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Tech Stack & Tools</p>
            </div>
            {skills.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                {skills.map((skill, index) => (
                  <div
                    key={skill.id}
                    className={`flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md ${
                      activeSkill === index ? "ring-2 ring-blue-400 ring-offset-2 scale-105" : ""
                    }`}
                    onMouseEnter={() => setActiveSkill(index)}
                  >
                    <div className="w-8 h-8 flex items-center justify-center">
                      <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-slate-700 text-sm">
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
      <section className="py-24 px-5 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/10 border border-slate-100">
                <img src="/foto.jpeg" alt="Working" className="w-full h-auto object-cover aspect-square sm:aspect-auto" />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-cyan-500/10 mix-blend-overlay"></div>
              </div>
              <div className="absolute -bottom-8 -right-8 bg-blue-600 text-white p-8 rounded-3xl shadow-xl flex items-center gap-4">
                <span className="material-symbols-outlined text-5xl opacity-80">verified</span>
                <div>
                  <div className="text-4xl font-black">{projects.length}+</div>
                  <div className="text-sm font-bold opacity-80">Projects Done</div>
                </div>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 text-slate-600 font-bold text-xs rounded-full uppercase tracking-wider mb-6">
                <span className="material-symbols-outlined text-sm">person</span>
                About Me
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                Turning <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Ideas</span> into Digital Reality
              </h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                {profile?.bio || "I am a passionate developer..."}
              </p>

              <div className="space-y-8">
                {skills.length > 0 ? (
                  Object.entries(groupedSkills).map(([category, items], idx) => (
                    <div key={idx}>
                      <h4 className="font-extrabold text-slate-800 mb-4 uppercase tracking-wider text-xs flex items-center gap-2">
                        <span className="w-6 h-0.5 bg-blue-500 rounded-full"></span>
                        {category}
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {items.map((skill) => (
                          <span
                            key={skill.id}
                            className="px-4 py-2 bg-slate-50 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all flex items-center gap-2 cursor-default"
                          >
                            <img src={skill.icon} alt={skill.name} className="w-5 h-5 object-contain" />
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

      {/* ================= SERVICES SECTION (BARU: FOKUS PENJUALAN) ================= */}
      <section className="py-24 px-5 bg-white relative border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 text-slate-600 font-bold text-xs rounded-full uppercase tracking-wider mb-4 shadow-sm">
              <span className="material-symbols-outlined text-sm">design_services</span>
              Layanan Keahlian
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Solusi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Digital</span> Anda
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Membantu mewujudkan bisnis Anda berkembang pesat melalui sistem aplikasi web yang efisien, responsif, dan aman.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Company Profile */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">web</span>
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-3">Company Profile</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">Website branding informatif yang elegan untuk meningkatkan kredibilitas, pasar, dan nilai jual usaha Anda secara online.</p>
              <ul className="space-y-3">
                {['Desain Full Responsif', 'Optimasi SEO Google', 'Integrasi Tombol WhatsApp'].map((fitur, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                    {fitur}
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 2: Sistem & Dashboard */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-8 shadow-xl transform md:-translate-y-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
              <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">dashboard</span>
              </div>
              <h3 className="text-xl font-black text-white mb-3">Sistem & Dashboard</h3>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">Pembuatan aplikasi pemantauan data kustom internal bisnis, kasir (POS), keuangan petty cash, hingga rekap pelaporan otomatis.</p>
              <ul className="space-y-3">
                {['Manajemen Relasi DB', 'Ekspor Laporan PDF/Excel', 'Hak Akses Keamanan Enkripsi'].map((fitur, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                    <span className="material-symbols-outlined text-blue-400 text-lg">check_circle</span>
                    {fitur}
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 3: Custom Web App */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="w-14 h-14 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">laptop_mac</span>
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-3">Custom Web App</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">Pengembangan platform sistem belajar mandiri digital Learning Management System (LMS), portal edukasi khusus, sesuai alur logika kebutuhan bisnis.</p>
              <ul className="space-y-3">
                {['Arsitektur Skalabilitas', 'Integrasi API Endpoint', 'Panel Dashboard Admin Dinamis'].map((fitur, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
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
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold text-xs rounded-full uppercase tracking-wider mb-4 shadow-sm">
              <span className="material-symbols-outlined text-sm">folder_open</span>
              Portfolio
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-50">Projects</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Beberapa karya aplikasi web pilihan terbaik yang telah selesai saya rancang dan kembangkan.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.slice(0, 6).map((item) => {
                let techStackArray = [];
                try {
                  techStackArray = typeof item.tech_stack === "string" ? JSON.parse(item.tech_stack) : item.tech_stack;
                } catch (e) {
                  techStackArray = [];
                }

                return (
                  <div
                    key={item.id}
                    className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full"
                  >
                    <div className="relative h-64 overflow-hidden bg-slate-100 p-2">
                      <div className="w-full h-full rounded-2xl overflow-hidden relative">
                        {item.image_url ? (
                          <>
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                              <Link
                                href={`/projects/${item.id}`}
                                className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600"
                              >
                                <span className="material-symbols-outlined text-xl">visibility</span>
                                View Details
                              </Link>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-slate-50">
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
                      <div className="mt-auto pt-4 border-t border-slate-100">
                        <div className="flex flex-wrap gap-2">
                          {techStackArray.slice(0, 3).map((t, i) => (
                            <span
                              key={i}
                              className="text-xs px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg font-bold flex items-center gap-1"
                            >
                              {t.name}
                            </span>
                          ))}
                          {techStackArray.length > 3 && (
                            <span className="text-xs px-2 py-1.5 text-slate-400 font-bold">+{techStackArray.length - 3}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-16">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:border-blue-300 hover:text-blue-600 hover:shadow-lg transition-all"
            >
              View All Projects
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CONTACT & FORM SECTION (Sesuai dengan tabel DB messages) ================= */}
      <section id="contact" className="py-24 px-5 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] opacity-60 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Let's Work <span className="text-blue-600">Together</span></h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Punya ide proyek menarik atau kebutuhan sistem untuk bisnis Anda? Mari diskusikan sekarang.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            
            {/* KIRI: Info Kontak & Social Media */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                <h3 className="text-2xl font-black text-slate-800 mb-6">Connect</h3>
                <div className="space-y-4">
                  {profile?.instagram_link && (
                    <a href={profile.instagram_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-pink-300 hover:shadow-md transition-all group">
                      <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined">photo_camera</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Instagram</p>
                        <p className="font-bold text-slate-700 group-hover:text-pink-600 transition-colors">Follow Me</p>
                      </div>
                    </a>
                  )}
                  
                  {profile?.github_link && (
                    <a href={profile.github_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-slate-400 hover:shadow-md transition-all group">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined">terminal</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">GitHub</p>
                        <p className="font-bold text-slate-700 group-hover:text-slate-900 transition-colors">View Code</p>
                      </div>
                    </a>
                  )}

                  {profile?.linkedin_link && (
                    <a href={profile.linkedin_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all group">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined">work</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">LinkedIn</p>
                        <p className="font-bold text-slate-700 group-hover:text-blue-700 transition-colors">Network Connect</p>
                      </div>
                    </a>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-slate-200">
                  <a
                    href="mailto:akbarfirdaus009@gmail.com"
                    className="w-full py-4 bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">mail</span>
                    Direct Email
                  </a>
                </div>
              </div>
            </div>

            {/* KANAN: Form Pengiriman Pesan (Aktif & Valid ke Endpoint Backend) */}
            <div className="lg:col-span-8">
              <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined text-blue-500 text-3xl">edit_document</span>
                  Kirim Pesan
                </h3>
                
                <form onSubmit={handleSendMsg} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Input Nama */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Nama Anda
                      </label>
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
                    
                    {/* Input Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Alamat Email
                      </label>
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

                  {/* Input Project Type (Radio Buttons Styled) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                      Tipe Proyek
                    </label>
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
                              ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200"
                              : "bg-slate-50 text-slate-500 border-slate-200 hover:border-blue-300 hover:bg-white hover:text-blue-600"
                          }`}
                        >
                          <span className="material-symbols-outlined">{type.icon}</span>
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Pesan */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Isi Pesan / Deskripsi Proyek
                    </label>
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

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="group w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3"
                  >
                    <span>Kirim Pesan Sekarang</span>
                    <span className="material-symbols-outlined group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                      send
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />

      {/* STYLE UNTUK ANIMASI BACKGROUND HERO */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
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