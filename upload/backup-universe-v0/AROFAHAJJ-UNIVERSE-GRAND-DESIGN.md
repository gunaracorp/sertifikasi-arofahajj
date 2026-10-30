# 🪐 AROFAHAJJ UNIVERSE — GRAND DESIGN & BLUEPRINT MVP
**Versi:** 1.0 | **Tanggal:** 2026-10-30 | **Status:** MVP Live & Terverifikasi

---

## 1. RINGKASAN EKSEKUTIF

Arofahajj Universe dibangun sebagai **satu super app ekosistem** dengan 4 properti yang berbagi
satu backbone data, satu design system, dan satu JSON-CMS:

| Properti | Domain | Status MVP | Fungsi |
|---|---|---|---|
| Arofahajj Travel | arofahajj.com | ✅ Live | Booking haji-umrah + escrow syariah + pizza tracker |
| Sertifikasi | sertifikasi.arofahajj.com | ✅ Live | 160+ layanan perizinan + AI Wizard + Public Verify |
| MEHUDIN | MUHDIN.ID | ✅ Live (Beta) | Asosiasi, tier membership, direktori + badge |
| Marketplace Halal | arofahajj.id | ✅ Live (Demo) | Produk pascapulang + keranjang + SLA badge |

**Prinsip:** microservices-first, API-first, headless & composable — sekali bangun, semua pakai.

---

## 2. YANG SUDAH DIWUJUDKAN DI MVP INI (TERVERIFIKASI BROWSER)

### Frontend (Next.js 16 + TypeScript + Tailwind 4 + shadcn/ui + Framer Motion)
- ✅ **Design system futuristik**: tema dark emerald-gold, aurora background, starfield,
  glassmorphism, spotlight card, 3D tilt, marquee, shimmer progress, animated counter,
  scroll reveal, gradient shimmer text, live-dot pulse — semua `prefers-reduced-motion` aware.
