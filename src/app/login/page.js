"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await axios.post("https://4g6q9fjz-5000.asse.devtunnels.ms/login", form);

      // Simpan Token di LocalStorage browser
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);

      Swal.fire({
        title: "Login Berhasil!",
        text: `Selamat datang kembali, ${res.data.username}!`,
        icon: "success",
        confirmButtonColor: "#2563eb",
      }).then(() => {
        router.push("/admin"); // Redirect ke dashboard
      });
    } catch (error) {
      Swal.fire({
        title: "Akses Ditolak",
        text: "Username atau Password yang Anda masukkan salah.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans selection:bg-blue-200 selection:text-blue-900">
      
      {/* Import Google Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
      />

      {/* Background Blobs (Dekorasi) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="w-full max-w-md z-10 p-5">
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-slate-100 backdrop-blur-xl relative overflow-hidden">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100">
              <span className="material-symbols-outlined text-4xl">admin_panel_settings</span>
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              Masuk ke sistem kontrol panel portofolio.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Input Username */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block ml-1">
                Username
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  person
                </span>
                <input
                  type="text"
                  placeholder="Masukkan username admin..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-4 pl-12 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block ml-1">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-4 pl-12 pr-12 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors focus:outline-none flex items-center justify-center p-1"
                  tabIndex="-1"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`group w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                isLoading ? "opacity-75 cursor-not-allowed" : "transform hover:-translate-y-1"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Footer Form */}
          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <Link 
              href="/" 
              className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors group"
            >
              <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">
                arrow_back
              </span>
              Kembali ke Halaman Utama
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}