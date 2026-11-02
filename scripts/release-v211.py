#!/usr/bin/env python3
# ============================================================
# Task 50 — Rilis v2.1.1 "Kilau Emas" (PATCH)
# Fix "gold footer dark": 18 kelas arbitrary Tailwind ber-spasi
# (permukaan kiswah transparan) + 9 residu emerald → emas.
# Sinkronisasi 8 titik versioning + dokumentasi.
# ============================================================
import json
import pathlib

R = pathlib.Path("/home/z/my-project")
VER = "2.1.1"
DATE = "2026-10-30"
NAME = "Kilau Emas"

# ------------------------------------------------------------
# 1. src/lib/version.ts
# ------------------------------------------------------------
vt = (R / "src/lib/version.ts").read_text(encoding="utf-8")
vt = vt.replace('export const APP_VERSION = "2.1.0";', f'export const APP_VERSION = "{VER}";')
vt = vt.replace('export const RELEASE_NAME = "Kiswah & Emas";', f'export const RELEASE_NAME = "{NAME}";')
vt = vt.replace(" * Riwayat lengkap 47 rilis — urut TERBARU lebih dulu.",
                " * Riwayat lengkap 48 rilis — urut TERBARU lebih dulu.")
NEW_ENTRY = '''export const RELEASES: ReleaseEntry[] = [
  {
    version: "2.1.1",
    date: "2026-10-30",
    type: "patch",
    name: "Kilau Emas",
    taskId: "50",
    highlights: [
      "Fix laporan owner \\u201ctolong pakai gold footer dark\\u201d: 18 kelas arbitrary Tailwind ber-SPASI mentah (bg-[oklch(0.175 0.025 78)] dkk.) tak pernah di-generate \\u2192 permukaan kiswah footer & 10+ section transparan, teks emas pucat di kanvas gading; diperbaiki spasi\\u2192underscore (scripts/fix-gold-footer-dark.py) + cold restart dev (cache scanner Tailwind basi)",
      "9 residu rgba() emerald yang lolos pemetaan v2.1.0 dipetakan ke keluarga emas \\u2014 border-beam footer yang semula campuran hijau+emas kini dua nada emas murni (perunggu\\u2192terang), glow summit deck, shadow CTA & pill bahasa, 4 badge admin \\u2014 nol warna tumpang tindih",
      "Audit kontras footer TERUKUR 14/14 PASS WCAG 2.2 (scripts/contrast-footer-audit.py): teks gading 14.8:1, heading emas 13.2:1, CTA tinta-di-emas 7.0:1 \\u2014 pola owner terjaga: kiswah gelap \\u2192 teks terang, CTA terang \\u2192 tinta gelap",
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
vj["docs"]["nextRelease"] = "v2.2.0 (Unreleased — antrean ROADMAP-99)"
vj["releases"]["total"] = 48
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
    "[![Versi Saat Ini](https://img.shields.io/badge/Versi_Saat_Ini-v2.1.0_Kiswah_%26_Emas-059669?style=for-the-badge&logo=semanticweb&logoColor=white)](#v2-1-0)",
    "[![Versi Saat Ini](https://img.shields.io/badge/Versi_Saat_Ini-v2.1.1_Kilau_Emas-059669?style=for-the-badge&logo=semanticweb&logoColor=white)](#v2-1-1)")
ct = ct.replace(
    "![Total Rilis](https://img.shields.io/badge/Total_Rilis-47_(0.1.0_%E2%86%92_2.1.0)-059669?style=flat-square)",
    "![Total Rilis](https://img.shields.io/badge/Total_Rilis-48_(0.1.0_%E2%86%92_2.1.1)-059669?style=flat-square)")
ct = ct.replace(
    "![Entri Worklog](https://img.shields.io/badge/Entri_Worklog-53_ber_versi-059669?style=flat-square)",
    "![Entri Worklog](https://img.shields.io/badge/Entri_Worklog-54_ber_versi-059669?style=flat-square)")
ct = ct.replace(
    '**📆 `arofahajj.com` → sekarang berjalan di `v2.1.0 — "Kiswah & Emas"`**',
    f'**📆 `arofahajj.com` → sekarang berjalan di `v{VER} — "{NAME}"`**')
ct = ct.replace("## 🪜 Tabel Lengkap 47 Rilis", "## 🪜 Tabel Lengkap 48 Rilis")
ct = ct.replace("[Tabel Lengkap 47 Rilis]", "[Tabel Lengkap 48 Rilis]")
ct = ct.replace(
    "| 47 | **v2.1.0** ⭐ | **2026-10-30** | minor | **Kiswah & Emas** | Task 49 | **🟢 AKTIF — versi berjalan** |",
    "| 48 | **v2.1.1** ⭐ | **2026-10-30** | patch | **Kilau Emas** | Task 50 | **🟢 AKTIF — versi berjalan** |\n"
    "| 47 | v2.1.0 | 2026-10-30 | minor | Kiswah & Emas | Task 49 | ✅ Rilis |")

ENTRY = '''<a id="v2-1-1"></a>

