"use client";

/**
 * GRAND VIEW — Dokumentasi hidup Arofahajj Universe
 * Arsitektur makro, monorepo, tech stack, data, keamanan, roadmap 99 langkah.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, SectionHeading, SpotlightCard, GradientText, LiveDot } from "./fx";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Circle, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============ MONOREPO TREE ============ */
const MONOREPO = `arofahajj-universe/                  # 🪐 Monorepo utama (Turborepo + pnpm)
├── .github/workflows/               # CI/CD: ci.yaml · cd-prod.yaml · security.yaml
├── docs/                            # adr/ · handbooks/ · runbooks/ · api/ (OpenAPI)
├── packages/                        # Paket bersama lintas app (hemat duplikasi)
│   ├── ui/                          # Design system React+Tailwind+shadcn (Wizard, Stepper, BadgeTrust)
│   ├── config/                      # eslint/ · tsconfigs/ · jest/ — aturan seragam
│   ├── lib-api/                     # SDK klien API (authClient, certClient, ...)
│   ├── lib-core/                    # Logger, error, feature-flag
│   ├── lib-schema/                  # Skema Zod + shared types antar layanan
│   ├── lib-i18n/                    # Terjemahan ID/EN/AR
│   └── lib-security/                # Crypto utils, masker PII
├── apps/                            # Aplikasi user-facing (Next.js 15)
│   ├── web-arofahajj/               # arofahajj.com — katalog & booking
│   │   └── app/(public) | (account) | api/ | sitemap.ts
│   ├── web-sertifikasi/             # sertifikasi.arofahajj.com — wizard + verifikasi/[kodeQR]
│   ├── web-muhdin/                  # MUHDIN.ID — membership, directory, events
│   ├── web-marketplace/             # arofahajj.id — products, cart/checkout, orders
│   └── admin-console/               # Back-office terpadu (ops-haji, ops-sertifikasi, reports)
├── services/                        # Microservices backend (NestJS, DDD modular)
│   ├── auth/                        # OIDC/SSO, RBAC, KYC · prisma/ · Dockerfile
│   ├── payments/                    # Gateway (Midtrans/Xendit/SAR), escrow, split, webhooks
│   ├── notifications/               # WA HSM / email MJML / push + scheduler retry
│   ├── docs/                        # PII vault, AV scan, watermark, OCR pipeline
│   ├── hajj/                        # catalog, booking, operations (visa/tasrih/rooming), nusuk-integration
│   ├── certification/               # rules engine KBLI, applications, audits, certificates, registry on-chain
│   ├── membership/                  # members, dues, badges
│   ├── marketplace/                 # products, orders, returns
│   └── gateway/kong/                # Declarative routes, rate-limit, auth
├── platform/                        # k8s (helm) · terraform · monitoring · logging · security (OPA/cosign)
├── data/                            # prisma/ (DDL) · neo4j/ (graf syarat) · seeds/ (KBLI, template)
├── tests/                           # Playwright e2e · Pact contract
├── turbo.json · package.json · pnpm-workspace.yaml`;

