// ============================================================
// Helper bersama Studio CMS (v2.4.0) — validasi & normalisasi
// payload halaman/tema dari Mission Control → Studio Tema & Halaman.
// Pola identik dengan src/app/api/admin/posts/helpers.ts agar
// perilaku editor blog & halaman konsisten.
// ============================================================

export function normalizeSlug(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // buang karakter non-URL
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
}

/** Validasi & normalisasi sections → JSON string (null bila bukan array) */
export function sanitizeSections(raw: unknown): string | null {
  if (!Array.isArray(raw)) return null;
  const clean = raw
    .filter(
      (s): s is { heading: string } =>
        s &&
        typeof s === "object" &&
        typeof (s as Record<string, unknown>).heading === "string" &&
        ((s as Record<string, unknown>).heading as string).trim().length > 0
    )
    .map((s) => {
      const sec = s as Record<string, unknown>;
      const paragraphs = Array.isArray(sec.paragraphs)
        ? (sec.paragraphs as unknown[]).map(String).filter((p) => p.trim())
        : [];
      const bullets = Array.isArray(sec.bullets)
        ? (sec.bullets as unknown[]).map(String).filter((b) => b.trim())
        : [];
      return {
        heading: String(sec.heading).trim(),
        paragraphs,
        ...(bullets.length > 0 ? { bullets } : {}),
      };
    });
  return JSON.stringify(clean);
}

/** Validasi & normalisasi FAQ → JSON string (null bila bukan array) */
export function sanitizeFaq(raw: unknown): string | null {
  if (!Array.isArray(raw)) return null;
  const clean = raw
    .filter(
      (f): f is { question: string; answer: string } =>
        f &&
        typeof f === "object" &&
        typeof (f as Record<string, unknown>).question === "string" &&
        typeof (f as Record<string, unknown>).answer === "string"
    )
    .map((f) => {
      const item = f as Record<string, unknown>;
      return {
        question: String(item.question).trim(),
        answer: String(item.answer).trim(),
      };
    })
    .filter((f) => f.question && f.answer);
  return JSON.stringify(clean);
}

/** CTA opsional → JSON string {text, anchor} (null bila kosong) */
export function sanitizeCta(raw: unknown): string | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  const text = String(obj.text ?? "").trim();
  const anchor = String(obj.anchor ?? "").trim();
  if (!text || !anchor) return null;
  return JSON.stringify({ text, anchor });
}
