#!/usr/bin/env python3
# ============================================================
# Task 48 (lanjutan) — Rilis v2.0.1 "Pakai Nama Resmi"
# Sinkronisasi 8 titik versioning + dokumentasi.
# ============================================================
import json
import pathlib

R = pathlib.Path("/home/z/my-project")
VER = "2.0.1"
DATE = "2026-10-30"
NAME = "Pakai Nama Resmi"

# ------------------------------------------------------------
# 1. src/lib/version.ts — konstanta + RELEASES + komentar jumlah
# ------------------------------------------------------------
vt = (R / "src/lib/version.ts").read_text(encoding="utf-8")
vt = vt.replace('export const APP_VERSION = "2.0.0";', f'export const APP_VERSION = "{VER}";')
vt = vt.replace('export const RELEASE_NAME = "Arofahajj Universe";', f'export const RELEASE_NAME = "{NAME}";')
vt = vt.replace('export const RELEASE_DATE = "2026-10-30";', f'export const RELEASE_DATE = "{DATE}";')
vt = vt.replace(" * Riwayat lengkap 45 rilis — urut TERBARU lebih dulu.",
                " * Riwayat lengkap 46 rilis — urut TERBARU lebih dulu.")
NEW_ENTRY = '''export const RELEASES: ReleaseEntry[] = [
  {
    version: "2.0.1",
    date: "2026-10-30",
    type: "patch",
    name: "Pakai Nama Resmi",
    taskId: "48",
    highlights: [
      "Sweep final nama lama sesuai perintah owner (\\u201ctolong rubah namanya sesuai semua dokument kita\\u201d): 684 penggantian di 51 file — domain brand-lama.com → arofahajj.com (tautan katalog 500 layanan, mesin auto-ping SEO, skrip deploy/audit), brand, entitas legal lama → PT AROFAH GLOBAL SISTEM, WA lama → 0812-2234-5856",
      "Database production-grade di-rename: ALTER DATABASE brand-lama → arofahajj (.env + ensure-pg.sh ikut) + default kolom Post.author → \\u201cTim Arofahajj\\u201d (kontrak Prisma 8 di-emit ulang & ter-verify)",
      "Kebersihan identitas: cookie admin pp_admin_token → ah_admin_token · PDF Katalog_Layanan di-rename · 6 klaim HQ \\u201cSCBD\\u201d yang basi → Kantor Pusat Kota Tasikmalaya per NIB (referensi SCBD di produk virtual-office & area layanan DKI dipertahankan — itu lokasi produk/geografi)",
    ],
  },
'''
vt = vt.replace("export const RELEASES: ReleaseEntry[] = [\n", NEW_ENTRY, 1)
(R / "src/lib/version.ts").write_text(vt, encoding="utf-8")
print("version.ts OK")

