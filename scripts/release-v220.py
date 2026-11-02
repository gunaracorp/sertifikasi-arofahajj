#!/usr/bin/env python3
# ============================================================
# Task 51 — Rilis v2.2.0 "Revaluasi Harga" (MINOR)
# Naikkan seluruh harga jual 30% (perintah owner) — presisi
# bedah: harga jual kita naik, konstanta eksternal utuh.
# Sinkronisasi 8 titik versioning.
# ============================================================
import json
import pathlib

R = pathlib.Path("/home/z/my-project")
VER = "2.2.0"
DATE = "2026-10-30"
NAME = "Revaluasi Harga"

# 1. version.ts
vt = (R / "src/lib/version.ts").read_text(encoding="utf-8")
vt = vt.replace('export const APP_VERSION = "2.1.1";', f'export const APP_VERSION = "{VER}";')
vt = vt.replace('export const RELEASE_NAME = "Kilau Emas";', f'export const RELEASE_NAME = "{NAME}";')
vt = vt.replace(" * Riwayat lengkap 48 rilis — urut TERBARU lebih dulu.",
                " * Riwayat lengkap 49 rilis — urut TERBARU lebih dulu.")
NEW_ENTRY = '''export const RELEASES: ReleaseEntry[] = [
  {
    version: "2.2.0",
    date: "2026-10-30",
    type: "minor",
    name: "Revaluasi Harga",
    taskId: "51",
    highlights: [
      "Seluruh harga jual naik 30% (perintah owner: \\u201cnaikan seluruh harga jual kita 30%\\u201d): checkout kanonik pricing.ts (12 paket + strike; langganan tahunan = 10\\u00d7 bulanan baru, strike tahunan = 12\\u00d7 strike bulanan), tier KepatuhanPRO (499rb\\u2192650rb, 1,49jt\\u21921,94jt, 3,99jt\\u21925,19jt), 500 layanan layanan-500.json (harga/harga_diskon/hemat direkonsiliasi), katalog v2 (500 SKU instant-order + 12 catatan Hemat), katalog v3 (1.000 SKU + indeks 500), sumber dasar (landing 39, pajak 16, PMI 12, sertifikasi 43), VO 6 paket + priceNumeric, paket-usaha, BUMDes, mitra + simulator profit (fee cabang 32,5jt · master 130jt), knowledge chat AI, generator roadmap, FAQ 8 bahasa, i18n 14 bahasa (termasuk CJK \\u201c35\\u4e07\\u201d), JSON-LD priceRange, anchor hero/header/teaser \\u2014 total \\u00b11.500 titik",
      "Presisi transformasi: \\u00d71,3 eksak; tampilan rb/jt desimal-koma; numerik dibulatkan kasir 10rb; rasio diskon per SKU dipertahankan; savings = normal \\u2212 discount direkomputasi penuh; threshold tier katalog ikut \\u00d71,3 (2jt\\u21922,6jt, 15jt\\u219219,5jt) agar distribusi entry/mid/premium identik; dua gelombang sweep + audit sisa otomatis menutup 30+ file",
      "Guardrail regulasi (TIDAK disentuh): PNBP & biaya resmi negara, denda pajak Rp100.000, modal dasar legal (Rp50jt/Rp10M PMA), omzet 4,8M & 500jt, gaji/UMP Rp5.729.876, kurs konversi gaji PMI, KUR, rentang harga pasar (notaris/uji lab/VO pasar), testimoni historis, dan riwayat rilis \\u2014 checkout anti-manipulasi tetap server-side dari pricing.ts (order lama menyimpan amount sendiri)",
    ],
  },
'''
vt = vt.replace("export const RELEASES: ReleaseEntry[] = [\n", NEW_ENTRY, 1)
(R / "src/lib/version.ts").write_text(vt, encoding="utf-8")
print("version.ts OK")

