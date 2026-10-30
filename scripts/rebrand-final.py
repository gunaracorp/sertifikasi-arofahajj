#!/usr/bin/env python3
# ============================================================
# Task 48 — Sweep Final Nama Lama → Identitas Resmi Arofahajj
# ============================================================
# Perintah owner: "tolong rubah namanya sesuai semua dokument kita"
#
# Peta penggantian (urutan = prioritas, terpanjang lebih dulu):
#   PT Brand Lama            → PT AROFAH GLOBAL SISTEM
#   https://brand-lama.com    → https://arofahajj.com
#   BRANDLAMA.COM            → AROFAHAJJ.COM
#   BrandLama.com            → Arofahajj.com
#   brand-lama.com            → arofahajj.com
#   BrandLama                → Arofahajj
#   BRANDLAMA                → AROFAHAJJ
#   brand-lama (DB/path)      → arofahajj
#   brand-lama               → arofahajj
#   PT Top Konsultan Internasional→ PT AROFAH GLOBAL SISTEM
#   Top Konsultan Internasional   → PT AROFAH GLOBAL SISTEM
#   812-6999-9910 (WA lama)       → 812-2234-5856 (WA resmi NIB)
#   6281269999910                 → 6281222345856
#   pp_admin_token                → ah_admin_token
#
# Target HQ basi (SCBD) — konteks spesifik, string persis:
#   README / team-data / coverage-data / kbli-catalog / llms.txt
#   (referensi "Jakarta Selatan (SCBD)" sebagai area layanan
#   DIPERTAHANKAN — itu geografi, bukan kantor pusat.)
#
# EKSKLUSI (tidak disentuh):
#   upload/ (arsip owner) · node_modules · .next · .git ·
#   .pgdata · generated · migrations/snapshots (snapshot Prisma
#   historis) · scripts/docs-rebrand-v2.py & fix-hq-refs*.py
#   (skrip peta penggantian lama — mengubahnya merusak logika)
# ============================================================
import pathlib
import sys

R = pathlib.Path("/home/z/my-project")

RULES = [
    # --- gabungan spesifik lebih dulu ---
    ("PT Brand Lama", "PT AROFAH GLOBAL SISTEM"),
    ("https://brand-lama.com", "https://arofahajj.com"),
    ("http://brand-lama.com", "http://arofahajj.com"),
    ("BRANDLAMA.COM", "AROFAHAJJ.COM"),
    ("BrandLama.com", "Arofahajj.com"),
    ("brand-lama.com", "arofahajj.com"),
    ("BrandLama", "Arofahajj"),
    ("BRANDLAMA", "AROFAHAJJ"),
    ("brand-lama", "arofahajj"),
    ("Brand-Lama", "Arofahajj"),
    ("brand-lama", "arofahajj"),
    ("BRAND-LAMA", "AROFAHAJJ"),
    # --- entitas legal lama ---
    ("PT Top Konsultan Internasional", "PT AROFAH GLOBAL SISTEM"),
    ("Top Konsultan Internasional", "PT AROFAH GLOBAL SISTEM"),
    ("Top Konsultan", "PT AROFAH GLOBAL SISTEM"),
    # --- kontak lama ---
    ("812-6999-9910", "812-2234-5856"),
    ("6281269999910", "6281222345856"),
    ("0812 6999 9910", "0812 2234 5856"),
    # --- cookie admin ---
    ("pp_admin_token", "ah_admin_token"),
    # --- HQ basi SCBD (string persis, konteks kantor pusat) ---
    ("SCBD Jakarta Selatan · Bandung", "Kota Tasikmalaya · Jawa Barat"),
    ("Kantor pusat kami di SCBD — NIB 1 hari", "Kantor pusat kami di Kota Tasikmalaya — NIB 1 hari"),
    ("kantor kami di SCBD", "kantor kami di Kota Tasikmalaya"),
    ("SCBD · Haji", "Tasikmalaya · Haji"),
    ("Berbasis di SCBD, Jakarta", "Berbasis di Kota Tasikmalaya"),
    ("Based in SCBD, Jakarta", "Based in Tasikmalaya, West Java"),
    ("(kantor: SCBD, Jakarta Selatan)", "(kantor: Kota Tasikmalaya)"),
]

EXCLUDE_DIRS = {
    "node_modules", ".next", ".git", ".pgdata", "generated",
    "upload", "skills", ".zscripts", "tool-results", ".seo",
    "download",  # hasil verifikasi lama — dibersihkan terpisah bila perlu
}
EXCLUDE_FILES = {
    "scripts/docs-rebrand-v2.py",
    "scripts/fix-hq-refs.py",
    "scripts/fix-hq-refs-2.py",
    "scripts/rebrand-final.py",  # dirinya sendiri
}
EXCLUDE_SUFFIX = {".lock", ".png", ".jpg", ".jpeg", ".webp", ".pdf",
                  ".ico", ".svg", ".woff", ".woff2", ".tar.gz", ".log"}
# Snapshot historis Prisma — jejak skema masa lalu, jangan disentuh.
EXCLUDE_PREFIXES = ("migrations/snapshots/",)

TEXT_SUFFIX = {".md", ".ts", ".tsx", ".js", ".mjs", ".cjs", ".json",
               ".css", ".html", ".txt", ".yml", ".yaml", ".sh", ".py",
               ".prisma", ".env", ".htaccess", ".xml", ".webmanifest", ""}

changed_files = []
total_rules_applied = 0

for path in R.rglob("*"):
    if not path.is_file():
        continue
    rel = path.relative_to(R).as_posix()
    if any(part in EXCLUDE_DIRS for part in path.relative_to(R).parts):
        continue
    if rel in EXCLUDE_FILES:
        continue
    if any(rel.startswith(p) for p in EXCLUDE_PREFIXES):
        continue
    if path.suffix.lower() in EXCLUDE_SUFFIX:
        continue
    if path.suffix.lower() not in TEXT_SUFFIX:
        continue
    try:
        raw = path.read_bytes()
        text = raw.decode("utf-8")
    except (UnicodeDecodeError, PermissionError, OSError):
        continue

    original = text
    for old, new in RULES:
        if old in text:
            total_rules_applied += text.count(old)
            text = text.replace(old, new)
    if text != original:
        path.write_text(text, encoding="utf-8")
        changed_files.append(rel)

print(f"Files changed : {len(changed_files)}")
print(f"Replacements  : {total_rules_applied}")
print("-" * 60)
for f in sorted(changed_files):
    print(f"  {f}")