/* ============ 99-STEP ROADMAP ============ */
interface RoadmapStep { n: number; t: string; d: string; phase: string }
const ROADMAP: RoadmapStep[] = [
  // FASE 0 — Fondasi (1-8)
  { n: 1, t: "Legal & entitas", d: "Badan hukum PT, NIB, domain (arofahajj.com, .id, MUHDIN.ID) & trademark", phase: "0" },
  { n: 2, t: "Monorepo bootstrap", d: "Turborepo + pnpm workspace + CI lint/test/typecheck", phase: "0" },
  { n: 3, t: "Design system v1", d: "packages/ui: token warna, Button, Wizard, Stepper, BadgeTrust", phase: "0" },
  { n: 4, t: "JSON-CMS engine", d: "ContentSection API + admin panel (selesai di MVP ini!)", phase: "0" },
  { n: 5, t: "Auth service", d: "NestJS + OIDC, SSO tunggal 4 portal, RBAC dasar", phase: "0" },
  { n: 6, t: "PostgreSQL + Redis", d: "Provisioning, migrasi Prisma per service, cache layer", phase: "0" },
  { n: 7, t: "API Gateway Kong", d: "Routing, rate-limit, auth plugin, OpenAPI v3 dev portal", phase: "0" },
  { n: 8, t: "Observability dasar", d: "OpenTelemetry + Grafana + Loki; /status uptime page", phase: "0" },
  // FASE 1 — MVP Sertifikasi (9-30)
  { n: 9, t: "Katalog 160+ layanan", d: "Seed 18 kategori × 50+ subkategori dari katalog PDF", phase: "1" },
  { n: 10, t: "Rules engine KBLI v1", d: "Mapping jenis usaha → syarat (juga siap di MVP ini)", phase: "1" },
  { n: 11, t: "Wizard pengajuan", d: "Flow multi-step + saved draft + kode tracking WZ", phase: "1" },
  { n: 12, t: "Portal pemohon", d: "Dashboard pengajuan + upload dokumen ke vault", phase: "1" },
  { n: 13, t: "Payment gateway IDR", d: "Midtrans Snap + webhook state machine + VA/QRIS", phase: "1" },
  { n: 14, t: "Notification service", d: "Email transactional + WhatsApp template (HSM)", phase: "1" },
  { n: 15, t: "SLA engine v1", d: "Timer per tahap, alert 80% threshold, dead-letter queue", phase: "1" },
  { n: 16, t: "Admin back-office v1", d: "Antrian pengajuan, assign validator, keputusan manual", phase: "1" },
  { n: 17, t: "e-Sertifikat PDF", d: "Generate PDF + QR + nomor sertifikat terkontrol", phase: "1" },
  { n: 18, t: "Public verify QR", d: "Halaman verifikasi publik ASLI/TIDAK SAH (live di MVP!)", phase: "1" },
  { n: 19, t: "Audit trail immutable", d: "Append-only log + retention policy UU PDP", phase: "1" },
  { n: 20, t: "Launch soft sertifikasi", d: "10 klien perintis, feedback loop mingguan", phase: "1" },
  { n: 21, t: "Programmatic SEO", d: "SSG halaman layanan per KBLI + schema.org Service/Offer", phase: "1" },
  { n: 22, t: "AI Document Checker v1", d: "OCR + checklist kelengkapan otomatis (GPT-4 vision)", phase: "1" },
  { n: 23, t: "Compliance Calendar", d: "Reminder perpanjangan 60 hari + export iCal", phase: "1" },
  { n: 24, t: "Neo4j dependency graph", d: "Graf syarat izin & jalur upgrade PPIU→PIHK", phase: "1" },
  { n: 25, t: "Auto-assign auditor", d: "Skill-based routing: produk × wilayah × beban", phase: "1" },
  { n: 26, t: "Audit modul desk/remote", d: "Jadwal, formulir temuan, foto, rekomendasi", phase: "1" },
  { n: 27, t: "Multi-tenant konsultan", d: "Portal partner konsultan resmi + revenue share", phase: "1" },
  { n: 28, t: "Escrow pembayaran layanan", d: "Dana escrow per milestone layanan perizinan", phase: "1" },
  { n: 29, t: "Dashboard eksekutif", d: "Pivot kategori × wilayah × produk, export CSV/XLSX", phase: "1" },
  { n: 30, t: "Bug bounty & pentest #1", d: "Scoped program + perbaikan temuan", phase: "1" },
  // FASE 2 — Travel portal (31-55)
  { n: 31, t: "Katalog paket umrah", d: "Paket, kuota, harga dinamis, filter cerdas (live di MVP!)", phase: "2" },
  { n: 32, t: "Booking engine", d: "Keranjang, multi-pax, kode booking BK (live di MVP!)", phase: "2" },
  { n: 33, t: "Escrow & split payment", d: "Split otomatis visa/tiket/hotel/transport per milestone", phase: "2" },
  { n: 34, t: "Cicilan syariah", d: "Angsuran 3-6x via mitra paylater syariah", phase: "2" },
  { n: 35, t: "Travel directory", d: "Profil travel + badge MEHUDIN + skor reputasi", phase: "2" },
  { n: 36, t: "Pizza tracker status", d: "Pipeline visa/tasrih/manifest real-time (WebSocket)", phase: "2" },
  { n: 37, t: "Rooming & manifest", d: "Rooming list, seating, bus grouping", phase: "2" },
  { n: 38, t: "FamilyView opt-in", d: "Keluarga pantau jamaah dengan izin eksplisit", phase: "2" },
  { n: 39, t: "Broadcast WA/email", d: "Blast info keberangkatan per grup tersegmentasi", phase: "2" },
  { n: 40, t: "E-Visa Assistant Bot", d: "Isi form Nusuk otomatis ID-EN-AR + face match guide", phase: "2" },
  { n: 41, t: "Nusuk wrapper (fase 1)", d: "Endpoint /nusuk/* manual + mitra syarikah, feature-flag", phase: "2" },
  { n: 42, t: "Multi-currency IDR/SAR", d: "Harga dual currency + Tap/HyperPay untuk SAR", phase: "2" },
  { n: 43, t: "Mobile app jamaah", d: "React Native (Expo): e-ticket, itinerary, SOS", phase: "2" },
  { n: 44, t: "Operator panel ops", d: "Issuance manual, rekonsiliasi, incident runbook", phase: "2" },
  { n: 45, t: "Laporan regulator", d: "Auto-report Kemenag (SISKOPATUH/SISKOHAT format)", phase: "2" },
  { n: 46, t: "Review & rating jamaah", d: "Ulasan verified booking → skor reputasi travel", phase: "2" },
  { n: 47, t: "AI rekomendasi paket", d: "Match budget/kebutuhan → paket + travel terbaik", phase: "2" },
  { n: 48, t: "Kalkulator estimasi AI", d: "Prediksi keterisian seat & harga dinamis", phase: "2" },
  { n: 49, t: "Referral & loyalty", d: "Poin jamaah, referral travel, tier reward", phase: "2" },
  { n: 50, t: "Panic button krisis", d: "Broadcast terpandu + dashboard krisis (delay visa massal)", phase: "2" },
  { n: 51, t: "i18n penuh ID/EN/AR", d: "RTL support Arab, terjemahan terpusat packages/lib-i18n", phase: "2" },
  { n: 52, t: "Load test peak season", d: "Simulasi 10x trafik Ramadan/Zulhijjah", phase: "2" },
  { n: 53, t: "Blue/green deploy", d: "Cutover aman untuk integrasi Nusuk fase 2", phase: "2" },
  { n: 54, t: "SLA kompensasi CaaS", d: "Certification-as-a-Service dengan auto-refund breach", phase: "2" },
  { n: 55, t: "Launch umrah portal", d: "GA arofahajj.com booking + 20 travel mitra", phase: "2" },
  // FASE 3 — MUHDIN & on-chain (56-78)
  { n: 56, t: "MUHDIN membership portal", d: "Registrasi, due diligence 2 lapis, iuran otomatis (live di MVP!)", phase: "3" },
  { n: 57, t: "SSO lintas portal", d: "OIDC tunggal: 1 akun untuk semua properti", phase: "3" },
  { n: 58, t: "Badge MEHUDIN-Accredited", d: "Badge tampil di seluruh ekosistem + API publik", phase: "3" },
  { n: 59, t: "Direktori publik QR", d: "Halaman anggota + QR scan cek status (live di MVP!)", phase: "3" },
  { n: 60, t: "E-voting & rapat anggota", d: "Voting aman berbasis SSO + notulen terstruktur", phase: "3" },
  { n: 61, t: "MoU & e-sign", d: "Integrasi Privy/DocuSign untuk dokumen asosiasi", phase: "3" },
  { n: 62, t: "Event & webinar", d: "Ticketing event + rekaman + sertifikat partisipasi", phase: "3" },
  { n: 63, t: "Job board tour leader", d: "Matching guide bersertifikat ↔ travel anggota", phase: "3" },
  { n: 64, t: "On-chain anchor v1", d: "Hash sertifikat → Polygon + IPFS, one-click publish", phase: "3" },
  { n: 65, t: "Verifiable Credentials", d: "Standar W3C VC untuk sertifikat digital portabel", phase: "3" },
  { n: 66, t: "VC registry API", d: "Endpoint /vc/* untuk partner verifikasi pihak ketiga", phase: "3" },
  { n: 67, t: "Skor reputasi terpadu", d: "Gabungan SLA + keluhan + audit + badge → label trust", phase: "3" },
  { n: 68, t: "Marketplace halal", d: "Katalog produk, keranjang, checkout (live di MVP!)", phase: "3" },
  { n: 69, t: "SLA fulfillment engine", d: "SLA per produk, pickup bandara/gerai", phase: "3" },
  { n: 70, t: "Vendor governance", d: "Syarat listing, rating minimum, sanksi otomatis", phase: "3" },
  { n: 71, t: "Bundling pascapulang", d: "Rekomendasi otomatis pasca-trip (souvenir, kurban)", phase: "3" },
  { n: 72, t: "Doc intelligence v2", d: "Ekstraksi paspor/KTP/NPWP otomatis + validasi", phase: "3" },
  { n: 73, t: "AI risk assessment", d: "Prediksi risiko compliance travel baru + review cycle", phase: "3" },
  { n: 74, t: "Regulatory push alerts", d: "Monitor perubahan regulasi → notify klien terdampak", phase: "3" },
  { n: 75, t: "Temporal workflows", d: "Deterministik SLA/assign/publish orchestration", phase: "3" },
  { n: 76, t: "SOC & DLP", d: "Deteksi kebocoran (regex paspor), alert SIEM, masking log", phase: "3" },
  { n: 77, t: "PDPL Saudi residency", d: "Bucket KSA terpisah untuk data jamaah Saudi", phase: "3" },
  { n: 78, t: "ISO 27001 internal", d: "Sertifikasi keamanan platform sendiri", phase: "3" },
  // FASE 4 — Skala regional (79-99)
  { n: 79, t: "Nusuk API switch fase 2", d: "Integrasi penuh via API gateway + feature flag cutover", phase: "4" },
  { n: 80, t: "B2B API compliance", d: "Jual API cek izin/travel ke bank, asuransi, marketplace", phase: "4" },
  { n: 81, t: "Kemenag dashboard", d: "B2G: rating travel real-time untuk regulator", phase: "4" },
  { n: 82, t: "Masjid B2B SaaS", d: "White-label database jamaah masjid + fundraising", phase: "4" },
  { n: 83, t: "Smart wallet jamaah", d: "Top-up IDR → SAR di Makkah, smart contract split", phase: "4" },
  { n: 84, t: "Umrah scholarship", d: "Crowdfunding umrah + blockchain receipt transparency", phase: "4" },
  { n: 85, t: "NFT sertifikat", d: "Sertifikat = asset digital tradeable + rarity tier", phase: "4" },
  { n: 86, t: "IoT wearable band", d: "NFC+GPS jamaah tracking + SOS + proof-of-presence", phase: "4" },
  { n: 87, t: "VR/AR manasik", d: "Simulasi ibadah pre-departure di masjid mitra", phase: "4" },
  { n: 88, t: "Concierge premium", d: "VIP hajj concierge 24/7 + corporate umrah", phase: "4" },
  { n: 89, t: "Content creator academy", d: "Training marketing travel + revenue sharing konten", phase: "4" },
  { n: 90, t: "Carbon offset program", d: "Kalkulasi jejak karbon perjalanan + tanam pohon", phase: "4" },
  { n: 91, t: "Diaspora platform", d: "Family umrah coordinator + remittance integration", phase: "4" },
  { n: 92, t: "Research institute", d: "Annual State of Umrah report + policy advocacy", phase: "4" },
  { n: 93, t: "Ekspansi Malaysia", d: "Partner lokal + harmonisasi regulasi JAKIM", phase: "4" },
  { n: 94, t: "Ekspansi Brunei & ASEAN", d: "Multi-country module, compliance lintas negara", phase: "4" },
  { n: 95, t: "Turki & Gulf corridor", d: "Entitas regional, gateway SAR penuh", phase: "4" },
  { n: 96, t: "Open platform", d: "Developer portal publik, marketplace app ecosystem", phase: "4" },
  { n: 97, t: "IPO / Series B readiness", d: "Audit finansial, governance, data room", phase: "4" },
  { n: 98, t: "AI Copilot generasi 2", d: "Agentic AI end-to-end: dari pertanyaan → izin terbit", phase: "4" },
  { n: 99, t: "Universe 2.0", d: "Metaverse hajj experience + global halal infrastructure", phase: "4" },
];

