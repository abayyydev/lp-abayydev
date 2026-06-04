"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({ name: "", category: "Frontend" });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = () => {
    axios
      .get("https://4g6q9fjz-5000.asse.devtunnels.ms/skills")
      .then((res) => setSkills(res.data))
      .catch((err) => console.error("Gagal mengambil data skills", err));
  };

  // FUNGSI HANDLE ADD YANG SEMPAT HILANG
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!file) {
      Swal.fire({
        title: "Peringatan!",
        text: "Pilih gambar icon (logo) terlebih dahulu!",
        icon: "warning",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("image", file);

    try {
      await axios.post("https://4g6q9fjz-5000.asse.devtunnels.ms/skills", formData);

      // Reset Form setelah sukses
      setForm({ name: "", category: "Frontend" });
      setFile(null);
      // Reset input file secara visual
      document.getElementById("skillFile").value = "";

      fetchSkills();
      Swal.fire({
        title: "Sukses!",
        text: "Skill baru berhasil ditambahkan.",
        icon: "success",
        confirmButtonColor: "#2563eb",
      });
    } catch (error) {
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat menambahkan skill.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  // FUNGSI HANDLE DELETE MENGGUNAKAN SWAL BUKAN NATIVE CONFIRM
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Skill?",
      text: "Skill yang dihapus tidak akan tampil di portofolio.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://4g6q9fjz-5000.asse.devtunnels.ms/skills/${id}`);
        fetchSkills();
        Swal.fire({
          title: "Terhapus!",
          text: "Skill berhasil dihapus.",
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

  return (
    <div className="w-full">
      {/* HEADER SECTION */}
      <div className="mb-8">
        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-600 text-3xl">
            bolt
          </span>
          Manajemen Keahlian
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Tambahkan atau hapus teknologi dan alat yang Anda kuasai.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* KOLOM KIRI: FORM TAMBAH (Porsi lebih kecil) */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-fit">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-slate-400">
                add_circle
              </span>
              Tambah Skill Baru
            </h4>
            
            <form onSubmit={handleAdd} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  Nama Skill
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-slate-400 text-xl">
                    code
                  </span>
                  <input
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3.5 pl-11 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                    placeholder="Contoh: React.js"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  Kategori
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-slate-400 text-xl">
                    category
                  </span>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3.5 pl-11 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all appearance-none"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Tools">Tools</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Database">Database</option>
                    <option value="DevOps">DevOps</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3.5 top-3.5 text-slate-400 pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  Upload Logo (PNG/SVG)
                </label>
                <input
                  id="skillFile"
                  type="file"
                  accept="image/*"
                  className="w-full text-sm text-slate-600 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer transition-all border border-slate-200 rounded-xl p-1 bg-slate-50"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
                <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">info</span>
                  Gunakan logo transparan (Rasio 1:1)
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">upload</span>
                  UPLOAD SKILL
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* KOLOM KANAN: LIST SKILL (Porsi lebih besar) */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm min-h-full">
            <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-amber-500">
                grid_view
              </span>
              Daftar Skill Tersimpan
              <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold ml-2">
                {skills.length}
              </span>
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col items-center justify-center shadow-sm hover:shadow-md hover:border-blue-200 transition-all relative group"
                >
                  {/* Tombol Hapus (Muncul saat hover) */}
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="absolute top-2 right-2 text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                    title="Hapus Skill"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>

                  {/* Gambar Icon */}
                  <div className="w-14 h-14 flex items-center justify-center mb-3 bg-white rounded-xl shadow-sm border border-slate-100 p-2 group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>

                  <div className="text-center w-full">
                    <div className="font-bold text-sm text-slate-800 truncate px-2">
                      {skill.name}
                    </div>
                    <div className="text-[10px] text-blue-600 font-bold uppercase bg-blue-50 px-2 py-1 rounded-md mt-1.5 inline-block border border-blue-100">
                      {skill.category}
                    </div>
                  </div>
                </div>
              ))}

              {/* State Kosong */}
              {skills.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
                  <span className="material-symbols-outlined text-6xl mb-3 text-slate-300">
                    extension_off
                  </span>
                  <p className="font-bold text-slate-500">Belum ada skill</p>
                  <p className="text-sm">Gunakan form di sebelah kiri untuk menambah.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}