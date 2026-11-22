import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyToken } from "@/lib/admin-auth";
import { THEMES, THEME_IDS, getTheme, DEFAULT_THEME_ID } from "@/lib/themes";
import { getActiveThemeId, setActiveThemeId } from "@/lib/site-settings";

// ============================================================
// STUDIO CMS (v2.4.0)
// GET /api/admin/theme — katalog tema + tema aktif saat ini
// PUT /api/admin/theme  — terapkan tema (validasi id ketat)
// ============================================================

async function guard(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(ADMIN_COOKIE)?.value);
}

export async function GET() {
  if (!(await guard())) {
    return NextResponse.json({ success: false, error: "Tidak terautentikasi" }, { status: 401 });
  }
  try {
    const active = await getActiveThemeId();
    return NextResponse.json({
      success: true,
      data: { active, default: DEFAULT_THEME_ID, themes: THEMES },
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : "Gagal memuat tema" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  if (!(await guard())) {
    return NextResponse.json({ success: false, error: "Tidak terautentikasi" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const themeId = String(body.themeId ?? "").trim();
    if (!THEME_IDS.includes(themeId)) {
      return NextResponse.json(
        { success: false, error: `Tema tidak dikenal: ${themeId || "(kosong)"}` },
        { status: 400 }
      );
    }
    await setActiveThemeId(themeId);
    return NextResponse.json({
      success: true,
      data: { active: themeId, theme: getTheme(themeId) },
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : "Gagal menerapkan tema" },
      { status: 500 }
    );
  }
}
