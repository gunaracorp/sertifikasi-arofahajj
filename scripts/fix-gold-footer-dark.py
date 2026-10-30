#!/usr/bin/env python3
"""
Task 49 — v2.1.1 "Kilau Emas" (gold footer dark)
=================================================
Dua kelas cacat warna ditemukan setelah laporan owner bahwa footer
"tidak bagus":

1. 18 arbitrary class Tailwind yang memakai SPASI mentah di dalam
   nilai oklch (mis. `bg-[oklch(0.175 0.025 78)]`). Tailwind hanya
   menerima underscore → class tak pernah di-generate → background
   gelap footer & 10+ section hilang (transparan), teks emas pucat
   di atas kanvas gading. Fix: spasi → underscore.

2. Residu rgba() EMERALD (16,185,129 dst.) yang lolos dari pemetaan
   string-based v2.1.0 — mencampur hijau & emas di permukaan yang
   sama (border-beam footer, glow, shadow CTA, admin badges).
   Owner: "jangan sampai ada warna yang tumpang tindih".
   Fix: semua → keluarga emas (amber-400/500/600), footer murni
   gold-on-dark.

Idempoten: aman dijalankan berulang.
"""
import re
import pathlib

ROOT = pathlib.Path("/home/z/my-project/src")

# ---------- 1. spasi → underscore di dalam arbitrary value ----------
# Pola: namautil-[ ...spasi... ]  — spasi hanya diganti bila berada
# di dalam tanda kurung siku kelas arbitrary (bukan pemisah kelas).
ARBITRARY = re.compile(r"((?:[a-zA-Z][a-zA-Z0-9:/_-]*))-(\[[^\[\]\n]*\])")


def fix_arbitrary(text: str):
    count = 0

    def repl(m):
        nonlocal count
        inner = m.group(2)
        if " " in inner:
            count += 1
            return f"{m.group(1)}-{inner.replace(' ', '_')}"
        return m.group(0)

    return ARBITRARY.sub(repl, text), count


# ---------- 2. residu emerald → keluarga emas ----------
# Pemetaan nada: emerald/teal gelap → perunggu amber-600;
# emerald terang → amber-500/400 sesuai peran (glow vs hairline).
EMERALD_MAP = [
    # footer border-beam conic (dua nada emas: perunggu → emas terang)
    ("rgba(16,185,129,0.75) 42deg", "rgba(217,119,6,0.75) 42deg"),
    # footer radial glow summit deck
    ("rgba(16,185,129,0.16)", "rgba(245,158,11,0.14)"),
    # footer beam-host drop shadow
    ("rgba(16,185,129,0.35)]", "rgba(217,119,6,0.30)]"),
    # footer CTA shadow (pulse ring gold)
    ("rgba(16,185,129,0.7)]", "rgba(217,119,6,0.60)]"),
    # footer pill shadow (language sovereign)
    ("rgba(16,185,129,0.35)", "rgba(245,158,11,0.30)"),
    # admin badges / inset ring / dot ping
    ("rgba(16,185,129,0.25)", "rgba(217,119,6,0.25)"),
    ("rgba(16,185,129,0.15)", "rgba(217,119,6,0.15)"),
    ("rgba(16,185,129,0.6)", "rgba(245,158,11,0.6)"),
    # jaga-jaga varian lain yang mungkin muncul
    ("rgba(20,184,166,", "rgba(217,119,6,"),
    ("rgba(5,150,105,", "rgba(180,83,9,"),
    ("rgba(6,95,70,", "rgba(146,64,14,"),
    ("rgba(4,120,87,", "rgba(180,83,9,"),
]

grand_arb = 0
grand_emerald = 0
files_touched = []

for f in sorted(ROOT.rglob("*")):
    if f.suffix not in {".tsx", ".ts", ".css", ".mjs"}:
        continue
    text = f.read_text()
    new, n_arb = fix_arbitrary(text)
    n_em = 0
    for old, newval in EMERALD_MAP:
        if old in new:
            n_em += new.count(old)
            new = new.replace(old, newval)
    if n_arb or n_em:
        f.write_text(new)
        grand_arb += n_arb
        grand_emerald += n_em
        files_touched.append((str(f.relative_to(ROOT.parent)), n_arb, n_em))

print(f"Arbitrary class diperbaiki : {grand_arb}")
print(f"Residu emerald → emas      : {grand_emerald}")
print(f"File tersentuh             : {len(files_touched)}")
for path, a, e in files_touched:
    print(f"  {path}  (class:{a}, emerald:{e})")

# ---------- verifikasi akhir ----------
leftover = []
for f in ROOT.rglob("*"):
    if f.suffix not in {".tsx", ".ts", ".css", ".mjs"}:
        continue
    s = f.read_text()
    for m in ARBITRARY.finditer(s):
        if " " in m.group(2):
            leftover.append(f"{f}: {m.group(0)}")
    if re.search(r"16,\s?185,\s?129|20,\s?184,\s?166", s):
        leftover.append(f"{f}: masih ada rgba emerald/teal")
print("\nSISA MASALAH:", len(leftover))
for x in leftover:
    print("  !", x)
