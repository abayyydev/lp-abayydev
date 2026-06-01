"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function ProfileManager() {
  const [form, setForm] = useState({
    full_name: "",
    role: "",
    bio: "",
    instagram_link: "",
    github_link: "",
    linkedin_link: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // State khusus untuk Data CV Terstruktur
  const [cvData, setCvData] = useState({
    summary: "",
    experiences: [],
    educations: [],
  });

  useEffect(() => {
    axios.get("http://localhost:5000/profile").then((res) => {
      if (res.data) {
        setForm(res.data);
        if (res.data.hero_image) setPreview(res.data.hero_image);
        
        // Parsing data CV jika ada
        if (res.data.cv_html) {
          try {
            setCvData(JSON.parse(res.data.cv_html));
          } catch (e) {
            console.error("Format CV tidak valid", e);
          }
        }
      }
    });
  }, []);

  // --- HANDLER UNTUK CV BUILDER ---
  const addExperience = () => {
    setCvData({
      ...cvData,
      experiences: [
        ...cvData.experiences,
        { id: Date.now(), company: "", role: "", period: "", description: "" },
      ],
    });
  };

  const removeExperience = (id) => {
    setCvData({
      ...cvData,
      experiences: cvData.experiences.filter((exp) => exp.id !== id),
    });
  };

  const updateExperience = (id, field, value) => {
    const updated = cvData.experiences.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    setCvData({ ...cvData, experiences: updated });
  };

  const addEducation = () => {
    setCvData({
      ...cvData,
      educations: [
        ...cvData.educations,
        { id: Date.now(), school: "", degree: "", period: "", gpa: "" },
      ],
    });
  };

  const removeEducation = (id) => {
    setCvData({
      ...cvData,
      educations: cvData.educations.filter((edu) => edu.id !== id),
    });
  };

  const updateEducation = (id, field, value) => {
    const updated = cvData.educations.map((edu) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    setCvData({ ...cvData, educations: updated });
  };

  // --- SUBMIT DATA ---
  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    Object.keys(form).forEach((key) => {
      if (key !== 'cv_html') formData.append(key, form[key] || "");
    });
    
    if (file) formData.append("image", file);
    
    // Simpan cvData sebagai JSON string ke dalam kolom cv_html
    formData.append("cv_html", JSON.stringify(cvData));

    try {
      await axios.post("http://localhost:5000/profile", formData);
      Swal.fire({
        title: "Sukses!",
        text: "Profil & CV Profesional berhasil diperbarui.",
        icon: "success",
        confirmButtonColor: "#2563eb",
      });
    } catch (error) {
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan pada server.",
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
          Pengaturan Profil & CV
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Perbarui informasi profil dan lengkapi data untuk CV interaktif Anda.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-8">
        
        {/* ROW ATAS: BIODATA DAN FOTO (Tetap sama seperti sebelumnya) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <h4 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="material-symbols-outlined text-slate-400">badge</span>
                Biodata Utama
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Nama Lengkap</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-slate-400 text-xl">person</span>
                    <input type="text" value={form.full_name || ""} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3 pl-11 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" required />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Role / Jabatan</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-slate-400 text-xl">work</span>
                    <input type="text" value={form.role || ""} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3 pl-11 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" required />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Bio Singkat</label>
                  <textarea value={form.bio || ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3 rounded-xl h-24 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none" required />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <h4 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="material-symbols-outlined text-slate-400">link</span> Tautan Sosial Media
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input type="url" placeholder="Instagram URL" value={form.instagram_link || ""} onChange={(e) => setForm({ ...form, instagram_link: e.target.value })} className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                <input type="url" placeholder="GitHub URL" value={form.github_link || ""} onChange={(e) => setForm({ ...form, github_link: e.target.value })} className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                <input type="url" placeholder="LinkedIn URL" value={form.linkedin_link || ""} onChange={(e) => setForm({ ...form, linkedin_link: e.target.value })} className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center h-full">
              <h4 className="text-lg font-bold text-slate-800 mb-6 self-start flex items-center gap-2 border-b border-slate-100 pb-3 w-full">
                <span className="material-symbols-outlined text-slate-400">account_circle</span> Foto Profil Hero
              </h4>
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-slate-100 shadow-md bg-slate-50 flex items-center justify-center mb-4">
                {preview ? <img src={preview} alt="Profile" className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-5xl text-slate-300">image</span>}
              </div>
              <input type="file" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) { setFile(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); } }} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* ROW BAWAH: DYNAMIC CV BUILDER */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h4 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="material-symbols-outlined text-blue-600">contact_page</span>
            Builder CV Interaktif
          </h4>
          <p className="text-xs text-slate-500 mb-6">Isi formulir di bawah ini. Sistem akan otomatis merakitnya menjadi dokumen CV berstandar profesional.</p>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch">
            
            {/* --- BAGIAN KIRI: FORM INPUT --- */}
            <div className="flex flex-col gap-6 overflow-y-auto h-[600px] pr-2 custom-scrollbar">
              
              {/* Ringkasan */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block flex items-center gap-1"><span className="material-symbols-outlined text-sm">edit_note</span> Ringkasan Profesional</label>
                <textarea 
                  value={cvData.summary} 
                  onChange={(e) => setCvData({...cvData, summary: e.target.value})} 
                  placeholder="Deskripsikan diri Anda secara profesional (Contoh: Web developer dengan pengalaman 3 tahun...)" 
                  className="w-full bg-white border border-slate-200 text-slate-800 p-3 rounded-xl h-24 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-sm" 
                />
              </div>

              {/* Pengalaman Kerja */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1"><span className="material-symbols-outlined text-sm">work</span> Pengalaman Kerja</label>
                  <button type="button" onClick={addExperience} className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-200 transition-colors flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">add</span> Tambah</button>
                </div>
                
                {cvData.experiences.length === 0 && <p className="text-xs text-slate-400 italic text-center py-4 bg-white rounded-xl border border-slate-100">Belum ada data pengalaman kerja.</p>}
                
                <div className="space-y-4">
                  {cvData.experiences.map((exp, index) => (
                    <div key={exp.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group">
                      <button type="button" onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-lg">delete</span></button>
                      <div className="grid grid-cols-2 gap-3 mb-3 pr-6">
                        <input type="text" placeholder="Nama Perusahaan" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="col-span-2 sm:col-span-1 w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-sm outline-none focus:border-blue-400" />
                        <input type="text" placeholder="Jabatan (cth: Frontend Dev)" value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} className="col-span-2 sm:col-span-1 w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-sm outline-none focus:border-blue-400" />
                        <input type="text" placeholder="Periode (cth: Jan 2024 - Sekarang)" value={exp.period} onChange={(e) => updateExperience(exp.id, 'period', e.target.value)} className="col-span-2 w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-sm outline-none focus:border-blue-400" />
                      </div>
                      <textarea placeholder="Deskripsi pekerjaan & pencapaian (Gunakan - untuk bullet point)" value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-sm outline-none focus:border-blue-400 h-20 resize-none" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pendidikan */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1"><span className="material-symbols-outlined text-sm">school</span> Pendidikan</label>
                  <button type="button" onClick={addEducation} className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-200 transition-colors flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">add</span> Tambah</button>
                </div>

                {cvData.educations.length === 0 && <p className="text-xs text-slate-400 italic text-center py-4 bg-white rounded-xl border border-slate-100">Belum ada data pendidikan.</p>}

                <div className="space-y-4">
                  {cvData.educations.map((edu, index) => (
                    <div key={edu.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group">
                      <button type="button" onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-lg">delete</span></button>
                      <div className="grid grid-cols-2 gap-3 pr-6">
                        <input type="text" placeholder="Nama Institusi / Universitas" value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} className="col-span-2 w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-sm outline-none focus:border-blue-400" />
                        <input type="text" placeholder="Gelar / Jurusan" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} className="col-span-2 sm:col-span-1 w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-sm outline-none focus:border-blue-400" />
                        <div className="col-span-2 sm:col-span-1 flex gap-2">
                          <input type="text" placeholder="Tahun (cth: 2022-2026)" value={edu.period} onChange={(e) => updateEducation(edu.id, 'period', e.target.value)} className="w-2/3 bg-slate-50 border border-slate-200 p-2 rounded-lg text-sm outline-none focus:border-blue-400" />
                          <input type="text" placeholder="IPK" value={edu.gpa} onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)} className="w-1/3 bg-slate-50 border border-slate-200 p-2 rounded-lg text-sm outline-none focus:border-blue-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* --- BAGIAN KANAN: LIVE PREVIEW KERTAS A4 --- */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">visibility</span> Live Preview (A4 Format)
              </label>
              <div className="w-full bg-slate-200 rounded-2xl p-4 sm:p-6 overflow-y-auto h-[600px] border border-slate-300 shadow-inner flex justify-center custom-scrollbar">
                
                {/* Desain Kertas CV */}
                <div className="bg-white w-full h-fit min-h-[700px] shadow-lg rounded-sm border border-gray-300 p-8 font-sans text-slate-800">
                  <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
                    <h1 className="text-3xl font-black uppercase tracking-wide text-slate-900">{form.full_name || "NAMA LENGKAP"}</h1>
                    <p className="text-blue-600 font-bold uppercase tracking-wider text-sm mt-1">{form.role || "JABATAN PROFESIONAL"}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      {form.linkedin_link ? "LinkedIn Tersedia" : "Profil Profesional"} | {form.github_link ? "GitHub Tersedia" : "Portfolio Terlampir"}
                    </p>
                  </div>

                  {cvData.summary && (
                    <div className="mb-6">
                      <h2 className="text-sm font-black uppercase text-slate-900 tracking-wider border-b border-slate-300 pb-1 mb-2">Ringkasan Profesional</h2>
                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{cvData.summary}</p>
                    </div>
                  )}

                  {cvData.experiences.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-sm font-black uppercase text-slate-900 tracking-wider border-b border-slate-300 pb-1 mb-2">Pengalaman Kerja</h2>
                      {cvData.experiences.map((exp, idx) => (
                        <div key={idx} className="mb-3">
                          <div className="flex justify-between font-bold text-xs text-slate-800">
                            <span>{exp.company} {exp.role ? `— ${exp.role}` : ""}</span>
                            <span>{exp.period}</span>
                          </div>
                          <div className="text-xs text-slate-600 mt-1 whitespace-pre-wrap leading-relaxed pl-3 border-l-2 border-slate-200">
                            {exp.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {cvData.educations.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-sm font-black uppercase text-slate-900 tracking-wider border-b border-slate-300 pb-1 mb-2">Pendidikan</h2>
                      {cvData.educations.map((edu, idx) => (
                        <div key={idx} className="mb-3">
                          <div className="flex justify-between font-bold text-xs text-slate-800">
                            <span>{edu.school} {edu.degree ? `— ${edu.degree}` : ""}</span>
                            <span>{edu.period}</span>
                          </div>
                          {edu.gpa && <p className="text-[11px] text-slate-500 mt-0.5">IPK/Nilai: {edu.gpa}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 pt-4">
          <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">save</span>
            SIMPAN PERUBAHAN DATA & CV
          </button>
        </div>

      </form>
    </div>
  );
}