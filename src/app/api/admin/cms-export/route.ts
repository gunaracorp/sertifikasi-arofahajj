import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyToken } from "@/lib/admin-auth";
import { getAllCmsPosts } from "@/lib/blog-cms";
import { getAllCmsPages } from "@/lib/cms-pages";
import { getActiveThemeId } from "@/lib/site-settings";

// ============================================================
// STUDIO CMS (v2.4.0)
// GET /api/admin/cms-export — ekspor seluruh konten CMS ke satu
// berkas JSON (ala fitur Export WordPress): posts + pages + tema.
// Dipakai untuk backup konten, migrasi antar environment, atau
// sebagai sumber data build statis manual.
// ============================================================

async function guard(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(ADMIN_COOKIE)?.value);
}

export async function GET(_req: NextRequest) {
  if (!(await guard())) {
    return NextResponse.json({ success: false, error: "Tidak terautentikasi" }, { status: 401 });
  }
  try {
    const [posts, pages, theme] = await Promise.all([
      getAllCmsPosts(),
      getAllCmsPages(),
      getActiveThemeId(),
    ]);
    const payload = {
      generator: "Arofahajj Studio CMS",
      version: 1,
      exportedAt: new Date().toISOString(),
      theme,
      posts,
      pages,
    };
    const stamp = new Date().toISOString().slice(0, 10);
    return new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="arofahajj-cms-export-${stamp}.json"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : "Gagal mengekspor konten" },
      { status: 500 }
    );
  }
}
