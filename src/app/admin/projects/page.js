"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    role: "",
    demo_link: "",
    repo_link: "",
  });

  const [file, setFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [techStack, setTechStack] = useState([]);

  useEffect(() => {
    fetchProjects();
    fetchSkills();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("https://ukmelrahma.my.id/portofolio-abayyy/projects");
      setProjects(res.data);
    } catch (error) {
      console.error("Error fetching projects");
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await axios.get("https://ukmelrahma.my.id/portofolio-abayyy/skills");
      setAvailableSkills(res.data);
    } catch (error) {
      console.error("Error fetching skills");
    }
  };

  const openCreateModal = () => {
    setEditId(null);
    setForm({ title: "", description: "", role: "", demo_link: "", repo_link: "" });
    setFile(null);
    setGalleryFiles([]);
    setTechStack([{ skill_id: "", name: "", icon: "", percentage: 0 }]);
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      role: project.role || "",
      demo_link: project.demo_link || "",
      repo_link: project.repo_link || "",
    });
    setFile(null);
    setGalleryFiles([]);

    try {
      const parsedStack =
        typeof project.tech_stack === "string"
          ? JSON.parse(project.tech_stack)
          : project.tech_stack;
      setTechStack(parsedStack || []);
    } catch (e) {
      setTechStack([]);
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Project?",
      text: "Data akan terhapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://ukmelrahma.my.id/portofolio-abayyy/projects/${id}`);
        Swal.fire({
          title: "Terhapus!",
          text: "Project berhasil dihapus.",
          icon: "success",
        });
        fetchProjects();
      } catch (error) {
        Swal.fire({
          title: "Gagal!",
          text: "Gagal menghapus project.",
          icon: "error",
        });
      }
    }
  };

  const handleTechChange = (index, field, value) => {
    const newStack = [...techStack];

    if (field === "skill") {
      const selectedSkill = availableSkills.find(
        (s) => s.id.toString() === value.toString()
      );
      if (selectedSkill) {
        newStack[index].skill_id = selectedSkill.id;
        newStack[index].name = selectedSkill.name;
        newStack[index].icon = selectedSkill.icon;
      }
    } else {
      newStack[index][field] = value;
    }

    setTechStack(newStack);
  };

  const addTechRow = () => {
    setTechStack([
      ...techStack,
      { skill_id: "", name: "", icon: "", percentage: 0 },
    ]);
  };

  const removeTechRow = (index) => {
    const newStack = techStack.filter((_, i) => i !== index);
    setTechStack(newStack);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    if (file) formData.append("image", file);

    if (galleryFiles.length > 0) {
      galleryFiles.forEach((gFile) => {
        formData.append("gallery", gFile);
      });
    }

    formData.append("tech_stack", JSON.stringify(techStack));

    try {
      if (editId) {
        await axios.put(`https://ukmelrahma.my.id/portofolio-abayyy/projects/${editId}`, formData);
      } else {
        await axios.post("https://ukmelrahma.my.id/portofolio-abayyy/projects", formData);
      }
      Swal.fire({
        title: "Berhasil!",
        text: "Data project tersimpan.",
        icon: "success",
      });
      fetchProjects();
      setIsModalOpen(false);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Gagal menyimpan data.",
        icon: "error",
      });
    }
  };

  return (
    <div className="w-full">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-3xl">folder_managed</span>
            Manajemen Project
          </h3>
          <p className="text-sm text-slate-500 mt-1">Kelola data portofolio project Anda di sini.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <span className="material-symbols-outlined">add</span>
          Tambah Project
        </button>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="p-5">Thumbnail</th>
                <th className="p-5">Info Project</th>
                <th className="p-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-5 w-24">
                    {item.image_url ? (
                      <div className="h-16 w-16 md:h-20 md:w-20 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                        <img
                          src={item.image_url}
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                          alt={item.title}
                        />
                      </div>
                    ) : (
                      <div className="h-16 w-16 md:h-20 md:w-20 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined">image_not_supported</span>
                      </div>
                    )}
                  </td>
                  <td className="p-5">
                    <div className="font-extrabold text-slate-800 text-lg mb-1">{item.title}</div>
                    <div className="text-sm text-slate-500 line-clamp-2 max-w-lg leading-relaxed">
                      {item.description}
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors flex items-center justify-center"
                        title="Edit Project"
                      >
                        <span className="material-symbols-outlined text-xl">edit_document</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center"
                        title="Hapus Project"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-16">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <span className="material-symbols-outlined text-6xl mb-3 text-slate-200">folder_open</span>
                      <p className="font-medium text-slate-500">Belum ada project.</p>
                      <p className="text-sm">Klik tombol Tambah Project untuk memulai.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODERN GLASSMORPHISM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/20 backdrop-blur-md transition-all">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header (Sticky) */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-5 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">
                  {editId ? "edit_square" : "add_box"}
                </span>
                {editId ? "Edit Project" : "Tambah Project Baru"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 p-1.5 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="overflow-y-auto p-6 sm:p-8 custom-scrollbar">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {/* Info Dasar */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Judul Project</label>
                    <input
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all"
                      placeholder="Masukkan nama project..."
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Role di Project</label>
                    <input
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all"
                      placeholder="Misal: Frontend Developer, UI/UX Designer..."
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Deskripsi Lengkap</label>
                    <textarea
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3.5 rounded-xl h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all resize-none"
                      placeholder="Jelaskan detail project ini..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Upload Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                  <div>
                    <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-blue-500 text-lg">image</span>
                      Foto Utama (Thumbnail)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="w-full text-sm text-slate-600 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-blue-500 text-lg">photo_library</span>
                      Galeri Multiple
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setGalleryFiles(Array.from(e.target.files))}
                      className="w-full text-sm text-slate-600 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer transition-all"
                    />
                    {galleryFiles.length > 0 && (
                      <p className="text-xs font-bold text-blue-600 mt-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        {galleryFiles.length} foto siap diupload
                      </p>
                    )}
                  </div>
                </div>

                {/* Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Live URL Demo</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-slate-400 text-xl">language</span>
                      <input
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3.5 pl-11 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                        placeholder="https://..."
                        value={form.demo_link}
                        onChange={(e) => setForm({ ...form, demo_link: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Repository GitHub</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-slate-400 text-xl">code_blocks</span>
                      <input
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3.5 pl-11 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                        placeholder="https://github.com/..."
                        value={form.repo_link}
                        onChange={(e) => setForm({ ...form, repo_link: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <label className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-blue-500 text-lg">memory</span>
                    Tech Stack & Persentase
                  </label>

                  <div className="space-y-3">
                    {techStack.map((t, i) => (
                      <div key={i} className="flex gap-2 sm:gap-3 items-center bg-white p-2 sm:p-2.5 rounded-xl border border-slate-200 shadow-sm">
                        <select
                          className="flex-grow border-none bg-transparent text-sm font-medium text-slate-700 focus:ring-0 outline-none w-1/2"
                          value={t.skill_id || ""}
                          onChange={(e) => handleTechChange(i, "skill", e.target.value)}
                          required
                        >
                          <option value="" disabled>-- Pilih Skill --</option>
                          {availableSkills.map((skill) => (
                            <option key={skill.id} value={skill.id}>
                              {skill.name}
                            </option>
                          ))}
                        </select>

                        <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>

                        <div className="relative w-20 sm:w-24">
                          <input
                            type="number"
                            placeholder="0"
                            min="0"
                            max="100"
                            className="w-full border-none bg-transparent p-2 pr-6 text-sm font-bold text-center text-slate-700 focus:ring-0 outline-none"
                            value={t.percentage}
                            onChange={(e) => handleTechChange(i, "percentage", e.target.value)}
                            required
                          />
                          <span className="absolute right-2 top-2 text-sm font-bold text-slate-400">%</span>
                        </div>

                        <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>

                        <button
                          type="button"
                          onClick={() => removeTechRow(i)}
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors flex items-center justify-center"
                          title="Hapus"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addTechRow}
                    className="mt-4 w-full sm:w-auto bg-white border border-slate-200 text-blue-600 px-4 py-2.5 rounded-xl font-bold hover:bg-blue-50 hover:border-blue-200 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Tambah Tech Stack
                  </button>
                </div>

                {/* Footer Modal Action */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">save</span>
                    {editId ? "Simpan Perubahan" : "Simpan Project"}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}