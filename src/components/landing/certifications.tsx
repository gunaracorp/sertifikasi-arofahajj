import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BadgeCheck, Award, ShieldCheck, Building2, Plane, UtensilsCrossed,
  ArrowRight, Sparkles, FileCheck2, Beaker, HardHat, PhoneCall,
  Wallet, Landmark, MoonStar, PlaneTakeoff, Compass,
} from "lucide-react";
import { CERT_STATS, CERT_GROUP_LABEL, type CertGroup } from "@/lib/catalog/certifications";
import { CERT_REGION_STATS } from "@/lib/catalog/sertifikasi-provinsi";

// ============================================================
// PRODUK ANDALAN — Redesign 2026 (band zamrud)
// Permintaan owner: Sertifikasi BPW, PPIU & PIHK harus LIVE —
// kini tampil sebagai tiket produk yang bisa dipesan langsung
// (checkout bayar-langsung) + Registrasi IATA dengan harga yang
// sudah disamakan dengan pusatperizinan.com (mulai Rp 13jt,
// 45-90 hari). Di bawahnya katalog sertifikasi lengkap.
// ============================================================

const PRODUCTS = [
  {
    id: "bpw",
    chip: "KBLI 79121",
    title: "Sertifikasi BPW",
    desc: "Biro Perjalanan Wisata: NIB + sertifikat standar — tiket masuk resmi industri pariwisata.",
    icon: Compass,
    price: "Rp 455rb",
    duration: "1-2 hari kerja",
    note: null as string | null,
    cta: { href: "/checkout?paket=bpw", label: "Pesan Sekarang", external: false },
    secondary: { href: "/layanan/pariwisata", label: "Detail layanan" },
  },
  {
    id: "ppi-u",
    chip: "KBLI 79122 · PMHU 2/2026",
    title: "Sertifikasi PPIU",
    desc: "GO UMRAH — paket lengkap siap operasi: PT + NIB + SIPU/SPPU + SIMPONI + rekening kolektif jamaah.",
    icon: MoonStar,
    price: "Rp 45jt",
    duration: "30-45 hari",
    note: "izin inti mulai Rp 15,6jt",
    cta: { href: "/checkout?paket=ppi-u", label: "Pesan GO UMRAH", external: false },
    secondary: { href: "/layanan/paket-pendirian-travel-umrah", label: "Detail layanan" },
  },
  {
    id: "pihk",
    chip: "Kemenag · PMHU 2/2026",
    title: "Sertifikasi PIHK",
    desc: "GO HAJI PLUS — izin PIHK (PPIH) Kemenag: audit modal, SISKOPATUH, uji kelayakan & SK.",
    icon: Landmark,
    price: "Rp 80jt",
    duration: "60-120 hari",
    note: null as string | null,
    cta: { href: "/checkout?paket=pihk", label: "Pesan GO HAJI PLUS", external: false },
    secondary: { href: "/layanan/paket-pendirian-travel-umrah", label: "Detail layanan" },
  },
  {
    id: "iata",
    chip: "IATA · Area Office Singapura",
    title: "Registrasi IATA",
    desc: "Akreditasi agen tiket global: ID IATA resmi, akses BSP/CASS & komisi langsung dari maskapai.",
    icon: PlaneTakeoff,
    price: "Rp 13jt",
    duration: "45-90 hari",
    note: null as string | null,
    cta: {
      href: `https://wa.me/6281222345856?text=${encodeURIComponent("Halo, saya mau konsultasi Registrasi IATA (mulai Rp 13jt, 45-90 hari)")}`,
      label: "Konsultasi Gratis",
      external: true,
    },
    secondary: { href: "/layanan/iata", label: "Detail layanan" },
  },
];

const GROUPS: { id: CertGroup; icon: typeof Award; blurb: string; href: string }[] = [
  { id: "travel-ibadah", icon: Plane, blurb: "PPIU, PIHK (ONH Plus), PPMP, pembimbing bersertifikat — sesuai PMHU 2/2026.", href: "/layanan/paket-pendirian-travel-umrah" },
  { id: "iso-manajemen", icon: Award, blurb: "ISO 9001:2026 edisi terbaru, 27001, 37001:2025, hingga IMS gabungan hemat biaya.", href: "/layanan/iso-9001" },
  { id: "halal", icon: BadgeCheck, blurb: "Halal jasa restoran, hotel & konveksi — sesuai PP 42/2024 via BPJPH.", href: "/layanan/halal-jasa-restoran" },
  { id: "pangan", icon: UtensilsCrossed, blurb: "ISO 22000, HACCP, CPPOB, SPP-IRT — dari UMKM sampai eksportir.", href: "/layanan/iso-22000" },
  { id: "lab-kesehatan", icon: Beaker, blurb: "ISO 17025, 15189, 13485, 17020/17024/17065 — lab & lembaga sertifikasi.", href: "/layanan/iso-17025" },
  { id: "badan-usaha", icon: HardHat, blurb: "SBU LPJK, SKTTK, BNSP, SLO — tiket masuk tender & kepatuhan fasilitas.", href: "/layanan/sbu-lpjk" },
];

