"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", form);

      // Simpan Token di LocalStorage browser
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);

      Swal.fire("Login Berhasil!", "Selamat datang bos!", "success");
      router.push("/admin"); // Redirect ke dashboard
    } catch (error) {
      Swal.fire("Gagal", "Username atau Password salah", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Admin Login 🔒
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700">
              Username
            </label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg text-black"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full border p-3 rounded-lg text-black"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">
            MASUK
          </button>
        </form>
      </div>
    </div>
  );
}
