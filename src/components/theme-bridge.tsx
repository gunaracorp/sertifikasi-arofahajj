"use client";

import { useEffect } from "react";

// ============================================================
// AROFAHAJJ UNIVERSE — Studio CMS: Theme Bridge (v2.4.0)
// Jembatan pratinjau tema sisi klien. Prioritas sumber tema:
//   1. Query ?theme=<id>   (tombol "Pratinjau" di admin)
//   2. localStorage "ah-theme-preview"
//   3. data-theme server dari layout (tidak disentuh)
// Komponen ini tidak merender apa pun — hanya menyinkronkan
// atribut <html> saat halaman dimuat. Tanpa useSearchParams
// agar tidak butuh Suspense boundary di build statis.
// ============================================================

export function ThemeBridge() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const override =
        params.get("theme") ||
        localStorage.getItem("ah-theme-preview") ||
        "";
      if (!override) return;
      const html = document.documentElement;
      if (override === "zamrud" || override === "default") {
        html.removeAttribute("data-theme");
      } else {
        html.setAttribute("data-theme", override);
      }
      // Tema gelap: class .dark memberi token gelap (globals.css)
      if (override === "kiswah-malam") html.classList.add("dark");
      else html.classList.remove("dark");
    } catch {
      // localStorage diblokir — biarkan tema server
    }
  }, []);
  return null;
}
