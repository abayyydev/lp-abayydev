"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import AdminFooter from "@/components/AdminFooter";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState("Muhammad Akbar");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    
    if (storedUsername) {
      setUsername(storedUsername);
    }

    if (!token) {
      Swal.fire({
        title: "Akses Ditolak",
        text: "Silakan login terlebih dahulu",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        router.push("/login");
      });
    } else {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [pathname, router]);

  const handleLogout = () => {
    Swal.fire({
      title: "Konfirmasi Logout",
      text: "Apakah Anda yakin ingin keluar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        router.push("/login");
      }
    });
  };

  const tabs = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "dashboard" },
    { name: "Analytics", path: "/admin/analytics", icon: "analytics" },
    { name: "Projects", path: "/admin/projects", icon: "folder" },
    { name: "Profile", path: "/admin/profile", icon: "person" },
    { name: "Skills", path: "/admin/skills", icon: "bolt" },
    { name: "Inbox", path: "/admin/messages", icon: "mail" },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
      />

      {/* OVERLAY MOBILE - Menggunakan efek blur terang (glassmorphism), bukan warna hitam pekat */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-white/20 backdrop-blur-md md:hidden transition-all duration-300 ease-in-out"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-[260px] bg-[#0B1120] border-r border-slate-800/60 shadow-2xl transform transition-transform duration-300 ease-in-out md:relative flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/80 bg-[#0F172A]/50">
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="material-symbols-outlined text-white text-lg">admin_panel_settings</span>
            </span>
            Admin<span className="text-blue-500">Panel</span>
          </h1>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="md:hidden text-slate-400 hover:text-white bg-slate-800/50 p-1.5 rounded-lg transition-colors focus:outline-none"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="px-3 text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] mb-4">Menu Utama</p>
          {tabs.map((tab) => {
            const isActive = pathname === tab.path || (tab.path !== "/admin/dashboard" && pathname.startsWith(tab.path));
            return (
              <Link
                key={tab.path}
                href={tab.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all duration-300 overflow-hidden ${
                  isActive
                    ? "text-white shadow-lg shadow-blue-900/40 translate-x-1"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50 hover:translate-x-1"
                }`}
              >
                {/* Latar belakang dinamis untuk menu aktif */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-100 transition-opacity"></div>
                )}
                
                {/* Indikator bar kecil di sebelah kiri saat aktif */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10"></div>
                )}

                <span className={`material-symbols-outlined text-xl relative z-10 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                  {tab.icon}
                </span>
                <span className="relative z-10 tracking-wide">{tab.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-5 border-t border-slate-800/80 bg-slate-900/50 flex flex-col gap-3">
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-slate-300 bg-slate-800/80 border border-slate-700/50 rounded-xl hover:text-white hover:bg-slate-700 hover:border-slate-600 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">language</span> Lihat Website
          </Link>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 text-sm font-bold rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20 transition-all"
          >
            <span className="material-symbols-outlined text-lg">logout</span> Logout Sistem
          </button>
        </div>
      </aside>

      {/* RIGHT SIDE WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        
        {/* HEADNAVBAR */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 flex items-center justify-between shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="md:hidden text-slate-500 hover:text-blue-600 focus:outline-none bg-slate-100/80 hover:bg-blue-50 p-2.5 rounded-xl transition-all"
            >
              <span className="material-symbols-outlined text-xl">menu_open</span>
            </button>
            
            <div className="hidden md:flex flex-col">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Workspace</span>
              <span className="text-sm font-black text-slate-700">Dashboard Control</span>
            </div>
          </div>

          <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:flex flex-col">
              <span className="text-sm font-black text-slate-800 leading-tight">{username}</span>
              <span className="text-xs text-slate-500 font-semibold">Administrator</span>
            </div>
            
            <div className="relative group cursor-pointer">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-50 to-indigo-50 border-2 border-white shadow-md flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform duration-300">
                <span className="material-symbols-outlined text-2xl">account_circle</span>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
          </div>
        </header>

        {/* CONTAINER KONTEN */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8 min-h-[75vh]">
              {children}
            </div>
            
            <div className="mt-8">
              <AdminFooter />
            </div>
          </div>
        </main>
      </div>
      
    </div>
  );
}