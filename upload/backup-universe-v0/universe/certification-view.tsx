"use client";

/**
 * SERTIFIKASI VIEW — sertifikasi.arofahahjj.com portal
 * AI Wizard KBLI + katalog 18 kategori + detail layanan + verifikasi publik QR.
 */

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUniverse } from "./store";
import { Reveal, SectionHeading, SpotlightCard, GradientText, LiveDot, rupiah, ShimmerProgress } from "./fx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2, ChevronRight, Loader2, Search, Sparkles, ShieldCheck, ShieldX,
  ArrowRight, ScanLine, Clock, ListChecks, Bot,
} from "lucide-react";

const CAT_ICON: Record<string, string> = {
  mosque: "🕌", building: "🏢", receipt: "🧾", store: "🏪", hotel: "🏨", award: "🏅",
  heart: "🏥", hardhat: "👷", laptop: "💻", leaf: "🌱", idcard: "🪪", helmet: "⛑️",
};

interface WizardResult {
  ruleNote: string;
  recommended: { id: string; code: string; name: string; priceMin: number; priceMax: number; timeline: string }[];
  totalMin: number;
  totalMax: number;
  journey: { step: number; service: string; code: string; timeline: string }[];
}

interface VerifyResult {
  verdict: string;
  message: string;
  certificate?: {
    code: string; holder: string; service: string; validUntil: string | null;
    dataHash: string; chain: string; status: string;
  };
}

