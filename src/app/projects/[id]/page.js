"use client";
import { useState, useEffect, use } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";

export default function ProjectDetail({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [techStack, setTechStack] = useState([]);
  const [galleryUrls, setGalleryUrls] = useState([]); // State baru untuk galeri
  const [relatedProjects, setRelatedProjects] = useState([]);

  useEffect(() => {
    if (id) {
      getProjectDetail(id);
      getRelatedProjects();
    }
  }, [id]);

  const getProjectDetail = async (idProject) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/projects/${idProject}`
      );
      const data = response.data;
      setProject(data);

      // Parsing Tech Stack
      if (data.tech_stack) {
        try {
          let parsedStack =
            typeof data.tech_stack === "string"
              ? JSON.parse(data.tech_stack)
              : data.tech_stack;
          setTechStack(parsedStack);
        } catch (err) {
          setTechStack([]);
        }
      }

      // Parsing Gallery URLs
      if (data.gallery_urls) {
        try {
          let parsedGallery =
            typeof data.gallery_urls === "string"
              ? JSON.parse(data.gallery_urls)
              : data.gallery_urls;
          setGalleryUrls(parsedGallery || []);
        } catch (err) {
          setGalleryUrls([]);
        }
      }

    } catch (error) {
      console.error("Gagal ambil detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRelatedProjects = async () => {
    try {
      const response = await axios.get("http://localhost:5000/projects");
      if (project) {
        const filtered = response.data.filter((p) => p.id !== id).slice(0, 3);
        setRelatedProjects(filtered);
      } else {
        setRelatedProjects(response.data.slice(0, 3));
      }
    } catch (error) {
      console.error("Gagal ambil project terkait:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <PublicHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Memuat detail project...</p>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white">
        <PublicHeader />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">🔍</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Project Tidak Ditemukan
            </h1>
            <p className="text-gray-600 mb-8">
              Project yang Anda cari tidak tersedia atau telah dihapus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Kembali
              </button>
              <Link
                href="/"
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Lihat Portfolio
              </Link>
            </div>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      {/* Hero Section */}
      <div className="relative pt-20 pb-12 px-4 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Kembali ke Portfolio
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
                Case Study
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {project.title}
              </h1>

              <p className="text-xl text-gray-600 mb-8">
                {project.description?.substring(0, 180)}...
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {techStack.slice(0, 5).map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white text-blue-700 text-sm font-medium rounded-full border border-blue-200"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {project.demo_link && (
                  <a
                    href={project.demo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Live Preview</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                )}
                {project.repo_link && (
                  <a
                    href={project.repo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>View Code</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-100 h-96">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image Available
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {project.created_at && (
                <div className="absolute -bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md">
                  <div className="text-sm text-gray-600">Dibuat pada</div>
                  <div className="font-medium text-gray-900">
                    {formatDate(project.created_at)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Project Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Left Column - Project Description */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 h-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                  Tentang Project
                </h2>
                <div className="prose prose-blue max-w-none">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {project.description}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Info Sidebar */}
            <div className="space-y-6">
              {/* Tech Stack Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                  Teknologi
                </h3>

                {techStack.length > 0 ? (
                  <div className="space-y-4">
                    {techStack.map((tech, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700 flex items-center gap-2">
                            {tech.icon && (
                              <img src={tech.icon} alt={tech.name} className="w-4 h-4 object-contain" />
                            )}
                            {tech.name}
                          </span>
                          <span className="text-gray-500">
                            {tech.percentage || "0"}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${tech.percentage || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Teknologi tidak tersedia
                  </p>
                )}
              </div>

              {/* Action Card */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h3 className="font-bold text-gray-900 mb-3">
                  Ingin Project Serupa?
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Hubungi saya untuk membahas kebutuhan project Anda.
                </p>
                <a
                  href="#contact"
                  className="block w-full py-3 bg-blue-600 text-white font-medium rounded-lg text-center hover:bg-blue-700 transition-colors"
                >
                  Konsultasi Project
                </a>
              </div>
            </div>
          </div>

          {/* Project Gallery - Update Tampilan Dinamis */}
          {(project.image_url || galleryUrls.length > 0) && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Galeri Project
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Gambar Utama (Thumbnail) di Kiri */}
                <div className="relative rounded-xl overflow-hidden h-80 bg-gray-100 shadow-sm border border-gray-100">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={`Preview utama ${project.title}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Main Image
                    </div>
                  )}
                </div>

                {/* Multiple Upload Gallery di Kanan */}
                <div className="grid grid-cols-2 gap-4 h-80">
                  {galleryUrls.length > 0 ? (
                    galleryUrls.map((url, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden h-full bg-gray-100 shadow-sm border border-gray-100">
                        <img
                          src={url}
                          alt={`Galeri ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                        />
                      </div>
                    ))
                  ) : (
                    // Jika tidak ada gambar galeri tambahan, tampilkan placeholder / text
                    <div className="col-span-2 flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
                      <span className="text-gray-400 text-4xl mb-2">📸</span>
                      <p className="text-gray-400 text-sm">Tidak ada foto galeri tambahan</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="mb-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Project Lainnya
                </h2>
                <Link
                  href="/"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  Lihat semua
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProjects.map((relatedProject) => {
                  let relatedTechStack = [];
                  try {
                    relatedTechStack =
                      typeof relatedProject.tech_stack === "string"
                        ? JSON.parse(relatedProject.tech_stack)
                        : relatedProject.tech_stack || [];
                  } catch (e) {
                    relatedTechStack = [];
                  }

                  return (
                    <Link
                      key={relatedProject.id}
                      href={`/projects/${relatedProject.id}`}
                      className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="h-48 overflow-hidden bg-gray-100">
                        {relatedProject.image_url ? (
                          <img
                            src={relatedProject.image_url}
                            alt={relatedProject.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {relatedProject.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {relatedProject.description?.substring(0, 100)}...
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {relatedTechStack.slice(0, 3).map((tech, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded"
                            >
                              {tech.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Kembali
            </button>

            <a
              href="#contact"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Mulai Project Anda
            </a>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}