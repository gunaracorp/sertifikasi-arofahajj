#!/usr/bin/env python3
# ============================================================
# Task 47 — Sinkronisasi dokumentasi rebrand Arofahajj Universe
# CHANGELOG.md (entri v2.0.0 + badge + ladder) · WORKLOG.md
# (Task 47) · README.md (sweep brand + badge versi)
# ============================================================
import pathlib, re

R = pathlib.Path("/home/z/my-project")

# ------------------------------------------------------------
# CHANGELOG.md
# ------------------------------------------------------------
cl = R / "CHANGELOG.md"
t = cl.read_text()

t = t.replace(
    "desc=BrandLama.com%20%C2%B7%20Riwayat%20Versi%20Resmi%20%C2%B7%20Official%20Version%20History",
    "desc=Arofahajj%20Universe%20%C2%B7%20Riwayat%20Versi%20Resmi%20%C2%B7%20Official%20Version%20History",
)
t = t.replace(
    "alt=\"CHANGELOG — BrandLama.com\"",
    "alt=\"CHANGELOG — Arofahajj Universe\"",
)
t = t.replace(
    "[![Versi Saat Ini](https://img.shields.io/badge/Versi_Saat_Ini-v1.20.0_Footer_Mahkota-059669?style=for-the-badge&logo=semanticweb&logoColor=white)](#v1-20-0)",
    "[![Versi Saat Ini](https://img.shields.io/badge/Versi_Saat_Ini-v2.0.0_Arofahajj_Universe-059669?style=for-the-badge&logo=semanticweb&logoColor=white)](#v2-0-0)",
)
t = t.replace(
    "![Total Rilis](https://img.shields.io/badge/Total_Rilis-44_(0.1.0_%E2%86%92_1.20.0)-059669?style=flat-square)",
    "![Total Rilis](https://img.shields.io/badge/Total_Rilis-45_(0.1.0_%E2%86%92_2.0.0)-059669?style=flat-square)",
)
t = t.replace(
    "![Entri Worklog](https://img.shields.io/badge/Entri_Worklog-50_ber_versi-059669?style=flat-square)",
    "![Entri Worklog](https://img.shields.io/badge/Entri_Worklog-51_ber_versi-059669?style=flat-square)",
)
t = t.replace(
    "![Rilis Berikutnya](https://img.shields.io/badge/Rilis_Berikutnya-v1.21.0_(Unreleased)-f59e0b?style=flat-square)",
    "![Rilis Berikutnya](https://img.shields.io/badge/Rilis_Berikutnya-v2.1.0_(Unreleased)-f59e0b?style=flat-square)",
)
t = t.replace(
    '**📆 `brand-lama.com` → sekarang berjalan di `v1.20.0 — "Footer Mahkota"`**',
    '**📆 `arofahajj.com` → sekarang berjalan di `v2.0.0 — "Arofahajj Universe"`**',
)
t = t.replace("Tabel Lengkap 44 Rilis", "Tabel Lengkap 45 Rilis")

