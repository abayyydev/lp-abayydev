"use client";
import { useEffect, useRef } from "react";
import axios from "axios";

export default function VisitorTracker() {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;

    const trackVisitor = async () => {
      const currentUrl = window.location.href;

      // Update: Tambahkan parameter city dan country
      const sendToBackend = async (lat = null, lon = null, city = null, country = null) => {
        try {
          await axios.post("https://ukmelrahma.my.id/portofolio-abayyy/track", {
            page_url: currentUrl,
            latitude: lat,
            longitude: lon,
            city: city,       // Kirim nama kota/daerah
            country: country  // Kirim nama negara
          });
          console.log("Visitor tracked!");
        } catch (error) {
          console.error("Gagal mengirim data tracking ke server");
        }
      };

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            let cityName = null;
            let countryName = null;

            // Terjemahkan koordinat GPS ke nama daerah pakai API gratis BigDataCloud
            try {
              const geoRes = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=id`);
              // Ambil nama kota, atau kecamatan/daerah (locality) jika kota kosong
              cityName = geoRes.data.city || geoRes.data.locality || geoRes.data.principalSubdivision;
              countryName = geoRes.data.countryName;
            } catch (e) {
              console.warn("Gagal mendapatkan nama daerah dari koordinat");
            }
            
            sendToBackend(lat, lon, cityName, countryName);
          },
          async (error) => {
            // Fallback: Jika di-block, ambil dari IP
            try {
              const ipRes = await axios.get("https://ipapi.co/json/");
              // ipapi.co sudah otomatis memberikan nama city dan country_name
              sendToBackend(ipRes.data.latitude, ipRes.data.longitude, ipRes.data.city, ipRes.data.country_name);
            } catch (ipError) {
              sendToBackend(null, null, null, null);
            }
          },
          { enableHighAccuracy: true, timeout: 5000 }
        );
      } else {
        // Fallback untuk browser lama
        try {
          const ipRes = await axios.get("https://ipapi.co/json/");
          sendToBackend(ipRes.data.latitude, ipRes.data.longitude, ipRes.data.city, ipRes.data.country_name);
        } catch (ipError) {
          sendToBackend(null, null, null, null);
        }
      }
    };

    trackVisitor();
  }, []);

  return null;
}