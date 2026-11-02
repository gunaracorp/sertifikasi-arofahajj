#!/usr/bin/env python3
# ============================================================
# Task 49 — Ekstraksi Palet Warna ASLI dari Logo Arofa Hajj
# Sumber: upload/logo-arofahajj-pt-arofah-global-sistem.png
# Output: dominan + rata-rata per klaster warna (RGBA, alpha>128)
# ============================================================
from PIL import Image
import colorsys
from collections import Counter

SRC = "/home/z/my-project/upload/logo-arofahajj-pt-arofah-global-sistem.png"
img = Image.open(SRC).convert("RGBA")
print(f"ukuran: {img.size}, mode: {img.mode}")

px = list(img.getdata())
opaque = [(r, g, b) for (r, g, b, a) in px if a > 128]
print(f"piksel opak: {len(opaque)} / {len(px)}")

# --- kuantisasi ke 4-bit per kanal untuk klaster kasar ---
def q4(c):
    return tuple(v >> 4 for v in c)

clusters = Counter(q4(c) for c in opaque)
print("\n=== 12 klaster dominan (kuantum 4-bit) ===")
total = len(opaque)
for key, n in clusters.most_common(12):
    # rata-rata warna asli dalam klaster
    members = [c for c in opaque if q4(c) == key]
    n_m = len(members)
    r = sum(c[0] for c in members) // n_m
    g = sum(c[1] for c in members) // n_m
    b = sum(c[2] for c in members) // n_m
    h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    print(
        f"#{r:02X}{g:02X}{b:02X}  {100*n/total:5.1f}%  "
        f"H={h*360:5.1f}° L={l*100:4.0f}% S={s*100:4.0f}%"
    )

# --- luma & kontras helper ---
def rel_lum(hex6):
    r, g, b = (int(hex6[i:i+2], 16) / 255 for i in (0, 2, 4))
    f = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)

def contrast(a, b):
    la, lb = rel_lum(a), rel_lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)

print("\n=== contoh pasangan kontras (WCAG) ===")
pairs = [
    ("0B3D2E", "F5C542"),  # deep emerald vs emas terang
    ("0B3D2E", "FFFFFF"),
    ("F8FAF7", "0B3D2E"),
    ("F8FAF7", "B58A1B"),
    ("0B3D2E", "B58A1B"),
]
for a, b in pairs:
    print(f"  #{a} vs #{b} = {contrast(a,b):.2f}:1")
