import { NextResponse } from "next/server";
import { safeGetFooterPages } from "@/lib/cms-pages";

// ============================================================
// STUDIO CMS (v2.4.0) — API publik halaman footer
// GET /api/cms/footer-pages → {slug,title}[] halaman PUBLISHED
// yang dicentang showInFooter. Dipakai komponen Footer (client)
// via hook useFooterCmsPages (cache modul, 1 fetch per sesi).
// Di hosting statis endpoint ini tidak ada → fetch gagal →
// footer tetap tampil normal tanpa link tambahan (fallback anggun).
// ============================================================

export async function GET() {
  try {
    const pages = await safeGetFooterPages();
    return NextResponse.json({
      success: true,
      data: { pages: pages.map((p) => ({ slug: p.slug, title: p.title })) },
    });
  } catch {
    // Tanpa DB (mis. hosting statis) → daftar kosong, jangan error
    return NextResponse.json({ success: true, data: { pages: [] } });
  }
}
