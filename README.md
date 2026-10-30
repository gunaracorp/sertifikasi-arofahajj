<div align="center">
<a id="top"></a>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1c1917,55:92400e,100:f59e0b&height=210&section=header&text=AROFAHAJJ%20UNIVERSE&fontSize=48&fontColor=ffffff&fontAlignY=34&desc=Haji%20%26%20Umrah%20%C2%B7%20Perizinan%20Usaha%20%C2%B7%20Sertifikasi%20%E2%80%94%20Satu%20Pintu&descSize=16&descAlignY=57&animation=fadeIn" width="100%" alt="Arofahajj Universe — Haji & Umrah, Perizinan Usaha & Sertifikasi"/>

<h1>Arofahajj Universe</h1>

<p><strong>Satu codebase untuk layanan Haji & Umrah, perizinan usaha, katalog digital 1.500+ layanan, konsultasi berbantuan AI, pembayaran, CMS, dan operasi bisnis — diterbitkan untuk 11.873+ halaman terindeks.</strong></p>

<p>
  <a href="https://arofahajj.com">🌐 Situs Live</a> ·
  <a href="https://github.com/gunaracorp/arofahajj">💻 Repository</a> ·
  <a href="./CHANGELOG.md">📦 Riwayat Versi</a> ·
  <a href="./ROADMAP-99.md">🏆 ROADMAP 99 PERFECT</a> ·
  <a href="./docs/HOSTINGER-NODEJS-DEPLOY.md">🚀 Panduan Deploy</a>
</p>

<a id="badge-versi" href="./CHANGELOG.md#v2-3-0"><img src="https://img.shields.io/badge/Versi-v2.3.0_Rumah_Baru-f59e0b?style=for-the-badge&logo=semanticweb&logoColor=1c1917" alt="Versi v2.3.0 Rumah Baru"/></a>
<img src="https://img.shields.io/badge/Status-stable-1c1917?style=for-the-badge" alt="Status stable"/>
<img src="https://img.shields.io/badge/Next.js-16-f59e0b?style=flat-square&logo=nextdotjs&logoColor=1c1917" alt="Next.js 16"/>
<img src="https://img.shields.io/badge/React-19-f59e0b?style=flat-square&logo=react&logoColor=1c1917" alt="React 19"/>
<img src="https://img.shields.io/badge/TypeScript-5.9-f59e0b?style=flat-square&logo=typescript&logoColor=1c1917" alt="TypeScript 5.9"/>
<img src="https://img.shields.io/badge/Prisma-8_contract_first-f59e0b?style=flat-square&logo=prisma&logoColor=1c1917" alt="Prisma 8 contract-first"/>
<img src="https://img.shields.io/badge/Tailwind_CSS-4-f59e0b?style=flat-square&logo=tailwindcss&logoColor=1c1917" alt="Tailwind CSS 4"/>
<img src="https://img.shields.io/badge/PostgreSQL-Prisma_Postgres-1c1917?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL — Prisma Postgres"/>
<img src="https://img.shields.io/badge/i18n-30_bahasa-f59e0b?style=flat-square" alt="i18n 30 bahasa"/>

<img src="public/logo.png" width="124" alt="Logo Arofahajj Universe"/>

<p><sup>🏛️ PT AROFAH GLOBAL SISTEM · Kota Tasikmalaya, Jawa Barat · Indonesia</sup></p>

### ⚡ Urus Ibadah, Legalitas, dan Kepatuhan Usaha dengan Lebih Terarah ⚡

</div>

---

## ✨ Tentang Platform

**Arofahajj Universe** (arofahajj.com) adalah satu pintu digital untuk dua pilar layanan PT AROFAH GLOBAL SISTEM. Dibangun sebagai satu codebase Next.js yang melayani situs publik, katalog pesan-antar layanan, alat bantu AI, pembayaran, dan panel operasional — dengan disiplin rilis ketat dan jejak audit penuh.

| Pilar | Isi Layanan | Contoh Permukaan Produk |
| --- | --- | --- |
| 🕋 **Haji & Umrah** | Edukasi dan layanan pendamping ibadah, kanal resmi, glosarium, kalender kepatuhan | `/kanal-resmi`, `/glosarium`, `/kalender-kepatuhan` |
| 🏛️ **Perizinan Usaha & Sertifikasi** | 1.500 layanan pesan-antar (NIB, sertifikasi, legalitas), KepatuhanPRO berlangganan, cek izin berbasis AI | `/katalog`, `/kepatuhan-pro`, `/cek-izin`, `/kbli` |

