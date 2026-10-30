"use client";

/**
 * MUHDIN VIEW — MUHDIN.ID portal
 * Membership tiers, direktori anggota, benefit, stats.
 */

import { useState } from "react";
import { useUniverse } from "./store";
import { Reveal, SectionHeading, SpotlightCard, GradientText, Counter, rupiah } from "./fx";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2, QrCode, Search } from "lucide-react";

const TIER_STYLE: Record<string, string> = {
  PLATINUM: "bg-gradient-to-r from-slate-200 to-slate-400 text-black",
  GOLD: "bg-gradient-to-r from-amber-300 to-yellow-500 text-black",
  SILVER: "bg-gradient-to-r from-zinc-300 to-zinc-500 text-black",
};

export function MuhdinView() {
  const { content, setView } = useUniverse();
  const { toast } = useToast();
  const [q, setQ] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinForm, setJoinForm] = useState({ travel: "", city: "", phone: "" });

  const directory = content.muhdin.directory.filter(
    (d) => q === "" || d.name.toLowerCase().includes(q.toLowerCase()) || d.city.toLowerCase().includes(q.toLowerCase())
  );

  async function submitJoin() {
    if (!joinForm.travel || !joinForm.city || !joinForm.phone) {
      toast({ title: "Data belum lengkap", description: "Nama travel, kota, dan WhatsApp wajib diisi.", variant: "destructive" });
      return;
    }
    setJoining(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: joinForm.travel,
          business: joinForm.travel,
          city: joinForm.city,
          phone: joinForm.phone,
          email: "muhdin@arofahajj.com",
          interest: "muhdin",
          message: `Pendaftaran anggota MEHUDIN dari ${joinForm.city}`,
          source: "website",
        }),
      });
      toast({ title: "🎉 Pendaftaran terkirim!", description: "Tim verifikasi MEHUDIN akan menghubungi Anda untuk due diligence." });
      setJoining(false);
    } catch {
      toast({ title: "Gagal mengirim", variant: "destructive" });
      setJoining(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* HERO */}
      <section className="mb-14 text-center">
        <Reveal>
          <Badge className="mb-4 border-teal-400/30 bg-teal-400/10 px-4 py-1.5 text-xs text-teal-200">🤝 MUHDIN.ID — Asosiasi Industri</Badge>
          <h1 className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl">
            <GradientText>{content.muhdin.headline}</GradientText>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">{content.muhdin.sub}</p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "Anggota", value: content.muhdin.stats.members, suffix: "+" },
              { label: "Kota", value: content.muhdin.stats.cities, suffix: "" },
              { label: "Tersertifikasi", value: content.muhdin.stats.certified, suffix: "+" },
              { label: "Event/Tahun", value: content.muhdin.stats.events, suffix: "" },
            ].map((s) => (
              <SpotlightCard key={s.label} className="p-4 text-center">
                <div className="text-2xl font-extrabold text-teal-300"><Counter value={s.value} suffix={s.suffix} /></div>
                <div className="text-[11px] text-muted-foreground">{s.label}</div>
              </SpotlightCard>
            ))}
          </div>
        </Reveal>
      </section>

      {/* TIERS */}
      <section className="mb-14">
        <SectionHeading kicker="Membership" title={<>Tingkat <GradientText>Keanggotaan</GradientText></>} sub="Satu SSO untuk semua portal ekosistem — booking, sertifikasi, marketplace." />
        <div className="grid gap-5 md:grid-cols-3">
          {content.muhdin.tiers.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <SpotlightCard className={`relative flex h-full flex-col p-6 ${t.highlight ? "ring-2 ring-teal-400/50" : ""}`}>
                {t.highlight && (
                  <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-400 to-emerald-500 text-[9px] font-bold text-black">PALING POPULER</Badge>
                )}
                <h3 className="mb-1 text-lg font-bold">{t.name}</h3>
                <div className="mb-4 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-teal-300">{rupiah(t.price)}</span>
                  <span className="text-xs text-muted-foreground">/{t.period}</span>
                </div>
                <ul className="mb-5 flex-1 space-y-2">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-foreground/85">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-400" /> {f}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => setJoining(true)}
                  className={t.highlight ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white" : "border border-white/20 bg-white/5 hover:bg-white/10"}
                  variant={t.highlight ? "default" : "outline"}
                >
                  Daftar Sekarang
                </Button>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* DIRECTORY */}
      <section className="mb-14">
        <SectionHeading kicker="Direktori Publik" title={<>Travel <GradientText>Tersertifikasi</GradientText> dengan Badge</>} sub="Setiap anggota punya halaman publik + QR verifikasi — jamaah bisa cek legalitas dalam 1 detik." />
        <Reveal className="mb-6">
          <div className="relative mx-auto max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari travel atau kota..." className="border-white/10 bg-black/25 pl-9" aria-label="Cari anggota" />
          </div>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {directory.map((d, i) => (
            <Reveal key={d.ppiu} delay={i * 0.06}>
              <SpotlightCard className="p-5 transition-transform hover:-translate-y-1">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/30 to-emerald-600/30 text-lg">🕌</span>
                    <div>
                      <p className="text-sm font-bold">{d.name}</p>
                      <p className="text-[11px] text-muted-foreground">📍 {d.city} · PPIU {d.ppiu}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-3 flex items-center justify-between">
                  <Badge className={`${TIER_STYLE[d.tier] ?? TIER_STYLE.SILVER} border-0 text-[9px] font-extrabold tracking-wider`}>
                    {d.tier === "platinum" ? "💎" : d.tier === "gold" ? "🥇" : "🥈"} MEHUDIN-{d.badge}
                  </Badge>
                  <span className="text-xs font-bold text-emerald-300">Skor {d.score}/100</span>
                </div>
                <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400" style={{ width: `${d.score}%` }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><QrCode className="h-3 w-3" /> QR publik aktif</span>
                  <Button size="sm" variant="ghost" className="text-teal-300 hover:bg-teal-500/10" onClick={() => setView("sertifikasi")}>
                    Cek Sertifikat →
                  </Button>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="mb-14">
        <SectionHeading kicker="Kenapa MEHUDIN" title={<>Kekuatan <GradientText>Jaringan Industri</GradientText></>} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {content.muhdin.benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.08}>
              <SpotlightCard className="h-full p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/15 text-2xl">
                  {b.icon === "shield" ? "🛡️" : b.icon === "award" ? "🏅" : b.icon === "users" ? "🤝" : "🔔"}
                </div>
                <h3 className="mb-1.5 text-sm font-bold">{b.title}</h3>
                <p className="text-[11px] leading-relaxed text-muted-foreground">{b.desc}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* JOIN CTA */}
      <Reveal>
        <div className="aro-glass relative overflow-hidden rounded-[2rem] p-8 text-center md:p-12">
          <div className="aro-aurora h-64 w-64 bg-teal-400/20" style={{ top: "-60px", left: "35%" }} />
          <h2 className="relative mb-2 text-2xl font-extrabold md:text-3xl">Siap Jadi Bagian dari <GradientText>Asosiasi #1</GradientText>?</h2>
          <p className="relative mx-auto mb-6 max-w-lg text-sm text-muted-foreground">Proses verifikasi 2 lapis memastikan hanya travel berintegritas yang membawa badge MEHUDIN.</p>
          <Button size="lg" onClick={() => setJoining(true)} className="relative gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-xl shadow-teal-600/30 transition-transform hover:scale-105">
            🤝 Daftar Anggota Sekarang
          </Button>
        </div>
      </Reveal>

      {/* JOIN DIALOG */}
      <Dialog open={joining} onOpenChange={setJoining}>
        <DialogContent className="aro-glass border-white/15 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>🤝 Pendaftaran Anggota MEHUDIN</DialogTitle>
            <DialogDescription>Isi data awal — tim verifikasi kami akan menghubungi untuk proses due diligence.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label className="text-xs">Nama Travel / Usaha *</Label>
              <Input value={joinForm.travel} onChange={(e) => setJoinForm({ ...joinForm, travel: e.target.value })} placeholder="PT Contoh Wisata Halal" className="bg-black/30" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs">Kota *</Label>
              <Input value={joinForm.city} onChange={(e) => setJoinForm({ ...joinForm, city: e.target.value })} placeholder="Jakarta" className="bg-black/30" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs">WhatsApp *</Label>
              <Input value={joinForm.phone} onChange={(e) => setJoinForm({ ...joinForm, phone: e.target.value })} placeholder="0812xxxxxxx" className="bg-black/30" />
            </div>
            <Button onClick={submitJoin} disabled={joining} className="gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
              {joining && <Loader2 className="h-4 w-4 animate-spin" />} Kirim Pendaftaran
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
