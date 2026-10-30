#!/usr/bin/env python3
# ============================================================
# Task 53 — Rilis v2.2.2 "Tanpa Jejak" (PATCH)
# Hapus total seluruh jejak brand lama: 6 foto kantor ber-logo lama
# (2 di /kontak diganti band brand, 3 di /tentang-kami diganti
# kartu info, 1 yatim), keyword SEO brand lama, JSON-LD, alt inisial lama,
# catatan historis dinetralkan, DB discan bersih (79 kolom).
# Sinkronisasi 8 titik versioning.
# ============================================================
import json
import pathlib
import re

R = pathlib.Path("/home/z/my-project")
VER = "2.2.2"
DATE = "2026-10-30"
NAME = "Tanpa Jejak"

# ------------------------------------------------------------
# 1. src/lib/version.ts
# ------------------------------------------------------------
vt = (R / "src/lib/version.ts").read_text(encoding="utf-8")
vt = vt.replace('export const APP_VERSION = "2.2.1";', f'export const APP_VERSION = "{VER}";')
vt = vt.replace('export const RELEASE_NAME = "Fokus Beranda";', f'export const RELEASE_NAME = "{NAME}";')
vt = re.sub(r" \* Riwayat lengkap \d+ rilis — urut TERBARU lebih dulu\.",
            " * Riwayat lengkap 51 rilis — urut TERBARU lebih dulu.", vt)
NEW_ENTRY = '''export const RELEASES: ReleaseEntry[] = [
  {
    version: "2.2.2",
    date: "2026-10-30",
    type: "patch",
    name: "Tanpa Jejak",
    taskId: "53",
    highlights: [
      "Hapus TOTAL seluruh jejak brand lama (perintah owner \\u201cjangan sampai ada yang tertinggal\\u201d): 6 foto kantor ber-logo lama dilepas \\u2014 2 kartu /kontak diganti band brand emas-di-kiswah (ikon MapPin/Building2), 3 galeri /tentang-kami diganti 3 kartu info ikon, 1 foto yatim public/kantor-bandung.jpg dihapus",
      "Sweep string: keyword SEO \\u201ck\\u201d lama di layout.tsx, 5 URL foto kantor di JSON-LD Organization \\u2192 og-arofahajj.png, alt \\u201clogo lama\\u201d \\u2192 dihapus bersama foto; catatan historis v0.x\\u20132.x (version.ts, CHANGELOG, WORKLOG, ver.json, 3 skrip migrasi, 2 dokumen upload) dinetralkan token \\u2192 sebutan netral via scripts/scrub-oldbrand.py (idempoten, token dinamis)",
      "Verifikasi berlapis: rg repo-wide = 0 jejak \\u00b7 DB discan 79 kolom teks/JSON di 15 tabel via postgres --single = 0 baris \\u00b7 tsc bersih \\u00b7 3 halaman HTTP 200 \\u00b7 bukti visual 2 PNG",
    ],
  },
'''
vt = vt.replace("export const RELEASES: ReleaseEntry[] = [\n", NEW_ENTRY, 1)
(R / "src/lib/version.ts").write_text(vt, encoding="utf-8")
print("version.ts OK")

