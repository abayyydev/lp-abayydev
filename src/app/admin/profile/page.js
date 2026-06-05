"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function ProfileManager() {
  const [form, setForm] = useState({
    full_name: "", role: "", bio: "",
    instagram_link: "", github_link: "", linkedin_link: "",
    whatsapp: "", email: "",
  });
  const [file, setFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [cvPreview, setCvPreview] = useState(null); // Menyimpan nama file atau status CV

  useEffect(() => {
    axios.get("https://ukmelrahma.my.id/portofolio-abayyy/profile").then((res) => {
      if (res.data) {
        setForm(res.data);
        if (res.data.hero_image) setPreview(res.data.hero_image);
        if (res.data.cv_link) setCvPreview("CV sudah terunggah");
      }
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Append Data Teks
    Object.keys(form).forEach((key) => formData.append(key, form[key] || ""));
    
    // Append File Gambar
    if (file) formData.append("image", file);
    
    // Append File CV (PDF)
    if (cvFile) formData.append("cv_file", cvFile);

    try {
      await axios.post("https://ukmelrahma.my.id/portofolio-abayyy/profile", formData);
      Swal.fire({
        title: "Sukses!",
        text: "Profil dan CV berhasil diperbarui.",
        icon: "success",
        confirmButtonColor: "#2563eb",
      });
      // Refresh penanda CV
      if(cvFile) setCvPreview(cvFile.name);
    } catch (error) {
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat menyimpan data.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-600 text-3xl">manage_accounts</span>
          Pengaturan Profil Utama
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Perbarui identitas, kontak, dan unggah berkas CV Anda.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* KOLOM KIRI */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Card Biodata */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h4 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-slate-400">badge</span> Biodata Utama
            </h4>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Nama Lengkap</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-slate-400 text-xl">person</span>
                  <input type="text" value={form.full_name || ""} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3 pl-11 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Role / Jabatan</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-slate-400 text-xl">work</span>
                  <input type="text" value={form.role || ""} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3 pl-11 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Bio Singkat</label>
                <textarea value={form.bio || ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3 rounded-xl h-24 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" required />
              </div>
            </div>
          </div>

          {/* Card Kontak & Sosial Media */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h4 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-slate-400">contact_mail</span> Kontak & Sosial Media
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Nomor WhatsApp</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-3 text-green-500 text-lg">chat</span>
                  <input type="text" placeholder="62812345..." value={form.whatsapp || ""} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-2.5 pl-10 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Email Utama (Gmail)</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-3 text-red-500 text-lg">mail</span>
                  <input type="email" placeholder="email@gmail.com" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-2.5 pl-10 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input type="url" placeholder="Instagram URL" value={form.instagram_link || ""} onChange={(e) => setForm({ ...form, instagram_link: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
              <input type="url" placeholder="GitHub URL" value={form.github_link || ""} onChange={(e) => setForm({ ...form, github_link: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
              <input type="url" placeholder="LinkedIn URL" value={form.linkedin_link || ""} onChange={(e) => setForm({ ...form, linkedin_link: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
            </div>
          </div>

        </div>

        {/* KOLOM KANAN */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Upload Foto */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col items-center">
            <h4 className="text-lg font-bold text-slate-800 mb-6 self-start flex items-center gap-2 border-b border-slate-100 pb-3 w-full">
              <span className="material-symbols-outlined text-slate-400">account_circle</span> Foto Profil Hero
            </h4>
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-slate-100 shadow-md bg-slate-50 flex items-center justify-center mb-4">
              {preview ? <img src={preview} alt="Profile" className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-5xl text-slate-300">image</span>}
            </div>
            <input type="file" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) { setFile(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); } }} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
          </div>

          {/* Upload CV File */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col items-center">
            <h4 className="text-lg font-bold text-slate-800 mb-6 self-start flex items-center gap-2 border-b border-slate-100 pb-3 w-full">
              <span className="material-symbols-outlined text-red-500">picture_as_pdf</span> Unggah File CV
            </h4>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors relative">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <span className="material-symbols-outlined text-slate-400 mb-1">upload_file</span>
                <p className="text-sm font-semibold text-slate-500">Pilih Berkas PDF</p>
                <p className="text-[11px] text-slate-400 mt-1">Maksimal 5MB (Format .pdf)</p>
              </div>
              <input type="file" className="hidden" accept=".pdf" onChange={(e) => { if (e.target.files?.[0]) { setCvFile(e.target.files[0]); setCvPreview(e.target.files[0].name); } }} />
            </label>
            {cvPreview && (
              <div className="mt-3 flex items-center gap-2 text-sm text-green-600 font-bold bg-green-50 px-4 py-2 rounded-lg border border-green-100 w-full justify-center">
                <span className="material-symbols-outlined text-lg">check_circle</span> {cvPreview}
              </div>
            )}
          </div>

          {/* Tombol Simpan */}
          <div className="mt-auto">
            <button type="submit" className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">save</span>
              SIMPAN SEMUA PERUBAHAN
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}