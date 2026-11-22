import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { ADMIN_COOKIE, verifyToken } from "@/lib/admin-auth";
import { ensureUniquePageSlug, rowToCmsPage } from "@/lib/cms-pages";
import {
  normalizeSlug,
  sanitizeSections,
  sanitizeFaq,
  sanitizeCta,
} from "@/lib/cms-helpers";

// ============================================================
// STUDIO CMS (v2.4.0)
// GET    /api/admin/pages/[id] — detail satu halaman
// PUT    /api/admin/pages/[id] — perbarui halaman
// DELETE /api/admin/pages/[id] — hapus halaman
// ============================================================

async function guard(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(ADMIN_COOKIE)?.value);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await guard())) {
    return NextResponse.json({ success: false, error: "Tidak terautentikasi" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const row = await db.cmsPage.findUnique({ where: { id } });
    if (!row) {
      return NextResponse.json({ success: false, error: "Halaman tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: rowToCmsPage(row) });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : "Gagal memuat halaman" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await guard())) {
    return NextResponse.json({ success: false, error: "Tidak terautentikasi" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = await req.json();
    const title = String(body.title ?? "").trim();
    if (!title) {
      return NextResponse.json({ success: false, error: "Judul wajib diisi" }, { status: 400 });
    }

    const slug = await ensureUniquePageSlug(
      normalizeSlug(String(body.slug ?? "") || title),
      id
    );
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

    const updated = await db.cmsPage.update({
      where: { id },
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

    return NextResponse.json({ success: true, data: rowToCmsPage(updated) });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : "Gagal memperbarui halaman" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await guard())) {
    return NextResponse.json({ success: false, error: "Tidak terautentikasi" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await db.cmsPage.delete({ where: { id } });
    return NextResponse.json({ success: true, data: { id } });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : "Gagal menghapus halaman" },
      { status: 500 }
    );
  }
}
