#!/usr/bin/env python3
# ============================================================
# bump-v240.py — Sinkronisasi 8 titik versioning v2.4.0
# "Studio CMS" sesuai disiplin rilis Arofahajj Universe.
# Idempoten: aman dijalankan berulang.
# ============================================================
import json, re, os

ROOT = os.path.dirname(os.path.abspath(__file__)) + "/.."
os.chdir(ROOT)

V = "2.4.0"
NAME = "Studio CMS"
DATE = "2026-11-22"
TASK = "55"
HIGHLIGHTS = [
    "Studio CMS ala WordPress: tab Studio Tema di Mission Control — katalog 5 tema situs (Zamrud default, Kiswah Malam gelap, Emas Nusantara, Tirta Zamrud, Terra Tasik) yang mengganti identitas visual seluruh halaman publik lewat data-theme CSS variable tanpa menyentuh kode",
    "Halaman CMS mandiri /p/[slug] ala WordPress Pages: CRUD lengkap dari admin (model CmsPage baru — sections/faq/cta terstruktur, metaTitle/metaDescription/focusKeyword, noindex, showInFooter+sortOrder terhubung ke footer), JSON-LD WebPage+Breadcrumb+FAQPage, sitemap seksi “halaman”, dan bake otomatis saat build statis",
    "Pipeline hosting statis hidup kembali (bug kritis): next.config.ts kini menghormati BUILD_STATIC=1 (output:“export” + rewrites/redirects dinonaktifkan) yang sejak v2.3.0 diabaikan sehingga build-static.mjs selalu gagal; plus pembersihan artefak .next/dev sebelum build agar type check tidak salah referensi",
    "Perbaikan guard ensure-pg.sh: deteksi DATABASE_URL tahan format kutip (template SQLite file:... dulu keliru dianggap “remote” sehingga .env sandbox tidak pernah dipulihkan) + marker .pgdata/.schema-ready membuat init skema idempoten",
]

def read(p): return open(p, encoding="utf-8").read()
def write(p, s): open(p, "w", encoding="utf-8").write(s)

changed = []

# ---------- 1. src/lib/version.ts ----------
p = "src/lib/version.ts"
s = read(p)
if f'APP_VERSION = "{V}"' not in s:
    s = s.replace('export const APP_VERSION = "2.3.0";', f'export const APP_VERSION = "{V}";')
    s = s.replace('export const RELEASE_NAME = "Rumah Baru";', f'export const RELEASE_NAME = "{NAME}";')
    s = s.replace('export const RELEASE_DATE = "2026-10-30";', f'export const RELEASE_DATE = "{DATE}";')
    entry = (
        "export const RELEASES: ReleaseEntry[] = [\n"
        "  {\n"
        f'    version: "{V}",\n'
        f'    date: "{DATE}",\n'
        '    type: "minor",\n'
        f'    name: "{NAME}",\n'
        f'    taskId: "{TASK}",\n'
        '    highlights: [\n'
        + "".join(f'      "{h}",\n' for h in HIGHLIGHTS) +
        '    ],\n'
        "  },\n"
    )
    marker = "export const RELEASES: ReleaseEntry[] = [\n"
    s = s.replace(marker, marker.replace(marker, entry), 1)
    write(p, s); changed.append(p)

# ---------- 2. package.json ----------
p = "package.json"
d = json.load(open(p, encoding="utf-8"))
if d["version"] != V:
    d["version"] = V
    write(p, json.dumps(d, indent=2, ensure_ascii=False) + "\n"); changed.append(p)

# ---------- 3. scripts/ver.json ----------
p = "scripts/ver.json"
d = json.load(open(p, encoding="utf-8"))
d["version"]["current"] = V
d["version"]["label"] = f"v{V} — {NAME}"
d["version"]["releaseName"] = NAME
d["version"]["releasedAt"] = DATE
rel = d.setdefault("releases", {})
rel["total"] = 53
rel["current"] = {"version": V, "date": DATE, "type": "minor", "name": NAME}
hist = rel.setdefault("history", [])
if all(h.get("version") != "2.3.0" for h in hist):
    hist.insert(0, {
        "version": "2.3.0", "date": "2026-10-30", "type": "minor",
        "name": "Rumah Baru", "taskId": "54",
        "highlights": [
            "Migrasi database produksi ke Prisma Postgres cloud (pooled.db.prisma.io, sslmode=require) — smoke test 15/15 model PASS",
            "Guard sandbox anti-tabrakan: scripts/ensure-pg.sh kini punya mode remote — .env cloud tidak pernah ditimpa templat sandbox",
            "README ditulis ulang total bergaya Kiswah & Emas",
        ],
    })
write(p, json.dumps(d, indent=2, ensure_ascii=False) + "\n"); changed.append(p)

