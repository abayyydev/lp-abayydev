"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function InboxManager() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/messages");
      setMessages(res.data);
    } catch (error) {
      console.error("Gagal ambil pesan");
    }
  };

  // Menggunakan Swal.fire alih-alih confirm() native agar UI tetap profesional
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Pesan?",
      text: "Pesan yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/messages/${id}`);
        fetchMessages(); // Refresh data
        Swal.fire({
          title: "Terhapus!",
          text: "Pesan berhasil dihapus.",
          icon: "success",
        });
      } catch (error) {
        Swal.fire({
          title: "Gagal!",
          text: "Terjadi kesalahan pada server.",
          icon: "error",
        });
      }
    }
  };

  // Format Tanggal
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full">
      {/* HEADER SECTION */}
      <div className="mb-8">
        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-600 text-3xl">
            inbox
          </span>
          Kotak Masuk
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold ml-2">
            {messages.length}
          </span>
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Kelola dan balas pesan masuk dari klien atau pengunjung portofolio Anda.
        </p>
      </div>

      {/* MESSAGES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length === 0 ? (
          <div className="col-span-1 md:col-span-2 bg-white border border-slate-100 rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
            <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">
              mark_email_read
            </span>
            <p className="font-bold text-slate-500 text-lg">Tidak ada pesan baru</p>
            <p className="text-sm text-slate-400 mt-1">Semua pesan telah dibaca atau kotak masuk kosong.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              {/* Header Card (Pengirim & Waktu) */}
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100 text-lg">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800">{msg.name}</h4>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-sm text-slate-500 hover:text-blue-600 hover:underline transition-colors"
                    >
                      {msg.email}
                    </a>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-lg whitespace-nowrap">
                  {formatDate(msg.created_at)}
                </span>
              </div>

              {/* Kategori Project */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[16px]">sell</span>
                  {msg.project_type}
                </span>
              </div>

              {/* Isi Pesan */}
              <div className="bg-slate-50 p-4.5 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed mb-6 flex-1 whitespace-pre-wrap p-4">
                {msg.message}
              </div>

              {/* Aksi Bawah */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-auto">
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="px-4 py-2 bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 font-bold rounded-xl transition-colors flex items-center gap-2 text-sm"
                  title="Hapus Pesan"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  <span className="hidden sm:inline">Hapus</span>
                </button>
                <a
                  href={`mailto:${msg.email}`}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-200 transition-all flex items-center gap-2 text-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">reply</span>
                  Balas Email
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}