export function CertificationView() {
  const { content, setView } = useUniverse();
  const { toast } = useToast();

  // ---- Wizard state ----
  const [wizardOpen, setWizardOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [wBiz, setWBiz] = useState("");
  const [wScale, setWScale] = useState("startup");
  const [wPt, setWPt] = useState(false);
  const [wPpiu, setWPpiu] = useState(false);
  const [wCity, setWCity] = useState("");
  const [wLoading, setWLoading] = useState(false);
  const [wResult, setWResult] = useState<(WizardResult & { code: string }) | null>(null);

  // ---- Catalog state ----
  const [cat, setCat] = useState("ALL");
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState<string | null>(null);

  // ---- Verify state ----
  const [verifyCode, setVerifyCode] = useState("");
  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null);
  const [verifying, setVerifying] = useState(false);

  const filtered = useMemo(
    () =>
      content.services.items.filter(
        (s) =>
          (cat === "ALL" || s.category === cat) &&
          (q === "" ||
            s.name.toLowerCase().includes(q.toLowerCase()) ||
            s.desc.toLowerCase().includes(q.toLowerCase()) ||
            s.code.toLowerCase().includes(q.toLowerCase()))
      ),
    [content.services.items, cat, q]
  );

  const detailSvc = content.services.items.find((s) => s.id === detail);
  const featured = content.services.items.filter((s) => s.featured);

  async function runWizard() {
    if (!wBiz) {
      toast({ title: "Pilih jenis usaha dulu", variant: "destructive" });
      return;
    }
    setWLoading(true);
    try {
      const res = await fetch("/api/wizard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessType: wBiz, scale: wScale, hasPt: wPt, hasPpiu: wPpiu, city: wCity }),
      });
      const j = (await res.json()) as { ok: boolean; code?: string; result?: WizardResult; error?: string };
      if (j.ok && j.result && j.code) {
        setWResult({ ...j.result, code: j.code });
        setStep(2);
      } else toast({ title: "Gagal", description: j.error, variant: "destructive" });
    } finally {
      setWLoading(false);
    }
  }

  async function doVerify() {
    if (!verifyCode.trim()) return;
    setVerifying(true);
    try {
      const res = await fetch(`/api/verify?code=${encodeURIComponent(verifyCode.trim().toUpperCase())}`);
      const j = (await res.json()) as VerifyResult;
      setVerifyResult(j);
    } finally {
      setVerifying(false);
    }
  }

  async function mintDemoCert() {
    const res = await fetch("/api/certificates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ holder: "Arofahajj Syariah (Demo)", service: "PPIU — Penyelenggara Perjalanan Ibadah Umrah", validUntil: "2031-12-31" }),
    });
    const j = (await res.json()) as { ok: boolean; certificate?: { code: string } };
    if (j.ok && j.certificate) {
      setVerifyCode(j.certificate.code);
      toast({ title: "Sertifikat demo terbit 🎉", description: `Kode ${j.certificate.code} otomatis diisi ke kolom verifikasi.` });
      void doVerify();
    }
  }

  function resetWizard() {
    setStep(0); setWBiz(""); setWResult(null); setWPt(false); setWPpiu(false); setWCity("");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <SectionHeading
        kicker="🏆 sertifikasi.arofahajj.com"
        title={<>Pusat <GradientText>Perizinan & Sertifikasi</GradientText> #1 Indonesia</>}
        sub="160+ layanan · 18 kategori · 50+ sub-kategori — dari pendirian PT sampai ISO & BPOM. Ditemani AI Compliance Copilot di setiap langkah."
      />

      {/* ==== AI WIZARD BANNER ==== */}
      <Reveal className="mb-10">
        <div className="aro-glass relative overflow-hidden rounded-[2rem] p-6 md:p-8">
          <div className="aro-aurora h-56 w-56 bg-amber-400/20" style={{ top: "-60px", right: "-40px" }} />
          <div className="relative flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-2xl shadow-lg shadow-amber-500/30 aro-float">🧙</span>
              <div>
                <h3 className="text-lg font-bold md:text-xl">AI Compliance Wizard — <span className="text-amber-300">Gratis</span></h3>
                <p className="mt-1 max-w-lg text-xs leading-relaxed text-muted-foreground md:text-sm">
                  Jawab 4 pertanyaan singkat, AI meracik rekomendasi izin yang <b>paling pas untuk kondisi Anda</b> — lengkap dengan urutan proses, estimasi biaya, dan timeline.
                </p>
              </div>
            </div>
            <Button size="lg" onClick={() => { setWizardOpen(true); resetWizard(); }} className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xl shadow-amber-600/30 transition-transform hover:scale-105">
              <Sparkles className="h-4 w-4" /> Konsultasi Gratis dengan AI
            </Button>
          </div>
        </div>
      </Reveal>

      {/* ==== FLAGSHIP R ROW ==== */}
      <Reveal className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold">
            🕌 Kategori R — <GradientText>Perizinan Haji-Umrah</GradientText>
            <Badge className="bg-amber-400/15 text-amber-300">FLAGSHIP</Badge>
          </h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.slice(0, 6).map((s, i) => (
            <Reveal key={s.id} delay={i * 0.06}>
              <SpotlightCard className="h-full p-5 transition-transform hover:-translate-y-1">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted-foreground">{s.code}</span>
                  {s.tier >= 3 && <Badge className="bg-amber-400/15 text-[9px] text-amber-300">{"⭐".repeat(s.tier)}</Badge>}
                </div>
                <h4 className="mb-1.5 text-sm font-bold leading-snug">{s.name}</h4>
                <p className="mb-3 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">{s.desc}</p>
                <div className="mb-3 text-sm font-extrabold text-emerald-300">
                  {s.priceMin === s.priceMax ? rupiah(s.priceMin) : `${rupiah(s.priceMin)} – ${rupiah(s.priceMax)}`}
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><Clock className="h-3 w-3" /> {s.timeline}</span>
                  <Button size="sm" variant="ghost" className="gap-1 text-emerald-300 hover:bg-emerald-500/10" onClick={() => setDetail(s.id)}>
                    Detail <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* ==== BUNDLES ==== */}
      <Reveal className="mb-12">
        <h3 className="mb-4 text-lg font-bold">🎁 Paket Bundel Unggulan — <span className="text-emerald-300">Hemat Jutaan Rupiah</span></h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {content.bundles.map((b, i) => (
            <Reveal key={b.id} delay={i * 0.06}>
              <SpotlightCard glow="var(--aro-gold)" className={`relative h-full p-6 ${b.popular ? "ring-1 ring-amber-400/40" : ""}`}>
                {b.popular && (
                  <Badge className="absolute -top-2.5 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-[9px] font-bold text-black">{b.tier}</Badge>
                )}
                <h4 className="mb-1 text-sm font-extrabold tracking-wide">{b.name}</h4>
                <p className="mb-3 text-[11px] leading-relaxed text-muted-foreground">{b.desc}</p>
                <div className="mb-3 flex items-baseline gap-2">
                  <span className="text-xl font-extrabold text-amber-300">{rupiah(b.price)}</span>
                  <span className="text-[10px] font-semibold text-emerald-400">HEMAT {rupiah(b.save)}</span>
                </div>
                <ul className="mb-4 space-y-1">
                  {b.includes.slice(0, 4).map((inc) => (
                    <li key={inc} className="flex items-start gap-1.5 text-[11px] text-foreground/85">
                      <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" /> {inc}
                    </li>
                  ))}
                  {b.includes.length > 4 && (
                    <li className="text-[11px] font-medium text-muted-foreground">+{b.includes.length - 4} benefit lainnya…</li>
                  )}
                </ul>
                <Button size="sm" className="w-full bg-amber-500/90 text-black hover:bg-amber-400" onClick={() => { setWizardOpen(true); resetWizard(); }}>
                  Mulai Paket Ini →
                </Button>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* ==== FULL CATALOG ==== */}
      <Reveal className="mb-6">
        <h3 className="mb-4 text-lg font-bold">📚 Katalog Lengkap — <span className="text-muted-foreground text-sm font-normal">{content.services.items.length}+ layanan tampil dari 160+ tersedia</span></h3>
        <div className="aro-glass mb-4 flex flex-col gap-3 rounded-2xl p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari layanan, kode (mis. R.1), atau kata kunci..." className="border-white/10 bg-black/25 pl-9" aria-label="Cari layanan" />
          </div>
          <div className="aro-scroll flex gap-2 overflow-x-auto pb-1">
            <button onClick={() => setCat("ALL")} className={`shrink-0 rounded-xl px-3.5 py-2 text-[11px] font-semibold transition-all ${cat === "ALL" ? "bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/40" : "bg-white/5 text-muted-foreground hover:bg-white/10"}`}>
              ✨ Semua
            </button>
            {content.services.categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`shrink-0 rounded-xl px-3.5 py-2 text-[11px] font-semibold transition-all ${cat === c.id ? "bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/40" : "bg-white/5 text-muted-foreground hover:bg-white/10"}`}
                title={c.desc}
              >
                {CAT_ICON[c.icon] ?? "📦"} {c.name}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((s, i) => (
            <motion.div
              key={s.id}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
            >
              <SpotlightCard className="flex h-full flex-col p-5">
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant="outline" className="border-white/15 font-mono text-[9px]">{s.code}</Badge>
                  {s.aiFeatures.length > 0 && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-300"><Bot className="h-3 w-3" /> AI-ready</span>
                  )}
                </div>
                <h4 className="mb-1.5 text-sm font-bold leading-snug">{s.name}</h4>
                <p className="mb-3 line-clamp-2 flex-1 text-[11px] leading-relaxed text-muted-foreground">{s.desc}</p>
                <div className="mb-2 text-sm font-extrabold text-emerald-300">
                  {s.priceMin === s.priceMax ? rupiah(s.priceMin) : `${rupiah(s.priceMin)} – ${rupiah(s.priceMax)}`}
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><Clock className="h-3 w-3" /> {s.timeline}</span>
                  <Button size="sm" variant="ghost" className="gap-1 text-emerald-300 hover:bg-emerald-500/10" onClick={() => setDetail(s.id)}>
                    Detail <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">Tidak ada layanan yang cocok. Coba kata kunci lain atau reset filter.</p>
      )}

      {/* ==== PUBLIC TRUST LAYER (verifikasi) ==== */}
      <Reveal className="mt-14">
        <div className="aro-glass relative overflow-hidden rounded-[2rem] p-6 md:p-10">
          <div className="aro-aurora h-56 w-56 bg-teal-400/20" style={{ bottom: "-80px", left: "-40px" }} />
          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-xl font-extrabold md:text-2xl">
                <ScanLine className="h-6 w-6 text-teal-300" /> Public Trust Layer
              </h3>
              <p className="mb-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                Setiap sertifikat terbit punya QR + hash SHA-256 yang di-anchor ke blockchain. Jamaah & mitra cukup scan untuk cek keaslian — <b className="text-foreground">anti-pemalsuan</b>.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input value={verifyCode} onChange={(e) => { setVerifyCode(e.target.value.toUpperCase()); setVerifyResult(null); }} placeholder="CERT-XXXXXXXX" className="border-white/10 bg-black/25 font-mono" aria-label="Kode sertifikat" />
                <Button onClick={doVerify} disabled={verifying} className="gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
                  {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} Verifikasi
                </Button>
              </div>
              <button onClick={mintDemoCert} className="mt-3 text-[11px] font-medium text-emerald-300 underline-offset-2 hover:underline">
                🔮 Tidak punya kode? Terbitkan sertifikat demo satu klik →
              </button>
            </div>
            <AnimatePresence mode="wait">
              {verifyResult ? (
                <motion.div
                  key={verifyResult.verdict + verifyResult.message}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  className={`rounded-2xl border p-6 ${verifyResult.verdict === "ASLI" ? "border-emerald-400/40 bg-emerald-500/10" : "border-red-400/40 bg-red-500/10"}`}
                >
                  <div className="mb-3 flex items-center gap-3">
                    {verifyResult.verdict === "ASLI" ? (
                      <ShieldCheck className="h-10 w-10 text-emerald-400" />
                    ) : (
                      <ShieldX className="h-10 w-10 text-red-400" />
                    )}
                    <div>
                      <p className={`text-2xl font-black tracking-widest ${verifyResult.verdict === "ASLI" ? "text-emerald-300" : "text-red-300"}`}>
                        {verifyResult.verdict}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{verifyResult.message}</p>
                    </div>
                  </div>
                  {verifyResult.certificate && (
                    <div className="mt-4 space-y-1.5 rounded-xl bg-black/30 p-4 font-mono text-[11px] text-muted-foreground">
                      <p><span className="text-emerald-300">{verifyResult.certificate.code}</span> · {verifyResult.certificate.status}</p>
                      <p>Pemilik: <span className="text-foreground">{verifyResult.certificate.holder}</span></p>
                      <p>Layanan: <span className="text-foreground">{verifyResult.certificate.service}</span></p>
                      <p className="break-all">Hash: {verifyResult.certificate.dataHash.slice(0, 32)}…</p>
                      <p>Chain: {verifyResult.certificate.chain} · IPFS anchor: siap (roadmap Fase 2)</p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-white/15 text-sm text-muted-foreground">
                  Hasil verifikasi akan tampil di sini 🔍
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Reveal>

      {/* CTA ke wizard */}
      <Reveal className="mt-10 text-center">
        <p className="mb-3 text-sm text-muted-foreground">Bingung mulai dari izin yang mana?</p>
        <Button size="lg" onClick={() => { setWizardOpen(true); resetWizard(); }} className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xl shadow-amber-600/30">
          <Sparkles className="h-4 w-4" /> Biaya AI Pilihkan untuk Anda
        </Button>
      </Reveal>

      {/* ================= WIZARD DIALOG ================= */}
      <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
        <DialogContent className="aro-glass max-h-[85vh] overflow-y-auto aro-scroll border-white/15 sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">🧙 AI Compliance Wizard</DialogTitle>
            <DialogDescription>
              {step === 0 && "Langkah 1/3 — Jenis usaha apa yang ingin Anda bangun atau kembangkan?"}
              {step === 1 && "Langkah 2/3 — Kondisi usaha Anda saat ini"}
              {step === 2 && "Selesai! Berikut rekomendasi personal Anda 🎉"}
            </DialogDescription>
          </DialogHeader>

          {/* progress */}
          <div className="mb-2">
            <ShimmerProgress value={step === 0 ? 33 : step === 1 ? 66 : 100} />
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="grid gap-2">
                {content.wizardRules.businessTypes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setWBiz(t.id); setStep(1); }}
                    className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all hover:border-emerald-400/50 hover:bg-emerald-500/10 ${wBiz === t.id ? "border-emerald-400/50 bg-emerald-500/10" : "border-white/10 bg-black/20"}`}
                  >
                    <div>
                      <p className="text-sm font-semibold">{t.label}</p>
                      <p className="text-[11px] text-muted-foreground">{t.note}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-emerald-400" />
                  </button>
                ))}
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="grid gap-4">
                <div className="grid gap-1.5">
                  <Label className="text-xs">Skala usaha</Label>
                  <div className="flex gap-2">
                    {[
                      { id: "startup", label: "🌱 Startup" },
                      { id: "medium", label: "🌿 Menengah" },
                      { id: "enterprise", label: "🌳 Enterprise" },
                    ].map((s) => (
                      <button key={s.id} onClick={() => setWScale(s.id)} className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${wScale === s.id ? "bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/40" : "bg-white/5 text-muted-foreground hover:bg-white/10"}`}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3 rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold">Sudah punya PT / CV?</p>
                      <p className="text-[10px] text-muted-foreground">Badan usaha terdaftar resmi</p>
                    </div>
                    <Switch checked={wPt} onCheckedChange={setWPt} aria-label="Sudah punya PT" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold">Sudah punya izin PPIU?</p>
                      <p className="text-[10px] text-muted-foreground">Untuk jalur haji plus</p>
                    </div>
                    <Switch checked={wPpiu} onCheckedChange={setWPpiu} aria-label="Sudah punya PPIU" />
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="text-xs">Kota / Domisili usaha</Label>
                    <Input value={wCity} onChange={(e) => setWCity(e.target.value)} placeholder="mis. Jakarta Selatan" className="bg-black/30" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(0)} className="border-white/20">← Kembali</Button>
                  <Button onClick={runWizard} disabled={wLoading} className="flex-1 gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    {wLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {wLoading ? "AI meracik rekomendasi..." : "Generate Rekomendasi"}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && wResult && (
              <motion.div key="s2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4">
                <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4">
                  <p className="mb-1 text-xs font-bold text-emerald-200">🎯 Kode Rencana Anda: <span className="font-mono">{wResult.code}</span></p>
                  <p className="text-[11px] text-muted-foreground">{wResult.ruleNote}</p>
                </div>
                <div className="grid gap-2">
                  <p className="flex items-center gap-1.5 text-xs font-bold"><ListChecks className="h-4 w-4 text-emerald-400" /> Journey Perizinan Anda ({wResult.journey.length} langkah):</p>
                  {wResult.journey.map((j) => (
                    <div key={j.step} className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300">{j.step}</span>
                      <div className="flex-1">
                        <p className="text-xs font-semibold">{j.service}</p>
                        <p className="text-[10px] text-muted-foreground">{j.code} · ⏱ {j.timeline}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-emerald-500/15 to-teal-500/15 p-4 ring-1 ring-emerald-400/30">
                  <span className="text-xs font-semibold">Estimasi total investasi</span>
                  <span className="text-sm font-extrabold text-emerald-300">{rupiah(wResult.totalMin)} – {rupiah(wResult.totalMax)}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={resetWizard} className="border-white/20">↺ Ulangi</Button>
                  <Button className="flex-1 gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white" onClick={() => { setWizardOpen(false); setView("home"); }}>
                    <CheckCircle2 /> Konsultasi lanjutan dengan expert
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* ================= SERVICE DETAIL DIALOG ================= */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="aro-glass max-h-[85vh] overflow-y-auto aro-scroll border-white/15 sm:max-w-xl">
          {detailSvc && (
            <>
              <DialogHeader>
                <DialogTitle className="text-left">{detailSvc.name}</DialogTitle>
                <DialogDescription className="text-left">
                  {detailSvc.code} · {content.services.categories.find((c) => c.id === detailSvc.category)?.name}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <p className="text-xs leading-relaxed text-foreground/90">{detailSvc.desc}</p>
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-emerald-400/25 bg-emerald-500/10 p-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Investasi</p>
                    <p className="text-lg font-extrabold text-emerald-300">
                      {detailSvc.priceMin === detailSvc.priceMax ? rupiah(detailSvc.priceMin) : `${rupiah(detailSvc.priceMin)} – ${rupiah(detailSvc.priceMax)}`}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Timeline</p>
                    <p className="text-sm font-bold">⏱ {detailSvc.timeline}</p>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-bold">📋 Persyaratan Utama</p>
                  <ul className="grid gap-1.5">
                    {detailSvc.requirements.map((r) => (
                      <li key={r} className="flex items-start gap-1.5 text-[11px] text-foreground/85">
                        <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-teal-400" /> {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-xs font-bold">✅ Paket Layanan Kami Mencakup</p>
                  <ul className="grid gap-1.5">
                    {detailSvc.includes.map((r) => (
                      <li key={r} className="flex items-start gap-1.5 text-[11px] text-foreground/85">
                        <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" /> {r}
                      </li>
                    ))}
                  </ul>
                </div>
                {detailSvc.aiFeatures.length > 0 && (
                  <div className="rounded-xl border border-amber-400/25 bg-amber-400/5 p-4">
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-amber-300"><Bot className="h-4 w-4" /> AI Automation Features</p>
                    <div className="flex flex-wrap gap-1.5">
                      {detailSvc.aiFeatures.map((f) => (
                        <Badge key={f} variant="outline" className="border-amber-400/30 text-[10px] text-amber-200">{f}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button className="flex-1 gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white" onClick={() => { setDetail(null); setWizardOpen(true); resetWizard(); }}>
                    <Sparkles className="h-4 w-4" /> Cek Kecocokan via AI Wizard
                  </Button>
                  <Button variant="outline" onClick={() => setDetail(null)} className="border-white/20">Tutup</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
