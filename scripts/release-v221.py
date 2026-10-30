#!/usr/bin/env python3
# ============================================================
# Task 52 — Rilis v2.2.1 "Fokus Beranda" (PATCH)
# Hapus section "Our Offices" (OfficeGallery) dari beranda
# sesuai permintaan owner. Sinkronisasi 8 titik versioning.
# ============================================================
import json
import pathlib
import re

R = pathlib.Path("/home/z/my-project")
VER = "2.2.1"
DATE = "2026-10-30"
NAME = "Fokus Beranda"

# ------------------------------------------------------------
# 1. src/lib/version.ts
# ------------------------------------------------------------
vt = (R / "src/lib/version.ts").read_text(encoding="utf-8")
vt = vt.replace('export const APP_VERSION = "2.2.0";', f'export const APP_VERSION = "{VER}";')
vt = vt.replace('export const RELEASE_NAME = "Revaluasi Harga";', f'export const RELEASE_NAME = "{NAME}";')
vt = re.sub(r" \* Riwayat lengkap \d+ rilis — urut TERBARU lebih dulu\.",
            " * Riwayat lengkap 50 rilis — urut TERBARU lebih dulu.", vt)
NEW_ENTRY = '''export const RELEASES: ReleaseEntry[] = [
  {
    version: "2.2.1",
    date: "2026-10-30",
    type: "patch",
    name: "Fokus Beranda",
    taskId: "52",
    highlights: [
      "Hapus section \\u201cOur Offices\\u201d (galeri 5 foto kantor Jakarta SCBD & Bandung) dari beranda sesuai permintaan owner \\u2014 komponen OfficeGallery + import-nya dilepas total dari page.tsx, nol referensi tersisa",
      "Bukti E-E-A-T kantor TETAP HIDUP: foto /kantor/* dipertahankan & tetap tampil di /kontak dan /tentang-kami + JSON-LD Organization image; alamat kantor pusat Tasikmalaya tetap utuh di footer & halaman kontak",
      "Beranda makin fokus pada konversi layanan \\u2014 alur WhyUs \\u2192 Process kini menyambung langsung tanpa jeda galeri",
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
vj["releases"]["total"] = 50
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
    "[![Versi Saat Ini](https://img.shields.io/badge/Versi_Saat_Ini-v2.2.0_Revaluasi_Harga-059669?style=for-the-badge&logo=semanticweb&logoColor=white)](#v2-2-0)",
    "[![Versi Saat Ini](https://img.shields.io/badge/Versi_Saat_Ini-v2.2.1_Fokus_Beranda-059669?style=for-the-badge&logo=semanticweb&logoColor=white)](#v2-2-1)")
ct = ct.replace(
    "![Total Rilis](https://img.shields.io/badge/Total_Rilis-49_(0.1.0_%E2%86%92_2.2.0)-059669?style=flat-square)",
    "![Total Rilis](https://img.shields.io/badge/Total_Rilis-50_(0.1.0_%E2%86%92_2.2.1)-059669?style=flat-square)")
ct = ct.replace(
    "![Entri Worklog](https://img.shields.io/badge/Entri_Worklog-55_ber_versi-059669?style=flat-square)",
    "![Entri Worklog](https://img.shields.io/badge/Entri_Worklog-56_ber_versi-059669?style=flat-square)")
ct = ct.replace(
    "![Rilis Berikutnya](https://img.shields.io/badge/Rilis_Berikutnya-v2.2.0_(Unreleased)-f59e0b?style=flat-square)",
    "![Rilis Berikutnya](https://img.shields.io/badge/Rilis_Berikutnya-v2.3.0_(Unreleased)-f59e0b?style=flat-square)")
ct = ct.replace(
    '**📆 `arofahajj.com` → sekarang berjalan di `v2.2.0 — "Revaluasi Harga"`**',
    f'**📆 `arofahajj.com` → sekarang berjalan di `v{VER} — "{NAME}"`**')
ct = ct.replace("## 🪜 Tabel Lengkap 49 Rilis", "## 🪜 Tabel Lengkap 50 Rilis")
ct = ct.replace("[Tabel Lengkap 49 Rilis]", "[Tabel Lengkap 50 Rilis]")
ct = ct.replace(
    "| 49 | **v2.2.0** ⭐ | **2026-10-30** | minor | **Revaluasi Harga** | Task 51 | **🟢 AKTIF — versi berjalan** |",
    "| 50 | **v2.2.1** ⭐ | **2026-10-30** | patch | **Fokus Beranda** | Task 52 | **🟢 AKTIF — versi berjalan** |\n"
    "| 49 | v2.2.0 | 2026-10-30 | minor | Revaluasi Harga | Task 51 | ✅ Rilis |")

ENTRY = '''<a id="v2-2-1"></a>

## [2.2.1] — 2026-10-30 — 🧹 "Fokus Beranda" (Task 52)

**PATCH perapian beranda** (perintah owner: *"tolong hapus ini sayang"* — disertai salinan section "Our Offices"): galeri foto kantor dilepas dari beranda agar halaman makin fokus pada konversi layanan.

### 🗑️ Removed
- **Section "Our Offices" / "Kantor Resmi Kami" dari beranda**: komponen `src/components/landing/office-gallery.tsx` (galeri 5 foto — resepsionis, branding wall, signage Jakarta SCBD, lobi & fasade Bandung) dihapus via `git rm`; import + pemakaian `<OfficeGallery />` dilepas dari `src/app/page.tsx`; verifikasi `rg` = nol referensi tersisa.
- Alur beranda kini WhyUs → Process menyambung langsung; urutan section lain tidak berubah.

