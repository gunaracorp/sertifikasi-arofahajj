"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/language-provider";

interface Stats {
  clients: number;
  permitsProcessed: number;
  provinces: number;
  regenciesCities: number;
  satisfaction: number;
  avgProcessingHours: number;
}

const FALLBACK: Stats = {
  clients: 1247,
  permitsProcessed: 3890,
  provinces: 38,
  regenciesCities: 514,
  satisfaction: 98,
  avgProcessingHours: 24,
};

/** Gabungkan respons API di atas FALLBACK + validasi angka.
 *  Menjamin TIDAK PERNAH ada field undefined yang ter-render. */
function sanitizeStats(input: unknown): Stats {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const num = (v: unknown, def: number): number =>
    typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : def;
  return {
    clients: num(raw.clients, FALLBACK.clients),
    permitsProcessed: num(raw.permitsProcessed, FALLBACK.permitsProcessed),
    provinces: num(raw.provinces, FALLBACK.provinces),
    regenciesCities: num(raw.regenciesCities, FALLBACK.regenciesCities),
    satisfaction: num(raw.satisfaction, FALLBACK.satisfaction),
    avgProcessingHours: num(raw.avgProcessingHours, FALLBACK.avgProcessingHours),
  };
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".0", "")}rb+`;
  return `${n}`;
}

// ============================================================
// STATSBAR — Redesign 2026: strip editorial bergaya "regal"
// Angka serif besar + label kecil, dipisah garis rambut vertikal
// emas — tanpa ikon-ikon kartu template lama.
// ============================================================

export function StatsBar() {
  const [stats, setStats] = useState<Stats>(FALLBACK);
  const { t } = useLanguage();

  useEffect(() => {
    let alive = true;
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((json) => {
        if (alive && json?.success) setStats(sanitizeStats(json.data));
      })
      .catch(() => {
        if (alive) setStats(FALLBACK);
      });
    return () => {
      alive = false;
    };
  }, []);

  const s = stats;

  const items = [
    { label: t("statClients"), value: formatNumber(s.clients) },
    { label: t("statPermits"), value: formatNumber(s.permitsProcessed) },
    { label: t("statProvinces"), value: `${s.provinces}` },
    { label: t("statCities"), value: `${s.regenciesCities}` },
    { label: t("statSatisfaction"), value: `${s.satisfaction}%` },
    { label: t("statAvgTime"), value: `${s.avgProcessingHours} ${t("statHours")}` },
  ];

  return (
    <section
      aria-label="Statistik kepercayaan"
      className="border-b border-border bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((item, i) => (
            <div
              key={i}
              /* Entrance CSS murni (fade-up + delay berantai) — tanpa JS,
                 hormat prefers-reduced-motion via media query global */
              className={`animate-fade-up reveal-${i + 1} relative flex flex-col items-center gap-1 py-7 px-3 ${
                i > 0 ? "before:absolute before:left-0 before:top-1/2 before:h-10 before:-translate-y-1/2 before:w-px before:bg-gold/25" : ""
              }`}
            >
              <span className="font-display text-3xl md:text-[2.1rem] font-medium tracking-tight text-primary tabular-nums leading-none">
                {item.value}
              </span>
              <span className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold text-center">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
