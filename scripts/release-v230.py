#!/usr/bin/env python3
# ============================================================
# Task 54 — Rilis v2.3.0 "Rumah Baru" (MINOR)
# Migrasi database ke Prisma Postgres cloud + guard anti-timpa
# ensure-pg.sh + README baru "Kiswah & Emas" + nextRelease
# dinamis di /api/version. Sinkronisasi 8 titik versioning.
# ============================================================
import json
import pathlib

R = pathlib.Path("/home/z/my-project")
VER = "2.3.0"
DATE = "2026-10-30"
NAME = "Rumah Baru"
NSAFE = "Rumah_Baru"

# ------------------------------------------------------------
# 1. src/lib/version.ts
# ------------------------------------------------------------
vt = (R / "src/lib/version.ts").read_text(encoding="utf-8")
assert 'APP_VERSION = "2.2.2"' in vt and 'RELEASE_NAME = "Tanpa Jejak"' in vt
vt = vt.replace('export const APP_VERSION = "2.2.2";', f'export const APP_VERSION = "{VER}";')
vt = vt.replace('export const RELEASE_NAME = "Tanpa Jejak";', f'export const RELEASE_NAME = "{NAME}";')
vt = vt.replace("Riwayat lengkap 51 rilis", "Riwayat lengkap 52 rilis")
NEW_ENTRY = '''export const RELEASES: ReleaseEntry[] = [
  {
    version: "2.3.0",
    date: "2026-10-30",
    type: "minor",
    name: "Rumah Baru",
    taskId: "54",
    highlights: [
      "Migrasi database produksi ke Prisma Postgres cloud (pooled.db.prisma.io, sslmode=require) \\u2014 .env dialihkan, skema 15 model diinisialisasi via db:init \\u2192 db:sign \\u2192 db:verify (marker & skema match contract, storageHash identik dengan kontrak), smoke test 15/15 model PASS create/read lewat runtime ORM 8 native",
      "Guard sandbox anti-tabrakan: scripts/ensure-pg.sh kini punya mode remote \\u2014 .env cloud tidak pernah ditimpa templat sandbox dan cluster embedded lokal dilewati otomatis bila DATABASE_URL menunjuk cloud; akar masalah \\u201cdatabase tidak konek\\u201d pasca daur ulang sandbox tertutup total",
      "README ditulis ulang total bergaya Kiswah & Emas (banner emas-di-kiswah, badge versi, statistik platform, arsitektur contract-first, panduan memulai & env vars tanpa kredensial asli) dan /api/version docs.nextRelease kini dihitung dinamis dari APP_VERSION \\u2014 akhir era hardcode v1.16.0",
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
vj["docs"]["nextRelease"] = "v2.4.0 (Unreleased — antrean ROADMAP-99)"
vj["releases"]["total"] = 52
vj["releases"]["current"] = {
    "version": VER, "date": DATE, "type": "minor", "name": NAME,
}
vp.write_text(json.dumps(vj, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print("ver.json OK")

# ------------------------------------------------------------
# 4. CHANGELOG.md — badge + entri baru + ladder
# ------------------------------------------------------------
ct = (R / "CHANGELOG.md").read_text(encoding="utf-8")
ct = ct.replace(
    "Versi_Saat_Ini-v2.2.2_Tanpa_Jejak-059669",
    f"Versi_Saat_Ini-v{VER}_{NSAFE}-059669")
ct = ct.replace("](#v2-2-2)", f"](#{'v' + VER.replace('.', '-')})", 1)
ct = ct.replace(
    "Total_Rilis-51_(0.1.0_%E2%86%92_2.2.2)",
    f"Total_Rilis-52_(0.1.0_%E2%86%92_{VER})")
ct = ct.replace(
    "Entri_Worklog-57_ber_versi",
    "Entri_Worklog-58_ber_versi")
ct = ct.replace(
    "Rilis_Berikutnya-v2.3.0_(Unreleased)",
    "Rilis_Berikutnya-v2.4.0_(Unreleased)")
ct = ct.replace(
    '**📆 `arofahajj.com` → sekarang berjalan di `v2.2.2 — "Tanpa Jejak"`**',
    f'**📆 `arofahajj.com` → sekarang berjalan di `v{VER} — "{NAME}"`**')
ct = ct.replace("Tabel Lengkap 51 Rilis", "Tabel Lengkap 52 Rilis")
ct = ct.replace(
    "| 51 | **v2.2.2** ⭐ | **2026-10-30** | patch | **Tanpa Jejak** | Task 53 | **🟢 AKTIF — versi berjalan** |",
    f"| 52 | **v{VER}** ⭐ | **{DATE}** | minor | **{NAME}** | Task 54 | **🟢 AKTIF — versi berjalan** |\n"
    "| 51 | v2.2.2 | 2026-10-30 | patch | Tanpa Jejak | Task 53 | ✅ Rilis |")

ENTRY = '''<a id="v2-3-0"></a>