## [2.1.1] — 2026-10-30 — ✨ "Kilau Emas" (Task 50)

**PATCH fix "gold footer dark"** (perintah owner: *"tolong pakai gold footer dark sayang karena selain itu tidak bagus"*): footer kini murni emas-di-atas-kiswah — permukaan gelap yang hilang dipulihkan dan seluruh residu hijau dibersihkan dari footer.

### 🐛 Fixed
- **18 kelas arbitrary Tailwind ber-SPASI mentah di 14 file** (akar masalah): nilai seperti `bg-[oklch(0.175 0.025 78)]` mengandung spasi sehingga Tailwind tidak pernah men-generate class-nya → permukaan kiswah **footer + 10+ section** (katalog v2/v3, testimoni ×2, kanal-resmi, roadmap wizard, kbli, layanan, virtual-office, email-course, comparison, admin-deploy) transparan; di mode terang teks emas jadi pucat di atas kanvas gading (persis "tidak bagus" yang dilihat owner). Fix: spasi → underscore (`scripts/fix-gold-footer-dark.py`) + cold restart dev server (cache scanner Tailwind yang basi menyamarkan fix).
- **9 residu `rgba()` emerald** yang lolos pemetaan string-based v2.1.0 → keluarga emas: border-beam conic summit deck (semula campuran hijau 0.75 + emas 0.65 — persis "warna tumpang tindih" yang dilarang owner) kini dua nada emas murni `rgba(217,119,6,.75)→rgba(251,191,36,.65)`; radial glow summit; shadow beam-host & CTA pulse-ring; pill bahasa sovereign; 4 badge/inset/dot admin (cms, dashboard, editorial).

### ✅ Verified
- Audit kontras footer `scripts/contrast-footer-audit.py`: **14/14 PASS WCAG 2.2** — teks utama gading 14.79:1, deskripsi 8.65:1, legal 4.89:1, heading/link emas 13.16:1, ikon 11.37:1 (≥3.0 UI), CTA tinta-di-emas 7.02:1.
- Computed style browser: footer `lab(4.85%)` (kiswah) + teks `oklab(0.987)` (gading); katalog & virtual-office gradient via/to oklch ter-compile.
- Bukti visual: `download/footer-gold-dark-light.png` · `download/footer-gold-dark-light-top.png` · `download/verify-katalog-dark-surface.png` (sebelum: `download/audit-footer-before-light.png`).

### 📚 Docs
- `scripts/ver.json` (blok versi + releases.total 48 + nextRelease v2.2.0) · entri ini + ladder #48 · WORKLOG Task 50 · STATE.md · README badge.

---

'''
ct = ct.replace('<a id="v2-1-0"></a>', ENTRY + '<a id="v2-1-0"></a>', 1)
(R / "CHANGELOG.md").write_text(ct, encoding="utf-8")
print("CHANGELOG.md OK")

# ------------------------------------------------------------
# 5. WORKLOG.md — entri Task 50 di akhir file
# ------------------------------------------------------------
wt = (R / "WORKLOG.md").read_text(encoding="utf-8")
WENTRY = '''

---
Task ID: 50
Agent: Z.ai Code (main agent — Full-Stack Architect mode)
Task: Fix "gold footer dark" sesuai laporan owner ("tolong pakai gold footer dark sayang karena selain itu tidak bagus") — pulihkan permukaan kiswah footer & 10+ section yang transparan + bersihkan residu emerald dari footer. 🏷️ Rilis v2.1.1 "Kilau Emas" (PATCH).

