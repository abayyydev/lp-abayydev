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

  // Konfigurasi list menu (Dashboard ditambahkan di urutan pertama)
  const tabs = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "dashboard" },
    { name: "Projects", path: "/admin/projects", icon: "folder" },
    { name: "Profile", path: "/admin/profile", icon: "person" },
    { name: "Skills", path: "/admin/skills", icon: "bolt" },
    { name: "Inbox", path: "/admin/messages", icon: "mail" },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-800 overflow-hidden">
      
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
      />

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-40 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-300 shadow-2xl transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Admin<span className="text-blue-500">Panel</span>
          </h1>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="md:hidden text-slate-400 hover:text-white focus:outline-none"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Menu Utama</p>
          {tabs.map((tab) => {
            const isActive = pathname === tab.path || (tab.path !== "/admin/dashboard" && pathname.startsWith(tab.path));
            return (
              <Link
                key={tab.path}
                href={tab.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30 translate-x-1"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1"
                }`}
              >
                <span className="material-symbols-outlined text-xl">{tab.icon}</span>
                {tab.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950/30">
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 px-4 py-3 mb-2 text-sm font-bold text-slate-300 bg-slate-800 border border-slate-700 rounded-xl hover:text-white hover:bg-slate-700 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">language</span> Lihat Website
          </Link>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 font-semibold rounded-xl hover:bg-red-950/30 hover:text-red-300 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">logout</span> Logout Sistem
          </button>
        </div>
      </aside>

      {/* RIGHT SIDE WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* HEADNAVBAR */}
        <header className="h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="md:hidden text-gray-600 hover:text-blue-600 focus:outline-none bg-gray-100 p-2 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            
            <div className="hidden md:flex flex-col">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Workspace</span>
              <span className="text-sm font-bold text-gray-700">Dashboard Control</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right hidden sm:flex flex-col">
              <span className="text-sm font-black text-gray-800 leading-tight">{username}</span>
              <span className="text-xs text-gray-400 font-medium">Administrator</span>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
              <span className="material-symbols-outlined text-2xl font-light">account_circle</span>
            </div>
          </div>
        </header>

        {/* CONTAINER KONTEN */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50">
          <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[75vh]">
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