### ✅ Preserved
- **Bukti E-E-A-T kantor tidak hilang dari produk**: foto `/kantor/*.jpg` tetap di repo & tampil di `/kontak` (galeri kantor + og:image) dan `/tentang-kami` (profil perusahaan); JSON-LD Organization `image` beranda tetap memuat 5 foto kantor sebagai metadata; alamat kantor pusat Andalusia Garden, Mangkubumi, Tasikmalaya tetap utuh di footer, halaman kontak & seluruh dokumen legal.

### ✅ Verified
- `bunx tsc --noEmit`: nol error di `src/` (sisa temuan hanya dari folder legacy non-aplikasi `skills/`, `upload/` — pra-eksisting).
- Beranda HTTP 200; teks "Our Offices" / "Kantor Resmi Kami" nol kemunculan di HTML (satu-satunya string `kantor-resepsionis` tersisa adalah JSON-LD yang memang disengaja).

### 📚 Docs
- `scripts/ver.json` (blok versi + releases.total 50 + nextRelease v2.3.0) · entri ini + ladder #50 · WORKLOG Task 52 · STATE.md · README badge.

---

'''
ct = ct.replace('<a id="v2-2-0"></a>', ENTRY + '<a id="v2-2-0"></a>', 1)
(R / "CHANGELOG.md").write_text(ct, encoding="utf-8")
print("CHANGELOG.md OK")

# ------------------------------------------------------------
# 5. WORKLOG.md — entri Task 52 di akhir file
# ------------------------------------------------------------
wt = (R / "WORKLOG.md").read_text(encoding="utf-8")
WENTRY = '''

---
Task ID: 52
Agent: Z.ai Code (main agent — Full-Stack Architect mode)
Task: Hapus section "Our Offices" dari beranda (perintah owner: "tolong hapus ini sayang" — disertai salinan section). 🏷️ Rilis v2.2.1 "Fokus Beranda" (PATCH).

Work Log:
- Pelacakan sumber: teks yang ditempel owner hidup di `src/components/landing/office-gallery.tsx` (section id="kantor", komponen OfficeGallery) — satu-satunya pemakaian di `src/app/page.tsx` (import line 18 + render line 83)
- Audit dampak sebelum hapus: foto `/kantor/*.jpg` TERNYATA juga dipakai `/kontak` (galeri + og:image) dan `/tentang-kami` (profil) → file foto dipertahankan; JSON-LD Organization `image` di `seo-jsonld.tsx` juga tetap (metadata, bukan tampilan galeri)
- Eksekusi: MultiEdit page.tsx (hapus import + `<OfficeGallery />`; alur WhyUs → Process langsung) + `git rm office-gallery.tsx`; verifikasi rg "OfficeGallery|office-gallery" = nol referensi
- Verifikasi: `bunx tsc --noEmit` bersih di src/ (sisa temuan pra-eksisting hanya di folder legacy skills/ & upload/); beranda HTTP 200; "Our Offices"/"Kantor Resmi Kami" nol kemunculan di HTML (string `kantor-resepsionis` tersisa = JSON-LD yang disengaja)
- Versioning 8 titik: version.ts 2.2.1 "Fokus Beranda" + RELEASES 50 entri (taskId 52); package.json; ver.json (total 50, nextRelease v2.3.0); CHANGELOG (badge ×4 + entri kategori Removed + ladder #50); STATE.md; README badge; WORKLOG (entri ini); prisma contract tanpa perubahan skema (db:verify hijau)

Stage Summary:
- v2.2.1 "Fokus Beranda" rilis: galeri kantor dilepas dari beranda sesuai keinginan owner; bukti kantor fisik tetap hidup di /kontak, /tentang-kami & JSON-LD; beranda makin fokus konversi
'''
(R / "WORKLOG.md").write_text(wt.rstrip("\n") + WENTRY, encoding="utf-8")
print("WORKLOG.md OK")

# ------------------------------------------------------------
# 6. STATE.md
# ------------------------------------------------------------
st = (R / "STATE.md").read_text(encoding="utf-8")
st = st.replace(
    '| Versi aplikasi | v2.2.0 "Revaluasi Harga" (`src/lib/version.ts`, `package.json`) |',
    f'| Versi aplikasi | v{VER} "{NAME}" (`src/lib/version.ts`, `package.json`) |')
(R / "STATE.md").write_text(st, encoding="utf-8")
print("STATE.md OK")

# ------------------------------------------------------------
# 7. README.md — badge & baris versi
# ------------------------------------------------------------
rt = (R / "README.md").read_text(encoding="utf-8")
rt = rt.replace(
    "[![Versi](https://img.shields.io/badge/Versi-aplikasi_2_2_0-059669?style=flat-square)](./src/lib/version.ts)",
    f"[![Versi](https://img.shields.io/badge/Versi-aplikasi_2_2_1-059669?style=flat-square)](./src/lib/version.ts)")
rt = rt.replace(
    '- **Versi aplikasi:** 2.2.0 ("Revaluasi Harga" — lihat [CHANGELOG](./CHANGELOG.md)), didefinisikan di <code>src/lib/version.ts</code> dan <code>package.json</code>.',
    f'- **Versi aplikasi:** {VER} ("{NAME}" — lihat [CHANGELOG](./CHANGELOG.md)), didefinisikan di <code>src/lib/version.ts</code> dan <code>package.json</code>.')
(R / "README.md").write_text(rt, encoding="utf-8")
print("README.md OK")

print("\nALL DONE — v2.2.1 'Fokus Beranda'")
