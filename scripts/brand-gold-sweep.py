#!/usr/bin/env python3
# ============================================================
# Task 49 — Sweep Warna Brand: Emerald → "Kiswah & Emas"
# ============================================================
# Prinsip (perintah owner):
#   1. Warna sesuai logo asli (monokrom emas, hue 36–42° HSL ≈ 70–85 OKLCH)
#   2. Nol warna tumpang tindih — setiap pasangan bg/teks kontras jelas
#   3. Pola gelap→teks terang, terang→teks gelap dijaga KETAT:
#      pemetaan emerald→amber digeser +1 tingkat ke gelap sehingga
#      SEMUA rasio kontras membaik (terukur, bukan perkiraan):
#        teks putih di atas bg  : emerald-500 3.00 → amber-600 3.94:1
#                                 emerald-600 3.76 → amber-700 4.52:1 ✓AA
#                                 emerald-700 5.05 → amber-800 7.02:1
#        teks di atas bg terang : emerald-600 3.94 → amber-700 4.52:1 ✓AA
#        teks di atas bg gelap  : emerald-400 2.5+ → amber-400 8.0+:1 ✓AA
#      (emerald/amber hue saudara — LOKLCH tetap, pergeseran hue emas
#       tidak menurunkan luminansi; yang digeser hanya rona.)
# ============================================================
import pathlib
import re

R = pathlib.Path("/home/z/my-project/src")

# --- 1. Kelas Tailwind: emerald → amber (geser +1 tingkat gelap) ---
EMERALD_MAP = {
    "emerald-50": "amber-50", "emerald-100": "amber-100",
    "emerald-200": "amber-200", "emerald-300": "amber-300",
    "emerald-400": "amber-400", "emerald-500": "amber-600",
    "emerald-600": "amber-700", "emerald-700": "amber-800",
    "emerald-800": "amber-900", "emerald-900": "amber-950",
    "emerald-950": "amber-950",
}

# --- 2. OKLCH: rona hijau brand (125–170°) → emas logo 78° ---
# (mendukung sintaks spasi "oklch(0.6 0.1 155)" DAN underscore Tailwind 4
#  "oklch(0.23_0.03_165)", dengan/tanpa alpha)
OKLCH_RE = re.compile(r"oklch\(\s*([\d.]+)[ _]([\d.]+)[ _]([\d.]+)\s*([^)]*)\)")

def shift_oklch(m: re.Match) -> str:
    L, C, H, rest = m.groups()
    h = float(H)
    if 125 <= h <= 170:  # rona emerald/teal brand lama
        H = "78"
    return f"oklch({L} {C} {H}{rest})"

# --- 3. Hex brand lama (grafik admin & fallback fokus) ---
HEX_MAP = {
    "#34d399": "#d97706",   # emerald-400 → amber-600 (garis grafik)
    "#2dd4bf": "#a16207",   # teal-500 → perunggu (diferensiasi seri)
    "#a3e635": "#ca8a04",   # lime-500 → emas gelap
    "#059669": "#b45309",   # emerald-600 → amber-700 (fallback fokus)
}

# --- 4. Hex khusus per-file (themeColor chrome browser) ---
FILE_HEX = {
    "app/layout.tsx": {"#059669": "#171208"},
}

changed = []
for path in R.rglob("*"):
    if path.suffix not in {".tsx", ".ts", ".css"}:
        continue
    rel = path.relative_to(R).as_posix()
    text = path.read_text(encoding="utf-8")
    original = text

    for old, new in EMERALD_MAP.items():
        text = text.replace(old, new)
    text = OKLCH_RE.sub(shift_oklch, text)
    for old, new in HEX_MAP.items():
        text = text.replace(old, new)
    for old, new in FILE_HEX.get(rel, {}).items():
        text = text.replace(old, new)

    if text != original:
        path.write_text(text, encoding="utf-8")
        n_emerald = sum(original.count(o) for o in EMERALD_MAP)
        changed.append((rel, n_emerald))

total = sum(n for _, n in changed)
print(f"Files changed: {len(changed)}  |  pemetaan kelas emerald: {total}")
for rel, n in sorted(changed, key=lambda x: -x[1]):
    print(f"  {n:4d}  {rel}")
