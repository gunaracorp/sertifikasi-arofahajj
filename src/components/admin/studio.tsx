"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Download,
  ExternalLink,
  Loader2,
  Palette,
  Plus,
  Save,
  Trash2,
  FileText,
  Pencil,
  X,
} from "lucide-react";

// ============================================================
// STUDIO CMS (v2.4.0) — Tab "Studio Tema & Halaman" Mission Control
// 1. TEMA: katalog tema (ala theme WordPress), terapkan + pratinjau.
// 2. HALAMAN: CRUD halaman mandiri /p/{slug} (ala WordPress Pages)
//    dengan editor SEO (metaTitle/metaDescription/focusKeyword).
// 3. EKSPOR: unduh seluruh konten CMS sebagai JSON (ala WXR export).
// ============================================================

interface ThemeMetaDTO {
  id: string;
  name: string;
  description: string;
  dark: boolean;
  palette: { primary: string; background: string; gold: string };
}

interface SectionDTO {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

interface FaqDTO {
  question: string;
  answer: string;
}

interface CmsPageDTO {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  keywords: string;
  sections: SectionDTO[];
  faq: FaqDTO[];
  cta: { text: string; anchor: string };
  status: "DRAFT" | "PUBLISHED";
  noindex: boolean;
  showInFooter: boolean;
  sortOrder: number;
  updatedAt: string;
}

interface PageForm {
  id?: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  keywords: string;
  sections: SectionDTO[];
  faq: FaqDTO[];
  ctaText: string;
  ctaAnchor: string;
  status: "DRAFT" | "PUBLISHED";
  noindex: boolean;
  showInFooter: boolean;
  sortOrder: number;
}

const EMPTY_FORM: PageForm = {
  title: "",
  slug: "",
  metaTitle: "",
  metaDescription: "",
  focusKeyword: "",
  keywords: "",
  sections: [{ heading: "", paragraphs: [""], bullets: [] }],
  faq: [],
  ctaText: "Konsultasi Sekarang",
  ctaAnchor: "/#konsultasi",
  status: "DRAFT",
  noindex: false,
  showInFooter: false,
  sortOrder: 0,
};

/** Skor SEO ringan ala editor blog: panjang meta + kata kunci + konten */
function seoScore(form: PageForm): { score: number; hints: string[] } {
  const hints: string[] = [];
  let score = 0;
  if (form.title.trim()) score += 10;
  else hints.push("Judul masih kosong.");
  const mt = form.metaTitle.trim();
  if (mt.length >= 30 && mt.length <= 60) score += 20;
  else if (mt) hints.push(`Meta title ${mt.length} karakter — ideal 30–60.`);
  else hints.push("Meta title kosong.");
  const md = form.metaDescription.trim();
  if (md.length >= 110 && md.length <= 160) score += 20;
  else if (md) hints.push(`Meta description ${md.length} karakter — ideal 110–160.`);
  else hints.push("Meta description kosong.");
  if (form.focusKeyword.trim()) {
    score += 15;
    const kw = form.focusKeyword.toLowerCase();
    if (mt.toLowerCase().includes(kw)) score += 10;
    else hints.push("Kata kunci fokus tidak ada di meta title.");
    if (md.toLowerCase().includes(kw)) score += 10;
    else hints.push("Kata kunci fokus tidak ada di meta description.");
  } else {
    hints.push("Kata kunci fokus kosong.");
  }
  const words = form.sections.reduce(
    (n, s) =>
      n +
      s.heading.split(/\s+/).filter(Boolean).length +
      s.paragraphs.join(" ").split(/\s+/).filter(Boolean).length +
      (s.bullets ?? []).join(" ").split(/\s+/).filter(Boolean).length,
    0
  );
  if (words >= 300) score += 15;
  else hints.push(`Konten ${words} kata — target minimal 300 kata.`);
  return { score: Math.min(100, score), hints };
}

export function StudioTab() {
  const { toast } = useToast();
  // ---------- state tema ----------
  const [themes, setThemes] = useState<ThemeMetaDTO[]>([]);
  const [activeTheme, setActiveTheme] = useState<string>("zamrud");
  const [themeBusy, setThemeBusy] = useState<string | null>(null);
  // ---------- state halaman ----------
  const [pages, setPages] = useState<CmsPageDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<PageForm | null>(null);
  const [saving, setSaving] = useState(false);
  const { score } = useMemo(() => seoScore(form ?? EMPTY_FORM), [form]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [themeRes, pageRes] = await Promise.all([
        fetch("/api/admin/theme", { cache: "no-store" }),
        fetch("/api/admin/pages", { cache: "no-store" }),
      ]);
      if (themeRes.ok) {
        const json = await themeRes.json();
        if (json.success) {
          setThemes(json.data.themes ?? []);
          setActiveTheme(json.data.active ?? "zamrud");
        }
      }
      if (pageRes.ok) {
        const json = await pageRes.json();
        if (json.success) setPages(json.data.pages ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  // ---------- tema ----------
  async function applyTheme(themeId: string) {
    setThemeBusy(themeId);
    try {
      const res = await fetch("/api/admin/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeId }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setActiveTheme(themeId);
        // Pratinjau instan di tab ini (tampak di UI admin yang memakai token)
        localStorage.setItem("ah-theme-preview", themeId);
        toast({
          title: "Tema diterapkan",
          description: `Tema aktif kini: ${json.data.theme?.name ?? themeId}. Buka situs untuk melihat hasilnya.`,
        });
      } else {
        toast({
          title: "Gagal menerapkan tema",
          description: json.error ?? "Coba lagi.",
          variant: "destructive",
        });
      }
    } finally {
      setThemeBusy(null);
    }
  }

  // ---------- halaman ----------
  function openNewPage() {
    setForm({ ...EMPTY_FORM });
  }

  function openEditPage(p: CmsPageDTO) {
    setForm({
      id: p.id,
      title: p.title,
      slug: p.slug,
      metaTitle: p.metaTitle,
      metaDescription: p.metaDescription,
      focusKeyword: p.focusKeyword,
      keywords: p.keywords,
      sections: p.sections.length
        ? p.sections.map((s) => ({
            heading: s.heading,
            paragraphs: [...s.paragraphs],
            bullets: [...(s.bullets ?? [])],
          }))
        : [{ heading: "", paragraphs: [""], bullets: [] }],
      faq: p.faq.map((f) => ({ ...f })),
      ctaText: p.cta?.text ?? "Konsultasi Sekarang",
      ctaAnchor: p.cta?.anchor ?? "/#konsultasi",
      status: p.status,
      noindex: p.noindex,
      showInFooter: p.showInFooter,
      sortOrder: p.sortOrder,
    });
  }

  async function savePage() {
    if (!form) return;
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        focusKeyword: form.focusKeyword,
        keywords: form.keywords,
        sections: form.sections.map((s) => ({
          heading: s.heading,
          paragraphs: s.paragraphs.filter((p) => p.trim()),
          bullets: (s.bullets ?? []).filter((b) => b.trim()),
        })),
        faq: form.faq,
        cta: { text: form.ctaText, anchor: form.ctaAnchor },
        status: form.status,
        noindex: form.noindex,
        showInFooter: form.showInFooter,
        sortOrder: form.sortOrder,
      };
      const res = await fetch(
        form.id ? `/api/admin/pages/${form.id}` : "/api/admin/pages",
        {
          method: form.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const json = await res.json();
      if (res.ok && json.success) {
        toast({
          title: "Halaman tersimpan",
          description: `URL: /p/${json.data.slug} (${json.data.status === "PUBLISHED" ? "terpublikasi" : "draf"})`,
        });
        setForm(null);
        await loadAll();
      } else {
        toast({
          title: "Gagal menyimpan",
          description: json.error ?? "Periksa isian dan coba lagi.",
          variant: "destructive",
        });
      }
    } finally {
      setSaving(false);
    }
  }

  async function deletePage(id: string, title: string) {
    if (!confirm(`Hapus halaman "${title}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    const res = await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast({ title: "Halaman dihapus", description: title });
      if (form?.id === id) setForm(null);
      await loadAll();
    } else {
      toast({ title: "Gagal menghapus", variant: "destructive" });
    }
  }

  return (
    <div className="space-y-6">
      {/* ---------- BAGIAN 1: TEMA ---------- */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="size-4" /> Tema Situs
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Ganti identitas visual seluruh situs publik — seketika, tanpa
              menyentuh kode. Tema aktif:{" "}
              <strong>{themes.find((t) => t.id === activeTheme)?.name ?? activeTheme}</strong>
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open(`/?theme=${activeTheme}`, "_blank", "noopener")
            }
          >
            <ExternalLink className="size-3.5" /> Pratinjau situs
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {themes.map((t) => {
              const isActive = t.id === activeTheme;
              return (
                <div
                  key={t.id}
                  className={`rounded-xl border p-4 transition ${
                    isActive
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex overflow-hidden rounded-md border">
                      <span className="size-7" style={{ background: t.palette.background }} title="latar" />
                      <span className="size-7" style={{ background: t.palette.primary }} title="utama" />
                      <span className="size-7" style={{ background: t.palette.gold }} title="aksen" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{t.name}</p>
                      {t.dark && (
                        <Badge variant="secondary" className="mt-0.5 text-[10px]">
                          Gelap
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 line-clamp-2 min-h-[2.4rem] text-xs leading-relaxed text-muted-foreground">
                    {t.description}
                  </p>
                  <Button
                    className="mt-3 w-full"
                    size="sm"
                    variant={isActive ? "secondary" : "default"}
                    disabled={isActive || themeBusy === t.id}
                    onClick={() => void applyTheme(t.id)}
                  >
                    {themeBusy === t.id && <Loader2 className="size-3.5 animate-spin" />}
                    {isActive ? "Tema Aktif" : "Terapkan"}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ---------- BAGIAN 2: HALAMAN ---------- */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="size-4" /> Halaman CMS (/p/…)
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Halaman mandiri ala WordPress — Tentang, Kebijakan, Landing khusus.
              Beri centang “Tampil di footer” agar otomatis tersambung.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("/api/admin/cms-export", "_blank", "noopener")}
            >
              <Download className="size-3.5" /> Ekspor JSON
            </Button>
            <Button size="sm" onClick={openNewPage} disabled={form !== null}>
              <Plus className="size-3.5" /> Halaman Baru
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="mr-2 size-4 animate-spin" /> Memuat…
            </div>
          ) : (
            <div className="max-h-72 space-y-2 overflow-y-auto rounded-lg border p-2">
              {pages.length === 0 && (
                <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                  Belum ada halaman. Klik “Halaman Baru” untuk membuat pertama —
                  misalnya Tentang Kami atau Kebijakan Refund.
                </p>
              )}
              {pages.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      /p/{p.slug} · diperbarui{" "}
                      {new Date(p.updatedAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Badge variant={p.status === "PUBLISHED" ? "default" : "secondary"} className="text-[10px]">
                      {p.status === "PUBLISHED" ? "TERBIT" : "DRAF"}
                    </Badge>
                    {p.showInFooter && (
                      <Badge variant="outline" className="text-[10px]">Footer</Badge>
                    )}
                    {p.noindex && (
                      <Badge variant="outline" className="text-[10px]">noindex</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => openEditPage(p)}
                      aria-label={`Edit ${p.title}`}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-destructive hover:text-destructive"
                      onClick={() => void deletePage(p.id, p.title)}
                      aria-label={`Hapus ${p.title}`}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ---------- FORM HALAMAN ---------- */}
          {form && (
            <div className="mt-4 space-y-4 rounded-xl border bg-background p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">
                  {form.id ? "Edit Halaman" : "Halaman Baru"}
                </h3>
                <Button variant="ghost" size="icon" className="size-7" onClick={() => setForm(null)} aria-label="Tutup form">
                  <X className="size-4" />
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="page-title">Judul *</Label>
                  <Input
                    id="page-title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Tentang Kami"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="page-slug">Slug (URL /p/…)</Label>
                  <Input
                    id="page-slug"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="tentang-kami — kosongkan untuk otomatis"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="page-meta-title">Meta Title (30–60 karakter)</Label>
                  <Input
                    id="page-meta-title"
                    value={form.metaTitle}
                    onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                    placeholder="Tentang Kami — PT Arofah Global Sistem"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="page-meta-desc">Meta Description (110–160 karakter)</Label>
                  <Textarea
                    id="page-meta-desc"
                    rows={2}
                    value={form.metaDescription}
                    onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                    placeholder="Kenali PT Arofah Global Sistem — konsultan perizinan & pendamping ibadah resmi dari Tasikmalaya…"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="page-focus-kw">Kata Kunci Fokus</Label>
                  <Input
                    id="page-focus-kw"
                    value={form.focusKeyword}
                    onChange={(e) => setForm({ ...form, focusKeyword: e.target.value })}
                    placeholder="tentang arofahajj"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="page-keywords">Kata Kunci Tambahan (koma)</Label>
                  <Input
                    id="page-keywords"
                    value={form.keywords}
                    onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                    placeholder="profil PT, konsultan perizinan Tasikmalaya"
                  />
                </div>
              </div>

              {/* SECTIONS editor */}
              <div className="space-y-2">
                <Label>Bagian Konten (H2)</Label>
                {form.sections.map((s, si) => (
                  <div key={si} className="space-y-2 rounded-lg border p-3">
                    <Input
                      value={s.heading}
                      onChange={(e) => {
                        const sections = [...form.sections];
                        sections[si] = { ...s, heading: e.target.value };
                        setForm({ ...form, sections });
                      }}
                      placeholder={`Judul bagian ${si + 1} — mis. Sejarah & Visi Kami`}
                    />
                    <Textarea
                      rows={3}
                      value={s.paragraphs.join("\n\n")}
                      onChange={(e) => {
                        const sections = [...form.sections];
                        sections[si] = {
                          ...s,
                          paragraphs: e.target.value.split(/\n\n+/),
                        };
                        setForm({ ...form, sections });
                      }}
                      placeholder="Paragraf 1… (pisahkan paragraf dengan baris kosong)"
                    />
                    <Textarea
                      rows={2}
                      value={(s.bullets ?? []).join("\n")}
                      onChange={(e) => {
                        const sections = [...form.sections];
                        sections[si] = {
                          ...s,
                          bullets: e.target.value ? e.target.value.split("\n") : [],
                        };
                        setForm({ ...form, sections });
                      }}
                      placeholder="Poin bullet (satu per baris — kosongkan bila tidak perlu)"
                    />
                    {form.sections.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          setForm({
                            ...form,
                            sections: form.sections.filter((_, i) => i !== si),
                          });
                        }}
                      >
                        <Trash2 className="size-3.5" /> Hapus bagian
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setForm({
                      ...form,
                      sections: [
                        ...form.sections,
                        { heading: "", paragraphs: [""], bullets: [] },
                      ],
                    })
                  }
                >
                  <Plus className="size-3.5" /> Tambah bagian
                </Button>
              </div>

              {/* FAQ editor */}
              <div className="space-y-2">
                <Label>FAQ (opsional — bagus untuk rich result Google)</Label>
                {form.faq.map((f, fi) => (
                  <div key={fi} className="space-y-2 rounded-lg border p-3">
                    <Input
                      value={f.question}
                      onChange={(e) => {
                        const faq = [...form.faq];
                        faq[fi] = { ...f, question: e.target.value };
                        setForm({ ...form, faq });
                      }}
                      placeholder="Pertanyaan…"
                    />
                    <Textarea
                      rows={2}
                      value={f.answer}
                      onChange={(e) => {
                        const faq = [...form.faq];
                        faq[fi] = { ...f, answer: e.target.value };
                        setForm({ ...form, faq });
                      }}
                      placeholder="Jawaban…"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() =>
                        setForm({ ...form, faq: form.faq.filter((_, i) => i !== fi) })
                      }
                    >
                      <Trash2 className="size-3.5" /> Hapus FAQ
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setForm({ ...form, faq: [...form.faq, { question: "", answer: "" }] })
                  }
                >
                  <Plus className="size-3.5" /> Tambah FAQ
                </Button>
              </div>

              {/* Opsi & status */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="page-status">Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) =>
                      setForm({ ...form, status: v === "PUBLISHED" ? "PUBLISHED" : "DRAFT" })
                    }
                  >
                    <SelectTrigger id="page-status"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draf (tersembunyi publik)</SelectItem>
                      <SelectItem value="PUBLISHED">Terbitkan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="page-sort">Urutan Footer (kecil = atas)</Label>
                  <Input
                    id="page-sort"
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) =>
                      setForm({ ...form, sortOrder: Number(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <Switch
                    checked={form.showInFooter}
                    onCheckedChange={(v) => setForm({ ...form, showInFooter: v })}
                  />
                  Tampil di footer
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Switch
                    checked={form.noindex}
                    onCheckedChange={(v) => setForm({ ...form, noindex: v })}
                  />
                  noindex (sembunyikan dari Google)
                </label>
              </div>

              {/* Skor SEO */}
              <div className="flex items-center gap-3 rounded-lg border bg-muted/40 px-3 py-2">
                <div
                  className={`text-sm font-bold ${
                    score >= 80 ? "text-primary" : score >= 50 ? "text-gold" : "text-destructive"
                  }`}
                >
                  SEO {score}/100
                </div>
                <div className="text-xs text-muted-foreground">
                  {score >= 80
                    ? "Bagus — siap terbit."
                    : "Lengkapi meta & konten untuk menaikkan skor."}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setForm(null)}>
                  Batal
                </Button>
                <Button onClick={() => void savePage()} disabled={saving || !form.title.trim()}>
                  {saving && <Loader2 className="size-3.5 animate-spin" />}
                  <Save className="size-3.5" /> Simpan
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
