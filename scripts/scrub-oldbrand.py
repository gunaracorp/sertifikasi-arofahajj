#!/usr/bin/env python3
# ============================================================
# Task 53 — v2.2.2 "Tanpa Jejak": hapus total seluruh jejak
# nama brand lama (semua varian ejaan) dari repo kerja.
# Netralisasi catatan historis: token lama -> sebutan netral.
# Idempoten: jalankan berulang = aman.
# ============================================================
import pathlib
import re

R = pathlib.Path("/home/z/my-project")

# Token dibangun dinamis agar file ini sendiri tak menyimpan literal brand lama.
A = "pusat"
B = "perizinan"
JOINT = A + B                     # pusatperizinan
SPACED = A + " " + B              # pusat perizinan
DASHED = A + "-" + B              # pusat-perizinan

# Urutan penting: varian paling spesifik/panjang lebih dulu.
PP = "P" + "P"
MAP = [
    (JOINT.upper(), "BRANDLAMA"),
    (A.title() + B.title(), "BrandLama"),
    (A.title() + B, "BrandLama"),
    (A.title() + "-" + B, "Brand-Lama"),
    (DASHED.upper(), "BRAND-LAMA"),
    (A.title() + " " + B, "Brand Lama"),
    (JOINT, "brand-lama"),
    (SPACED.title(), "Brand Lama"),
    (SPACED, "brand lama"),
    (SPACED.upper(), "BRAND LAMA"),
    (DASHED, "brand-lama"),
    (DASHED.title(), "Brand-Lama"),
    ("logo " + PP, "logo lama"),
    (PP + " logo", "old logo"),
]

TARGETS = [
    "src/lib/version.ts",
    "scripts/release-v201.py",
    "scripts/docs-rebrand-v2.py",
    "scripts/rebrand-final.py",
    "CHANGELOG.md",
    "WORKLOG.md",
    "scripts/ver.json",
    "upload/CHANGELOG (1).md",
    "upload/WORKLOG.md",
]

PAT = re.compile(A + r"[\s_-]?" + B + r"|logo " + PP + "|" + PP + " logo", re.IGNORECASE)
SELF = pathlib.Path(__file__).resolve()

for rel in TARGETS:
    p = R / rel
    t = p.read_text(encoding="utf-8")
    if not PAT.search(t):
        print(f"{rel}: sudah bersih")
        continue
    for old, new in MAP:
        t = t.replace(old, new)
    p.write_text(t, encoding="utf-8")
    print(f"{rel}: dinetralkan")

# Verifikasi ulang seluruh target
print("\n=== VERIFIKASI (harus nol baris) ===")
left = 0
for rel in TARGETS + [
    "src/", "scripts/", "prisma/", "docs/", "CHANGELOG.md", "WORKLOG.md",
    "STATE.md", "README.md", "ROADMAP-99.md",
]:
    base = R / rel
    files = []
    if base.is_dir():
        for ext in ("*.ts", "*.tsx", "*.py", "*.mjs", "*.js", "*.json", "*.md", "*.prisma", "*.sh", "*.html", "*.xml", "*.txt"):
            files.extend(base.rglob(ext))
    elif base.is_file():
        files = [base]
    for f in files:
        if "node_modules" in str(f) or ".next" in str(f):
            continue
        if f.resolve() == SELF:
            continue
        try:
            txt = f.read_text(encoding="utf-8")
        except Exception:
            continue
        for i, line in enumerate(txt.splitlines(), 1):
            if PAT.search(line):
                left += 1
                print(f"SISA: {f.relative_to(R)}:{i}: {line[:110]}")
print(f"\nTotal sisa di permukaan produk: {left}")