# 2. package.json
pj = json.loads((R / "package.json").read_text(encoding="utf-8"))
pj["version"] = VER
(R / "package.json").write_text(json.dumps(pj, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print("package.json OK")

# 3. ver.json
vp = R / "scripts/ver.json"
vj = json.loads(vp.read_text(encoding="utf-8"))
vj["version"].update({"current": VER, "label": f"v{VER} — {NAME}", "releaseName": NAME, "releasedAt": DATE})
vj["docs"]["nextRelease"] = "v2.3.0 (Unreleased — antrean ROADMAP-99)"
vj["releases"]["total"] = 49
vj["releases"]["current"] = {"version": VER, "date": DATE, "type": "minor", "name": NAME}
vp.write_text(json.dumps(vj, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print("ver.json OK")

# 4. CHANGELOG
ct = (R / "CHANGELOG.md").read_text(encoding="utf-8")
ct = ct.replace(
    "[![Versi Saat Ini](https://img.shields.io/badge/Versi_Saat_Ini-v2.1.1_Kilau_Emas-059669?style=for-the-badge&logo=semanticweb&logoColor=white)](#v2-1-1)",
    "[![Versi Saat Ini](https://img.shields.io/badge/Versi_Saat_Ini-v2.2.0_Revaluasi_Harga-059669?style=for-the-badge&logo=semanticweb&logoColor=white)](#v2-2-0)")
ct = ct.replace(
    "![Total Rilis](https://img.shields.io/badge/Total_Rilis-48_(0.1.0_%E2%86%92_2.1.1)-059669?style=flat-square)",
    "![Total Rilis](https://img.shields.io/badge/Total_Rilis-49_(0.1.0_%E2%86%92_2.2.0)-059669?style=flat-square)")
ct = ct.replace(
    "![Entri Worklog](https://img.shields.io/badge/Entri_Worklog-54_ber_versi-059669?style=flat-square)",
    "![Entri Worklog](https://img.shields.io/badge/Entri_Worklog-55_ber_versi-059669?style=flat-square)")
ct = ct.replace(
    '**📆 `arofahajj.com` → sekarang berjalan di `v2.1.1 — "Kilau Emas"`**',
    f'**📆 `arofahajj.com` → sekarang berjalan di `v{VER} — "{NAME}"`**')
ct = ct.replace("## 🪜 Tabel Lengkap 48 Rilis", "## 🪜 Tabel Lengkap 49 Rilis")
ct = ct.replace("[Tabel Lengkap 48 Rilis]", "[Tabel Lengkap 49 Rilis]")
ct = ct.replace(
    "| 48 | **v2.1.1** ⭐ | **2026-10-30** | patch | **Kilau Emas** | Task 50 | **🟢 AKTIF — versi berjalan** |",
    "| 49 | **v2.2.0** ⭐ | **2026-10-30** | minor | **Revaluasi Harga** | Task 51 | **🟢 AKTIF — versi berjalan** |\n"
    "| 48 | v2.1.1 | 2026-10-30 | patch | Kilau Emas | Task 50 | ✅ Rilis |")

ENTRY = '''<a id="v2-2-0"></a>

## [2.2.0] — 2026-10-30 — 💰 "Revaluasi Harga" (Task 51)

**MINOR revaluasi harga** (perintah owner: *"tolong naikan seluruh harga jual kita 30%"*): seluruh permukaan harga jual naik ×1,3 dengan bedah presisi — harga jual kita naik, konstanta eksternal (regulasi/pasar) utuh 100%.

### 🔄 Changed (±1.500 titik, 30+ file, 2 gelombang + audit sisa)
- **Checkout kanonik `pricing.ts`**: 12 paket + strike ×1,3 (499rb→650rb · 1,49jt→1,94jt · 3,99jt→5,19jt · tahunan 4,99jt→6,5jt / 14,9jt→19,4jt / 39,9jt→51,9jt); langganan tahunan = 10× bulanan baru, strike tahunan = 12× strike bulanan baru; tagline hemat dikoreksi & dihitung ulang (Rp 5,2 juta). Tier KepatuhanPRO (`kepatuhan-pro.ts` + client `fmtRupiah(650_000)`) sinkron.
- **Katalog layanan**: `layanan-500.json` (harga ×1,3 ceil-10rb · harga_diskon = half-up-10rb × rasio diskon asli · hemat = selisih eksak) · **katalog v2** 500 SKU instant-order (normalPrice/discountPrice/savings direkonsiliasi penuh + 12 catatan "Hemat Rp X" + threshold tier 2jt→2,6jt & 15jt→19,5jt) · **katalog v3** 1.000 SKU (500 blok detail dgn discountPct+savings + indeks 500 satu-baris berformat field terbalik) — rasio diskon per SKU dipertahankan.
- **Sumber dasar & display**: landing-data 39 · tax-services 16 · pmi-services 12 · sertifikasi 43 · VO 6 paket + priceNumeric + 12 konten FAQ/konten (market-range pasar sengaja dipertahankan) · paket-usaha 6 · BUMDes 3 · mitra 8 + simulator profit (avg kontrak blended, fee cabang Rp32,5jt, master franchise Rp130jt) · knowledge chat AI (paket bundel GO UMRAH 58,5jt, GO HAJI PLUS 104jt, dll.) · generator roadmap 17 titik · FAQ harga masuk 8 bahasa · i18n hero 14 bahasa (ID/EN/ZH/JA/PT/TL/HI/TA/AR/FA/UR/HE/ES/FR/DE/IT/NL/EL/RU/PL/UK) · JSON-LD priceRange 195rb–58,5jt · anchor hero (coret 650rb), header, catalog teaser, admin notifications.
- **Alat bantu**: `scripts/price-rebrand-130.py` (mesin string ×1,3 + peta eksplisit) · `scripts/fix-layanan500-rounding.py` · `scripts/scale-katalog-numeric.py` · `scripts/fix-katalog-savings-v3.py` · `scripts/price-wave2.py` — semua idempoten & terdokumentasi.

### 🛡️ Guardrail — TIDAK diubah (akurasi regulasi & pasar)
PNBP/biaya resmi negara (termasuk "Rp 0" NIB) · denda pajak Rp100.000 · modal dasar legal Rp50jt & investasi PMA Rp10M · omzet Rp4,8M/Rp500jt/Rp50M · gaji UMP Rp5.729.876 · kurs konversi gaji PMI (¥/SAR/S$/HK$/RM/CAD/GBP/EUR) · KUR Rp100jt · rentang pasar notaris/uji lab/VO pasar · testimoni klien (transaksi historis) · riwayat rilis di version.ts/CHANGELOG.

### ✅ Verified
- `tsc --noEmit` bersih · render check 8 halaman (beranda ID/EN, katalog, layanan detail, paket-usaha, bumdes, kepatuhan-pro, virtual-office, checkout) seluruhnya menampilkan harga baru · konsistensi savings = normal − discount pada 1.000 SKU · checkout tetap anti-manipulasi (server-side dari `pricing.ts`; order lama menyimpan amount-nya sendiri).
- Bukti visual: `download/harga-kepatuhanpro.png` · `download/harga-final-kepatuhan.png`.

### 📚 Docs
- `scripts/ver.json` (blok versi + total 49 + nextRelease v2.3.0) · entri ini + ladder #49 · WORKLOG Task 51 · STATE.md · README badge.

---

'''
ct = ct.replace('<a id="v2-1-1"></a>', ENTRY + '<a id="v2-1-1"></a>', 1)
(R / "CHANGELOG.md").write_text(ct, encoding="utf-8")
print("CHANGELOG.md OK")

# 5. WORKLOG
wt = (R / "WORKLOG.md").read_text(encoding="utf-8")
WENTRY = '''

---
Task ID: 51
Agent: Z.ai Code (main agent — Full-Stack Architect mode)
Task: Naikkan seluruh harga jual 30% (perintah owner: "tolong naikan seluruh harga jual kita 30%") — revaluasi ×1,3 presisi bedah di 30+ file/±1.500 titik dengan guardrail regulasi. 🏷️ Rilis v2.2.0 "Revaluasi Harga" (MINOR).

Work Log:
- Inventarisasi harga: 2.770 kemunculan price/harga di 30+ file → klasifikasi harga jual KITA vs konstanta eksternal (PNBP, denda, modal dasar, omzet, UMP, kurs PMI, rentang pasar, testimoni historis)
- Kebijakan: ×1,3 eksak; tampilan rb/jt desimal-koma; numeric ceil-10rb; rasio diskon SKU dipertahankan; langganan tahunan = 10× bulanan & strike tahunan = 12× strike bulanan; threshold tier katalog ikut ×1,3
- Wave-1 scripts/price-rebrand-130.py: engine string Rp-token + field terstruktur (landing/tax/pmi/sertifikasi) + numeric pricing.ts & kepatuhan-pro (boundary-safe utk substring 500_000 dalam 1_500_000) + VO + layanan-500.json + hemat katalog-v2 + i18n 5 file + prose eksplisit → 772 penggantian
- Wave-2 scripts/price-wave2.py: sisa varian (FAQ VO, komponen VO, header EN 499k, bundel katalog-lengkap penuh 7 paket, GO HAJI PLUS, mitra 5 baris) → nol miss
- Koreksi tengah jalan: konvensi layanan-500 direkonsiliasi dr git index (half-up 10rb); katalog-v2/v3 numeric (normalPrice/discountPrice/savings 2.000+ nilai) — termasuk perbaikan koma ganda & bentuk indeks field-terbalik; savings = normal − discount direkomputasi 1.000 SKU
- Kejutan yang ditangkap audit: simulator profit mitra, kepatuhan-client fmtRupiah(499_000), JSON-LD priceRange, harga "Rp 500rb/bulan" di 3 varian VO, deskripsi rentang katalog ternyata dinamis dari data
- Verifikasi: tsc bersih; render 8 halaman menampilkan harga baru; checkout anti-manipulasi tetap server-side; guardrail eksternal 100% utuh
- Versioning 8 titik: version.ts 2.2.0 + RELEASES 49 entri (taskId 51); package.json; ver.json (total 49, nextRelease v2.3.0); CHANGELOG (badge ×4 + entri + ladder #49); STATE.md; README badge; WORKLOG (entri ini); prisma contract tanpa perubahan skema (db:verify hijau)

Stage Summary:
- v2.2.0 "Revaluasi Harga" rilis: seluruh harga jual +30% konsisten dari checkout kanonik hingga chat AI & 14 bahasa; konstanta regulasi/pasar nol pergeseran; fondasi harga baru siap diperbarui owner kapan pun via satu file pricing.ts + sumber katalog
'''
(R / "WORKLOG.md").write_text(wt.rstrip("\n") + WENTRY, encoding="utf-8")
print("WORKLOG.md OK")

# 6. STATE.md
st = (R / "STATE.md").read_text(encoding="utf-8")
st = st.replace(
    '| Versi aplikasi | v2.1.1 "Kilau Emas" (`src/lib/version.ts`, `package.json`) |',
    f'| Versi aplikasi | v{VER} "{NAME}" (`src/lib/version.ts`, `package.json`) |')
(R / "STATE.md").write_text(st, encoding="utf-8")
print("STATE.md OK")

# 7. README.md
rt = (R / "README.md").read_text(encoding="utf-8")
rt = rt.replace(
    "[![Versi](https://img.shields.io/badge/Versi-aplikasi_2_1_1-059669?style=flat-square)](./src/lib/version.ts)",
    f"[![Versi](https://img.shields.io/badge/Versi-aplikasi_2_2_0-059669?style=flat-square)](./src/lib/version.ts)")
rt = rt.replace(
    '- **Versi aplikasi:** 2.1.1 ("Kilau Emas" — lihat [CHANGELOG](./CHANGELOG.md)), didefinisikan di <code>src/lib/version.ts</code> dan <code>package.json</code>.',
    f'- **Versi aplikasi:** {VER} ("{NAME}" — lihat [CHANGELOG](./CHANGELOG.md)), didefinisikan di <code>src/lib/version.ts</code> dan <code>package.json</code>.')
(R / "README.md").write_text(rt, encoding="utf-8")
print("README.md OK")

print("\nALL DONE — v2.2.0 'Revaluasi Harga'")