# ---------- 4. CHANGELOG.md ----------
p = "CHANGELOG.md"
s = read(p)
if f'<a id="v2-{V[0]}-{V[2]}0"></a>' not in s:
    s = s.replace(
        "Versi_Saat_Ini-v2.3.0_Rumah_Baru-059669?style=for-the-badge&logo=semanticweb&logoColor=white)](#v2-3-0)",
        f"Versi_Saat_Ini-v{V}_{NAME.replace(' ', '_')}-059669?style=for-the-badge&logo=semanticweb&logoColor=white)](#v2-4-0)",
    )
    s = s.replace(
        "Total_Rilis-52_(0.1.0_%E2%86%92_2.3.0)-059669",
        "Total_Rilis-53_(0.1.0_%E2%86%92_2.4.0)-059669",
    )
    s = s.replace("Entri_Worklog-58_ber_versi", "Entri_Worklog-59_ber_versi")
    s = s.replace(
        "**📆 `arofahajj.com` → sekarang berjalan di `v2.3.0 — \"Rumah Baru\"`**",
        f"**📆 `arofahajj.com` → sekarang berjalan di `v{V} — \"{NAME}\"`**",
    )
    s = s.replace("[Tabel Lengkap 52 Rilis](#ladder)", "[Tabel Lengkap 53 Rilis](#ladder)")
    hl_md = "\n".join(f"- **{h.split(':')[0]}**: {h.split(':', 1)[1].strip()}" for h in HIGHLIGHTS)
    entry_md = f"""<a id="v2-4-0"></a>

## [2.4.0] — {DATE} — 🎨 "{NAME}" (Task {TASK})

**MINOR fitur** (perintah owner: *"buatkan cms seperti wordpress, buatkan thema, tutorial pengembangan dari hulu ke hilir agar full seo"*): Studio CMS dibangun di atas Mission Control, pipeline hosting statis dihidupkan kembali, dua bug lama ditutup.

### 🎨 Added
{hl_md}
- API Studio: `/api/admin/pages` + `/api/admin/pages/[id]` (CRUD halaman), `/api/admin/theme` (GET/PUT tema aktif — validasi ketat), `/api/admin/cms-export` (unduh seluruh konten CMS sebagai JSON, ala Export WordPress), `/api/cms/footer-pages` (publik, untuk footer).
- Blog & sitemap: `generateStaticParams` blog kini menyertakan post PUBLISHED dari DB (bake CMS saat build statis); seksi sitemap baru `halaman.xml` (total 16 seksi) + sinkron robots.txt.
- Tema diterapkan lewat `<html data-theme>` dari tabel `SiteSetting` (ala wp_options) dengan pratinjau klien `?theme=`/localStorage via ThemeBridge — nol regresi bila DB mati (fallback tema default).

### 🗄️ Database
- 2 model baru di `contract.prisma`: **CmsPage** (halaman mandiri) & **SiteSetting** (key/value pengaturan situs) → 17 model total; pipeline `contract emit → db:init → db:sign → db:verify` hijau.

### 🐛 Fixed
- **Static export mati sejak v2.3.0**: `next.config.ts` mengabaikan env `BUILD_STATIC` sehingga `PACK_LIGHT=1 node scripts/build-static.mjs` selalu gagal (output:"standalone" mengunci). Kini `BUILD_STATIC=1 → output:"export"` + rewrites/redirects dikosongkan (tak didukung mode export).
- **Type check build statis salah referensi**: artefak dev `.next/dev/types/validator.ts` mereferensikan route API yang digeser saat build → `build-static.mjs` kini membersihkan `.next/dev` sebelum build.
- **`ensure-pg.sh` salah klasifikasi**: `cut -d'"' -f2` gagal pada `.env` tanpa kutip sehingga template SQLite `DATABASE_URL=file:...` dianggap "remote" dan sandbox tak pernah dipulihkan → deteksi diganti sed tahan kutip; init skema kini idempoten via marker `.pgdata/.schema-ready`.

### ✅ Verified
- `bunx tsc --noEmit`: 0 error · `bun run lint`: bersih · `bun run db:verify` + `db:smoke` 17/17 PASS.
- Build statis end-to-end: `PACK_LIGHT=1 node scripts/build-static.mjs` → **out/** 268 halaman HTML (termasuk `/p/tentang-kami` hasil CMS), sitemap di-prune 4 seksi, `deploy-pack.mjs` → `arofahajj-static-hosting.tar.gz` 29,29 MB (MD5 97cf2cf2…).
- Verifikasi browser: halaman `/p/tentang-kami` render (tema Tirta & Kiswah Malam diuji), admin Studio Tema CRUD halaman, ekspor JSON, footer link otomatis.

"""
    s = s.replace('<a id="v2-3-0"></a>', entry_md + '<a id="v2-3-0"></a>', 1)
    # Ladder: demote #52, tambah #53
    s = s.replace(
        "| 52 | **v2.3.0** ⭐ | **2026-10-30** | minor | **Rumah Baru** | Task 54 | **🟢 AKTIF — versi berjalan** |",
        "| 52 | **v2.3.0** ⭐ | **2026-10-30** | minor | **Rumah Baru** | Task 54 | stable |",
    )
    old52 = "| 52 | **v2.3.0** ⭐ | **2026-10-30** | minor | **Rumah Baru** | Task 54 | stable |"
    new53 = old52 + f"\n| 53 | **v{V}** ⭐ | **{DATE}** | minor | **{NAME}** | Task {TASK} | **🟢 AKTIF — versi berjalan** |"
    s = s.replace(old52, new53, 1)
    write(p, s); changed.append(p)

