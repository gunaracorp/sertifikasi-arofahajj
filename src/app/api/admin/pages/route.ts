import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { ADMIN_COOKIE, verifyToken } from "@/lib/admin-auth";
import {
  getAllCmsPages,
  ensureUniquePageSlug,
  rowToCmsPage,
} from "@/lib/cms-pages";
import {
  normalizeSlug,
  sanitizeSections,
  sanitizeFaq,
  sanitizeCta,
} from "@/lib/cms-helpers";

// ============================================================
// STUDIO CMS (v2.4.0)
// GET  /api/admin/pages — daftar seluruh halaman CMS (+ draft)
// POST /api/admin/pages — buat halaman baru
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
    const pages = await getAllCmsPages();
    return NextResponse.json({
      success: true,
      data: {
        pages,
        stats: {
          total: pages.length,
          published: pages.filter((p) => p.status === "PUBLISHED").length,
          draft: pages.filter((p) => p.status === "DRAFT").length,
          inFooter: pages.filter((p) => p.showInFooter).length,
        },
      },
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : "Gagal memuat halaman" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!(await guard())) {
    return NextResponse.json({ success: false, error: "Tidak terautentikasi" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const title = String(body.title ?? "").trim();
    if (!title) {
      return NextResponse.json({ success: false, error: "Judul wajib diisi" }, { status: 400 });
    }

    const slug = await ensureUniquePageSlug(normalizeSlug(String(body.slug ?? "") || title));
    const sections = sanitizeSections(body.sections);
    if (sections === null) {
      return NextResponse.json(
        { success: false, error: "Format sections tidak valid" },
        { status: 400 }
      );
    }
    const faq = sanitizeFaq(body.faq);
    if (faq === null) {
      return NextResponse.json({ success: false, error: "Format FAQ tidak valid" }, { status: 400 });
    }

    const created = await db.cmsPage.create({
      data: {
        slug,
        title,
        metaTitle: String(body.metaTitle ?? "").trim() || null,
        metaDescription: String(body.metaDescription ?? "").trim() || null,
        focusKeyword: String(body.focusKeyword ?? "").trim() || null,
        keywords: String(body.keywords ?? "").trim() || null,
        sections,
        faq,
        cta: sanitizeCta(body.cta),
        status: body.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
        noindex: Boolean(body.noindex),
        showInFooter: Boolean(body.showInFooter),
        sortOrder:
          typeof body.sortOrder === "number" && Number.isFinite(body.sortOrder)
            ? Math.round(body.sortOrder)
            : 0,
      },
    });

    return NextResponse.json({ success: true, data: rowToCmsPage(created) }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : "Gagal membuat halaman" },
      { status: 500 }
    );
  }
}
