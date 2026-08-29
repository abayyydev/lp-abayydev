"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";

export default function AllProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("https://ukmelrahma.my.id/portofolio-abayyy/projects");
        setProjects(res.data);
      } catch (error) {
        console.error("Gagal ambil data project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen font-sans bg-[#0a0a0f] text-[#f0f0f5] flex flex-col">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
      <PublicHeader />
      
      {/* HEADER SECTION */}
      <div className="relative pt-32 pb-20 px-5 overflow-hidden flex-grow"
        style={{ background: "linear-gradient(135deg, #0a0a0f 0%, #1a1028 40%, #0d1520 70%, #0a0a0f 100%)" }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/8 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/[0.06] text-white/40 font-semibold text-xs rounded-full uppercase tracking-wider mb-4">
              <span className="material-symbols-outlined text-sm">folder_open</span>
              Portfolio
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
              Semua <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Project</span>
            </h1>
            <p className="text-white/30 max-w-2xl mx-auto text-lg">
              Kumpulan seluruh karya aplikasi web yang telah selesai dirancang dan dikembangkan.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((item, index) => {
                let techStackArray = [];
                try { techStackArray = typeof item.tech_stack === "string" ? JSON.parse(item.tech_stack) : item.tech_stack; }
                catch (e) { techStackArray = []; }

                return (
                  <div
                    key={item.id}
                    className="group bg-white/[0.02] rounded-2xl overflow-hidden border border-white/[0.06] hover:border-violet-500/30 hover:bg-white/[0.04] transition-all duration-500 transform hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(139,92,246,0.08)] flex flex-col h-full"
                  >
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
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0a0a0f]/80 to-transparent pointer-events-none"></div>
                    </div>

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
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
