#!/usr/bin/env python3
"""RECOLOR SWEEP — Redesign "Zamrud & Emas" 2026.

Mengganti kelas amber-*/orange-* (DNA warna template lama yang
identik dengan pusatperizinan.com) ke keluarga zamrud di seluruh
src/. amber-400 dipertahankan (bintang rating & aksen kecil = emas
brand logo Kaaba; pasangan resmi palet zamrud+emas).

- amber-50..300  -> emerald-50..300  (tint halus)
- amber-500      -> emerald-600      (aksen kuat)
- amber-600      -> emerald-700
- amber-700      -> emerald-800
- amber-800      -> emerald-900
- amber-900/950  -> emerald-950
- amber-400      -> TETAP (emas)
- orange-*       -> emerald-* (ekuivalen terdekat)
"""
import re
import sys
from pathlib import Path

SRC = Path("/home/z/my-project/src")

AMBER = {
    50: "emerald-50",
    100: "emerald-100",
    200: "emerald-200",
    300: "emerald-300",
    500: "emerald-600",
    600: "emerald-700",
    700: "emerald-800",
    800: "emerald-900",
    900: "emerald-950",
    950: "emerald-950",
    # 400 = emas brand, dipertahankan apa adanya
}
ORANGE = {
    50: "emerald-50",
    100: "emerald-100",
    200: "emerald-200",
    300: "emerald-300",
    400: "emerald-400",
    500: "emerald-600",
    600: "emerald-700",
    700: "emerald-800",
    800: "emerald-900",
    900: "emerald-950",
    950: "emerald-950",
}

RX_AMBER = re.compile(r"amber-(\d+)")
RX_ORANGE = re.compile(r"orange-(\d+)")

def sub(match: re.Match) -> str:
    n = int(match.group(1))
    return AMBER.get(n, match.group(0))

def sub_orange(match: re.Match) -> str:
    n = int(match.group(1))
    return ORANGE.get(n, match.group(0))

total_files = 0
total_subs = 0

for f in SRC.rglob("*"):
    if f.suffix not in {".tsx", ".ts"}:
        continue
    if f.name == "globals.css":
        continue
    text = f.read_text(encoding="utf-8")
    new = RX_AMBER.sub(sub, text)
    new = RX_ORANGE.sub(sub_orange, new)
    if new != text:
        nsubs = len(RX_AMBER.findall(text)) + len(RX_ORANGE.findall(text))
        f.write_text(new, encoding="utf-8")
        total_files += 1
        total_subs += nsubs
        print(f"  {f.relative_to(SRC)}: {nsubs} substitution")

print(f"\nSELESAI: {total_subs} substitusi di {total_files} file.")