# ------------------------------------------------------------
# 2. package.json — 2.0.0 → 2.0.1
# ------------------------------------------------------------
pj = json.loads((R / "package.json").read_text(encoding="utf-8"))
pj["version"] = VER
(R / "package.json").write_text(json.dumps(pj, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print("package.json OK")

# ------------------------------------------------------------
# 3. scripts/ver.json — sinkron blok versi
# ------------------------------------------------------------
vp = R / "scripts/ver.json"
vj = json.loads(vp.read_text(encoding="utf-8"))
vj["version"].update({
    "current": VER, "label": f"v{VER} — {NAME}",
    "releaseName": NAME, "releasedAt": DATE,
})
vj["docs"]["nextRelease"] = "v2.1.0 (Unreleased — antrean ROADMAP-99)"
vj["releases"]["total"] = 46
vj["releases"]["current"] = {
    "version": VER, "date": DATE, "type": "patch", "name": NAME,
}
vp.write_text(json.dumps(vj, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print("ver.json OK")

# ------------------------------------------------------------
# 4. CHANGELOG.md — badge + entri baru + ladder
# ------------------------------------------------------------
ct = (R / "CHANGELOG.md").read_text(encoding="utf-8")
ct = ct.replace(
    "[![Versi Saat Ini](https://img.shields.io/badge/Versi_Saat_Ini-v2.0.0_Arofahajj_Universe-059669?style=for-the-badge&logo=semanticweb&logoColor=white)](#v2-0-0)",
    "[![Versi Saat Ini](https://img.shields.io/badge/Versi_Saat_Ini-v2.0.1_Pakai_Nama_Resmi-059669?style=for-the-badge&logo=semanticweb&logoColor=white)](#v2-0-1)")
ct = ct.replace(
    "![Total Rilis](https://img.shields.io/badge/Total_Rilis-45_(0.1.0_%E2%86%92_2.0.0)-059669?style=flat-square)",
    "![Total Rilis](https://img.shields.io/badge/Total_Rilis-46_(0.1.0_%E2%86%92_2.0.1)-059669?style=flat-square)")
ct = ct.replace(
    "![Entri Worklog](https://img.shields.io/badge/Entri_Worklog-51_ber_versi-059669?style=flat-square)",
    "![Entri Worklog](https://img.shields.io/badge/Entri_Worklog-52_ber_versi-059669?style=flat-square)")
ct = ct.replace(
    '**📆 `arofahajj.com` → sekarang berjalan di `v2.0.0 — "Arofahajj Universe"`**',
    f'**📆 `arofahajj.com` → sekarang berjalan di `v{VER} — "{NAME}"`**')
ct = ct.replace("## 🪜 Tabel Lengkap 45 Rilis", "## 🪜 Tabel Lengkap 46 Rilis")
ct = ct.replace("[Tabel Lengkap 45 Rilis]", "[Tabel Lengkap 46 Rilis]")
ct = ct.replace(
    "| 45 | **v2.0.0** ⭐ | **2026-10-30** | major | **Arofahajj Universe** | Task 47 | **🟢 AKTIF — versi berjalan** |",
    "| 46 | **v2.0.1** ⭐ | **2026-10-30** | patch | **Pakai Nama Resmi** | Task 48 | **🟢 AKTIF — versi berjalan** |\n"
    "| 45 | v2.0.0 | 2026-10-30 | major | Arofahajj Universe | Task 47 | ✅ Rilis |")

ENTRY = '''<a id="v2-0-1"></a>

## [2.0.1] — 2026-10-30 — 🧹 "Pakai Nama Resmi" (Task 48)

**PATCH naming sweep** (perintah owner: *"tolong rubah namanya sesuai semua dokument kita sayang"*): penghapusan total seluruh sisa nama lama dari era BrandLama agar 100% konsisten dengan dokumen resmi (NIB OSS PT AROFAH GLOBAL SISTEM · Grand Design Arofahajj Universe). Kali ini termasuk riwayat dokumen historis — kebijakan Task 47 ("riwayat 0.x–1.x tidak diubah") dikaburkan secara sadar atas instruksi owner.

### 🔄 Changed
- **684 penggantian di 51 file** oleh `scripts/rebrand-final.py` (peta terdokumentasi, idempoten): `brand-lama.com` → `arofahajj.com` (500 tautan `layanan-500.json`, mesin auto-ping SEO `seo-ping-core.mjs`, 20+ skrip deploy/audit/SEO, dokumen docs/ & root), brand `BrandLama` → `Arofahajj`, entitas lama `PT Top Konsultan Internasional` → **PT AROFAH GLOBAL SISTEM**, WA lama `0812-6999-9910` → **0812-2234-5856** (FAQ EN, llms.txt, dokumen deploy, skrip 60 detik), paket deploy `public/download/*` ikut dibersihkan.
- **6 klaim kantor pusat "SCBD" yang basi** → Kantor Pusat **Kota Tasikmalaya** per NIB (README header, `team-data.ts` id+en, `coverage-data.ts`, `kbli-catalog.ts`, `seo-content.ts` fastFacts & tabel perbandingan, `llms.txt`) — referensi `Jakarta Selatan (SCBD)` sebagai area layanan & lokasi produk virtual-office DIPERTAHANKAN (geografi/produk, bukan HQ).
- **WORKLOG.md**: kutipan instruksi owner era v1.12.0 dinetralkan; `scripts/process-logo.mjs` diarahkan ke logo asli Arofa Hajj.
- **`src/prisma/contract.prisma`**: default `Post.author` → `"Tim Arofahajj"`.

### 🗄️ Database (produksi-grade rename)
- `ALTER DATABASE "brand-lama" RENAME TO "arofahajj"` — cluster embedded PostgreSQL `.pgdata` utuh, data selamat (dilakukan SEBELUM sweep file agar `ensure-pg.sh` tidak salah buat DB kosong).
- `ALTER TABLE "Post" ALTER COLUMN "author" SET DEFAULT 'Tim Arofahajj'` — DB sinkron dengan kontrak.
- `.env` + `scripts/ensure-pg.sh` mengikuti (`EXPECTED_URL` → `.../arofahajj`).

### 🔐 Security/Infra kecil
- Cookie admin `pp_admin_token` → `ah_admin_token` (`src/lib/admin-auth.ts` + skrip verify + STATE.md) — sesi admin lama otomatis logout (diharapkan, efek rebrand).
- Aset: `public/Katalog_Layanan_BrandLama.pdf` → `public/Katalog_Layanan_Arofahajj.pdf` (nol referensi kode rusak — file tak pernah ditaut).
- Remote git: `origin` → `https://github.com/gunaracorp/arofahajj.git` (repo sudah di-rename owner — selaras clone Task 47).

### 📚 Docs
- `STATE.md` (judul, baris website/repositori/versi/DB/cookie) · `README.md` (badge versi ×2) · `scripts/ver.json` (blok versi + releases.total 46) · entri ini + ladder #46 · WORKLOG Task 48.

---

'''
ct = ct.replace('<a id="v2-0-0"></a>', ENTRY + '<a id="v2-0-0"></a>', 1)
(R / "CHANGELOG.md").write_text(ct, encoding="utf-8")
print("CHANGELOG.md OK")

# ------------------------------------------------------------
# 5. WORKLOG.md — entri Task 48 di akhir file (urut menaik)
# ------------------------------------------------------------
wt = (R / "WORKLOG.md").read_text(encoding="utf-8")
WENTRY = '''

---
Task ID: 48
Agent: Z.ai Code (main agent — Full-Stack Architect mode)
Task: Sweep final penamaan sesuai dokumen resmi (perintah owner: "tolong rubah namanya sesuai semua dokument kita sayang") — hapus total ±684 sisa nama lama era BrandLama + rename database produksi. 🏷️ Rilis v2.0.1 "Pakai Nama Resmi" (PATCH).

Work Log:
- Inventarisasi menyeluruh (rg case-insensitive): 640+ sisa di 49 file — runtime (layanan-500.json 500 tautan domain lama, seo-ping-core.mjs, contract.prisma, globals.css), 20+ skrip, 8 dokumen root/docs, paket deploy public/download/
- scripts/rebrand-final.py (peta 20 aturan terurut + eksklusi upload/, snapshots/, skrip peta lama): 684 penggantian / 49 file; sisa 2 file public/download dibersihkan terpisah (ter-eksklusi aturan folder)
- DATABASE RENAME dulu (urutan aman): pg_ctl stop → postgres --single: ALTER DATABASE "brand-lama" RENAME TO "arofahajj" + ALTER TABLE "Post" default author 'Tim Arofahajj' → start → BARU sweep file (.env, ensure-pg.sh EXPECTED_URL, contract.prisma) — data cluster .pgdata selamat 100%
- Konteks akurat dipertahankan: keyword generik "brand lama" (layout.tsx — istilah vertikal, bukan brand), "Jakarta Selatan (SCBD)" area layanan (coverage/kabkota), lokasi produk virtual-office SCBD/BSD
- Klaim HQ basi dibenahi 6 titik → Kantor Pusat Kota Tasikmalaya per NIB (README, team-data id+en, coverage-data note, kbli-catalog FAQ, seo-content fastFacts + tabel perbandingan, llms.txt)
- Cookie admin pp_admin_token → ah_admin_token; PDF katalog di-rename; git origin → github.com/gunaracorp/arofahajj.git (selaras rename repo owner & clone Task 47)
- Versioning 8 titik: version.ts 2.0.1 + RELEASES 46 entri (taskId 48); package.json; scripts/ver.json (blok versi + total 46 + nextRelease v2.1.0); CHANGELOG (badge ×4 + entri v2.0.1 + ladder #46); STATE.md (versi v1.17.1 basi → v2.0.1); README (badge 1.20.0 basi → 2.0.1); WORKLOG (entri ini); prisma contract emit + db verify
- Kebijakan Task 47 "riwayat 0.x–1.x tidak diubah" dikaburkan sadar atas instruksi owner — seluruh dokumen kini satu nama

Stage Summary:
- v2.0.1 "Pakai Nama Resmi" rilis: nol sisa nama lama di kode, data, skrip & seluruh dokumen (scan rg bersih, di luar arsip upload/ milik owner); DB arofahajj + default author baru ter-verify; situs siap diverifikasi E2E
'''
(R / "WORKLOG.md").write_text(wt.rstrip("\n") + WENTRY, encoding="utf-8")
print("WORKLOG.md OK")

# ------------------------------------------------------------
# 6. STATE.md — baris versi basi + deskripsi website
# ------------------------------------------------------------
st = (R / "STATE.md").read_text(encoding="utf-8")
st = st.replace(
    '| Website | Arofahajj.com — konsultan perizinan, pajak & penempatan PMI Indonesia |',
    '| Website | arofahajj.com — **Arofahajj Universe** (Haji & Umrah, Perizinan Usaha & Sertifikasi) — PT AROFAH GLOBAL SISTEM |')
st = st.replace(
    '| Versi aplikasi | v1.17.1 "Dokumen Terkini" (`src/lib/version.ts`, `package.json`) |',
    f'| Versi aplikasi | v{VER} "{NAME}" (`src/lib/version.ts`, `package.json`) |')
(R / "STATE.md").write_text(st, encoding="utf-8")
print("STATE.md OK")

# ------------------------------------------------------------
# 7. README.md — badge & baris versi basi
# ------------------------------------------------------------
rt = (R / "README.md").read_text(encoding="utf-8")
rt = rt.replace(
    "[![Versi](https://img.shields.io/badge/Versi-aplikasi_1.20.0-059669?style=flat-square)](./src/lib/version.ts)",
    f"[![Versi](https://img.shields.io/badge/Versi-aplikasi_{VER}-059669?style=flat-square)](./src/lib/version.ts)")
rt = rt.replace(
    '- **Versi aplikasi:** 1.20.0 ("Arofahajj Universe" — lihat [CHANGELOG](./CHANGELOG.md)), didefinisikan di <code>src/lib/version.ts</code> dan <code>package.json</code>.',
    f'- **Versi aplikasi:** {VER} ("{NAME}" — lihat [CHANGELOG](./CHANGELOG.md)), didefinisikan di <code>src/lib/version.ts</code> dan <code>package.json</code>.')
(R / "README.md").write_text(rt, encoding="utf-8")
print("README.md OK")

print("\nALL DONE")
