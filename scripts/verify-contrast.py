#!/usr/bin/env python3
# ============================================================
# Task 49 — Verifikasi Kontras WCAG 2.2 Palet "Kiswah & Emas"
# Konversi OKLCH → sRGB → rasio kontras; standar:
#   teks normal ≥ 4.5 · teks besar ≥ 3.0 · non-teks ≥ 3.0
# ============================================================
import math

def oklch_to_srgb(L, C, H):
    h = math.radians(H)
    a, b = C * math.cos(h), C * math.sin(h)
    l_ = L + 0.3963377774 * a + 0.2158037573 * b
    m_ = L - 0.1055613458 * a - 0.0638541728 * b
    s_ = L - 0.0894841775 * a - 1.2914855480 * b
    l, m, s = l_**3, m_**3, s_**3
    r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
    g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
    bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    def enc(u):
        u = max(0.0, min(1.0, u))
        return 12.92 * u if u <= 0.0031308 else 1.055 * (u ** (1 / 2.4)) - 0.055
    return enc(r), enc(g), enc(bl)

def rel_lum(rgb):
    f = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (f(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def contrast(fg, bg):
    la, lb = rel_lum(fg), rel_lum(bg)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)

def tok(spec):
    L, C, H = spec
    return oklch_to_srgb(L, C, H)

# ---------------- Token (dari globals.css) ----------------
LIGHT = {
    "background": (0.985, 0.008, 85),
    "foreground": (0.24, 0.025, 70),
    "card": (0.998, 0.003, 85),
    "primary": (0.49, 0.09, 70),
    "primary-foreground": (0.985, 0.01, 85),
    "secondary": (0.955, 0.03, 85),
    "secondary-foreground": (0.35, 0.06, 70),
    "muted": (0.955, 0.012, 80),
    "muted-foreground": (0.48, 0.025, 75),
    "accent": (0.94, 0.045, 85),
    "accent-foreground": (0.35, 0.07, 70),
    "gold": (0.50, 0.105, 70),
    "gold-foreground": (0.99, 0.005, 85),
    "ring": (0.62, 0.15, 70),
    "border": (0.9, 0.02, 80),
}
DARK = {
    "background": (0.17, 0.012, 75),
    "foreground": (0.965, 0.012, 85),
    "card": (0.215, 0.015, 75),
    "primary": (0.82, 0.14, 80),
    "primary-foreground": (0.2, 0.03, 70),
    "secondary": (0.27, 0.015, 75),
    "secondary-foreground": (0.965, 0.012, 85),
    "muted": (0.27, 0.015, 75),
    "muted-foreground": (0.72, 0.02, 80),
    "accent": (0.3, 0.03, 80),
    "accent-foreground": (0.965, 0.012, 85),
    "gold": (0.82, 0.16, 80),
    "gold-foreground": (0.22, 0.04, 70),
    "ring": (0.82, 0.14, 80),
    "border": None,  # putih 10% di atas bg — dihitung manual di bawah
}

PAIRS = [
    # (fg, bg, minimum, label)
    ("foreground", "background", 4.5, "teks utama di kanvas"),
    ("foreground", "card", 4.5, "teks utama di kartu"),
    ("primary-foreground", "primary", 4.5, "teks tombol utama"),
    ("secondary-foreground", "secondary", 4.5, "teks chip sekunder"),
    ("accent-foreground", "accent", 4.5, "teks aksen/hover"),
    ("muted-foreground", "background", 4.5, "teks sekunder di kanvas"),
    ("muted-foreground", "card", 4.5, "teks sekunder di kartu"),
    ("gold-foreground", "gold", 4.5, "teks di badge emas"),
    ("gold", "background", 4.5, "teks emas di kanvas (harga/highlight)"),
    ("gold", "card", 4.5, "teks emas di kartu"),
    ("primary", "background", 3.0, "tombol primary vs kanvas (non-teks)"),
    ("ring", "background", 3.0, "fokus ring vs kanvas (non-teks)"),
    ("ring", "card", 3.0, "fokus ring vs kartu (non-teks)"),
]

def run(mode, T):
    print(f"\n=== MODE {mode.upper()} ===")
    ok_all = True
    for fg, bg, minimum, label in PAIRS:
        ratio = contrast(tok(T[fg]), tok(T[bg]))
        mark = "PASS" if ratio >= minimum else "GAGAL"
        if ratio < minimum:
            ok_all = False
        print(f"  [{mark}] {ratio:5.2f}:1 (min {minimum}) — {label}")
    return ok_all

ok_l = run("terang (gading)", LIGHT)
ok_d = run("gelap (kiswah)", DARK)

# border putih-10% mode gelap: blend manual di atas bg
bg = tok(DARK["background"])
white10 = tuple(0.9 * bg[i] + 0.1 * 1.0 for i in range(3))
r_border = contrast(white10, bg)
print(f"\n  [{'PASS' if r_border >= 1.15 else 'CEK'}] {r_border:5.2f}:1 — border putih-10% (non-teks halus, standar UI gelap)")

print("\nHASIL AKHIR:", "SEMUA PASS ✓" if (ok_l and ok_d) else "ADA YANG GAGAL ✗")