const PHASES = [
  { id: "0", label: "Fase 0 · Fondasi", steps: "1–8", color: "bg-slate-400" },
  { id: "1", label: "Fase 1 · MVP Sertifikasi", steps: "9–30", color: "bg-emerald-400" },
  { id: "2", label: "Fase 2 · Travel Portal", steps: "31–55", color: "bg-teal-400" },
  { id: "3", label: "Fase 3 · MUHDIN & On-Chain", steps: "56–78", color: "bg-amber-400" },
  { id: "4", label: "Fase 4 · Skala Regional", steps: "79–99", color: "bg-lime-400" },
];

/** Langkah yang SUDAH diwujudkan di MVP ini */
const MVP_DONE = new Set([2, 3, 4, 9, 10, 11, 18, 31, 32, 56, 59, 68]);

export function GrandView() {
  const [phaseFilter, setPhaseFilter] = useState("ALL");

  const steps = ROADMAP.filter((s) => phaseFilter === "ALL" || s.phase === phaseFilter);
  const doneCount = ROADMAP.filter((s) => MVP_DONE.has(s.n)).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <SectionHeading
        kicker="🧭 Grand Design — Hulu ke Hilir"
        title={<>Arofahajj <GradientText>Universe Blueprint</GradientText></>}
        sub="Satu “Arofahajj Universe”: sekali bangun, semua pakai. Microservices-first, API-first, headless & composable."
      />

      <Tabs defaultValue="arsitektur" className="w-full">
        <TabsList className="aro-glass mb-6 flex h-auto flex-wrap gap-1 rounded-2xl p-2">
          <TabsTrigger value="arsitektur" className="rounded-xl data-[state=active]:bg-emerald-500/20">🏗️ Arsitektur</TabsTrigger>
          <TabsTrigger value="monorepo" className="rounded-xl data-[state=active]:bg-emerald-500/20">📁 Monorepo</TabsTrigger>
          <TabsTrigger value="tech" className="rounded-xl data-[state=active]:bg-emerald-500/20">⚙️ Tech Stack</TabsTrigger>
          <TabsTrigger value="data" className="rounded-xl data-[state=active]:bg-emerald-500/20">🗄️ Data & API</TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl data-[state=active]:bg-emerald-500/20">🛡️ Keamanan</TabsTrigger>
          <TabsTrigger value="roadmap" className="rounded-xl data-[state=active]:bg-emerald-500/20">🗺️ Roadmap 99</TabsTrigger>
        </TabsList>

        {/* ===== ARSITEKTUR ===== */}
        <TabsContent value="arsitektur" className="grid gap-5">
          <Reveal>
            <SpotlightCard className="p-6 md:p-8">
              <h3 className="mb-4 text-lg font-bold">Arsitektur Makro — “Arofahajj Universe”</h3>
              <div className="grid gap-4 md:grid-cols-4">
                {[
                  { icon: "🌐", title: "Channels", items: ["Web ×4 portal", "Mobile (Expo)", "Partner API", "Admin Console"] },
                  { icon: "🚪", title: "Edge & Gateway", items: ["CDN + WAF", "Kong API Gateway", "Rate limit & auth", "Feature flags"] },
                  { icon: "⚙️", title: "Core Services", items: ["service-user (OIDC/RBAC)", "service-payment (escrow)", "service-notification", "service-docs (PII vault)", "service-catalog", "service-compliance"] },
                  { icon: "🕋", title: "Domain Services", items: ["service-haji", "service-certification", "service-membership", "service-marketplace", "Event bus antar domain"] },
                ].map((c, i) => (
                  <div key={c.title} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xl">{c.icon}</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">{c.title}</span>
                    </div>
                    <ul className="space-y-1">
                      {c.items.map((it) => (
                        <li key={it} className="text-[11px] text-muted-foreground">· {it}</li>
                      ))}
                    </ul>
                    {i < 3 && <div className="mt-2 text-center text-white/25">↓</div>}
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-emerald-500/10 p-4 text-[11px] leading-relaxed text-muted-foreground ring-1 ring-emerald-400/25">
                <b className="text-emerald-300">Prinsip:</b> API-first · headless & composable · SSO tunggal · observability standar (OpenTelemetry) · blue/green + feature flag untuk cutover Nusuk. Layanan generik dipakai lintas situs; layanan domain berdiri sendiri dan saling bicara lewat event bus.
              </div>
            </SpotlightCard>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2">
            <Reveal>
              <SpotlightCard className="h-full p-6">
                <h3 className="mb-3 text-base font-bold">🤖 Superpowers</h3>
                <ul className="grid gap-2 text-xs text-muted-foreground">
                  <li>🧠 <b className="text-foreground">AI/ML:</b> rekomendasi paket, document intelligence, risk scoring, dynamic pricing</li>
                  <li>🔗 <b className="text-foreground">Blockchain:</b> Verifiable Credentials (W3C) + Polygon/IPFS anchoring, QR public verify</li>
                  <li>⏱ <b className="text-foreground">Temporal:</b> workflow deterministik untuk SLA/assign/publish</li>
                  <li>📡 <b className="text-foreground">Real-time:</b> WebSocket Socket.IO untuk status, tracking, broadcast krisis</li>
                </ul>
              </SpotlightCard>
            </Reveal>
            <Reveal delay={0.1}>
              <SpotlightCard className="h-full p-6">
                <h3 className="mb-3 text-base font-bold">🔌 Integrasi Eksternal</h3>
                <ul className="grid gap-2 text-xs text-muted-foreground">
                  <li>🕋 <b className="text-foreground">Nusuk/Masar:</b> fase 1 manual + mitra syarikah → fase 2 switch via gateway</li>
                  <li>💳 <b className="text-foreground">Payment:</b> Midtrans/Xendit (IDR) + Tap/HyperPay (SAR)</li>
                  <li>✍️ <b className="text-foreground">E-sign:</b> Privy/DocuSign</li>
                  <li>📱 <b className="text-foreground">WhatsApp HSM:</b> multilingual template + retry/backoff</li>
                </ul>
              </SpotlightCard>
            </Reveal>
          </div>
        </TabsContent>

        {/* ===== MONOREPO ===== */}
        <TabsContent value="monorepo">
          <Reveal>
            <SpotlightCard className="p-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-bold">Struktur Monorepo Final (Turborepo + pnpm)</h3>
                <Badge variant="outline" className="border-emerald-400/30 text-[10px] text-emerald-300">production-grade</Badge>
              </div>
              <ScrollArea className="h-[520px] rounded-xl border border-white/10 bg-black/40 p-4">
                <pre className="whitespace-pre font-mono text-[11px] leading-relaxed text-emerald-100/85">{MONOREPO}</pre>
              </ScrollArea>
            </SpotlightCard>
          </Reveal>
        </TabsContent>

        {/* ===== TECH ===== */}
        <TabsContent value="tech" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: "⚛️", title: "Frontend", items: ["Next.js 15+ (TypeScript, App Router)", "Tailwind CSS 4 + shadcn/ui", "Framer Motion (animasi)", "i18n ID/EN/AR + RTL", "SSR/SSG untuk SEO"] },
            { icon: "🖥️", title: "Backend", items: ["Node.js + NestJS (DDD modular)", "Worker: on-chain publishing, SLA engine", "WebSocket Socket.IO real-time", "OpenAPI v3 + mock server"] },
            { icon: "🗄️", title: "Data (Polyglot)", items: ["PostgreSQL — transaksi", "Neo4j — graf syarat & dependensi", "Redis — cache/queue/session", "MongoDB (opsional) — form dinamis"] },
            { icon: "☁️", title: "Infra", items: ["GCP + GKE (Kubernetes)", "Kong API Gateway", "Secret Manager + CDN/WAF", "Terraform IaC + Helm"] },
            { icon: "💳", title: "Payment & Doc", items: ["Midtrans/Xendit (IDR)", "Tap/HyperPay (SAR)", "Escrow & split ledger", "S3/GCS + AV scan + watermark"] },
            { icon: "🔗", title: "Blockchain", items: ["Polygon testnet → mainnet", "IPFS metadata", "W3C Verifiable Credentials", "Public QR verify API"] },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <SpotlightCard className="h-full p-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-2xl">{c.icon}</span>
                  <h3 className="text-sm font-bold">{c.title}</h3>
                </div>
                <ul className="space-y-1.5">
                  {c.items.map((it) => (
                    <li key={it} className="flex items-start gap-1.5 text-[11px] text-muted-foreground"><CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" /> {it}</li>
                  ))}
                </ul>
              </SpotlightCard>
            </Reveal>
          ))}
        </TabsContent>

        {/* ===== DATA & API ===== */}
        <TabsContent value="data" className="grid gap-5 lg:grid-cols-2">
          <Reveal>
            <SpotlightCard className="h-full p-6">
              <h3 className="mb-3 text-base font-bold">Entitas Kunci</h3>
              <div className="flex flex-wrap gap-2">
                {["User", "Organization", "Membership", "Package", "Booking", "Payment", "Certification", "Certificate/VC", "Product", "Order", "AuditTrail", "ContentSection(CMS)"].map((e) => (
                  <Badge key={e} variant="outline" className="border-white/15 text-[11px]">{e}</Badge>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-black/30 p-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
                <p className="text-emerald-300">{"// API surface (OpenAPI v3)"}</p>
                <p>/auth/* · /payments/* · /hajj/*</p>
                <p>/cert/* · /membership/* · /market/*</p>
                <p>/vc/* · /verify/:code · /admin/cms</p>
                <p className="mt-2 text-emerald-300">{"// MVP ini sudah live:"}</p>
                <p>GET /api/content · POST /api/wizard</p>
                <p>POST /api/bookings (+PATCH escrow)</p>
                <p>GET /api/verify · POST /api/leads · GET /api/stats</p>
              </div>
            </SpotlightCard>
          </Reveal>
          <Reveal delay={0.1}>
            <SpotlightCard className="h-full p-6">
              <h3 className="mb-3 text-base font-bold">Flow Hulu → Hilir (satu journey)</h3>
              <div className="grid gap-2">
                {[
                  { s: "1", t: "Onboarding & KYC", d: "Akun/organisasi, unggah PII ke vault terenkripsi, auto-checks + review manual" },
                  { s: "2", t: "Discovery", d: "Katalog paket atau wizard izin berbasis KBLI + rules engine" },
                  { s: "3", t: "Checkout & Pembayaran", d: "Escrow/split, IDR/SAR, cicilan syariah" },
                  { s: "4", t: "Operasional", d: "Visa/tasrih, manifest, rooming/tracking, audit trail immutable" },
                  { s: "5", t: "Pascapulang & Retensi", d: "NPS, badge reputasi, upsell marketplace, renewal reminder" },
                ].map((f) => (
                  <div key={f.s} className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300">{f.s}</span>
                    <div>
                      <p className="text-xs font-semibold">{f.t}</p>
                      <p className="text-[11px] text-muted-foreground">{f.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </Reveal>
        </TabsContent>

        {/* ===== SECURITY ===== */}
        <TabsContent value="security" className="grid gap-5 md:grid-cols-2">
          {[
            { icon: "🔐", title: "Perlindungan PII", items: ["TLS 1.3 + KMS at-rest", "Field-level encryption (paspor)", "Masking di log", "Residency ID vs KSA (PDP + PDPL)"] },
            { icon: "🧑‍⚖️", title: "RBAC & Separation of Duties", items: ["Peran granular: pemohon, validator, auditor, operator, admin", "Approval matrix", "MFA wajib admin", "Least privilege + Zero Trust"] },
            { icon: "🚨", title: "DLP & SIEM", items: ["Deteksi kebocoran (regex paspor)", "Alert ke SOC", "Pentest berkala + bug bounty", "Image signing (cosign) + OPA/Kyverno"] },
            { icon: "📜", title: "Audit & Continuity", items: ["Audit trail immutable append-only", "Retention & right-to-erasure", "RTO ≤ 4 jam · RPO ≤ 15 menit", "Crisis team ≤ 30 menit + drill kuartalan"] },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <SpotlightCard className="h-full p-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-2xl">{c.icon}</span>
                  <h3 className="text-sm font-bold">{c.title}</h3>
                </div>
                <ul className="space-y-1.5">
                  {c.items.map((it) => (
                    <li key={it} className="flex items-start gap-1.5 text-[11px] text-muted-foreground"><CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" /> {it}</li>
                  ))}
                </ul>
              </SpotlightCard>
            </Reveal>
          ))}
        </TabsContent>

        {/* ===== ROADMAP 99 ===== */}
        <TabsContent value="roadmap">
          <Reveal className="mb-5">
            <SpotlightCard className="p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold"><LiveDot /> Roadmap 99 Langkah — dari Nol sampai Global</h3>
                  <p className="text-xs text-muted-foreground">Nusuk.sa coordination ditempatkan di Fase 2+ (langkah 41, 79) — MVP dulu, integrasi kemudian. ✅ = sudah diwujudkan di MVP ini.</p>
                </div>
                <Badge className="bg-emerald-500/20 text-sm text-emerald-200 ring-1 ring-emerald-400/40">{doneCount}/99 done</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setPhaseFilter("ALL")} className={cn("rounded-xl px-3.5 py-2 text-[11px] font-semibold transition-all", phaseFilter === "ALL" ? "bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/40" : "bg-white/5 text-muted-foreground hover:bg-white/10")}>
                  ✨ Semua Fase
                </button>
                {PHASES.map((p) => (
                  <button key={p.id} onClick={() => setPhaseFilter(p.id)} className={cn("flex items-center gap-2 rounded-xl px-3.5 py-2 text-[11px] font-semibold transition-all", phaseFilter === p.id ? "bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/40" : "bg-white/5 text-muted-foreground hover:bg-white/10")}>
                    <span className={cn("h-2 w-2 rounded-full", p.color)} /> {p.label} <span className="opacity-60">({p.steps})</span>
                  </button>
                ))}
              </div>
            </SpotlightCard>
          </Reveal>

          <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {steps.map((s) => {
                const done = MVP_DONE.has(s.n);
                const phase = PHASES.find((p) => p.id === s.phase);
                return (
                  <motion.div
                    key={s.n}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border p-4",
                      done ? "border-emerald-400/40 bg-emerald-500/10" : "border-white/10 bg-black/25"
                    )}
                  >
                    <span className="mt-0.5 shrink-0">
                      {done ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <Circle className="h-5 w-5 text-white/25" />}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold">
                        <span className="mr-1.5 font-mono text-[10px] text-muted-foreground">#{String(s.n).padStart(2, "0")}</span>
                        {s.t}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{s.d}</p>
                      <span className={cn("mt-1.5 inline-block h-1 w-8 rounded-full", phase?.color)} />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