# ------------------------------------------------------------
# 2. package.json
# ------------------------------------------------------------
pj = json.loads((R / "package.json").read_text(encoding="utf-8"))
pj["version"] = VER
(R / "package.json").write_text(json.dumps(pj, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print("package.json OK")

# ------------------------------------------------------------
# 3. scripts/ver.json
# ------------------------------------------------------------
vp = R / "scripts/ver.json"
vj = json.loads(vp.read_text(encoding="utf-8"))
vj["version"].update({
    "current": VER, "label": f"v{VER} — {NAME}",
    "releaseName": NAME, "releasedAt": DATE,
})
vj["docs"]["nextRelease"] = "v2.3.0 (Unreleased — antrean ROADMAP-99)"
vj["releases"]["total"] = 51
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
    "[![Versi Saat Ini](https://img.shields.io/badge/Versi_Saat_Ini-v2.2.1_Fokus_Beranda-059669?style=for-the-badge&logo=semanticweb&logoColor=white)](#v2-2-1)",
    "[![Versi Saat Ini](https://img.shields.io/badge/Versi_Saat_Ini-v2.2.2_Tanpa_Jejak-059669?style=for-the-badge&logo=semanticweb&logoColor=white)](#v2-2-2)")
ct = ct.replace(
    "![Total Rilis](https://img.shields.io/badge/Total_Rilis-50_(0.1.0_%E2%86%92_2.2.1)-059669?style=flat-square)",
    "![Total Rilis](https://img.shields.io/badge/Total_Rilis-51_(0.1.0_%E2%86%92_2.2.2)-059669?style=flat-square)")
ct = ct.replace(
    "![Entri Worklog](https://img.shields.io/badge/Entri_Worklog-56_ber_versi-059669?style=flat-square)",
    "![Entri Worklog](https://img.shields.io/badge/Entri_Worklog-57_ber_versi-059669?style=flat-square)")
ct = ct.replace(
    "![Rilis Berikutnya](https://img.shields.io/badge/Rilis_Berikutnya-v2.2.1_(Unreleased)-f59e0b?style=flat-square)",
    "![Rilis Berikutnya](https://img.shields.io/badge/Rilis_Berikutnya-v2.3.0_(Unreleased)-f59e0b?style=flat-square)")
ct = ct.replace(
    '**📆 `arofahajj.com` → sekarang berjalan di `v2.2.1 — "Fokus Beranda"`**',
    f'**📆 `arofahajj.com` → sekarang berjalan di `v{VER} — "{NAME}"`**')
ct = ct.replace("## 🪜 Tabel Lengkap 50 Rilis", "## 🪜 Tabel Lengkap 51 Rilis")
ct = ct.replace("[Tabel Lengkap 50 Rilis]", "[Tabel Lengkap 51 Rilis]")
ct = ct.replace(
    "| 50 | **v2.2.1** ⭐ | **2026-10-30** | patch | **Fokus Beranda** | Task 52 | **🟢 AKTIF — versi berjalan** |",
    "| 51 | **v2.2.2** ⭐ | **2026-10-30** | patch | **Tanpa Jejak** | Task 53 | **🟢 AKTIF — versi berjalan** |\n"
    "| 50 | v2.2.1 | 2026-10-30 | patch | Fokus Beranda | Task 52 | ✅ Rilis |")

ENTRY = '''<a id="v2-2-2"></a>

## [2.2.2] — 2026-10-30 — 🧼 "Tanpa Jejak" (Task 53)

**PATCH pembersihan identitas total** (perintah owner: *"kantor kami yang memuat [nama lama] tolong hapus semua jangan sampai ada yang tertinggal sayang malu aku mau brandingkan"*): seluruh jejak brand lama — foto fisik ber-logo lama, keyword SEO, metadata, alt teks, hingga catatan historis — dihapus atau dinetralkan.

### 🗑️ Removed
- **6 foto kantor ber-logo brand lama**: `public/kantor/` (5 file) di-`git rm` seluruhnya + 1 foto yatim `public/kantor-bandung.jpg`; nol file foto ber-jejak tersisa di repo.
- **Keyword SEO brand lama** dari metadata `layout.tsx` (sebelumnya dipertahankan sebagai istilah vertikal — kini dihapus penuh atas instruksi owner).
- **5 URL foto kantor** dari JSON-LD Organization `image` (beranda) → diganti og-arofahajj.png; 3 URL og:image halaman kontak idem.

### ✨ Changed
- **/kontak**: 2 kartu kantor kini memakai **band brand emas-di-kiswah** (`oklch(0.205 0.03 78)` + ikon MapPin/Building2 amber + glow lembut) — identitas murni Arofahajj, kontras pola owner terjaga.
- **/tentang-kami**: galeri 3 foto diganti **3 kartu info** (Kantor Pusat Tasikmalaya · Jangkauan Bandung—Jakarta · Online ke 38 Provinsi) dengan ikon amber — sinyal E-E-A-T bertahan tanpa foto lama.

### 🧹 Scrubbed
- `scripts/scrub-oldbrand.py` (idempoten, token dinamis — file tool sendiri tak menyimpan literal): menetralkan seluruh token brand lama di catatan historis `version.ts` (3 highlight), `CHANGELOG.md`, `WORKLOG.md`, `scripts/ver.json`, 3 skrip migrasi legacy, 2 dokumen upload owner — makna riwayat tetap terbaca, nama lama nol muncul.
- Verifikasi repo-wide `rg` = **0 jejak** (semua varian ejaan: gabung, ber-spasi, ber-hyphen, camel, kapital, dan pasangan inisial logo lama).

### ✅ Verified
- **Database discan penuh**: 79 kolom teks/JSON di 15 tabel via `postgres --single` (pola concat, tanpa literal di file SQL) = **0 baris** berisi jejak.
- `bunx tsc --noEmit` bersih di `src/` · beranda, /kontak, /tentang-kami HTTP 200 · nol path foto kantor di HTML (sisa match hanya anchor ID berbahasa Indonesia yang sah).
- Bukti visual: `download/verify-kontak-band-brand.png` · `download/verify-tentang-kami-cards.png`.

### 📚 Docs
- `scripts/ver.json` (blok versi + releases.total 51 + nextRelease v2.3.0) · entri ini + ladder #51 · WORKLOG Task 53 · STATE.md · README badge.

---

'''
ct = ct.replace('<a id="v2-2-1"></a>', ENTRY + '<a id="v2-2-1"></a>', 1)
(R / "CHANGELOG.md").write_text(ct, encoding="utf-8")
print("CHANGELOG.md OK")

# ------------------------------------------------------------
# 5. WORKLOG.md — entri Task 53 di akhir file
# ------------------------------------------------------------
wt = (R / "WORKLOG.md").read_text(encoding="utf-8")
WENTRY = '''

---
Task ID: 53
Agent: Z.ai Code (main agent — Full-Stack Architect mode)
Task: Hapus total seluruh jejak brand lama ("kantor kami yang memuat [nama lama] tolong hapus semua jangan sampai ada yang tertinggal sayang malu aku mau brandingkan") — foto, keyword, metadata, catatan historis, database. 🏷️ Rilis v2.2.2 "Tanpa Jejak" (PATCH).

Work Log:
- Inventarisasi 3 jalur: foto kantor ber-logo lama (5 di public/kantor/ + 1 yatim kantor-bandung.jpg), string nama lama (semua varian ejaan + pasangan inisial logo lama), dan konten DB
- /kontak: 2 kartu kantor diganti band brand emas-di-kiswah oklch(0.205 0.03 78) + ikon amber + glow — tanpa foto lama; og:image JSON-LD → og-arofahajj.png
- /tentang-kami: galeri 3 foto → 3 kartu info ikon (Tasikmalaya · Bandung—Jakarta · 38 provinsi); import Camera→Building2, Image dilepas
- layout.tsx: keyword SEO brand lama (warisan keputusan Task 48) dihapus penuh atas instruksi owner
- seo-jsonld.tsx: Organization image → logo.png saja
- scripts/scrub-oldbrand.py (idempoten, token dinamis agar tool sendiri bebas literal): netralkan token lama → "brand lama/BrandLama/logo lama" di version.ts (3 highlight historis), CHANGELOG, WORKLOG, ver.json, 3 skrip migrasi legacy (release-v201, docs-rebrand-v2, rebrand-final), 2 dokumen upload — scanner awal menemukan jejak tersembunyi yang lolos grep pertama; 2 varian ejaan (modal-awal & ber-hyphen) tertangkap di gelombang ke-2
- DB: Prisma 8 tanpa psql → pola postgres --single (pg_ctl stop fast → scan → start); NOTICE ternyata disupresi standalone backend → laporan via SELECT count per kolom; 79 kolom teks/JSON × 15 tabel = 0 baris berjejak; dev server diverifikasi 200 usai tiap siklus restart
- Verifikasi: rg repo-wide = 0; tsc bersih; 3 halaman 200; sisa match HTML hanya anchor ID "kantor-*" berbahasa Indonesia yang sah; bukti visual 2 PNG (kontak band brand, tentang-kami kartu info)
- Versioning 8 titik: version.ts 2.2.2 + RELEASES 51 entri (taskId 53); package.json; ver.json (total 51, nextRelease v2.3.0); CHANGELOG (badge ×4 + entri + ladder #51); STATE.md; README badge; WORKLOG (entri ini); prisma contract tanpa perubahan skema (db:verify hijau)

Stage Summary:
- v2.2.2 "Tanpa Jejak" rilis: nol jejak brand lama di file produk, metadata, catatan historis & database — halaman kantor kini tampil dengan band & kartu identitas Arofahajj murni; owner siap branding tanpa malu
'''
(R / "WORKLOG.md").write_text(wt.rstrip("\n") + WENTRY, encoding="utf-8")
print("WORKLOG.md OK")

# ------------------------------------------------------------
# 6. STATE.md
# ------------------------------------------------------------
st = (R / "STATE.md").read_text(encoding="utf-8")
st = st.replace(
    '| Versi aplikasi | v2.2.1 "Fokus Beranda" (`src/lib/version.ts`, `package.json`) |',
    f'| Versi aplikasi | v{VER} "{NAME}" (`src/lib/version.ts`, `package.json`) |')
(R / "STATE.md").write_text(st, encoding="utf-8")
print("STATE.md OK")

# ------------------------------------------------------------
# 7. README.md — badge & baris versi
# ------------------------------------------------------------
rt = (R / "README.md").read_text(encoding="utf-8")
rt = rt.replace(
    "[![Versi](https://img.shields.io/badge/Versi-aplikasi_2_2_1-059669?style=flat-square)](./src/lib/version.ts)",
    f"[![Versi](https://img.shields.io/badge/Versi-aplikasi_2_2_2-059669?style=flat-square)](./src/lib/version.ts)")
rt = rt.replace(
    '- **Versi aplikasi:** 2.2.1 ("Fokus Beranda" — lihat [CHANGELOG](./CHANGELOG.md)), didefinisikan di <code>src/lib/version.ts</code> dan <code>package.json</code>.',
    f'- **Versi aplikasi:** {VER} ("{NAME}" — lihat [CHANGELOG](./CHANGELOG.md)), didefinisikan di <code>src/lib/version.ts</code> dan <code>package.json</code>.')
(R / "README.md").write_text(rt, encoding="utf-8")
print("README.md OK")

print("\nALL DONE — v2.2.2 'Tanpa Jejak'")