Work Log:
- Diagnosis visual (agent-browser): footer mode terang tampak ivory pucat — teks emas nyaris tak terbaca; computed style `backgroundColor: rgba(0,0,0,0)`
- Akar masalah #1: 18 kelas arbitrary Tailwind ber-SPASI mentah di 14 file (`bg-[oklch(0.175 0.025 78)]`, `bg-[oklch(0.205 0.03 78)]`, `from/via/to-[oklch(0.23 0.03 78)]`) — spasi dilarang di nilai arbitrary (harus underscore) → class tak ter-generate → permukaan kiswah hilang
- Akar masalah #2: 9 residu `rgba(16,185,129,…)` emerald lolos pemetaan v2.1.0 — border-beam footer campuran hijau+emas (pelanggaran "tanpa warna tumpang tindih"), glow/shadow/pill footer + 4 badge admin
- scripts/fix-gold-footer-dark.py (idempoten): spasi→underscore 18 class + peta emerald→emas 9 titik; verifikasi sisa = 0
- Cold restart dev server (.next dihapus) — cache scanner Tailwind dev ternyata basi menyamarkan fix; setelah restart computed `lab(4.85%)` + teks gading
- Audit kontras numerik scripts/contrast-footer-audit.py: 14/14 PASS WCAG 2.2 (min 4.89:1 teks legal, 7.02:1 CTA, 11.37:1 ikon)
- Verifikasi lintas halaman: /katalog dark surface aktif, /virtual-office gradient via/to oklch ter-compile, console bersih; bukti visual 4 PNG di download/
- Versioning 8 titik: version.ts 2.1.1 "Kilau Emas" + RELEASES 48 entri (taskId 50); package.json; ver.json (total 48, nextRelease v2.2.0); CHANGELOG (badge ×4 + entri + ladder #48); STATE.md; README badge; WORKLOG (entri ini); prisma contract tanpa perubahan skema (db:verify hijau)

Stage Summary:
- v2.1.1 "Kilau Emas" rilis: footer murni gold-on-dark sesuai keinginan owner — kiswah gelap, heading emas, teks gading 14.8:1, beam dua nada emas; 10+ section gelap lain ikut pulih; nol residu hijau di footer
'''
(R / "WORKLOG.md").write_text(wt.rstrip("\n") + WENTRY, encoding="utf-8")
print("WORKLOG.md OK")

# ------------------------------------------------------------
# 6. STATE.md
# ------------------------------------------------------------
st = (R / "STATE.md").read_text(encoding="utf-8")
st = st.replace(
    '| Versi aplikasi | v2.1.0 "Kiswah & Emas" (`src/lib/version.ts`, `package.json`) |',
    f'| Versi aplikasi | v{VER} "{NAME}" (`src/lib/version.ts`, `package.json`) |')
(R / "STATE.md").write_text(st, encoding="utf-8")
print("STATE.md OK")

# ------------------------------------------------------------
# 7. README.md — badge & baris versi
# ------------------------------------------------------------
rt = (R / "README.md").read_text(encoding="utf-8")
rt = rt.replace(
    "[![Versi](https://img.shields.io/badge/Versi-aplikasi_2_1_0-059669?style=flat-square)](./src/lib/version.ts)",
    f"[![Versi](https://img.shields.io/badge/Versi-aplikasi_2_1_1-059669?style=flat-square)](./src/lib/version.ts)")
rt = rt.replace(
    '- **Versi aplikasi:** 2.1.0 ("Kiswah & Emas" — lihat [CHANGELOG](./CHANGELOG.md)), didefinisikan di <code>src/lib/version.ts</code> dan <code>package.json</code>.',
    f'- **Versi aplikasi:** {VER} ("{NAME}" — lihat [CHANGELOG](./CHANGELOG.md)), didefinisikan di <code>src/lib/version.ts</code> dan <code>package.json</code>.')
(R / "README.md").write_text(rt, encoding="utf-8")
print("README.md OK")

print("\nALL DONE — v2.1.1 'Kilau Emas'")