Ditenagai **AI RIZKI 24/7** (konsultasi & cek dokumen), **5 alat bantu AI**, kalkulator biaya & pajak, checkout dengan escrow demo, CMS blog, dan panel admin — semuanya dalam **30 bahasa** dengan dark mode penuh.

## 📊 Statistik Langsung

Sumber tunggal: [`GET /api/version`](https://arofahajj.com/api/version) (dihidupkan dari `src/lib/version.ts`).

| Metrik | Nilai | Metrik | Nilai |
| --- | --- | --- | --- |
| Halaman terindeks | **11.873** | Layanan pesan-antar | **1.500** |
| Section sitemap | **15** | SKU berlangganan | **6** |
| Bahasa antarmuka | **30** | Alat bantu AI | **5** |
| Provinsi tercakup | **38** | Model database | **15** |

## 🧰 Teknologi

| Lapisan | Teknologi | Catatan |
| --- | --- | --- |
| Framework | **Next.js 16 (App Router) + React 19** | Static export & standalone Node.js siap cPanel/Hostinger |
| Bahasa | **TypeScript 5.9** | Ketat, tanpa `any` baru di jalur kritis |
| Styling | **Tailwind CSS 4** | Palet brand **"Kiswah & Emas"** — kiswah gelap + skala amber, kontras WCAG 2.2 |
| Database | **PostgreSQL via Prisma ORM 8 (RC)** | Contract-first: `contract.prisma → contract emit → db init/sign/verify` |
| Hosting DB | **Prisma Postgres (cloud, pooled)** + embedded PostgreSQL untuk sandbox | Lihat [Arsitektur Database](#️-arsitektur-database--prisma-8-contract-first) |
| Runtime & tooling | **Bun**, ESLint, `tsx` | Dev, smoke test, dan rilis otomatis via skrip Python idempoten |
| i18n | 30 bahasa (ID/EN/AR dst.) | Kamus terpusat, RTL untuk Arab |

## 🗄️ Arsitektur Database — Prisma 8 Contract-First

```text
src/prisma/contract.prisma          ← sumber kebenaran skema (kontrak)
        │  prisma contract emit
        ▼
generated/prisma8/contract.json     ← kontrak terkompilasi + tipe
        │  prisma db init → db sign → db verify
        ▼
PostgreSQL (Prisma Postgres cloud)  ← 15 model, marker tersigning
        │  runtime: src/prisma/db.ts (driver @prisma/orm-postgres)
        ▼
src/lib/db.ts                       ← delegasi kompatibel untuk seluruh aplikasi
```

**Dua mode koneksi, dipilih otomatis oleh `scripts/ensure-pg.sh` (predev guard):**

- ☁️ **Mode remote** — bila `DATABASE_URL` di `.env` menunjuk cloud (mis. `pooled.db.prisma.io`), guard melewatkan cluster lokal dan **tidak pernah menimpa `.env`**. Skema dikelola lewat `db:init → db:sign → db:verify`.
- 🧪 **Mode sandbox** — bila `.env` lokal/hilang, guard menyiapkan **embedded PostgreSQL** (`.pgdata`) dan memulihkan `.env` sandbox secara idempoten, lalu menginisialisasi skema otomatis.

Verifikasi kontrak kapan saja: `bun run db:verify` (ketat: `db:verify:strict`) · uji end-to-end 15 model: `bun run db:smoke`.

## 🚀 Memulai

Prasyarat: [Bun](https://bun.sh) ≥ 1.3 dan (opsional, untuk mode sandbox) tidak ada — PostgreSQL embedded disiapkan otomatis.

```bash
git clone https://github.com/gunaracorp/arofahajj.git
cd arofahajj
bun install

# Tentukan database:
#   (a) Cloud — isi DATABASE_URL Prisma Postgres Anda di .env, atau
#   (b) Sandbox — biarkan .env kosong; guard membuat embedded PostgreSQL lokal
bun run dev          # http://localhost:3000
bun run db:smoke     # uji create/read 15 model
```

## 🔐 Environment Variables

Semua rahasia hidup di `.env` (di-gitignore, **jangan pernah di-commit**). Contoh aman tanpa kredensial:

```env
# Wajib — connection string PostgreSQL (cloud atau lokal)
DATABASE_URL="postgres://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
# Panel admin
ADMIN_PASSWORD="ganti-saya"
ADMIN_SECRET="hex-acak-48"
# Operasional
CRON_SECRET="hex-acak-48"
PAYMENT_DEMO_MODE="true"
FOLLOWUP_SWEEP_MINUTES="0"
NEXT_PUBLIC_GA_ID="G-XXXXXXX"
```

| Variabel | Wajib | Fungsi |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | Koneksi PostgreSQL — dipakai CLI Prisma, build, dan runtime |
| `ADMIN_PASSWORD` / `ADMIN_SECRET` | ✅ | Kredensial & penandatangan sesi panel admin |
| `CRON_SECRET` | ⬜ | Auth job terjadwal (follow-up, pemulihan) |
| `PAYMENT_DEMO_MODE` | ⬜ | `true` = checkout escrow simulasi tanpa gateway |
| `FOLLOWUP_SWEEP_MINUTES` | ⬜ | Interval sweep follow-up otomatis |
| `NEXT_PUBLIC_GA_ID` | ⬜ | Google Analytics 4 |

## 🧪 Perintah Penting

| Perintah | Fungsi |
| --- | --- |
| `bun run dev` | Dev server :3000 (predev guard menyiapkan DB otomatis) |
| `bun run build` / `bun run start` | Build produksi & jalankan standalone |
| `bun run db:init` / `db:sign` / `db:verify` | Inisialisasi, signing, dan verifikasi kontrak skema |
| `bun run db:verify:strict` | Verifikasi ketat (CI) |
| `bun run db:smoke` | Uji create/read seluruh 15 model |
| `bun run db:backup` / `db:restore` | Backup & pulihkan PostgreSQL |
| `bun run db:plan` / `db:migrate:preview` | Rencana migrasi tanpa menulis |

## 🏷️ Disiplin Versioning — 8 Titik Wajib Sinkron

Setiap rilis **wajib** menyinkronkan kedelapan titik ini sebelum commit (dijalankan skrip rilis Python idempoten):

1. `src/lib/version.ts` — `APP_VERSION`, `RELEASE_NAME`, entri `RELEASES`
2. `package.json` — `version`
3. `scripts/ver.json` — blok versi, `nextRelease`, `releases.total`
4. `CHANGELOG.md` — badge, entri ber-anker, ladder tabel lengkap
5. `WORKLOG.md` — entri Task ID di akhir berkas
6. `STATE.md` — baris versi aplikasi
7. `README.md` — badge versi ( Anda di sini → **v2.3.0 "Rumah Baru"** )
8. Kontrak Prisma — `bun run db:verify` hijau

Hingga v2.3.0: **52 rilis** tercatat (0.1.0 → 2.3.0) dan **58 entri worklog** — semua terlacak di [CHANGELOG](./CHANGELOG.md) & [WORKLOG](./WORKLOG.md).

## 🗺️ ROADMAP 99 PERFECT

Rencana induk **12 fase · 99 langkah** menuju platform sempurna — antrean rilis berikutnya selalu tampil di [`/api/version`](https://arofahajj.com/api/version) dan [ROADMAP-99.md](./ROADMAP-99.md).

## 📁 Struktur Proyek

```text
arofahajj/
├── src/
│   ├── app/                 # App Router — 15 section sitemap (katalog, kepatuhan-pro, ...)
│   ├── components/          # landing/, footer, admin, katalog, ai
│   ├── lib/                 # version.ts (sumber versi), db.ts, pricing.ts, i18n
│   └── prisma/              # contract.prisma (sumber kebenaran) + db.ts (runtime ORM 8)
├── generated/prisma8/       # kontrak terkompilasi (artifact, tidak di-commit)
├── scripts/                 # ensure-pg.sh, release-v*.py, ver.json, smoke-prisma8.ts
├── docs/                    # deploy Hostinger, status migrasi Prisma 8, SEO
├── CHANGELOG.md             # 52 rilis terdokumentasi penuh
├── WORKLOG.md               # jejak audit per Task ID
└── ROADMAP-99.md            # 12 fase · 99 langkah
```

## ☁️ Deployment

Target produksi: **Node.js standalone di Hostinger** (panduan lengkap: [`docs/HOSTINGER-NODEJS-DEPLOY.md`](./docs/HOSTINGER-NODEJS-DEPLOY.md)) — set `DATABASE_URL` cloud di environment hosting, lalu `bun run build && bun run start`. Static export tersedia untuk jalur cPanel.

## 🏛️ Badan Hukum & Kontak

**PT AROFAH GLOBAL SISTEM** · Andalusia Garden, Mangkubumi, Kota Tasikmalaya, Jawa Barat · 🌐 [arofahajj.com](https://arofahajj.com)

© 2026 PT AROFAH GLOBAL SISTEM. Seluruh hak cipta.

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1c1917,55:92400e,100:f59e0b&height=120&section=footer" width="100%" alt=""/>
