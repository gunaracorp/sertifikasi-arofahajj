// ============================================================
// AROFAHAJJ.COM — Next Config
// DEV/PRODUCTION: Next.js standalone output for Node.js hosting.
// STATIC EXPORT: bila env BUILD_STATIC=1 (dipasang scripts/
// build-static.mjs), output beralih ke "export" dan rewrites/
// redirects dinonaktifkan — keduanya TIDAK didukung output export.
// [fix v2.4.0] Dulu config ini mengabaikan BUILD_STATIC sepenuhnya
// sehingga pipeline hosting statis (idwebhost/cPanel) gagal —
// build-static.mjs menunggu folder out/ yang tidak pernah dibuat.
// Use Webpack for production builds to avoid the Hostinger Turbopack
// CSS worker process failure observed in the deployment logs.
// ============================================================

import type { NextConfig } from "next";

// BUILD_STATIC=1 → static export murni (HTML+CSS+JS, folder out/)
const isStaticExport = process.env.BUILD_STATIC === "1";

// NEXT_CPU_COUNT is an application-defined build variable (not a built-in
// Next.js environment variable). Default to 2 on constrained builders and
// clamp overrides to 1..4 so a generous reported CPU count cannot create
// an oversized worker pool.
const requestedBuildCpus = Number(process.env.NEXT_CPU_COUNT ?? "2");
const buildCpus =
  Number.isInteger(requestedBuildCpus) && requestedBuildCpus > 0
    ? Math.min(requestedBuildCpus, 4)
    : 2;

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/orm-postgres"],
  output: isStaticExport ? "export" : "standalone",
  // Izinkan host preview sandbox memuat aset dev Next.js (font, HMR)
  // — tanpa ini font next/font/google diblokir cross-origin di preview.
  allowedDevOrigins: ["*.space-z.ai", "space-z.ai"],
  experimental: {
    cpus: buildCpus,
    // Lower per-worker page-generation concurrency for process-limited builders.
    staticGenerationMaxConcurrency: 2,
  },
  async rewrites() {
    // Static export tidak mendukung rewrites — sitemap index ditulis
    // langsung sebagai out/sitemap.xml oleh postProcessSeo().
    if (isStaticExport) return { beforeFiles: [], afterFiles: [], fallback: [] };
    return {
      beforeFiles: [
        { source: "/sitemap.xml", destination: "/api/sitemap-index" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async redirects() {
    // Static export tidak mendukung redirects — rute lama tak relevan
    // di paket statis (sitemap sudah di-prune oleh build-static).
    if (isStaticExport) return [];
    return [
      // ========================================================
      // PULIHAN GSC "Tidak ditemukan (404)": 12 slug lowongan lama
      // (dihapus saat rekrutmen di-restrukturisasi) masih dikunjungi
      // Google dari sitemap versi lama. 301/308 ke hub lowongan agar
      // sinyal lama menyatu, tidak terbuang sebagai 404.
      // ========================================================
      { source: "/lowongan-kerja/account-executive-pajak", destination: "/lowongan-kerja", permanent: true },
      { source: "/lowongan-kerja/content-writer-seo", destination: "/lowongan-kerja", permanent: true },
      { source: "/lowongan-kerja/coordinator-penempatan-pmi", destination: "/lowongan-kerja", permanent: true },
      { source: "/lowongan-kerja/data-entry-oss-lkpm", destination: "/lowongan-kerja", permanent: true },
      { source: "/lowongan-kerja/digital-marketing-specialist", destination: "/lowongan-kerja", permanent: true },
      { source: "/lowongan-kerja/graphic-designer", destination: "/lowongan-kerja", permanent: true },
      { source: "/lowongan-kerja/konsultan-junior-perizinan-umkm", destination: "/lowongan-kerja", permanent: true },
      { source: "/lowongan-kerja/legal-officer", destination: "/lowongan-kerja", permanent: true },
      { source: "/lowongan-kerja/marketing-consultant-perizinan", destination: "/lowongan-kerja", permanent: true },
      { source: "/lowongan-kerja/staf-administrasi-legalitas", destination: "/lowongan-kerja", permanent: true },
      { source: "/lowongan-kerja/telemarketing-inside-sales", destination: "/lowongan-kerja", permanent: true },
      { source: "/lowongan-kerja/trainer-bahasa-jepang-lpk", destination: "/lowongan-kerja", permanent: true },
    ];
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: false,
};

export default nextConfig;
