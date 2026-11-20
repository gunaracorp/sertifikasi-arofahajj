"use client";

// ============================================================
// SERVICES — Redesign 2026: Indeks Layanan Editorial
// Sengaja MENINGGALKAN pola grid-kartu template lama (yang
// identik dengan kompetitor). Kini daftar indeks bernomor
// bergaya editorial: garis rambut tipis, nomor serif emas,
// baris melebar saat hover — seperti katalog majalah premium.
// Data, harga, jangkar SEO (#layanan-<id>) & tombol Pesan
// dipertahankan persis.
// ============================================================

import { useState } from "react";
import { ArrowRight, ChevronDown, Clock, Wallet } from "lucide-react";
import { SERVICES } from "@/lib/landing-data";
import { PACKAGES } from "@/lib/pricing";
import { useLanguage } from "@/lib/i18n/language-provider";

const INITIAL_VISIBLE = 9;

/** Layanan yang punya paket bayar-langsung → dapat tombol "Pesan Sekarang". */
const SELLABLE = new Set(PACKAGES.map((p) => p.id));

export function Services() {
  const { t } = useLanguage();
  const [showAll, setShowAll] = useState(false);
  const visibleServices = showAll ? SERVICES : SERVICES.slice(0, INITIAL_VISIBLE);

  return (
    <section id="layanan" className="py-20 md:py-28 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header editorial — rata kiri, kicker emas, judul serif */}
        <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-6 md:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold">
              Indeks Layanan
            </p>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-medium tracking-tight leading-[1.1]">
              {t("servicesT1")}{" "}
              <em className="text-primary">{t("servicesTHigh")}</em>{" "}
              {t("servicesT2")}
            </h2>
          </div>
          <p className="text-muted-foreground text-base md:text-lg md:pb-1.5">
            {t("servicesSub")}
          </p>
        </div>

        {/* Indeks layanan — baris bernomor dengan garis rambut */}
        <ul className="mt-12 border-t border-border">
          {visibleServices.map((service, i) => {
            const sellable = SELLABLE.has(service.id);
            return (
              <li
                key={service.id}
                id={`layanan-${service.id}`}
                className="group border-b border-border scroll-mt-24 transition-colors hover:bg-secondary/60"
              >
                <div className="grid grid-cols-[2.4rem_1fr_auto] md:grid-cols-[3rem_2.75rem_1fr_auto_auto] items-center gap-x-3 md:gap-x-5 gap-y-2 py-5 px-2 sm:px-4">
                  {/* Nomor indeks — serif emas */}
                  <span className="font-display text-lg md:text-xl text-gold/90 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Ikon — kotak zamrud */}
                  <div className="hidden md:flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/8 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <service.icon className="h-5 w-5" aria-hidden="true" />
                  </div>

                  {/* Judul + deskripsi (tautan detail) */}
                  <div className="min-w-0">
                    <a
                      href={`/layanan/${service.id}`}
                      className="inline-flex flex-wrap items-center gap-2 font-bold tracking-tight text-foreground hover:text-primary"
                    >
                      <span className="text-[15px] md:text-lg">{service.title}</span>
                      {service.popular && (
                        <span className="rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-foreground shadow-sm">
                          Terlaris
                        </span>
                      )}
                    </a>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {service.desc}
                    </p>
                  </div>

                  {/* Harga + durasi — angka tegas rata kanan */}
                  <div className="text-right">
                    <p className="font-display text-xl md:text-2xl text-primary whitespace-nowrap">
                      {service.price}
                    </p>
                    <p className="mt-0.5 flex items-center justify-end gap-1 text-[11px] text-muted-foreground whitespace-nowrap">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {service.duration}
                    </p>
                  </div>

                  {/* Aksi: Pesan (bila bisa dibayar langsung) + detail */}
                  <div className="col-start-3 md:col-start-auto flex md:flex-col items-center justify-end gap-2">
                    {sellable && (
                      <a
                        href={`/checkout?paket=${service.id}`}
                        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110"
                      >
                        <Wallet className="h-3.5 w-3.5" aria-hidden="true" />
                        Pesan
                      </a>
                    )}
                    <a
                      href={`/layanan/${service.id}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-all group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary"
                      aria-label={`Lihat detail ${service.title}`}
                    >
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Toggle tampilkan semua */}
        {!showAll ? (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
              aria-expanded={showAll}
            >
              Tampilkan semua {SERVICES.length} layanan
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="mt-10 text-center">
            <a
              href="/layanan"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg transition-all"
            >
              Buka Katalog Lengkap: Perizinan × Wilayah, Pajak &amp; Kerja LN
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        )}

        {/* Catatan bawah */}
        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            Butuh izin yang tidak tercantum?{" "}
            <a href="/konsultasi" className="font-semibold text-primary hover:underline">
              Konsultasikan gratis
            </a>{" "}
            — kami menangani 60+ jenis perizinan lainnya.
          </p>
        </div>
      </div>
    </section>
  );
}
