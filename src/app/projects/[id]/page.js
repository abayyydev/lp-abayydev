"use client";
import { useState, useEffect, use } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";

export default function ProjectDetail({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [techStack, setTechStack] = useState([]);
  const [galleryUrls, setGalleryUrls] = useState([]); // State baru untuk galeri
  const [relatedProjects, setRelatedProjects] = useState([]);

  useEffect(() => {
    if (id) {
      getProjectDetail(id);
      getRelatedProjects();
    }
  }, [id]);

  const getProjectDetail = async (idProject) => {
    try {
      const response = await axios.get(
        `https://ukmelrahma.my.id/portofolio-abayyy/projects/${idProject}`
      );
      const data = response.data;
      setProject(data);

      // Parsing Tech Stack
      if (data.tech_stack) {
        try {
          let parsedStack =
            typeof data.tech_stack === "string"
              ? JSON.parse(data.tech_stack)
              : data.tech_stack;
          setTechStack(parsedStack);
        } catch (err) {
          setTechStack([]);
        }
      }

      // Parsing Gallery URLs
      if (data.gallery_urls) {
        try {
          let parsedGallery =
            typeof data.gallery_urls === "string"
              ? JSON.parse(data.gallery_urls)
              : data.gallery_urls;
          setGalleryUrls(parsedGallery || []);
        } catch (err) {
          setGalleryUrls([]);
        }
      }

    } catch (error) {
      console.error("Gagal ambil detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRelatedProjects = async () => {
    try {
      const response = await axios.get("https://ukmelrahma.my.id/portofolio-abayyy/projects");
      if (project) {
        const filtered = response.data.filter((p) => p.id !== id).slice(0, 3);
        setRelatedProjects(filtered);
      } else {
        setRelatedProjects(response.data.slice(0, 3));
      }
    } catch (error) {
      console.error("Gagal ambil project terkait:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <PublicHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-violet-500 border-t-transparent mb-4"></div>
            <p className="text-white/30">Memuat detail project...</p>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <PublicHeader />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/[0.04] rounded-2xl border border-white/[0.06] flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-white/20">search_off</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Project Tidak Ditemukan
            </h1>
            <p className="text-white/30 mb-8">
              Project yang Anda cari tidak tersedia atau telah dihapus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-violet-500/20 transition-all"
              >
                Kembali
              </button>
              <Link
                href="/"
                className="px-6 py-3 border border-white/[0.1] text-white/60 font-semibold rounded-xl hover:bg-white/[0.05] hover:text-white transition-all"
              >
                Lihat Portfolio
              </Link>
            </div>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Import Google Material Symbols */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

      <PublicHeader />

      {/* Hero Section */}
      <div className="relative pt-20 pb-14 px-5 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a0a0f 0%, #1a1028 40%, #0d1520 70%, #0a0a0f 100%)" }}
      >
        {/* Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/8 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Back Link */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/40 hover:text-violet-400 font-medium text-sm transition-colors group"
            >
              <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
              Kembali ke Portfolio
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 font-semibold text-xs rounded-full uppercase tracking-wider mb-5">
                <span className="material-symbols-outlined text-sm">folder_open</span>
                Case Study
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
                {project.title}
              </h1>

              {project.role && (
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-violet-400">person</span>
                  <span className="text-white/60 font-semibold text-lg">{project.role}</span>
                </div>
              )}

              <p className="text-lg text-white/35 mb-8 leading-relaxed">
                {project.description?.substring(0, 180)}...
              </p>

              {/* Tech Stack Badges */}
              <div className="flex flex-wrap gap-2 mb-8">
                {techStack.slice(0, 5).map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-white/[0.04] text-white/60 text-sm font-medium rounded-lg border border-white/[0.06] flex items-center gap-1.5"
                  >
                    {tech.icon && <img src={tech.icon} alt={tech.name} className="w-4 h-4 object-contain" />}
                    {tech.name}
                  </span>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {project.demo_link && (
                  <a
                    href={project.demo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group px-6 py-3.5 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-violet-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Live Preview</span>
                    <span className="material-symbols-outlined text-lg group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">open_in_new</span>
                  </a>
                )}
                {project.repo_link && (
                  <a
                    href={project.repo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 bg-white/[0.04] border border-white/[0.1] text-white/70 font-bold rounded-xl hover:bg-white/[0.08] hover:border-violet-500/30 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">terminal</span>
                    <span>View Code</span>
                  </a>
                )}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] h-80 md:h-96 bg-[#12121a] group">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <span className="material-symbols-outlined text-5xl">image_not_supported</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/60 via-transparent to-transparent"></div>
              </div>

              {project.created_at && (
                <div className="absolute -bottom-4 right-4 bg-[#12121a] border border-white/[0.08] px-5 py-3 rounded-xl shadow-xl">
                  <div className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">Dibuat pada</div>
                  <div className="font-bold text-white/80 text-sm">
                    {formatDate(project.created_at)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none"></div>
      </div>

      {/* Main Content */}
      <main className="py-14 px-5">
        <div className="max-w-6xl mx-auto">
          {/* Project Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            {/* Left Column - Project Description */}
            <div className="lg:col-span-2">
              <div className="bg-white/[0.02] rounded-2xl p-7 md:p-8 border border-white/[0.06] h-full">
                <h2 className="text-xl font-bold text-white mb-5 pb-4 border-b border-white/[0.06] flex items-center gap-2">
                  <span className="material-symbols-outlined text-violet-400">description</span>
                  Tentang Project
                </h2>
                <div className="text-white/40 leading-relaxed whitespace-pre-line text-[15px]">
                  {project.description}
                </div>
              </div>
            </div>

            {/* Right Column - Info Sidebar */}
            <div className="space-y-5">
              {/* Tech Stack Card */}
              <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/[0.06]">
                <h3 className="font-bold text-white mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-violet-400 text-lg">code</span>
                  Teknologi
                </h3>

                {techStack.length > 0 ? (
                  <div className="space-y-4">
                    {techStack.map((tech, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="font-medium text-white/50 flex items-center gap-2">
                            {tech.icon && (
                              <img src={tech.icon} alt={tech.name} className="w-4 h-4 object-contain" />
                            )}
                            {tech.name}
                          </span>
                          <span className="text-white/25 text-xs font-semibold">
                            {tech.percentage || "0"}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full transition-all duration-700"
                            style={{ width: `${tech.percentage || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/20 text-sm">
                    Teknologi tidak tersedia
                  </p>
                )}
              </div>

              {/* Action Card */}
              <div className="bg-gradient-to-br from-violet-600/10 to-cyan-500/10 rounded-2xl p-6 border border-violet-500/15 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl"></div>
                <h3 className="font-bold text-white mb-2 relative z-10">
                  Ingin Project Serupa?
                </h3>
                <p className="text-white/30 text-sm mb-4 relative z-10">
                  Hubungi saya untuk membahas kebutuhan project Anda.
                </p>
                <a
                  href="/#contact"
                  className="block w-full py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold rounded-xl text-center hover:shadow-lg hover:shadow-violet-500/20 transition-all relative z-10"
                >
                  Konsultasi Project
                </a>
              </div>
            </div>
          </div>

          {/* Project Gallery */}
          {(project.image_url || galleryUrls.length > 0) && (
            <div className="mb-16">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-violet-400">collections</span>
                Galeri Project
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Gambar Utama (Thumbnail) di Kiri */}
                <div className="relative rounded-2xl overflow-hidden h-72 md:h-80 bg-[#12121a] border border-white/[0.06] group">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={`Preview utama ${project.title}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      <span className="material-symbols-outlined text-4xl">image_not_supported</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/50 to-transparent pointer-events-none"></div>
                </div>

                {/* Multiple Upload Gallery di Kanan */}
                <div className="grid grid-cols-2 gap-4 h-72 md:h-80">
                  {galleryUrls.length > 0 ? (
                    galleryUrls.map((url, idx) => (
                      <div key={idx} className="relative rounded-2xl overflow-hidden h-full bg-[#12121a] border border-white/[0.06] group">
                        <img
                          src={url}
                          alt={`Galeri ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/40 to-transparent pointer-events-none"></div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 flex flex-col items-center justify-center bg-white/[0.02] border border-dashed border-white/[0.08] rounded-2xl">
                      <span className="material-symbols-outlined text-3xl text-white/10 mb-2">add_photo_alternate</span>
                      <p className="text-white/15 text-sm">Tidak ada foto galeri tambahan</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="mb-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-violet-400">apps</span>
                  Project Lainnya
                </h2>
                <Link
                  href="/"
                  className="text-violet-400 hover:text-violet-300 font-medium text-sm flex items-center gap-1 group transition-colors"
                >
                  Lihat semua
                  <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">chevron_right</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {relatedProjects.map((relatedProject) => {
                  let relatedTechStack = [];
                  try {
                    relatedTechStack =
                      typeof relatedProject.tech_stack === "string"
                        ? JSON.parse(relatedProject.tech_stack)
                        : relatedProject.tech_stack || [];
                  } catch (e) {
                    relatedTechStack = [];
                  }

                  return (
                    <Link
                      key={relatedProject.id}
                      href={`/projects/${relatedProject.id}`}
                      className="group bg-white/[0.02] rounded-2xl overflow-hidden border border-white/[0.06] hover:border-violet-500/30 hover:bg-white/[0.04] transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(139,92,246,0.08)]"
                    >
                      <div className="h-44 overflow-hidden bg-[#12121a] relative">
                        {relatedProject.image_url ? (
                          <img
                            src={relatedProject.image_url}
                            alt={relatedProject.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/15">
                            <span className="material-symbols-outlined text-3xl">image_not_supported</span>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0a0a0f]/60 to-transparent pointer-events-none"></div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-white/80 mb-2 group-hover:text-violet-300 transition-colors line-clamp-1">
                          {relatedProject.title}
                        </h3>
                        <p className="text-white/25 text-sm mb-3 line-clamp-2 leading-relaxed">
                          {relatedProject.description?.substring(0, 100)}...
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {relatedTechStack.slice(0, 3).map((tech, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-violet-500/10 text-violet-300/60 text-[11px] font-semibold rounded-md uppercase tracking-wider"
                            >
                              {tech.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-white/[0.06]">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/30 hover:text-white font-medium transition-colors group"
            >
              <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
              Kembali
            </button>

            <a
              href="/#contact"
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-violet-500/20 transition-all flex items-center gap-2"
            >
              Mulai Project Anda
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </a>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}