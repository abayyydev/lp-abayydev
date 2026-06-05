"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        const [projectsRes, skillsRes, messagesRes] = await Promise.all([
          axios.get("https://ukmelrahma.my.id/portofolio-abayyy/projects"),
          axios.get("https://ukmelrahma.my.id/portofolio-abayyy/skills"),
          axios.get("https://ukmelrahma.my.id/portofolio-abayyy/messages"),
        ]);

        setStats({
          projects: projectsRes.data.length || 0,
          skills: skillsRes.data.length || 0,
          messages: messagesRes.data.length || 0,
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
    { title: "Total Projects", value: stats.projects, icon: "folder", color: "bg-blue-500", textColor: "text-blue-600", bgLight: "bg-blue-50" },
    { title: "Mastered Skills", value: stats.skills, icon: "bolt", color: "bg-amber-500", textColor: "text-amber-600", bgLight: "bg-amber-50" },
    { title: "Inbox Messages", value: stats.messages, icon: "mail", color: "bg-emerald-500", textColor: "text-emerald-600", bgLight: "bg-emerald-50" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-black text-gray-800">📊 Overview Ringkasan</h3>
        <p className="text-sm text-gray-400 mt-1">Selamat datang kembali! Berikut adalah statistik data portofolio Anda saat ini.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardsInfo.map((card, index) => (
            <div key={index} className="bg-white border border-gray-100 rounded-2xl p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">{card.title}</span>
                <span className="text-3xl font-black text-gray-800 mt-2">{card.value}</span>
              </div>
              <div className={`w-14 h-14 ${card.bgLight} ${card.textColor} rounded-xl flex items-center justify-center shadow-inner`}>
                <span className="material-symbols-outlined text-3xl">{card.icon}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Tambahan */}
      <div className="mt-8 bg-slate-50 border border-slate-200/60 p-6 rounded-2xl">
        <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-blue-600">info</span> 
          Sistem Informasi Panel
        </h4>
        <p className="text-sm text-gray-500 leading-relaxed">
          Gunakan menu navigasi di sebelah kiri untuk melakukan manajemen konten data website portofolio Anda seperti memperbarui riwayat proyek, menambah ikon kompetensi teknologi, ataupun merespons pesan masuk dari klien.
        </p>
      </div>
    </div>
  );
}