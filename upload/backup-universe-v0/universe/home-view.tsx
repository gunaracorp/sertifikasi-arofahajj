"use client";

/**
 * HOME VIEW — Arofahajj Universe landing
 * Hero full animasi + stats + 4 properti + layanan flagship + testimoni + kontak.
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUniverse } from "./store";
import {
  AuroraBackground, Reveal, Counter, SpotlightCard, TiltCard, GradientText,
  Marquee, LiveDot, SectionHeading, ShimmerProgress, rupiah,
} from "./fx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2, Send, Star, ShieldCheck, Sparkles } from "lucide-react";

interface LiveStats {
  leads: number;
  wizardSubs: number;
  bookings: number;
  certs: number;
}

export function HomeView() {
  const { content, setView } = useUniverse();
  const { toast } = useToast();
  const [live, setLive] = useState<LiveStats | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", business: "", message: "" });

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((j) => j.ok && setLive(j.live))
      .catch(() => {});
  }, []);

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast({ title: "Data belum lengkap", description: "Nama, email, dan telepon wajib diisi.", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, interest: "lainnya", source: "website" }),
      });
      const j = (await res.json()) as { ok: boolean; error?: string };
      if (j.ok) {
        setSent(true);
        toast({ title: "✨ Terima kasih!", description: "Tim kami akan menghubungi Anda dalam 1×24 jam kerja." });
      } else {
        toast({ title: "Gagal mengirim", description: j.error, variant: "destructive" });
      }
    } finally {
      setSending(false);
    }
  }

  const iconMap: Record<string, string> = { shield: "🛡️", grid: "🧩", building: "🏢", users: "🧕" };
  const propIcon: Record<string, string> = { plane: "✈️", award: "🏆", users: "🤝", shopping: "🛍️" };
  const propColor: Record<string, string> = {
    emerald: "from-emerald-500/25 to-emerald-500/5 border-emerald-400/30",
    amber: "from-amber-500/25 to-amber-500/5 border-amber-400/30",
    teal: "from-teal-500/25 to-teal-500/5 border-teal-400/30",
    lime: "from-lime-500/25 to-lime-500/5 border-lime-400/30",
  };

  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="relative mx-auto max-w-7xl px-4 pt-8 md:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Reveal>
              <Badge className="mb-5 gap-2 border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs text-amber-200 hover:bg-amber-400/20">
                <Sparkles className="h-3.5 w-3.5" />
                {content.hero.badge}
              </Badge>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight md:text-6xl">
                {content.hero.titleLine1}
                <br />
                {content.hero.titleLine2}{" "}
                <GradientText>{content.hero.titleHighlight}</GradientText>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {content.hero.subtitle}
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={() => setView("sertifikasi")}
                  className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-600/30 transition-transform hover:scale-105"
                >
                  🚀 {content.hero.ctaPrimary}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setView("umrah")}
                  className="gap-2 border-emerald-400/30 bg-transparent hover:bg-emerald-400/10"
                >
                  🕋 {content.hero.ctaSecondary}
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="mt-8 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><LiveDot /> Sistem operational</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> UU PDP & PDPL compliant</span>
                {live && (
                  <span className="flex items-center gap-1.5">
                    <span className="aro-pop font-semibold text-emerald-300">{live.bookings}</span> booking live
                  </span>
                )}
              </div>
            </Reveal>
          </div>

          {/* Kaaba visual */}
          <Reveal delay={0.25} className="relative hidden lg:block">
            <div className="relative mx-auto max-w-md">
              <div className="aro-orbit absolute -inset-8 rounded-full border border-dashed border-emerald-400/20" aria-hidden="true" />
              <TiltCard>
                <div className="aro-glass aro-glow-border relative overflow-hidden rounded-[2rem] p-3 shadow-2xl shadow-emerald-950/50">
                  <img
                    src={content.hero.image}
                    alt="Ka'bah Masjidil Haram — perjalanan ibadah terpercaya"
                    className="h-72 w-full rounded-3xl object-cover md:h-96"
                  />
                  <div className="pointer-events-none absolute inset-3 rounded-3xl bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">Masjidil Haram · Makkah</p>
                    <p className="text-sm text-white/90">Dilindungi escrow syariah & tracking real-time</p>
                  </div>
                </div>
              </TiltCard>
              {/* floating badges */}
              <div className="absolute -left-10 top-8"><div className="aro-float"><div className="aro-glass rounded-full px-3 py-1.5 text-xs font-semibold">🏆 160+ Layanan</div></div></div>
              <div className="absolute -right-8 top-24"><div className="aro-float-slow"><div className="aro-glass rounded-full px-3 py-1.5 text-xs font-semibold">🔗 Verifikasi On-Chain</div></div></div>
              <div className="absolute -left-6 bottom-16"><div className="aro-float-slow" style={{ animationDelay: "-3s" }}><div className="aro-glass rounded-full px-3 py-1.5 text-xs font-semibold">🤖 AI Compliance</div></div></div>
              <div className="absolute -right-4 bottom-6"><div className="aro-float" style={{ animationDelay: "-2s" }}><div className="aro-glass rounded-full px-3 py-1.5 text-xs font-semibold">🕋 25.000+ Jamaah</div></div></div>
            </div>
          </Reveal>
        </div>

        <Marquee items={content.hero.marquee} />
      </section>

      {/* ================= STATS ================= */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {content.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <SpotlightCard className="p-6 text-center">
                <div className="mb-2 text-2xl">{iconMap[s.icon] ?? "✨"}</div>
                <div className="text-3xl font-extrabold text-emerald-300 md:text-4xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-1 text-xs font-medium text-muted-foreground">{s.label}</div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= 4 PROPERTI ================= */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeading
          kicker="Satu Bangun · Semua Pakai"
          title={<>Ekosistem <GradientText>4 Properti</GradientText> Terpadu</>}
          sub="Empat portal, satu SSO, satu data backbone — dirancang microservices-first supaya tumbuh bersama tanpa duplikasi."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {content.properties.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1}>
              <TiltCard>
                <SpotlightCard className={`h-full border bg-gradient-to-br p-6 ${propColor[p.color] ?? propColor.emerald}`}>
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/30 text-2xl shadow-inner">
                        {propIcon[p.icon] ?? "✨"}
                      </span>
                      <div>
                        <div className="text-sm font-bold">{p.name}</div>
                        <div className="font-mono text-xs text-emerald-300/80">{p.domain}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-white/20 text-[10px]">{p.status}</Badge>
                  </div>
                  <p className="mb-4 text-xs leading-relaxed text-muted-foreground md:text-sm">{p.desc}</p>
                  <ul className="mb-5 grid gap-1.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-foreground/85">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" /> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mb-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Progress ekosistem</span>
                    <span className="font-semibold text-emerald-300">{p.progress}%</span>
                  </div>
                  <ShimmerProgress value={p.progress} />
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-5 w-full border-white/15 bg-black/20 hover:bg-white/10"
                    onClick={() => setView(p.id === "arofahajj" ? "umrah" : p.id === "marketplace" ? "market" : (p.id as "sertifikasi" | "muhdin"))}
                  >
                    Masuk Portal →
                  </Button>
                </SpotlightCard>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= FLAGSHIP SERVICES ================= */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeading
          kicker="The Heart of Arofahajj"
          title={<>Spesialis #1 <GradientText>Perizinan Travel Haji-Umrah</GradientText></>}
          sub="Kategori R — layanan flagship dengan margin terbaik & expertise tertinggi. 160+ layanan lainnya menanti di portal Sertifikasi."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {content.services.items.filter((s) => s.category === "R" && s.tier === 3).slice(0, 3).map((s, i) => (
            <Reveal key={s.id} delay={i * 0.1}>
              <SpotlightCard className="h-full p-6">
                <div className="mb-3 flex items-center justify-between">
                  <Badge className="bg-amber-400/15 text-amber-300 hover:bg-amber-400/25">{"⭐".repeat(s.tier)} FLAGSHIP</Badge>
                  <span className="font-mono text-xs text-muted-foreground">{s.code}</span>
                </div>
                <h3 className="mb-2 text-base font-bold leading-snug">{s.name}</h3>
                <p className="mb-4 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
                <div className="mb-4 flex items-baseline gap-1">
                  <span className="text-lg font-extrabold text-emerald-300">{rupiah(s.priceMin)}</span>
                  <span className="text-xs text-muted-foreground">— {rupiah(s.priceMax)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>⏱ {s.timeline}</span>
                  {s.aiFeatures.length > 0 && <span className="flex items-center gap-1 text-amber-300"><Sparkles className="h-3 w-3" /> {s.aiFeatures.length} AI feature</span>}
                </div>
                <Button size="sm" className="mt-4 w-full bg-emerald-500/90 text-white hover:bg-emerald-500" onClick={() => setView("sertifikasi")}>
                  Lihat Detail & Requirements
                </Button>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= LIVE STATUS ================= */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <Reveal>
          <SpotlightCard className="p-6 md:p-8">
            <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
              <div>
                <h3 className="mb-1 flex items-center gap-2 text-lg font-bold"><LiveDot /> Status Platform Real-Time</h3>
                <p className="text-sm text-muted-foreground">Semua servis dalam ekosistem berjalan sebagaimana mestinya — dipantau 24/7.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  { label: "Leads Masuk", value: live?.leads ?? 0, icon: "📥" },
                  { label: "Wizard Digunakan", value: live?.wizardSubs ?? 0, icon: "🧙" },
                  { label: "Booking Aktif", value: live?.bookings ?? 0, icon: "🕋" },
                  { label: "Sertifikat Terbit", value: live?.certs ?? 0, icon: "📜" },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl border border-white/10 bg-black/20 p-3 text-center">
                    <div className="text-lg">{m.icon}</div>
                    <div className="text-xl font-extrabold text-emerald-300"><Counter value={m.value} duration={1} /></div>
                    <div className="text-[10px] text-muted-foreground">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </SpotlightCard>
        </Reveal>
      </section>

      {/* ================= TESTIMONI ================= */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeading
          kicker="Cerita Sukses"
          title={<>Dipercaya oleh <GradientText>Industri & Jamaah</GradientText></>}
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {content.testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <SpotlightCard className="flex h-full flex-col p-6">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-amber-300 text-amber-300" />
                  ))}
                </div>
                <p className="mb-4 flex-1 text-xs leading-relaxed text-foreground/90">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-bold text-white">
                    {t.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </span>
                  <div>
                    <div className="text-xs font-semibold">{t.name}</div>
                    <div className="text-[10px] text-muted-foreground">{t.role} · {t.city}</div>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= KONTAK / CTA ================= */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <Reveal>
          <div className="aro-glass relative overflow-hidden rounded-[2rem] p-8 md:p-12">
            <div className="aro-aurora h-72 w-72 bg-emerald-500/20" style={{ top: "-80px", right: "-60px" }} />
            <div className="relative grid items-center gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-extrabold md:text-4xl">
                  {content.contact.headline.split(" ").slice(0, -2).join(" ")}{" "}
                  <GradientText>{content.contact.headline.split(" ").slice(-2).join(" ")}</GradientText>
                </h2>
                <p className="mt-3 max-w-md text-sm text-muted-foreground">{content.contact.sub}</p>
                <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                  <p>📧 {content.contact.email}</p>
                  <p>📱 {content.contact.phone} · WhatsApp tersedia</p>
                  <p>📍 {content.contact.address}</p>
                  <p>🕒 {content.contact.hours}</p>
                </div>
              </div>
              <form onSubmit={submitLead} className="grid gap-3 rounded-2xl border border-white/10 bg-black/25 p-5">
                {sent ? (
                  <div className="aro-pop flex flex-col items-center gap-3 py-10 text-center">
                    <CheckCircle2 className="h-14 w-14 text-emerald-400" />
                    <p className="text-lg font-bold">Pesan Terkirim! 🎉</p>
                    <p className="max-w-xs text-xs text-muted-foreground">
                      Konsultan expert kami akan menghubungi Anda maksimal 1×24 jam kerja.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", business: "", message: "" }); }}>
                      Kirim pesan lain
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="grid gap-1.5">
                        <Label htmlFor="lead-name" className="text-xs">Nama Lengkap *</Label>
                        <Input id="lead-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="H. Ahmad Fauzi" className="bg-black/30" />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="lead-phone" className="text-xs">WhatsApp *</Label>
                        <Input id="lead-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0812xxxxxxx" className="bg-black/30" />
                      </div>
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="lead-email" className="text-xs">Email *</Label>
                      <Input id="lead-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="nama@usaha.id" className="bg-black/30" />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="lead-biz" className="text-xs">Nama Usaha / Travel</Label>
                      <Input id="lead-biz" value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })} placeholder="PT Contoh Wisata Halal" className="bg-black/30" />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="lead-msg" className="text-xs">Pesan</Label>
                      <Textarea id="lead-msg" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Saya ingin berkonsultasi tentang izin PPIU untuk travel baru..." className="min-h-[80px] bg-black/30" />
                    </div>
                    <Button type="submit" disabled={sending} className="mt-1 gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-600/30">
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      {sending ? "Mengirim..." : "Kirim Konsultasi Gratis"}
                    </Button>
                  </>
                )}
              </form>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
