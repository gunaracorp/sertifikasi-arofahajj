#!/usr/bin/env python3
# ============================================================
# Task 49 — Rilis v2.1.0 "Kiswah & Emas" (MINOR — overhaul visual)
# Sinkronisasi versioning + dokumentasi.
# ============================================================
import json
import pathlib

R = pathlib.Path("/home/z/my-project")
VER = "2.1.0"
DATE = "2026-10-30"
NAME = "Kiswah & Emas"

# 1. version.ts --------------------------------------------------
vt = (R / "src/lib/version.ts").read_text(encoding="utf-8")
vt = vt.replace('export const APP_VERSION = "2.0.1";', f'export const APP_VERSION = "{VER}";')
vt = vt.replace('export const RELEASE_NAME = "Pakai Nama Resmi";', f'export const RELEASE_NAME = "{NAME}";')
vt = vt.replace(" * Riwayat lengkap 46 rilis — urut TERBARU lebih dulu.",
                " * Riwayat lengkap 47 rilis — urut TERBARU lebih dulu.")
ENTRY = '''export const RELEASES: ReleaseEntry[] = [
  {
    version: "2.1.0",
    date: "2026-10-30",
    type: "minor",
    name: "Kiswah & Emas",
    taskId: "49",
    highlights: [
      "Rebranding warna menyeluruh sesuai logo asli (perintah owner: \\u201crebranding warna nya sesuaikan dengan logo kita\\u201d): palet \\u201cKiswah & Emas\\u201d diekstrak dari piksel logo (monokrom emas, hue 36\\u201342\\u00b0 HSL \\u2248 70\\u201385 OKLCH) \\u2014 kanvas gading hangat + tinta espresso (terang), kiswah hitam-hangat + emas terang (gelap); 996 pemetaan kelas emerald\\u2192amber di 76 file + geser rona OKLCH hijau\\u2192emas (termasuk sintaks underscore Tailwind 4)",
      "Aturan kontras owner dijamin TERUKUR 26/26 PASS (WCAG 2.2, skrip scripts/verify-contrast.py): pola gelap\\u2192teks terang & terang\\u2192teks gelap \\u2014 token --gold ADAPTIF (perunggu sebagai teks di kanvas terang 5.9:1, emas terang sebagai teks di kiswah 10.8:1), --gold-foreground ikut berpasangan (putih di atas perunggu 6.0:1, tinta di atas emas 9.8:1); hover tombol yang mencerahkan emas+putih digelapkan (amber-800 7:1)",
      "Identitas non-kode ikut: manifest theme_color #171208 + background gading \\u00b7 metadata themeColor \\u00b7 og-arofahajj.png di-render ulang berlatar kiswah \\u00b7 grafik admin & fallback fokus ke keluarga emas \\u2014 warna semantik fungsional (hijau LUNAS, merah batal, teal/lime kategori) sengaja dipertahankan agar makna tak tumpang tindih",
    ],
  },
'''
vt = vt.replace("export const RELEASES: ReleaseEntry[] = [\n", ENTRY, 1)
(R / "src/lib/version.ts").write_text(vt, encoding="utf-8")

