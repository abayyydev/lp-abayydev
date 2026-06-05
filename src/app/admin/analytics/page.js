"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState({
    total_visits: 0,
    today_visits: 0,
    logs: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState({ lat: null, lon: null });
  // State untuk filter & pagination
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Logika Filter Data berdasarkan Tanggal
  const filteredLogs = analyticsData.logs.filter((log) => {
    if (!startDate && !endDate) return true;
    
    const logDate = new Date(log.created_at).setHours(0, 0, 0, 0);
    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

    if (start && end) return logDate >= start && logDate <= end;
    if (start) return logDate >= start;
    if (end) return logDate <= end;
    return true;
  });

  // Logika Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);

  // Reset ke halaman 1 jika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      // Sesuaikan cara Anda mengambil token (misal dari localStorage atau cookies)
      const token = localStorage.getItem("token") || ""; 
      
      // Sesuaikan base URL API Anda
      const res = await axios.get("https://ukmelrahma.my.id/portofolio-abayyy/analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAnalyticsData(res.data);
      
      // Set lokasi peta default ke pengunjung terbaru jika data koordinat tersedia
      if (res.data.logs && res.data.logs.length > 0) {
        const latestVisitor = res.data.logs.find(log => log.latitude && log.longitude);
        if (latestVisitor) {
          setSelectedLocation({
            lat: latestVisitor.latitude,
            lon: latestVisitor.longitude
          });
        }
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      Swal.fire({
        title: "Gagal!",
        text: "Gagal mengambil data analitik dari server.",
        icon: "error",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (lat, lon) => {
    if (lat && lon) {
      setSelectedLocation({ lat, lon });
    } else {
      Swal.fire({
        title: "Info",
        text: "Data koordinat tidak tersedia untuk pengunjung ini.",
        icon: "info",
        confirmButtonColor: "#3b82f6",
      });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="w-full">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-3xl">analytics</span>
            Analytics & Pengunjung
          </h3>
          <p className="text-sm text-slate-500 mt-1">Pantau statistik dan log aktivitas pengunjung website Anda.</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="w-full sm:w-auto bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-50 hover:text-blue-600 shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <span className="material-symbols-outlined">refresh</span>
          Refresh Data
        </button>
      </div>

      {/* STATS CARDS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Total Visits Card */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">public</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Total Pengunjung</p>
            <h4 className="text-3xl font-black text-slate-800">
              {isLoading ? "..." : analyticsData.total_visits}
            </h4>
          </div>
        </div>

        {/* Today Visits Card */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="h-16 w-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">today</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Pengunjung Hari Ini</p>
            <h4 className="text-3xl font-black text-slate-800">
              {isLoading ? "..." : analyticsData.today_visits}
            </h4>
          </div>
        </div>
      </div>

      {/* MAP & TABLE GRID SECTION */}
      {/* MAP SECTION (Di Atas Tabel) */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm h-[400px] mb-8 flex flex-col">
        <div className="p-5 border-b border-slate-100 bg-slate-50">
          <h4 className="font-bold text-slate-700 flex items-center gap-2">
            <span className="material-symbols-outlined text-red-500">location_on</span>
            Peta Lokasi Pengunjung
          </h4>
          <p className="text-xs text-slate-500 mt-1">Klik baris tabel di bawah untuk melihat lokasi</p>
        </div>
        <div className="flex-grow bg-slate-100 relative">
          {selectedLocation.lat && selectedLocation.lon ? (
            <iframe
              title="Visitor Location Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lon}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
            ></iframe>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
              <span className="material-symbols-outlined text-5xl mb-2 text-slate-300">map</span>
              <p className="text-sm font-medium">Peta belum tersedia</p>
              <p className="text-xs mt-1">Pilih pengunjung dari tabel di bawah untuk menampilkan peta.</p>
            </div>
          )}
        </div>
      </div>

      {/* FILTER & TABLE SECTION */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm mb-8">
        
        {/* Header & Date Filter */}
        <div className="p-5 border-b border-slate-100 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h4 className="font-bold text-slate-700 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-500">list_alt</span>
            Log Pengunjung
          </h4>
          
          <div className="flex items-center gap-2 text-sm w-full sm:w-auto">
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-slate-200 rounded-lg p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full sm:w-auto"
            />
            <span className="text-slate-400 font-medium">-</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-slate-200 rounded-lg p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full sm:w-auto"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse relative">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="p-4">Waktu</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Lokasi</th>
                <th className="p-4 text-center">Map</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-slate-500">
                    Memuat data analitik...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-16">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <span className="material-symbols-outlined text-6xl mb-3 text-slate-200">history_toggle_off</span>
                      <p className="font-medium text-slate-500">Tidak ada data untuk filter ini.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                // PERHATIKAN: Sekarang kita mapping dari `currentItems`, BUKAN `analyticsData.logs`
                currentItems.map((log) => (
                  <tr 
                    key={log.id} 
                    onClick={() => handleRowClick(log?.latitude, log?.longitude)}
                    className={`hover:bg-blue-50/50 transition-colors cursor-pointer group ${
                      selectedLocation.lat == log?.latitude && selectedLocation.lon == log?.longitude 
                        ? "bg-blue-50/80" 
                        : ""
                    }`}
                  >
                    <td className="p-4 text-sm text-slate-600 whitespace-nowrap">
                      {formatDate(log?.created_at)}
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm bg-slate-100 text-slate-700 px-2 py-1 rounded-md">
                        {log?.ip_address || "Unknown"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-slate-800">
                        {log?.city ? `${log.city}, ${log.country}` : "Lokasi Tidak Diketahui"}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {log?.latitude && log?.longitude ? (
                        <button 
                          className="text-blue-500 bg-blue-50 p-1.5 rounded-lg group-hover:bg-blue-100 transition-colors inline-flex"
                          title="Lihat di Peta"
                        >
                          <span className="material-symbols-outlined text-lg">my_location</span>
                        </button>
                      ) : (
                        <span className="text-slate-300 material-symbols-outlined text-lg" title="Koordinat Tidak Tersedia">
                          location_off
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION CONTROLS */}
        {!isLoading && filteredLogs.length > 0 && (
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center bg-slate-50 text-sm gap-3">
            <span className="text-slate-500 font-medium">
              Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredLogs.length)} dari total {filteredLogs.length} data
            </span>
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span> Prev
              </button>
              <span className="font-bold text-slate-700 px-3 bg-slate-200/50 py-2 rounded-lg">
                {currentPage} <span className="text-slate-400 font-normal">/ {totalPages}</span>
              </span>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors flex items-center gap-1"
              >
                Next <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}