"use client";

import { useEffect, useState } from "react";

// ============================================================
// STUDIO CMS (v2.4.0) — Hook daftar halaman CMS untuk footer
// Cache level modul: walau <Footer/> dipasang di banyak halaman,
// hanya ada SATU fetch /api/cms/footer-pages per sesi browser.
// Gagal fetch (hosting statis tanpa API) → daftar kosong [] —
// footer tampil normal, tidak pernah memecahkan halaman.
// ============================================================

export interface FooterPageLink {
  slug: string;
  title: string;
}

let cache: FooterPageLink[] | null = null;
let inflight: Promise<FooterPageLink[]> | null = null;

function loadOnce(): Promise<FooterPageLink[]> {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = fetch("/api/cms/footer-pages", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((json) => {
        const list: FooterPageLink[] = json?.success ? (json.data?.pages ?? []) : [];
        cache = list;
        return list;
      })
      .catch(() => {
        cache = [];
        return cache;
      });
  }
  return inflight;
}

export function useFooterCmsPages(): FooterPageLink[] {
  const [pages, setPages] = useState<FooterPageLink[]>(cache ?? []);

  useEffect(() => {
    if (!cache) {
      void loadOnce().then(setPages);
    }
  }, []);

  return pages;
}
