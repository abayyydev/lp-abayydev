"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    messages: 0,
    totalVisits: 0,
    todayVisits: 0,
  });
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Selamat Datang");
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    // Set Greeting berdasarkan waktu
    const hour = new Date().getHours();
    if (hour < 11) setGreeting("Selamat Pagi");
    else if (hour < 15) setGreeting("Selamat Siang");
    else if (hour < 18) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");

    // Ambil nama admin dari local storage
    const storedName = localStorage.getItem("username");
    if (storedName) setAdminName(storedName);

    async function fetchDashboardStats() {
      try {
        const token = localStorage.getItem("token") || "";
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Tarik semua data secara bersamaan (Parallel Fetching)
        const [projectsRes, skillsRes, messagesRes, analyticsRes] = await Promise.all([
          axios.get("https://ukmelrahma.my.id/portofolio-abayyy/projects"),
          axios.get("https://ukmelrahma.my.id/portofolio-abayyy/skills"),
          axios.get("https://ukmelrahma.my.id/portofolio-abayyy/messages", config),
          axios.get("https://ukmelrahma.my.id/portofolio-abayyy/analytics", config),
        ]);

        setStats({
          projects: projectsRes.data.length || 0,
          skills: skillsRes.data.length || 0,
          messages: messagesRes.data.length || 0,
          totalVisits: analyticsRes.data.total_visits || 0,
          todayVisits: analyticsRes.data.today_visits || 0,
        });
      } catch (error) {
        console.error("Gagal memuat statistik dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, []);

  const cardsInfo = [
    { 
      title: "Total Project", 
      value: stats.projects, 
      icon: "folder_managed", 
      color: "blue", 
      link: "/admin/projects",
      desc: "Portofolio yang telah dipublish"
    },
    { 
      title: "Skill Dikuasai", 
      value: stats.skills, 
      icon: "military_tech", 
      color: "amber", 
      link: "/admin/skills",
      desc: "Teknologi yang Anda pelajari"
    },
    { 
      title: "Pesan Masuk", 
      value: stats.messages, 
      icon: "mark_email_unread", 
      color: "emerald", 
      link: "/admin/messages",
      desc: "Inbox dari calon klien"
    },
    { 
      title: "Total Pengunjung", 
      value: stats.totalVisits, 
      icon: "public", 
      color: "purple", 
      link: "/admin/analytics",
      desc: "Kunjungan website keseluruhan"
    },
    { 
      title: "Pengunjung Hari Ini", 
      value: stats.todayVisits, 
      icon: "today", 
      color: "rose", 
      link: "/admin/analytics",
      desc: "Trafik website hari ini"
    },
  ];

  // Helper function untuk warna dinamis Tailwind
  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white border-blue-100",
      amber: "bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white border-amber-100",
      emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white border-emerald-100",
      purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white border-purple-100",
      rose: "bg-rose-50 text-rose-600 group-hover:bg-rose-500 group-hover:text-white border-rose-100",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="w-full">
      {/* HEADER GREETING */}
      <div className="mb-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-20 w-24 h-24 bg-blue-500 opacity-10 rounded-full blur-xl"></div>
        
        <div className="relative z-10">
          <h3 className="text-3xl font-black mb-2 flex items-center gap-3">
            {greeting}, {adminName}! <span className="text-3xl">👋</span>
          </h3>
          <p className="text-slate-300 font-medium text-sm md:text-base max-w-xl leading-relaxed">
            Ini adalah pusat kendali website portofolio Anda. Pantau perkembangan trafik pengunjung, kelola project terbaru, dan respons pesan dari klien potensial dengan mudah.
          </p>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-600">bar_chart</span>
          Statistik Keseluruhan
        </h4>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh] bg-slate-50 rounded-3xl border border-slate-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-slate-400 font-medium animate-pulse">Menyiapkan data dashboard...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {cardsInfo.map((card, index) => (
            <Link 
              href={card.link} 
              key={index} 
              className={`group bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${index === 4 ? "sm:col-span-2 lg:col-span-1 xl:col-span-1" : ""}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300 border ${getColorClasses(card.color)}`}>
                  <span className="material-symbols-outlined text-3xl">{card.icon}</span>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-slate-800 transition-colors">arrow_outward</span>
              </div>
              
              <div>
                <h5 className="text-4xl font-black text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                  {card.value}
                </h5>
                <p className="font-bold text-slate-500 text-sm">{card.title}</p>
                <p className="text-xs text-slate-400 mt-2 line-clamp-1">{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* QUICK ACTIONS & INFO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        
        {/* Info Card */}
        <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-3xl relative overflow-hidden">
          <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-blue-500/10 rotate-12">rocket_launch</span>
          <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-3 text-lg relative z-10">
            <span className="material-symbols-outlined text-blue-600">tips_and_updates</span> 
            Pusat Bantuan Cepat
          </h4>
          <p className="text-sm text-blue-700/80 leading-relaxed mb-4 relative z-10">
            Selalu pastikan Anda mempublikasikan project terbaru Anda untuk menarik perhatian perekrut. Jangan lupa untuk memeriksa halaman <b>Analytics</b> untuk melihat dari mana saja pengunjung Anda berasal hari ini.
          </p>
          <Link href="/admin/profile" className="inline-flex items-center gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl transition-colors relative z-10">
            Update Profil CV <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {/* Server Status Card */}
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-1 text-lg">
              <span className="material-symbols-outlined text-emerald-500">dns</span> 
              Status Sistem
            </h4>
            <p className="text-sm text-slate-500 mb-4">Semua layanan berjalan dengan normal.</p>
            
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-600">Database API</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-600">Tracking System</span>
              </div>
            </div>
          </div>
          <div className="w-24 h-24 opacity-20">
            <span className="material-symbols-outlined text-[80px] text-slate-600">check_circle</span>
          </div>
        </div>

      </div>
    </div>
  );
}