ENTRY_200 = """<a id="v2-0-0"></a>

## [2.0.0] — 2026-10-30 — 🕋 "Arofahajj Universe" (Task 47)

**REBRAND MAJOR** (perombakan arah produk — SemVer MAJOR): seluruh mesin fitur lengkap yang terbukti di medan (44 rilis: SEO 11.873 halaman, Mission Control, follow-up & recovery engine, editorial calendar, glosarium, footer Mahkota, GA4 full-funnel, backup harian) kini berjalan sebagai **AROFAHAJJ UNIVERSE** di **arofahajj.com** — dengan identitas legal resmi **PT AROFAH GLOBAL SISTEM** dan **logo asli Arofa Hajj** (Kaaba emas + عرفة) milik owner.

### 🛍️ Added
- **Logo ASLI dipasang ke semua aset identitas** — dibuat dari file asli owner (`upload/logo-arofahajj-pt-arofah-global-sistem.png`, 184×169 RGBA transparan) tanpa penggantian desain via `scripts/make-arofahajj-logo-assets.py`: `logo.png` (3× LANCZOS), `logo-icon.png` 512² (marka Kaaba ter-crop otomatis via analisis band alpha), `logo-icon-white.png` (maskable safe-zone), `logo.svg` + `favicon.svg` (wrapper base64), dan **`og-arofahajj.png` 1200×630** (Kaaba dalam ring emas + wordmark di atas gradasi deep-emerald) — `og-brand-lama.png` pensiun.
- **Konstanta `LEGAL_DOCS` baru di `site.ts`**: NIB **2503250053856**, Sertifikat Standar **25032500538560001**, KBLI **79121 — Aktivitas Biro Perjalanan Wisata**, penerbit DPMPTSP Kota Tasikmalaya (terbit 25 Maret 2025) — siap dipakai halaman legal & schema.
- **`SITE_URL` → `https://arofahajj.com`** — seluruh canonical, sitemap, robots, JSON-LD, OG mengalir otomatis dari satu konstanta.

### 🔄 Changed
- **Identitas sitewide (203 file tersentuh)**: `BrandLama.com` → **Arofahajj Universe** · `PT Top Konsultan Internasional` → **PT AROFAH GLOBAL SISTEM** · domain → `arofahajj.com` · aset download di-rename (`katalog-500-layanan-arofahajj.pdf`, `arofahajj-static-hosting.tar.gz`) · `manifest.json` + `scripts/ver.json` + `package.json` (name `arofahajj-universe`, v2.0.0).
- **NAP baru dari NIB**: kantor Andalusia Garden Cluster Granada No.11, Jl. Abdi Negara II, Mangkubumi, **Kota Tasikmalaya 46181** · WA/telepon resmi **0812-2234-5856** (`6281222345856` — 20 file) · `halo@arofahajj.com` · geo Tasikmalaya — halaman kontak/FAQ/JSON-LD kini konsisten (referensi HQ "SCBD" yang basi dibersihkan; referensi SCBD di produk virtual-office dipertahankan karena memang lokasi produk).
- **Metadata root (`layout.tsx`)**: title default + description + OG berposisi "Haji & Umrah, Perizinan Usaha & Sertifikasi #1 Indonesia" dengan menyebut NIB & KBLI resmi.
- **`src/lib/version.ts`**: APP_VERSION **2.0.0** ("Arofahajj Universe"), RELEASES 44 → 45 entri (taskId 47), APP_NAME/APP_DOMAIN/APP_TAGLINE baru.

### 🧪 QA
- `GET /api/version` → 2.0.0 "Arofahajj Universe"; footer & JSON-LD mengalir otomatis
- Verifikasi browser: logo Kaaba emas tampil di header/footer/favicon; OG image baru ter-render
- Riwayat rilis 0.x–1.x **tidak diubah** (rekam jejak historis mesin tetap utuh)

"""

anchor = '<a id="v1-20-0"></a>'
assert anchor in t, "anchor v1-20-0 tidak ditemukan"
t = t.replace(anchor, ENTRY_200 + anchor, 1)

LADDER_OLD = "| 44 | **v1.20.0** ⭐ | **2026-10-29** | minor | **Footer Mahkota** | Task 46 | **🟢 AKTIF — versi berjalan** |"
LADDER_NEW = (
    "| 45 | **v2.0.0** ⭐ | **2026-10-30** | major | **Arofahajj Universe** | Task 47 | **🟢 AKTIF — versi berjalan** |\n"
    "| 44 | v1.20.0 | 2026-10-29 | minor | Footer Mahkota | Task 46 | ✅ Rilis |"
)
assert LADDER_OLD in t, "baris ladder v1.20.0 tidak ditemukan"
t = t.replace(LADDER_OLD, LADDER_NEW, 1)

cl.write_text(t)
print("CHANGELOG.md ok")

# ------------------------------------------------------------
# WORKLOG.md — append Task 47
# ------------------------------------------------------------
wl = R / "WORKLOG.md"
w = wl.read_text()