# ---------- 5. WORKLOG.md ----------
p = "WORKLOG.md"
s = read(p)
if "Task 55" not in s:
    entry = """

---

## Task 55 — Studio CMS ala WordPress + Perbaikan Pipeline Hosting Statis

**Tanggal**: {DATE} · **Rilis**: v{V} "{NAME}" (MINOR)

Perintah owner: pastikan tanpa bug untuk static hosting (siap unduh), buatkan CMS seperti WordPress + tema, buatkan tutorial pengembangan hulu-ke-hilir full SEO.

Work Log:
- Audit: ESLint bersih; `bunx tsc --noEmit` 0 error; eksplorasi menyeluruh menemukan 3 bug (pipeline statis matik sejak v2.3.0, artefak .next/dev mengacaukan type check, guard ensure-pg salah klasifikasi .env template)
- Studio CMS: model CmsPage + SiteSetting (17 model), bridge cms-pages.ts + site-settings.ts (pola defensif blog-cms.ts), registri tema themes.ts (5 tema oklch WCAG AA), CSS data-theme + ThemeBridge (pratinjau ?theme=/localStorage), layout async membaca tema dengan fallback aman
- Admin: tab "Studio Tema" (dashboard.tsx + studio.tsx) — picker tema + CRUD halaman + skor SEO live + Ekspor JSON; API pages/theme/cms-export/footer-pages dengan guard cookie sama seperti posts
- Publik: route /p/[slug] (WebPage+Breadcrumb+FAQPage JSON-LD, draft preview admin), footer link otomatis via hook cache-modul (fallback anggun di hosting statis), blog generateStaticParams menyertakan post DB, sitemap seksi "halaman" + robots.txt 16 Sitemap
- Build statis end-to-end hijau: out/ 268 HTML → deploy-pack 29,29 MB; dev server, smoke 17/17, verifikasi browser tema terang/gelap & CRUD halaman
- Versioning 8 titik: version.ts (RELEASES 53 entri), package.json, ver.json, CHANGELOG (badge + entri + ladder #53), STATE.md, README badge, WORKLOG (entri ini), db:verify hijau

Stage Summary:
- v2.4.0 "Studio CMS": situs punya CMS ala WordPress (tema + halaman mandiri + ekspor konten) DAN hosting statis kembali bisa dibangun/diunduh — tutorial pengembangan hulu-ke-hilir menyusul di download/
"""
    entry = entry.replace("{DATE}", DATE).replace("{V}", V).replace("{NAME}", NAME)
    s = s.rstrip() + entry + "\n"
    write(p, s); changed.append(p)

# ---------- 6. STATE.md ----------
p = "STATE.md"
s = read(p)
s = s.replace(
    '| Versi aplikasi | v2.3.0 "Rumah Baru" (`src/lib/version.ts`, `package.json`) |',
    f'| Versi aplikasi | v{V} "{NAME}" (`src/lib/version.ts`, `package.json`) |',
)
write(p, s); changed.append(p)

# ---------- 7. README.md ----------
p = "README.md"
s = read(p)
s = s.replace(
    '<img src="https://img.shields.io/badge/Versi-v2.3.0_Rumah_Baru-f59e0b?style=for-the-badge&logo=semanticweb&logoColor=1c1917" alt="Versi v2.3.0 Rumah Baru"/>',
    f'<img src="https://img.shields.io/badge/Versi-v{V}_{NAME.replace(" ", "_")}-f59e0b?style=for-the-badge&logo=semanticweb&logoColor=1c1917" alt="Versi v{V} {NAME}"/>',
)
s = s.replace("href=\"./CHANGELOG.md#v2-3-0\"", "href=\"./CHANGELOG.md#v2-4-0\"")
s = s.replace('Anda di sini → **v2.3.0 "Rumah Baru"**', f'Anda di sini → **v{V} "{NAME}"**')
s = s.replace(
    "Hingga v2.3.0: **52 rilis** tercatat (0.1.0 → 2.3.0) dan **58 entri worklog**",
    f"Hingga v{V}: **53 rilis** tercatat (0.1.0 → {V}) dan **59 entri worklog**",
)
s = s.replace("# 52 rilis terdokumentasi penuh", "# 53 rilis terdokumentasi penuh")
write(p, s); changed.append(p)

# ---------- 8. db:verify — dijalankan terpisah oleh pemanggil ----------

print("✔ Titik versi disinkronkan:", len(changed))
for c in changed: print("   -", c)