# 2. package.json ------------------------------------------------
pj = json.loads((R / "package.json").read_text(encoding="utf-8"))
pj["version"] = VER
(R / "package.json").write_text(json.dumps(pj, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

# 3. ver.json ----------------------------------------------------
vp = R / "scripts/ver.json"
vj = json.loads(vp.read_text(encoding="utf-8"))
vj["version"].update({"current": VER, "label": f"v{VER} — {NAME}",
                      "releaseName": NAME, "releasedAt": DATE})
vj["docs"]["nextRelease"] = "v2.2.0 (Unreleased — antrean ROADMAP-99)"
vj["releases"]["total"] = 47
vj["releases"]["current"] = {"version": VER, "date": DATE, "type": "minor", "name": NAME}
vp.write_text(json.dumps(vj, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

# 4. CHANGELOG ---------------------------------------------------
ct = (R / "CHANGELOG.md").read_text(encoding="utf-8")
ct = ct.replace(
    "[![Versi Saat Ini](https://img.shields.io/badge/Versi_Saat_Ini-v2.0.1_Pakai_Nama_Resmi-059669?style=for-the-badge&logo=semanticweb&logoColor=white)](#v2-0-1)",
    "[![Versi Saat Ini](https://img.shields.io/badge/Versi_Saat_Ini-v2.1.0_Kiswah_%26_Emas-059669?style=for-the-badge&logo=semanticweb&logoColor=white)](#v2-1-0)")
ct = ct.replace(
    "![Total Rilis](https://img.shields.io/badge/Total_Rilis-46_(0.1.0_%E2%86%92_2.0.1)-059669?style=flat-square)",
    "![Total Rilis](https://img.shields.io/badge/Total_Rilis-47_(0.1.0_%E2%86%92_2.1.0)-059669?style=flat-square)")
ct = ct.replace(
    "![Entri Worklog](https://img.shields.io/badge/Entri_Worklog-52_ber_versi-059669?style=flat-square)",
    "![Entri Worklog](https://img.shields.io/badge/Entri_Worklog-53_ber_versi-059669?style=flat-square)")
ct = ct.replace(
    "![Rilis Berikutnya](https://img.shields.io/badge/Rilis_Berikutnya-v2.1.0_(Unreleased)-f59e0b?style=flat-square)",
    "![Rilis Berikutnya](https://img.shields.io/badge/Rilis_Berikutnya-v2.2.0_(Unreleased)-f59e0b?style=flat-square)")
ct = ct.replace(
    '**📆 `arofahajj.com` → sekarang berjalan di `v2.0.1 — "Pakai Nama Resmi"`**',
    f'**📆 `arofahajj.com` → sekarang berjalan di `v{VER} — "{NAME}"`**')
ct = ct.replace("## 🪜 Tabel Lengkap 46 Rilis", "## 🪜 Tabel Lengkap 47 Rilis")
ct = ct.replace("[Tabel Lengkap 46 Rilis]", "[Tabel Lengkap 47 Rilis]")
ct = ct.replace(
    "| 46 | **v2.0.1** ⭐ | **2026-10-30** | patch | **Pakai Nama Resmi** | Task 48 | **🟢 AKTIF — versi berjalan** |",
    "| 47 | **v2.1.0** ⭐ | **2026-10-30** | minor | **Kiswah & Emas** | Task 49 | **🟢 AKTIF — versi berjalan** |\n"
    "| 46 | v2.0.1 | 2026-10-30 | patch | Pakai Nama Resmi | Task 48 | ✅ Rilis |")

CENTRY = '''<a id="v2-1-0"></a>

## [2.1.0] — 2026-10-30 — 🕌 "Kiswah & Emas" (Task 49)

**MINOR visual overhaul** (perintah owner: *"bisakah kamu re branding warna nya sesuaikan dengan logo kita tapi jangan sampai ada warna yang tumpang tindih, jadi pola nya adalah ketika background gelap tulisan harus jelas terang begitupun sebaliknya"*): seluruh sistem warna situs diambil langsung dari piksel logo asli Arofa Hajj — hasil ekstraksi `scripts/logo-palette.py`: logo 100% keluarga emas (hue 36–42° HSL), tanpa hijau. Pasangan ikonik yang dipilih setia pada objek logo: **Kiswah** (kain hitam-hangat Kaaba) × **Emas** (benang emas logo).

### 🎨 Changed
- **Token desain (`globals.css`)** — mode terang "Gading": kanvas `oklch(0.985 0.008 85)` + tinta espresso `oklch(0.24 0.025 70)` + primary perunggu emas tua `oklch(0.49 0.09 70)` (teks tombol putih gading **6.12:1**); mode gelap "Kiswah": kanvas `oklch(0.17 0.012 75)` + teks gading `oklch(0.965 0.012 85)` + primary emas terang `oklch(0.82 0.14 80)` bertinta tinta (**10.26:1**).
- **`--gold` ADAPTIF** (kunci pola owner tanpa tumpang tindih): mode terang = perunggu `oklch(0.50 0.105 70)` — aman sebagai **teks** highlight/harga di kanvas gading (**5.88:1**); mode gelap = emas terang `oklch(0.82 0.16 80)` — aman sebagai **teks** di kiswah (**10.78:1**). `--gold-foreground` ikut adaptif: putih di atas perunggu (**5.97:1**), tinta di atas emas (**9.80:1**).
- **996 pemetaan kelas emerald→amber di 76 file** (`scripts/brand-gold-sweep.py`) — digeser +1 tingkat gelap agar SETIAP rasio kontras membaik dibanding sebelumnya (mis. teks putih di atas tombol: emerald-600 3.76 → amber-700 4.52:1 ✓AA); rona OKLCH hijau 125–170° → emas 78° (mendukung sintaks underscore Tailwind 4); grafik admin `#34d399/#2dd4bf/#a3e635` → keluarga emas/perunggu.
- **Hover anti-regresi**: tombol admin `bg-amber-700 text-white hover:bg-amber-500` (putih di emas terang ≈2.6:1 saat hover) → `hover:bg-amber-800` (**7:1**).

### ✅ Accessibility (terukur, bukan perkiraan)
- **26/26 pasangan PASS** WCAG 2.2 — verifikator `scripts/verify-contrast.py` (konversi OKLCH→sRGB→rasio): teks utama 15.8–17.3:1, teks sekunder 6.3–7.7:1, tombol 6.1–10.3:1, badge emas 6.0–9.8:1, ring fokus 3.6–10.8:1.
- Warna **semantik fungsional sengaja dipertahankan** (hijau LUNAS/sukses, merah batal, teal/lime pembeda kategori admin) — makna status tidak ikut berubah jadi emas agar tidak tumpang tindih makna.

### 🖼️ Assets & metadata
- `public/og-arofahajj.png` di-render ulang berlatar kiswah hangat `#171208` (sebelumnya emerald-charcoal); `manifest.json` theme_color `#171208` + background `#faf7ef`; `themeColor` layout `#171208`; fallback fokus CSS `#b45309`.

### 📚 Docs
- Badge & ladder CHANGELOG #47 · entri ini · WORKLOG Task 49 · `STATE.md`/`README.md` badge versi · `scripts/ver.json` (total 47, nextRelease v2.2.0).

---

'''
ct = ct.replace('<a id="v2-0-1"></a>', CENTRY + '<a id="v2-0-1"></a>', 1)
(R / "CHANGELOG.md").write_text(ct, encoding="utf-8")

# 5. WORKLOG -----------------------------------------------------
wt = (R / "WORKLOG.md").read_text(encoding="utf-8")
WENTRY = '''

---
Task ID: 49
Agent: Z.ai Code (main agent — Full-Stack Architect mode)
Task: Rebranding warna situs sesuai logo asli + aturan kontras owner: "jangan sampai ada warna yang tumpang tindih — background gelap tulisan jelas terang, begitupun sebaliknya". 🏷️ Rilis v2.1.0 "Kiswah & Emas" (MINOR).

Work Log:
- Ekstraksi piksel logo asli (scripts/logo-palette.py): 12 klaster dominan 100% emas (hue 36–42° HSL, #A97625→#EAC367) — TIDAK ada hijau; keputusan desain: pasangan ikonik Kaaba = Kiswah hitam-hangat × Emas
- Token globals.css ditulis ulang dua mode (terang "Gading" / gelap "Kiswah"); --gold ADAPTIF per mode (perunggu↔emas terang) menyelesaikan konflik fisika satu-token (teks-aman vs bg-aman) + --gold-foreground berpasangan adaptif
- Sweep scripts/brand-gold-sweep.py: 996 kelas emerald→amber di 76 file (geser +1 tingkat gelap = kontras selalu membaik, terukur), rona OKLCH hijau→78° (termasuk sintaks underscore Tailwind 4 yang lolos putaran pertama), hex grafik admin + fallback fokus
- Perbaikan pairing nyata: bg-gold text-amber-950→gold-foreground; hover amber-500+putih→amber-800; audit bg-amber-*(300–500)+text-white = nol
- Verifikasi terukur scripts/verify-contrast.py (OKLCH→sRGB→WCAG): 26/26 PASS kedua mode (teks utama 15.8–17.3:1, tombol 6.1–10.3:1, badge emas 6.0–9.8:1); tsc src bersih; eslint nol error
- Visual E2E: screenshot terang+gelap 1440px + footer Mahkota dark — kanvas/tombol/badge/headline semua sesuai pola owner; 7 halaman kunci 200
- Aset: og-arofahajj.png re-render latar kiswah; manifest theme_color #171208 / bg #faf7ef; themeColor layout; warna semantik fungsional (hijau LUNAS, merah batal, teal/lime kategori) dipertahankan
- Versioning: version.ts 2.1.0 "Kiswah & Emas" + RELEASES 47 entri (taskId 49); package.json; ver.json; CHANGELOG (badge ×5 + entri + ladder #47); STATE.md; README; WORKLOG (entri ini)

Stage Summary:
- v2.1.0 "Kiswah & Emas" rilis: situs kini memakai satu-satunya warna yang dimiliki logo — emas — di atas kiswah/gading dengan pola kontras owner TERUKUR PASS 26/26; nol warna tumpang tindih (pasangan adaptif + audit pairing nyata); bukti visual download/verify-gold-{light,dark,footer-dark}.png
'''
(R / "WORKLOG.md").write_text(wt.rstrip("\n") + WENTRY, encoding="utf-8")

# 6. STATE.md ----------------------------------------------------
st = (R / "STATE.md").read_text(encoding="utf-8")
st = st.replace(
    f'| Versi aplikasi | v2.0.1 "Pakai Nama Resmi" (`src/lib/version.ts`, `package.json`) |',
    f'| Versi aplikasi | v{VER} "{NAME}" (`src/lib/version.ts`, `package.json`) |')
(R / "STATE.md").write_text(st, encoding="utf-8")

# 7. README ------------------------------------------------------
rt = (R / "README.md").read_text(encoding="utf-8")
rt = rt.replace(
    "[![Versi](https://img.shields.io/badge/Versi-aplikasi_2.0.1-059669?style=flat-square)](./src/lib/version.ts)",
    f"[![Versi](https://img.shields.io/badge/Versi-aplikasi_{VER.replace('.', '_')}-059669?style=flat-square)](./src/lib/version.ts)")
rt = rt.replace(
    '- **Versi aplikasi:** 2.0.1 ("Pakai Nama Resmi" — lihat [CHANGELOG](./CHANGELOG.md)), didefinisikan di <code>src/lib/version.ts</code> dan <code>package.json</code>.',
    f'- **Versi aplikasi:** {VER} ("{NAME}" — lihat [CHANGELOG](./CHANGELOG.md)), didefinisikan di <code>src/lib/version.ts</code> dan <code>package.json</code>.')
(R / "README.md").write_text(rt, encoding="utf-8")

print("v2.1.0 release sync DONE")