TASK47 = """

---

Task ID: 47
Agent: Z.ai Code (main agent — Full-Stack Architect mode)
Task: Rebrand penuh mesin fitur lengkap → AROFAHAJJ UNIVERSE (perintah owner: "logo nya tolong pakai yang asli lalu tolong baca yang aku upload ini dan jalankan, ambil semua fitur yang sama tapi untuk arofahajj-universe") + logo ASLI Arofa Hajj dari file owner + identitas legal PT AROFAH GLOBAL SISTEM dari NIB OSS. 🏷️ Rilis v2.0.0 "Arofahajj Universe" (MAJOR).

Work Log:
- Basis: clone github.com/gunaracorp/brand-lama @ a2e125a (v1.20.0 "Footer Mahkota" — 44 rilis fitur) → swap penuh ke workspace; backup prototipe universe sesi lama ke upload/backup-universe-v0/
- Infra sandbox dipulihkan: .env PostgreSQL (pola ensure-pg.sh self-healing) → bun install 641 paket → embedded PostgreSQL 17 initdb + database + skema 15 model → dev server Next.js 16.4.3 Ready, GET / 200, [detak-jantung] terdeteksi
- LOGO ASLI (bukan generate): upload/logo-arofahajj-pt-arofah-global-sistem.png (Kaaba emas + "Arofa Hajj" + عرفة, 184×169 RGBA) → scripts/make-arofahajj-logo-assets.py: crop marka Kaaba via analisis band alpha (bands [[0,93],[103,169]]) → logo.png 3×, logo-icon.png 512², logo-icon-white.png maskable, logo.svg + favicon.svg (base64), og-arofahajj.png 1200×630 (ring emas + wordmark); og-brand-lama.png dihapus
- site.ts (sumber kebenaran): SITE_URL → https://arofahajj.com, SITE_NAME → Arofahajj Universe, LEGAL_ENTITY → PT AROFAH GLOBAL SISTEM, + LEGAL_DOCS (NIB 2503250053856 · SS 25032500538560001 · KBLI 79121 · DPMPTSP Kota Tasikmalaya), CONTACT → NAP NIB (Andalusia Garden Cluster Granada No.11 Mangkubumi Tasikmalaya 46181 · 6281222345856 · halo@arofahajj.com · geo -7.3305,108.2199 · founding 2025)
- Sweep terkontrol 203 file: brand/domain/entitas + nomor WA lama→baru (20 file) + alamat HQ SCBD→Tasikmalaya (kontak, tentang-kami, mitra, konsultasi, kalkulator, PMA-EN, chat prompt, JSON-LD layanan) — referensi SCBD di produk virtual-office dipertahankan (lokasi produk, bukan HQ); aset download di-rename (katalog-500-layanan-arofahajj.pdf, arofahajj-static-hosting.tar.gz)
- Metadata root: title default "Arofahajj Universe — Haji & Umrah, Perizinan Usaha & Sertifikasi #1 Indonesia", description menyebut NIB & KBLI resmi
- Versioning 6 titik: version.ts 2.0.0 "Arofahajj Universe" (MAJOR — perombakan arah produk) + RELEASES 45 entri (taskId 47); package.json (arofahajj-universe, 2.0.0); scripts/ver.json; manifest.json; CHANGELOG.md (entri v2.0.0 + badge + ladder #45); WORKLOG.md (entri ini); README.md sweep brand + badge
- Riwayat rilis 0.x–1.x TIDAK diubah — rekam jejak historis mesin tetap utuh; entri v2.0.0 hanya menandai titik rebrand

Stage Summary:
- v2.0.0 "Arofahajj Universe" rilis: SEMUA fitur sama (SEO engine 11.873 halaman, Mission Control CMS, follow-up 24/48/72 jam + detak jantung, recovery checkout, social proof, live activity feed, garansi, editorial calendar, glosarium 214 istilah, footer Mahkota 7 lapis, GA4 full-funnel, backup harian + Sentry) kini hidup dengan logo ASLI Arofa Hajj dan identitas legal PT AROFAH GLOBAL SISTEM di arofahajj.com
"""

wl.write_text(w.rstrip("\n") + TASK47)
print("WORKLOG.md ok")

# ------------------------------------------------------------
# README.md — sweep brand + badge versi
# ------------------------------------------------------------
rd = R / "README.md"
r = rd.read_text()
before = r
r = r.replace("BrandLama.com", "Arofahajj Universe")
r = r.replace("brand-lama.com", "arofahajj.com")
r = r.replace("BRANDLAMA.COM", "AROFAHAJJ UNIVERSE")
r = r.replace("PT Top Konsultan Internasional", "PT AROFAH GLOBAL SISTEM")
r = r.replace("v1.20.0_Footer_Mahkota", "v2.0.0_Arofahajj_Universe")
r = r.replace("v1.20.0", "v2.0.0")
r = r.replace("Footer Mahkota", "Arofahajj Universe")
rd.write_text(r)
print(f"README.md ok ({len(before)} → {len(r)} chars)")

print("SEMUA DOKUMEN TERSINKRON")
