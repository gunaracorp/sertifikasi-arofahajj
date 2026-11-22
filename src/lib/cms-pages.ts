import { db } from "@/lib/db";
import type { BlogFAQ, BlogSection } from "@/lib/blog-content";

// ============================================================
// AROFAHAJJ UNIVERSE — Studio CMS: Bridge Halaman (Admin → Front)
// (v2.4.0) Halaman mandiri ala WordPress dikelola di Mission
// Control → Studio Tema & Halaman, tampil di URL publik /p/{slug}.
// Pola identik dengan blog-cms.ts: parse JSON defensif, data
// rusak TIDAK BOLEH mematikan halaman publik.
// ============================================================

/** Baris mentah CmsPage sesuai skema Prisma (field JSON masih string) */
export interface CmsPageRow {
  id: string;
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  focusKeyword: string | null;
  keywords: string | null;
  sections: string;
  faq: string;
  cta: string | null;
  status: string; // DRAFT | PUBLISHED
  noindex: boolean;
  showInFooter: boolean;
  sortOrder: number;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/** CmsPage setelah JSON string di-parse — bentuk untuk UI & renderer */
export interface CmsPageData {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  keywords: string;
  sections: BlogSection[];
  faq: BlogFAQ[];
  cta: { text: string; anchor: string };
  status: "DRAFT" | "PUBLISHED";
  noindex: boolean;
  showInFooter: boolean;
  sortOrder: number;
  publishedAt: string; // ISO
  updatedAt: string; // ISO
}

function safeParse<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    const v = JSON.parse(raw);
    return (v ?? fallback) as T;
  } catch {
    return fallback;
  }
}

/** Konversi nilai DateTime apa pun → string ISO, tanpa pernah melempar error
 *  (mitigasi objek eksotis Prisma 8 — lihat toIsoSafe di blog-cms.ts). */
function toIsoSafe(v: unknown, fallback?: unknown): string {
  if (v instanceof Date && !isNaN(v.getTime())) return v.toISOString();
  if (typeof v === "string" && v.trim()) {
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d.toISOString();
  }
  if (fallback !== undefined) return toIsoSafe(fallback);
  return new Date().toISOString();
}

/** Konversi baris DB → CmsPageData (defensif: field rusak → nilai aman) */
export function rowToCmsPage(r: CmsPageRow): CmsPageData {
  const sections = safeParse<BlogSection[]>(r.sections, []).filter(
    (s) => s && typeof s.heading === "string" && Array.isArray(s.paragraphs)
  );
  const faq = safeParse<BlogFAQ[]>(r.faq, []).filter(
    (f) => f && typeof f.question === "string" && typeof f.answer === "string"
  );
  const cta = safeParse<{ text: string; anchor: string }>(r.cta, {
    text: "Konsultasi Sekarang",
    anchor: "#konsultasi",
  });
  const firstParagraph =
    sections.find((s) => s.paragraphs.length > 0)?.paragraphs[0] ?? r.title;
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    metaTitle: r.metaTitle || r.title,
    metaDescription: r.metaDescription || firstParagraph.slice(0, 160),
    focusKeyword: r.focusKeyword || "",
    keywords: r.keywords || "",
    sections,
    faq,
    cta,
    status: r.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
    noindex: r.noindex,
    showInFooter: r.showInFooter,
    sortOrder: Number.isFinite(r.sortOrder) ? r.sortOrder : 0,
    publishedAt: toIsoSafe(r.publishedAt, r.createdAt),
    updatedAt: toIsoSafe(r.updatedAt, r.createdAt),
  };
}

/** Semua halaman CMS (untuk admin) — termasuk draft */
export async function getAllCmsPages(): Promise<CmsPageData[]> {
  const rows = await db.cmsPage.findMany({ orderBy: { updatedAt: "desc" } });
  return rows.map((row) => rowToCmsPage(row as CmsPageRow));
}

/** Halaman CMS berstatus PUBLISHED (untuk situs publik, footer & sitemap) */
export async function getPublishedCmsPages(): Promise<CmsPageData[]> {
  const rows = await db.cmsPage.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { updatedAt: "desc" },
  });
  return rows.map((row) => rowToCmsPage(row as CmsPageRow));
}

/** Halaman footer: PUBLISHED + showInFooter, terurut sortOrder → title */
export async function getFooterCmsPages(): Promise<CmsPageData[]> {
  const pages = await getPublishedCmsPages();
  return pages
    .filter((p) => p.showInFooter)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
}

/** Satu halaman CMS berdasar slug (status apa pun — validasi status di pemanggil) */
export async function getCmsPageBySlug(slug: string): Promise<CmsPageData | null> {
  const row = await db.cmsPage.findUnique({ where: { slug } });
  return row ? rowToCmsPage(row as CmsPageRow) : null;
}

/** Slug unik di antara halaman: bila bentrok, tambah -2, -3, ... */
export async function ensureUniquePageSlug(
  slug: string,
  excludeId?: string
): Promise<string> {
  let candidate = slug;
  let n = 2;
  while (true) {
    const exists = await db.cmsPage.findUnique({ where: { slug: candidate } });
    if (!exists || exists.id === excludeId) return candidate;
    candidate = `${slug}-${n}`;
    n += 1;
  }
}

// ------------------------------------------------------------
// Versi "aman" untuk halaman publik / build statis:
// DB belum siap / tabel belum ada → fallback kosong, build tak pernah crash.
// ------------------------------------------------------------

export async function safeGetPublishedPages(): Promise<CmsPageData[]> {
  try {
    return await getPublishedCmsPages();
  } catch {
    return [];
  }
}

export async function safeGetCmsPageBySlug(slug: string): Promise<CmsPageData | null> {
  try {
    return await getCmsPageBySlug(slug);
  } catch {
    return null;
  }
}

export async function safeGetFooterPages(): Promise<CmsPageData[]> {
  try {
    return await getFooterCmsPages();
  } catch {
    return [];
  }
}
