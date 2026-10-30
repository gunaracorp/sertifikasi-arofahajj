"use client";

/**
 * UMRAH VIEW — arofahajj.com travel portal
 * Katalog paket + filter + booking modal + escrow pizza tracker.
 */

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUniverse } from "./store";
import { Reveal, SectionHeading, SpotlightCard, GradientText, LiveDot, rupiah } from "./fx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Clock, MapPin, Loader2, Search, Star, Users, XCircle, ShieldCheck } from "lucide-react";

interface BookingInfo {
  code: string;
  total: number;
  title: string;
}

const ESCROW_FLOW = [
  { id: "PENDING_PAYMENT", label: "Menunggu Pembayaran", desc: "Pesanan dibuat, silakan bayar ke rekening escrow", icon: "💳" },
  { id: "ESCROW_HELD", label: "Dana di Escrow", desc: "Dana aman di rekening penampungan — belum cair ke travel", icon: "🏦" },
  { id: "CONFIRMED", label: "Booking Dikonfirmasi", desc: "Travel mengonfirmasi ketersediaan seat & visa diproses", icon: "✅" },
  { id: "COMPLETED", label: "Perjalanan Selesai", desc: "Dana cair ke travel setelah jamaah tiba dengan aman", icon: "🕋" },
];

export function UmrahView() {
  const { content } = useUniverse();
  const { toast } = useToast();
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", paxCount: 1 });
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [status, setStatus] = useState<string>("PENDING_PAYMENT");
  const [trackingCode, setTrackingCode] = useState("");
  const [tracking, setTracking] = useState<{ status: string; packageTitle: string } | null>(null);

  const filtered = useMemo(
    () =>
      content.packages.filter(
        (p) =>
          (typeFilter === "ALL" || p.type === typeFilter) &&
          (q === "" || p.title.toLowerCase().includes(q.toLowerCase()) || p.travel.toLowerCase().includes(q.toLowerCase()))
      ),
    [content.packages, q, typeFilter]
  );

  const selectedPkg = content.packages.find((p) => p.slug === selected);

  async function submitBooking() {
    if (!selectedPkg) return;
    if (!form.fullName || !form.phone) {
      toast({ title: "Data belum lengkap", description: "Nama & WhatsApp wajib diisi.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageSlug: selectedPkg.slug, ...form }),
      });
      const j = (await res.json()) as { ok: boolean; booking?: BookingInfo; error?: string };
      if (j.ok && j.booking) {
        setBooking(j.booking);
        setStatus("PENDING_PAYMENT");
      } else {
        toast({ title: "Gagal membuat booking", description: j.error, variant: "destructive" });
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function escrowAction(action: "pay" | "confirm") {
    if (!booking) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: booking.code, action }),
      });
      const j = (await res.json()) as { ok: boolean; booking?: { status: string }; error?: string };
      if (j.ok && j.booking) setStatus(j.booking.status);
      else toast({ title: "Gagal", description: j.error, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  async function trackBooking() {
    if (!trackingCode) return;
    const res = await fetch(`/api/bookings?code=${encodeURIComponent(trackingCode)}`);
    const j = (await res.json()) as { ok: boolean; booking?: { status: string; packageTitle: string }; error?: string };
    if (j.ok && j.booking) setTracking({ status: j.booking.status, packageTitle: j.booking.packageTitle });
    else {
      setTracking(null);
      toast({ title: "Tidak ditemukan", description: "Kode booking tidak valid.", variant: "destructive" });
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <SectionHeading
        kicker="🕋 arofahajj.com — Travel Portal"
        title={<>Perjalanan Ibadah <GradientText>Aman & Transparan</GradientText></>}
        sub="Setiap rupiah dilindungi escrow syariah — dana baru cair ke travel setelah jamaah tiba dengan aman. Tracking real-time ala pizza tracker."
      />

      {/* Filter bar */}
      <Reveal className="mb-8">
        <div className="aro-glass flex flex-col gap-3 rounded-2xl p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari paket atau travel..." className="border-white/10 bg-black/25 pl-9" aria-label="Cari paket" />
          </div>
          <div className="flex gap-2">
            {[
              { id: "ALL", label: "Semua" },
              { id: "UMRAH_REGULER", label: "Umrah Reguler" },
              { id: "UMRAH_PLUS", label: "Umrah Plus" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTypeFilter(t.id)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  typeFilter === t.id
                    ? "bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/40"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Katalog paket */}
      <div className="grid gap-6 lg:grid-cols-3">
        {filtered.map((p, i) => {
          const fill = Math.round((p.booked / p.quota) * 100);
          return (
            <Reveal key={p.id} delay={i * 0.08}>
              <SpotlightCard className="group h-full overflow-hidden p-0">
                <div className="relative h-48 overflow-hidden">
                  <img src={p.image} alt={p.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute left-4 top-4 flex gap-2">
                    <Badge className="bg-emerald-500/90 text-white">{p.type.replace("_", " ")}</Badge>
                    {p.featured && <Badge className="bg-amber-400/90 text-black">⭐ FEATURED</Badge>}
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-xs text-amber-300">
                        <Star className="h-3.5 w-3.5 fill-amber-300" /> {p.rating} ({p.reviewCount} ulasan)
                      </div>
                    </div>
                    <Badge variant="outline" className="border-white/30 bg-black/40 text-[10px]">{p.durationDays} Hari</Badge>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="mb-1 text-sm font-bold leading-snug">{p.title}</h3>
                  <p className="mb-3 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {p.departureCity} · {p.departureMonth} · oleh <span className="font-semibold text-emerald-300">{p.travel}</span>
                  </p>
                  <div className="mb-3 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                    <span>🕋 {p.hotelMakkah} ({p.starMakkah}★)</span>
                    <span>🕌 {p.hotelMadinah} ({p.starMadinah}★)</span>
                  </div>
                  <div className="mb-4">
                    <div className="mb-1 flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1 text-muted-foreground"><Users className="h-3 w-3" /> {p.booked}/{p.quota} seat</span>
                      {fill > 80 && <span className="font-semibold text-amber-300">Hampir penuh!</span>}
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${fill}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className={`h-full rounded-full ${fill > 80 ? "bg-amber-400" : "bg-emerald-400"}`}
                      />
                    </div>
                  </div>
                  <div className="mb-4 flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-emerald-300">{rupiah(p.price)}</span>
                    {p.oldPrice > p.price && <span className="text-xs text-muted-foreground line-through">{rupiah(p.oldPrice)}</span>}
                    <span className="text-[10px] text-muted-foreground">/jamaah</span>
                  </div>
                  <Button
                    className="w-full gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-600/25 transition-transform hover:scale-[1.02]"
                    onClick={() => {
                      setSelected(p.slug);
                      setBooking(null);
                      setForm({ fullName: "", phone: "", email: "", paxCount: 1 });
                    }}
                  >
                    <ShieldCheck className="h-4 w-4" /> Booking dengan Escrow
                  </Button>
                </div>
              </SpotlightCard>
            </Reveal>
          );
        })}
      </div>

      {/* Tracking */}
      <Reveal className="mt-12">
        <SpotlightCard className="p-6">
          <h3 className="mb-1 flex items-center gap-2 text-base font-bold"><LiveDot /> Lacak Booking Anda</h3>
          <p className="mb-4 text-xs text-muted-foreground">Masukkan kode booking (mis. BK-ABC123) untuk melihat status escrow real-time.</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input value={trackingCode} onChange={(e) => setTrackingCode(e.target.value.toUpperCase())} placeholder="BK-XXXXXX" className="border-white/10 bg-black/25 font-mono" aria-label="Kode booking" />
            <Button onClick={trackBooking} className="bg-emerald-500/90 text-white hover:bg-emerald-500">Lacak</Button>
          </div>
          <AnimatePresence>
            {tracking && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                <p className="mb-2 text-xs font-semibold">{tracking.packageTitle}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {ESCROW_FLOW.map((f, idx) => {
                    const currentIdx = ESCROW_FLOW.findIndex((s) => s.id === tracking.status);
                    const done = idx <= currentIdx;
                    return (
                      <div key={f.id} className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium ${done ? "bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/40" : "bg-white/5 text-muted-foreground"}`}>
                        <span>{f.icon}</span> {f.label}
                        {idx < ESCROW_FLOW.length - 1 && <span className="ml-1 text-white/30">→</span>}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </SpotlightCard>
      </Reveal>

      {/* ===== Booking modal ===== */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="aro-glass max-h-[85vh] overflow-y-auto aro-scroll border-white/15 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-left">{booking ? "Pesanan Dibuat! 🎉" : "Booking Paket"}</DialogTitle>
            <DialogDescription className="text-left">
              {booking ? `Kode booking: ${booking.code} — simpan untuk tracking.` : selectedPkg?.title}
            </DialogDescription>
          </DialogHeader>

          {!booking ? (
            <div className="grid gap-3">
              {selectedPkg && (
                <div className="rounded-xl border border-white/10 bg-black/25 p-4 text-xs">
                  <div className="mb-2 flex items-baseline justify-between">
                    <span className="font-semibold">{rupiah(selectedPkg.price)} /jamaah</span>
                    <span className="text-muted-foreground">{selectedPkg.durationDays} hari · {selectedPkg.departureCity}</span>
                  </div>
                  <ul className="space-y-1 text-muted-foreground">
                    {selectedPkg.includes.slice(0, 3).map((inc) => (
                      <li key={inc} className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-400" /> {inc}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="grid gap-1.5">
                <Label className="text-xs">Nama Lengkap Jamaah *</Label>
                <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Sesuai paspor" className="bg-black/30" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label className="text-xs">WhatsApp *</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0812xxxxxxx" className="bg-black/30" />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs">Jumlah Jamaah</Label>
                  <Input type="number" min={1} max={20} value={form.paxCount} onChange={(e) => setForm({ ...form, paxCount: parseInt(e.target.value) || 1 })} className="bg-black/30" />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs">Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="opsional" className="bg-black/30" />
              </div>
              {selectedPkg && (
                <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 p-3 text-sm ring-1 ring-emerald-400/30">
                  <span className="font-semibold">Total ({form.paxCount} jamaah)</span>
                  <span className="font-extrabold text-emerald-300">{rupiah(selectedPkg.price * form.paxCount)}</span>
                </div>
              )}
              <Button onClick={submitBooking} disabled={submitting} className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                Buat Booking (Dana ke Escrow)
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 p-4 text-center">
                <p className="font-mono text-2xl font-extrabold tracking-wider text-emerald-300">{booking.code}</p>
                <p className="mt-1 text-xs text-muted-foreground">Total: <b>{rupiah(booking.total)}</b> · {booking.title}</p>
              </div>
              <div className="grid gap-2">
                {ESCROW_FLOW.map((f, idx) => {
                  const currentIdx = ESCROW_FLOW.findIndex((s) => s.id === status);
                  const done = idx <= currentIdx;
                  const cancelled = status === "CANCELLED";
                  return (
                    <div key={f.id} className={`flex items-start gap-3 rounded-xl border p-3 transition-all ${done && !cancelled ? "border-emerald-400/40 bg-emerald-500/10" : "border-white/10 bg-black/20 opacity-60"}`}>
                      <span className="text-lg">{cancelled ? "" : f.icon}</span>
                      <div className="flex-1">
                        <p className={`text-xs font-semibold ${done && !cancelled ? "text-emerald-200" : ""}`}>{f.label}</p>
                        <p className="text-[11px] text-muted-foreground">{f.desc}</p>
                      </div>
                      {done && !cancelled && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                    </div>
                  );
                })}
                {status === "CANCELLED" && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-xs text-red-200">
                    <XCircle className="h-4 w-4" /> Booking dibatalkan — dana escrow dikembalikan 100%.
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {status === "PENDING_PAYMENT" && (
                  <Button onClick={() => escrowAction("pay")} disabled={submitting} className="flex-1 gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "💳"} Simulasikan Bayar → Escrow
                  </Button>
                )}
                {status === "ESCROW_HELD" && (
                  <Button onClick={() => escrowAction("confirm")} disabled={submitting} className="flex-1 gap-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "✅"} Konfirmasi Travel
                  </Button>
                )}
                {status !== "COMPLETED" && status !== "CANCELLED" && (
                  <Button variant="outline" onClick={() => escrowAction("cancel")} disabled={submitting} className="border-white/20">
                    Batalkan
                  </Button>
                )}
              </div>
              <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" /> Ini simulator escrow MVP — produksi terhubung Midtrans/Xendit + webhook state machine.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
