"use client";

// ============================================================
// HERO — Redesign 2026 "Zamrud & Emas Terang" (revisi ketum:
// gelap dibuang, semua terang). Kanvas porcelain dengan pancaran
// aurora emas & mint, judul serif Playfair tinta zamrud, aksen
// emas, dan form konsultasi kartu-kaca putih.
// Logika submit leads 100% dipertahankan (API + fallback WA +
// konversi GA4) — hanya kulitnya yang baru.
// ============================================================

import { useState } from "react";
import { trackEvent } from "@/components/landing/analytics";
import {
  ShieldCheck,
  ChevronDown,
  CheckCircle2,
  Loader2,
  Star,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SECTORS, WHATSAPP_NUMBER } from "@/lib/landing-data";
import { useLanguage } from "@/lib/i18n/language-provider";

const PACKAGES = ["UMKM", "Bisnis", "Enterprise", "Belum tahu"];

interface HeroFormState {
  name: string;
  whatsapp: string;
  businessType: string;
  businessDesc: string;
  package: string;
}

const EMPTY_FORM: HeroFormState = {
  name: "",
  whatsapp: "",
  businessType: "",
  businessDesc: "",
  package: "Belum tahu",
};

export function Hero() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [form, setForm] = useState<HeroFormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "hero" }),
      });
      const json = await res.json();
      if (json.success) {
        // GA4 conversion — lead dari form hero (recommended event).
        trackEvent("generate_lead", { source: "hero" });
        setDone(true);
        toast({
          title: t("toastSuccess"),
          description: json.message,
        });
      } else {
        toast({
          title: t("toastFail"),
          description: json.error || "Coba lagi dalam sejenak.",
          variant: "destructive",
        });
      }
    } catch {
      // Hosting statis (tanpa Node.js): API tidak tersedia —
      // fallback MULUS ke WhatsApp resmi agar lead tetap masuk, tidak pernah hangus.
      const waText = encodeURIComponent(
        `Halo Arofahajj Universe! Saya ${form.name || "(nama)"} (${form.whatsapp || "via form"}).\nJenis usaha: ${form.businessType || "-"}.\nKebutuhan: ${form.businessDesc || "-"}.\nPaket: ${form.package}.\nMohon konsultasi lanjutan. Terima kasih!`
      );
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`, "_blank", "noopener,noreferrer");
      setDone(true);
      toast({
        title: t("toastSuccess"),
        description: "Pesanan Anda diteruskan via WhatsApp — konsultan kami segera merespons.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="beranda"
      className="band-sun-deep pattern-grid relative overflow-hidden pt-28 pb-20 md:pt-40 md:pb-28"
    >
      {/* Ornamen cahaya — kilau emas & mint lembut di kanvas terang */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 -left-40 h-[520px] w-[520px] rounded-full opacity-40 blur-3xl"
        style={{ background: "oklch(0.85 0.08 85 / 0.45)", animation: "aurora-drift 22s ease-in-out infinite alternate" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-56 -right-40 h-[540px] w-[540px] rounded-full opacity-35 blur-3xl"
        style={{ background: "oklch(0.84 0.07 168 / 0.50)", animation: "aurora-drift 28s ease-in-out -11s infinite alternate" }}
      />
      {/* Garis emas tipis pembuka band — tanda tangan identitas baru */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-12 items-center">
          {/* KIRI — Narasi brand dengan tipografi serif editorial */}
          <div className="max-w-xl">
            <p className="animate-fade-up text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-gold">
              PT Arofah Global Sistem · NIB 2503250053856 · KBLI 79121 &amp; 79122
            </p>

            <h1 className="animate-fade-up reveal-1 mt-6 font-display text-4xl sm:text-5xl lg:text-[3.6rem] font-medium leading-[1.08] tracking-tight text-foreground">
              {t("heroTitle1")}{" "}
              <em className="text-gold">{t("heroHigh1")}</em>
              <br />
              {t("heroTitle2")}{" "}
              <span className="relative inline-block">
                <em className="text-gold">{t("heroHigh2")}</em>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 120 10" fill="none" aria-hidden="true">
                  <path d="M2 8C30 2 90 2 118 8" stroke="oklch(0.82 0.15 80)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
                </svg>
              </span>
            </h1>

            <p className="animate-fade-up reveal-2 mt-6 text-lg leading-relaxed text-foreground/70">
              {t("heroSubtitle")}
            </p>

            <ul className="animate-fade-up reveal-3 mt-8 space-y-3.5">
              {[
                t("heroBullet1"),
                t("heroBullet2"),
                t("heroBullet3"),
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/45 bg-gold/15 text-gold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[15px] text-foreground/85">{text}</span>
                </li>
              ))}
            </ul>

            {/* Bukti sosial — avatar zamrud + rating emas */}
            <div className="animate-fade-up reveal-4 mt-9 flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {["RK", "BS", "AW", "HG"].map((initials, i) => (
                  <div
                    key={i}
                    className="h-9 w-9 rounded-full border-2 border-white bg-gradient-to-br from-emerald-500 to-emerald-800 flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                  >
                    {initials}
                  </div>
                ))}
                <div className="h-9 w-9 rounded-full border-2 border-white bg-gold flex items-center justify-center text-[9px] font-bold text-gold-foreground shadow-sm">
                  +1.2k
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1" aria-label="Rating 4.9 dari 5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                  ))}
                  <span className="text-sm font-bold ml-1 text-foreground">4.9</span>
                </div>
                <p className="text-xs text-foreground/60">{t("heroReviews")}</p>
              </div>
            </div>

            {/* CTA berpasangan — emas pejal + outline gading */}
            <div className="animate-fade-up reveal-5 mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#konsultasi"
                className="btn-shine inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
              >
                {t("btnSubmit")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="#produk"
                className="inline-flex items-center gap-2 rounded-lg border border-foreground/20 bg-white/60 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-white"
              >
                Lihat Produk Andalan
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* KANAN — Form konsultasi kaca-gelap (id jangkar #konsultasi) */}
          <div id="konsultasi" className="animate-fade-up reveal-3 relative scroll-mt-28">
            <div className="glass-bright rounded-2xl p-6 md:p-8">
              {done ? (
                <div className="text-center py-10">
                  <div className="mx-auto h-16 w-16 rounded-full bg-gold/15 flex items-center justify-center mb-5">
                    <CheckCircle2 className="h-9 w-9 text-gold" />
                  </div>
                  <h3 className="font-display text-2xl text-foreground">{t("successTitle")}</h3>
                  <p className="mt-3 text-sm text-foreground/70 leading-relaxed max-w-sm mx-auto">
                    {t("successBody").replace("{name}", form.name)}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6 rounded-full border-primary/30 text-primary hover:bg-primary/5 hover:text-primary"
                    onClick={() => {
                      setDone(false);
                      setForm(EMPTY_FORM);
                    }}
                  >
                    {t("btnAnother")}
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-2xl font-medium text-foreground">{t("formTitle")}</h2>
                      <p className="text-sm text-foreground/60 mt-1">
                        {t("formSubtitle")}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-display text-2xl text-gold">{t("labelFree")}</p>
                      <p className="text-[10px] text-foreground/40 line-through">Rp 650rb</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="hero-name" className="text-foreground/80">{t("labelName")}</Label>
                        <Input
                          id="hero-name"
                          placeholder="cth: Budi Santoso"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          required
                          minLength={2}
                          className="h-11 border-primary/20 bg-white/80 text-foreground placeholder:text-foreground/40 focus-visible:ring-primary focus-visible:border-primary/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="hero-wa" className="text-foreground/80">{t("labelWa")}</Label>
                        <Input
                          id="hero-wa"
                          type="tel"
                          inputMode="tel"
                          placeholder="cth: 0812 3456 7890"
                          value={form.whatsapp}
                          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                          required
                          className="h-11 border-primary/20 bg-white/80 text-foreground placeholder:text-foreground/40 focus-visible:ring-primary focus-visible:border-primary/50"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="hero-sector" className="text-foreground/80">{t("labelSector")}</Label>
                        <Select value={form.businessType} onValueChange={(v) => setForm({ ...form, businessType: v })}>
                          <SelectTrigger
                            id="hero-sector"
                            className="h-11 border-primary/20 bg-white/80 text-foreground focus-visible:ring-primary focus-visible:border-primary/50 data-[placeholder]:text-foreground/40"
                          >
                            <SelectValue placeholder={t("phSector")} />
                          </SelectTrigger>
                          <SelectContent className="border-primary/15">
                            {SECTORS.map((s) => (
                              <SelectItem key={s} value={s} className="focus:bg-primary/10 focus:text-foreground">
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="hero-package" className="text-foreground/80">{t("labelNeed")}</Label>
                        <Select value={form.package} onValueChange={(v) => setForm({ ...form, package: v })}>
                          <SelectTrigger
                            id="hero-package"
                            className="h-11 border-primary/20 bg-white/80 text-foreground focus-visible:ring-primary focus-visible:border-primary/50"
                          >
                            <SelectValue placeholder={t("phNeed")} />
                          </SelectTrigger>
                          <SelectContent className="border-primary/15">
                            {PACKAGES.map((p) => (
                              <SelectItem key={p} value={p} className="focus:bg-primary/10 focus:text-foreground">
                                {p === "Belum tahu" ? t("pkgNotSure") : t("pkgPrefix").replace("{p}", p)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="hero-desc" className="text-foreground/80">{t("labelDesc")}</Label>
                      <Textarea
                        id="hero-desc"
                        placeholder="cth: Saya mau buka travel umroh di Bandung, sudah punya PT, belum punya izin Kemenag..."
                        rows={2}
                        value={form.businessDesc}
                        onChange={(e) => setForm({ ...form, businessDesc: e.target.value })}
                        className="resize-none border-primary/20 bg-white/80 text-foreground placeholder:text-foreground/40 focus-visible:ring-primary focus-visible:border-primary/50"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="btn-shine w-full h-12 rounded-lg font-bold text-base bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary hover:brightness-110 transition-all"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          {t("btnSending")}
                        </>
                      ) : (
                        <>
                          {t("btnSubmit")}
                          <ChevronDown className="h-5 w-5 rotate-[-90deg]" />
                        </>
                      )}
                    </Button>

                    <p className="text-[11px] text-center text-foreground/55 flex items-center justify-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-gold" />
                      {t("privacyNote")}
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