## [2.3.0] — 2026-10-30 — 🏠 "Rumah Baru" (Task 54)

**MINOR infrastruktur data** (perintah owner: *"push ke github, buatkan readme terbaik, migrasikan semua ke Prisma 8 postgres cloud, settingkan agar konek"*): database pindah ke Prisma Postgres cloud, README menyulam ulang, dan dua tiket kebersihan infra ikut naik.

### ☁️ Infrastructure
- **Database produksi beralih ke Prisma Postgres cloud** (`pooled.db.prisma.io:5432`, sslmode=require): `DATABASE_URL` di `.env` dialihkan, skema 15 model diinisialisasi via `db:init → db:sign → db:verify` — marker & skema **match contract** (storageHash identik dengan kontrak lokal), smoke test **15/15 model PASS** create/read lewat runtime ORM 8 native.
- **Guard `scripts/ensure-pg.sh` kini punya mode remote**: bila `DATABASE_URL` menunjuk cloud, `.env` tidak pernah ditimpa templat sandbox dan cluster embedded lokal (.pgdata) dilewati otomatis — menutup akar masalah "database tidak konek" setiap daur ulang sandbox.

### 🔧 Changed
- **README.md ditulis ulang total** bergaya palet "Kiswah & Emas": banner emas-di-kiswah (menggantikan emerald era lama), badge versi & stack, tabel statistik hidup dari `/api/version`, diagram arsitektur contract-first, panduan memulai, tabel env vars tanpa satu pun kredensial asli, struktur proyek & disiplin 8 titik.
- **`/api/version` `docs.nextRelease` kini dihitung dinamis** dari `APP_VERSION` (minor berikutnya) — menghapus hardcode basi "v1.16.0" yang tertinggal sejak era lama; kini selalu sinkron dengan antrean ROADMAP-99.
- Keamanan: token GitHub & kredensial DB yang pernah dikirim owner via chat hanya dipakai sesi ini (push + `.env` gitignored) dan **disarankan dirotasi**.

### ✅ Verified
- `bun run db:verify` (remote): ✔ "Database marker and schema match contract" · `bun run db:smoke`: 15/15 PASS.
- Dev server hidup memakai cloud: boot log "Mode remote", `.env` tidak berubah, `/`, `/kontak`, `/tentang-kami`, `/admin`, `/api/version` HTTP 200, nol error DB di log.
- `bunx tsc --noEmit`: nol error di `src/` (sisa temuan hanya folder legacy non-aplikasi — pra-eksisting).

### 📚 Docs
- `scripts/ver.json` (blok versi + releases.total 52 + nextRelease v2.4.0) · entri ini + ladder #52 · WORKLOG Task 54 · STATE.md · README baru.

---

