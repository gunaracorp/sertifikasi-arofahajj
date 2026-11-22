// ============================================================
// AROFAHAJJ UNIVERSE — STUDIO CMS: Registri Tema (v2.4.0)
// ============================================================
// Sistem tema ala WordPress: setiap tema adalah satu set token
// warna oklch yang menimpa variabel `:root` lewat atribut
// data-theme pada <html>. Tema default ("zamrud") adalah palet
// asli "Zamrud & Emas Editorial" (globals.css) sehingga TANPA
// atribut data-theme situs tampil persis seperti sebelumnya —
// nol regresi visual.
//
// Kontras setiap tema dipilih manual agar setara WCAG AA+
// (rasio utama ≥ 4.5:1 utk teks, ≥ 3:1 utk elemen UI besar).
// Menambah tema baru:
//   1. Tambah entri THEMES di bawah (id unik, tanpa spasi).
//   2. Tambah blok CSS `html[data-theme="<id>"] { ... }` di
//      globals.css dengan token yang sama seperti :root.
//   3. Selesai — picker admin & pratinjau otomatis mengikuti.
// ============================================================

export interface ThemePalette {
  /** Warna utama (tombol, tautan, ikon) — utk swatch pratinjau */
  primary: string;
  /** Warna latar kanvas — utk swatch pratinjau */
  background: string;
  /** Aksen emas/highlight — utk swatch pratinjau */
  gold: string;
}

export interface ThemeMeta {
  /** id stabil — dipakai sebagai nilai data-theme + kunci DB */
  id: string;
  /** Nama tampil di picker admin */
  name: string;
  /** Satu kalimat suasana/bisa dipakai untuk apa */
  description: string;
  /** true = tema gelap (html diberi class "dark" juga) */
  dark: boolean;
  palette: ThemePalette;
}

export const THEMES: ThemeMeta[] = [
  {
    id: "zamrud",
    name: "Zamrud & Emas (Default)",
    description:
      "Palet bawaan v2.3+: kertas porselen hangat, zamrud pekat, aksen emas logo — identitas brand resmi.",
    dark: false,
    palette: { primary: "#15725f", background: "#f8faf5", gold: "#a2691f" },
  },
  {
    id: "kiswah-malam",
    name: "Kiswah Malam",
    description:
      "Mode gelap penuh: kain kiswah hijau-hitam, teks gading, mint & emas terang. Nyaman untuk baca malam hari.",
    dark: true,
    palette: { primary: "#3fc79a", background: "#11201b", gold: "#e8bf43" },
  },
  {
    id: "emas-nusantara",
    name: "Emas Nusantara",
    description:
      "Gading hangat keemasan dengan perunggu pekat — kesan premium klasik untuk katalog & brosur digital.",
    dark: false,
    palette: { primary: "#9c6a1e", background: "#fbf6ec", gold: "#8a5a14" },
  },
  {
    id: "tirta",
    name: "Tirta Zamrud",
    description:
      "Aqua-teal segar di kanvas putih kabut — nuansa bersih & modern, cocok untuk audiens muda.",
    dark: false,
    palette: { primary: "#0e8a86", background: "#f5fbfa", gold: "#b08a2e" },
  },
  {
    id: "terra",
    name: "Terra Tasik",
    description:
      "Terakota bumi Jawa Barat di kanvas pasir — hangat, ramah, dekat dengan UMKM lokal.",
    dark: false,
    palette: { primary: "#b04a2f", background: "#faf4ef", gold: "#9c6a1e" },
  },
];

export const DEFAULT_THEME_ID = "zamrud";

/** Daftar id valid — dipakai validasi API */
export const THEME_IDS = THEMES.map((t) => t.id);

export function getTheme(id: string | null | undefined): ThemeMeta {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