- ✅ **7 view SPA dengan transisi animasi**: Universe (home), Umrah, Sertifikasi, MEHUDIN,
  Marketplace, Grand Design, Admin CMS + deep-link hash (#sertifikasi, #admin, dst).
- ✅ Fully responsive (desktop 1440px → mobile iPhone 14) + mobile menu + sticky footer.

### AI Compliance Wizard (rules engine)
- ✅ 6 jenis usaha × kondisi (punya PT? PPIU? skala?) → journey perizinan berurutan
  (contoh terverifikasi: PT → R.6 Legalitas → D.1 TDUP → R.1 PPIU) + estimasi biaya total
  + kode tracking `WZ-XXXXX` tersimpan di DB.

### Booking & Escrow Simulator
- ✅ Katalog paket + filter + fill-seat indicator.
- ✅ State machine: `PENDING_PAYMENT → ESCROW_HELD → CONFIRMED → COMPLETED` (+CANCELLED)
  dengan status log JSON & kode `BK-XXXXXX` + tracking publik.

### Public Trust Layer
- ✅ Terbit sertifikat demo → hash SHA-256 → halaman verifikasi publik verdict **ASLI/TIDAK SAH**
  dengan detail holder, layanan, hash, chain (polygon-mumbai), siap di-anchor IPFS/Polygon.

### JSON-CMS (kendali penuh tanpa kode)
- ✅ 12 section (site, hero, stats, properties, services, bundles, packages, products,
  muhdin, testimonials, contact, wizardRules).
- ✅ Admin panel: editor JSON + Simpan & Publish (live seketika) + Reset default +
  daftar Leads + Registry Sertifikat + Export/Import snapshot JSON.

### API (teruji end-to-end)
```
GET  /api/content          → konten CMS ter-merge
GET/PUT/DELETE /api/admin/cms  → kelola section (x-admin-token)
POST /api/leads            → simpan lead konsultasi
POST /api/wizard           → AI wizard rules engine (kode WZ)
GET  /api/wizard?code=     → tracking hasil wizard
POST /api/bookings         → create booking (kode BK)
GET  /api/bookings?code=   → tracking escrow
PATCH /api/bookings        → transisi escrow (pay/confirm/cancel)
POST /api/certificates     → terbit sertifikat + hash
GET  /api/verify?code=     → PUBLIC TRUST (ASLI/TIDAK SAH)
GET  /api/stats            → angka live + status service
```

---

## 3. ARSITEKTUR MAKRO (TARGET PRODUKSI)

```
┌────────────────────── CHANNELS ──────────────────────┐
│  arofahajj.com · sertifikasi · MUHDIN.ID · marketplace │
│  Mobile (Expo) · Partner API · Admin Console           │
└──────────────────────────┬───────────────────────────┘
                           │ CDN + WAF
                ┌──────────▼──────────┐
                │  KONG API GATEWAY   │ (rate-limit, auth, feature flag)
                └──────────┬──────────┘
   ┌───────────────────────┼───────────────────────┐
   │            CORE SERVICES (generik)            │
   │  user/SSO · payment/escrow · notification     │
   │  docs/PII-vault · catalog · compliance        │
   └───────────────────────┬───────────────────────┘
   ┌───────────────────────┼───────────────────────┐
   │           DOMAIN SERVICES (event bus)         │
   │  haji · certification · membership · market   │
   └───────────────────────┬───────────────────────┘
                     POLYGLOT DATA
   PostgreSQL (transaksi) · Neo4j (graf syarat)
   Redis (cache/queue) · MongoDB (form dinamis)
```

**Superpowers:** AI/ML (document intelligence, rekomendasi, dynamic pricing) ·
Blockchain (W3C VC + Polygon/IPFS) · Temporal (SLA workflow) · WebSocket real-time.

---

## 4. STRUKTUR MONOREPO FINAL (Turborepo + pnpm)

```
arofahajj-universe/
├── .github/workflows/          # ci.yaml · cd-prod.yaml · security.yaml
├── docs/                       # adr/ · handbooks/ · runbooks/ · api/ (OpenAPI v3)
├── packages/                   # shared lintas app
│   ├── ui/                     # design system (Wizard, Stepper, BadgeTrust) + themes + hooks
│   ├── config/                 # eslint/ · tsconfigs/ · jest/
│   ├── lib-api/                # SDK klien (authClient, certClient, …)
│   ├── lib-core/               # logger, error, feature-flag
│   ├── lib-schema/             # Zod schemas + shared types
│   ├── lib-i18n/               # ID/EN/AR (+RTL)
│   └── lib-security/           # crypto, masker PII
├── apps/
│   ├── web-arofahajj/          # app/(public) | (account) | api/ | sitemap.ts
│   ├── web-sertifikasi/        # wizard/ | pengajuan/[id]/ | verifikasi/[kodeQR]/ | dashboard/
│   ├── web-muhdin/             # membership/ | directory/ | events/
│   ├── web-marketplace/        # products/[slug]/ | cart/checkout/ | orders/[id]/
│   └── admin-console/          # ops-haji/ | ops-sertifikasi/ | ops-marketplace/ | reports/
├── services/                   # NestJS (DDD modular) + Dockerfile per service
│   ├── auth/                   # modules/users · orgs · sso (OIDC) + prisma/
│   ├── payments/               # gateways/ · ledger/ · webhooks/
│   ├── notifications/          # channels/ · templates/ (WA HSM, MJML) · scheduler/
│   ├── docs/                   # storage/ · security/ · ocr/
│   ├── hajj/                   # catalog · booking · operations · integration-nusuk/
│   ├── certification/          # rules/ · applications/ · audits/ · certificates/ · registry/
│   ├── membership/             # members/ · dues/ · badges/
│   ├── marketplace/            # products/ · orders/ · returns/
│   └── gateway/kong/           # declarative routes
├── platform/                   # k8s/ · terraform/ · monitoring/ · logging/ · security/ (OPA, cosign)
├── data/                       # prisma/ · neo4j/ · seeds/ (KBLI, template dokumen)
├── tests/                      # Playwright e2e · Pact contract
├── turbo.json · package.json · pnpm-workspace.yaml
```

> MVP ini = bukti konsep terintegrasi yang langsung dipetakan ke struktur di atas:
> `src/components/universe/*` → `packages/ui`, `src/app/api/*` → `services/*`,
> `src/data/default-content.ts` → `data/seeds/`.

---

## 5. DATA MODEL (MVP → PRODUKSI)

**Sudah di MVP (Prisma/SQLite):** ContentSection (CMS), ConsultationLead,
WizardSubmission, Booking (+statusLog), Certificate (+dataHash).

**Roadmap produksi:** User, Organization, Membership, Package, Payment,
Certification, Product, Order, VCRegistry — PostgreSQL per service + Neo4j untuk
graf dependensi syarat (jalur upgrade PPIU→PIHK otomatis terdeteksi).

---

## 6. KEAMANAN & KEPATUHAN

- PII: TLS 1.3, KMS at-rest, field-level encryption (paspor), masking log.
- Residency: bucket ID vs KSA (UU PDP Indonesia + PDPL Saudi).
- RBAC + SoD + approval matrix; MFA admin; Zero Trust.
- DLP (regex paspor) + SIEM + pentest berkala + bug bounty.
- Audit trail immutable; retention & right-to-erasure.
- MVP note: token admin demo `arofahajj-mvp-admin` → diganti NextAuth RBAC di langkah #5.

---

## 7. ROADMAP 99 LANGKAH (RINGKASAN)

- **Fase 0 · Fondasi (1–8):** legal, monorepo, design system, JSON-CMS ✅, auth, DB, gateway, observability
- **Fase 1 · MVP Sertifikasi (9–30):** katalog ✅, rules engine ✅, wizard ✅, payment, SLA, e-sertifikat, verify QR ✅, SEO, AI doc checker, Neo4j, auto-assign, CaaS SLA
- **Fase 2 · Travel Portal (31–55):** katalog ✅, booking ✅, escrow-split, cicilan syariah, pizza tracker, FamilyView, **Nusuk wrapper (fase 1, langkah 41)**, e-visa bot, mobile app, panic button, GA launch
- **Fase 3 · MUHDIN & On-Chain (56–78):** membership ✅, SSO, badge, direktori ✅, e-voting, e-sign, marketplace ✅, **on-chain anchor Polygon/IPFS**, VC, Temporal, SOC/DLP, PDPL residency
- **Fase 4 · Skala Regional (79–99):** **Nusuk API penuh (langkah 79)**, B2B API, Kemenag dashboard, masjid SaaS, smart wallet, scholarship, NFT, IoT band, VR manasik, ekspansi Malaysia→ASEAN→Gulf, IPO readiness, Universe 2.0

**Koordinasi Nusuk.sa** sengaja ditempatkan di langkah 41 (wrapper manual + mitra syarikah)
dan langkah 79 (API penuh via gateway + feature-flag cutover) — sesuai permintaan:
MVP dulu, integrasi Nusuk belakangan.

---

## 8. CARA PAKAI (UNTUK PEMULA — HULU KE HILIR)

1. **Jalankan:** server dev sudah auto-run di port 3000. Buka preview.
2. **Ubah konten:** buka `#admin` (menu → Admin CMS) → pilih section → edit JSON
   → *Simpan & Publish* → halaman langsung berubah. Salah? *Reset default*.
3. **Backup konten:** tab *Backup* → *Unduh JSON* (commit ke Git repo Anda).
4. **Terima lead:** semua form masuk ke tab *Leads* di Admin.
5. **Terbitkan sertifikat:** portal Sertifikasi → Public Trust Layer → tombol demo,
   atau `POST /api/certificates` → bagikan kode `CERT-...` untuk diverifikasi publik.
6. **Push ke GitHub:** commit project ini ke `github.com/gunaracorp/arofahajj`,
   lalu ikuti struktur monorepo di atas saat split per app/service.

---

*Dibangun dengan ❤️ untuk Arofahajj Universe — Amanah adalah misi kami.*