export function CertificationsSection() {
  return (
    <section id="produk" aria-labelledby="sertifikasi-heading" className="band-sun pattern-grid relative overflow-hidden scroll-mt-20">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Heading */}
        <div className="max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold">
            Produk Andalan — Travel Ibadah &amp; Aviasi
          </p>
          <h2 id="sertifikasi-heading" className="mt-3 font-display text-3xl md:text-5xl font-medium tracking-tight leading-[1.1] text-foreground text-balance">
            Tiga kunci legalitas bisnis haji &amp; umrah — <em className="text-gold">plus tiket global IATA.</em>
          </h2>
          <p className="mt-4 text-foreground/70 leading-relaxed md:text-lg">
            Empat produk yang paling dicari travel di Indonesia — kini bisa dipesan langsung, dengan garansi
            100% uang kembali dan dokumentasi transparan per tahap. Semua dibangun di atas regulasi terkini
            (PMHU 2/2026, OSS-RBA, KBLI 79121 &amp; 79122).
          </p>
        </div>

        {/* Tiket produk andalan */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p) => {
            const Icon = p.icon;
            const cta =
              p.cta.external ? (
                <a
                  key="cta"
                  href={p.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90"
                >
                  <PhoneCall className="h-4 w-4" aria-hidden />
                  {p.cta.label}
                </a>
              ) : (
                <a
                  key="cta"
                  href={p.cta.href}
                  className="btn-shine inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90"
                >
                  <Wallet className="h-4 w-4" aria-hidden />
                  {p.cta.label}
                </a>
              );
            return (
              <article
                key={p.id}
                className="glass-bright card-lift flex flex-col rounded-2xl p-6 transition-all hover:border-gold/50"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-gold/35 bg-gold/10 text-gold">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <span className="rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground/55">
                    {p.chip}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-2xl font-medium text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/65">{p.desc}</p>

                <div className="mt-4 pt-4 border-t border-primary/10">
                  <p className="font-display text-3xl text-gold">{p.price}</p>
                  <p className="mt-1 text-xs text-foreground/55">
                    {p.duration}
                    {p.note ? <span className="text-foreground/45"> · {p.note}</span> : null}
                  </p>
                </div>

                <div className="mt-5 space-y-2.5">
                  {cta}
                  <a
                    href={p.secondary.href}
                    className="flex w-full items-center justify-center gap-1.5 text-sm font-semibold text-foreground/70 hover:text-primary"
                  >
                    {p.secondary.label}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* Katalog sertifikasi lengkap */}
        <div className="mt-14 flex items-center gap-4">
          <h3 className="font-display text-xl md:text-2xl text-foreground shrink-0">
            Katalog {CERT_STATS.total} sertifikasi
          </h3>
          <div aria-hidden="true" className="h-px flex-1 bg-primary/15" />
          <Link href="/layanan/kategori/sertifikasi" className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            Lihat semua <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {GROUPS.map((g) => {
            const Icon = g.icon;
            return (
              <Link
                key={g.id}
                href={g.id === "travel-ibadah" ? "/layanan/kategori/sertifikasi" : g.href}
                className="group flex items-center gap-3 rounded-xl border border-primary/15 bg-white/70 px-4 py-3.5 transition-all hover:border-gold/50 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
              >
                <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                <div className="min-w-0">
                  <p className="font-bold text-sm text-foreground leading-tight">{CERT_GROUP_LABEL[g.id]}</p>
                  <p className="mt-0.5 truncate text-xs text-foreground/55">{g.blurb}</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto shrink-0 text-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
              </Link>
            );
          })}
        </div>

        {/* Catatan regulasi terbaru + CTA */}
        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-gold/40 bg-gold/10 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
            <p className="text-sm leading-relaxed text-foreground/85">
              <span className="font-bold text-gold">Baru 2026:</span> ISO 9001:2026 resmi terbit (16 Sep 2026) &amp; standar travel
              haji-umrah diperbarui via PMHU 2/2026.{" "}
              <span className="text-foreground/60">Jangan sampai dokumen Anda dibangun di atas regulasi basi — kami pakai yang terkini.</span>
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <a href={`https://wa.me/6281222345856?text=${encodeURIComponent("Halo, saya mau konsultasi sertifikasi (BPW/PPIU/PIHK/IATA/ISO/halal)")}`} target="_blank" rel="noopener noreferrer">
                <PhoneCall className="h-4 w-4" aria-hidden /> Konsultasi Gratis
              </a>
            </Button>
            <Button asChild variant="outline" className="border-primary/25 text-foreground hover:bg-primary/5 hover:text-foreground">
              <Link href="/layanan/sertifikasi/dki-jakarta">
                <Building2 className="h-4 w-4" aria-hidden /> Sertifikasi × {CERT_REGION_STATS.provinces} Provinsi
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-primary/25 text-foreground hover:bg-primary/5 hover:text-foreground">
              <Link href="/layanan/kategori/sertifikasi">
                <ShieldCheck className="h-4 w-4" aria-hidden /> Katalog {CERT_STATS.total} Sertifikasi
              </Link>
            </Button>
          </div>
        </div>

        <p className="mt-4 hidden items-center gap-1.5 text-xs text-foreground/50 sm:flex">
          <Building2 className="h-3.5 w-3.5" aria-hidden /> Jasa konsultan — biaya resmi lembaga/instansi terpisah &amp; transparan di penawaran.
        </p>
      </div>
    </section>
  );
}