'''
ct = ct.replace('<a id="v2-2-2"></a>', ENTRY + '<a id="v2-2-2"></a>', 1)
(R / "CHANGELOG.md").write_text(ct, encoding="utf-8")
print("CHANGELOG.md OK")

# ------------------------------------------------------------
# 5. WORKLOG.md — entri Task 54 di akhir file
# ------------------------------------------------------------
wt = (R / "WORKLOG.md").read_text(encoding="utf-8")
WENTRY = '''
---
Task ID: 54
Agent: Z.ai Code (main agent — Full-Stack Architect mode)
Task: Push ke GitHub + README terbaik + migrasi database ke Prisma 8 Prisma Postgres cloud & setting agar konek (perintah owner). 🏷️ Rilis v2.3.0 "Rumah Baru" (MINOR).

Work Log:
- Rekonsaimientos: remote origin github.com/gunaracorp/arofahajj (branch main); commit UUID auto-commit sandbox diamankan jadi pesan bermakna; .env terkonfirmasi tidak terlacak git (.gitignore .env*) dan nol kredensial di file terlacak
- Konektivitas: TCP pooled.db.prisma.io:5432 OPEN dari sandbox; HTTPS github.com 200
- Migrasi DB: .env dialihkan ke Prisma Postgres cloud (sslmode=require, variabel sandbox lain dipertahankan); contract emit ulang; db:init → db:sign → db:verify semua ✔ (storageHash d0999… identik, marker & skema match contract); bun run db:smoke 15/15 model PASS create/read via runtime ORM 8 native
- Guard anti-timpa: ensure-pg.sh diberi mode remote (step 0) — .env cloud tidak pernah ditimpa templat sandbox, cluster embedded lokal dilewati; diuji: boot log "Mode remote", .env tetap cloud
- Dev server direstart memakai cloud; pg lokal dimatikan; / /kontak /tentang-kami /admin /api/version HTTP 200, nol error DB di log
- README.md ditulis ulang total (Kiswah & Emas): banner, badge, statistik, arsitektur contract-first, memulai, env vars, perintah, 8 titik, struktur, deploy, kontak — tanpa kredensial asli
- Fix legacy: /api/version docs.nextRelease dihitung dinamis dari APP_VERSION (akhir hardcode v1.16.0)
- Versioning 8 titik: version.ts 2.3.0 "Rumah Baru" + RELEASES 52 entri (taskId 54); package.json; ver.json (total 52, nextRelease v2.4.0); CHANGELOG (badge ×5 + entri Infrastructure/Changed/Verified/Docs + ladder #52); STATE.md; README badge v2.3.0; WORKLOG (entri ini); db:verify hijau

Stage Summary:
- v2.3.0 "Rumah Baru" rilis: database hidup di Prisma Postgres cloud dan benar-benar konek (smoke 15/15), sandbox tak akan menimpa .env cloud lagi, README tampil berkelas sesuai branding emas, repo terdorong ke GitHub
'''
(R / "WORKLOG.md").write_text(wt.rstrip("\n") + WENTRY, encoding="utf-8")
print("WORKLOG.md OK")

# ------------------------------------------------------------
# 6. STATE.md
# ------------------------------------------------------------
st = (R / "STATE.md").read_text(encoding="utf-8")
st = st.replace(
    '| Versi aplikasi | v2.2.2 "Tanpa Jejak" (`src/lib/version.ts`, `package.json`) |',
    f'| Versi aplikasi | v{VER} "{NAME}" (`src/lib/version.ts`, `package.json`) |')
(R / "STATE.md").write_text(st, encoding="utf-8")
print("STATE.md OK")

# ------------------------------------------------------------
# 7. README.md — sudah ditulis ulang langsung; verifikasi badge
# ------------------------------------------------------------
rt = (R / "README.md").read_text(encoding="utf-8")
assert f"v{VER}_{NSAFE}" in rt, "README badge v2.3.0 belum ada!"
assert "52 rilis" in rt and "58 entri worklog" in rt, "Angka README tidak sinkron!"
print("README.md OK (badge v2.3.0 terverifikasi)")

print(f"\nALL DONE — v{VER} '{NAME}'")
