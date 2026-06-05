"use client";
import { useEffect, useRef } from "react";
import axios from "axios";

export default function VisitorTracker() {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Mencegah request ganda (double-fire) saat Strict Mode aktif di React
    if (hasTracked.current) return;
    hasTracked.current = true;

    const trackVisitor = async () => {
      const currentUrl = window.location.href;

      // Fungsi untuk nembak endpoint tracking backend Anda
      const sendToBackend = async (lat = null, lon = null) => {
        try {
          await axios.post("https://ukmelrahma.my.id/portofolio-abayyy/track", {
            page_url: currentUrl,
            latitude: lat,
            longitude: lon,
          });
          console.log("Visitor tracked!");
        } catch (error) {
          console.error("Gagal mengirim data tracking ke server");
        }
      };

      // 1. Coba ambil lokasi akurat dari Device (GPS)
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          // Jika pengunjung klik "Allow"
          (position) => {
            sendToBackend(position.coords.latitude, position.coords.longitude);
          },
          // Jika pengunjung klik "Block" atau terjadi error (timeout)
          async (error) => {
            console.warn("GPS diblokir/gagal. Menggunakan fallback IP Location...");
            try {
              // 2. Fallback: Dapatkan perkiraan latitude & longitude dari IP Address
              const ipRes = await axios.get("https://ipapi.co/json/");
              sendToBackend(ipRes.data.latitude, ipRes.data.longitude);
            } catch (ipError) {
              // Jika API IP juga gagal, tetap kirim data tanpa koordinat
              sendToBackend(null, null);
            }
          },
          { enableHighAccuracy: true, timeout: 5000 }
        );
      } else {
        // Browser tidak support Geolocation, langsung pakai fallback IP
        try {
          const ipRes = await axios.get("https://ipapi.co/json/");
          sendToBackend(ipRes.data.latitude, ipRes.data.longitude);
        } catch (ipError) {
          sendToBackend(null, null);
        }
      }
    };

    trackVisitor();
  }, []);

  return null; // Tidak merender apapun di UI
}