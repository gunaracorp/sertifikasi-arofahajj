#!/usr/bin/env python3
"""
Task 49 — Audit kontras pasangan warna FOOTER (gold footer dark).
Menghitung rasio kontras WCAG 2.2 untuk semua pairing kritikal
footer di atas permukaan gelap footer & deck, dua arah sesuai
kebijakan owner: bg gelap → teks terang; bg terang → teks gelap.
"""
import math

# ---------- OKLCH → sRGB (implementasi ringkas) ----------
def oklch_to_srgb(L, C, H):
    hr = math.radians(H)
    a, b = C * math.cos(hr), C * math.sin(hr)
    l_ = L + 0.3963377774 * a + 0.2158037573 * b
    m_ = L - 0.1055613458 * a - 0.0638541728 * b
    s_ = L - 0.0894841775 * a - 1.2914855480 * b
    l, m, s = l_**3, m_**3, s_**3
    r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
    g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
    bb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    def gam(u):
        u = max(0.0, min(1.0, u))
        return 12.92 * u if u <= 0.0031308 else 1.055 * (u ** (1 / 2.4)) - 0.055
    return tuple(round(gam(c) * 255) for c in (r, g, bb))

def hex2rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def srgb_to_lin(c):
    c /= 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def lum(rgb):
    r, g, b = (srgb_to_lin(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def ratio(fg, bg):
    l1, l2 = sorted((lum(fg), lum(bg)), reverse=True)
    return (l1 + 0.05) / (l2 + 0.05)

def blend(fg_hex, alpha, bg_rgb):
    f = hex2rgb(fg_hex)
    return tuple(round(alpha * f[i] + (1 - alpha) * bg_rgb[i]) for i in range(3))

# ---------- permukaan footer ----------
SURF = oklch_to_srgb(0.175, 0.025, 78)   # footer utama (kiswah)
DECK = oklch_to_srgb(0.205, 0.03, 78)    # summit deck
AMBER_500 = oklch_to_srgb(0.769, 0.188, 70.08)  # tombol CTA

AMBER = {
    50: "#fffbeb", 100: "#fef3c7", 200: "#fde68a",
    300: "#fcd34d", 400: "#fbbf24", 500: "#f59e0b", 950: "#451a03",
}

TESTS = [
    # (label, fg_rgb, bg_rgb, ambang)
    ("Teks utama amber-50/90 di kiswah",        blend(AMBER[50], 0.90, SURF), SURF, 4.5),
    ("Teks deskripsi amber-100/70 di kiswah",   blend(AMBER[100], 0.70, SURF), SURF, 4.5),
    ("Teks legal amber-100/50 di kiswah",       blend(AMBER[100], 0.50, SURF), SURF, 4.5),
    ("Heading kolom amber-300 di kiswah",       hex2rgb(AMBER[300]), SURF, 4.5),
    ("Link footer amber-300 di kiswah",         hex2rgb(AMBER[300]), SURF, 4.5),
    ("Ikon aksen amber-400 di kiswah",          hex2rgb(AMBER[400]), SURF, 3.0),
    ("Brand 'Arofahajj' amber-400 di kiswah",   hex2rgb(AMBER[400]), SURF, 4.5),
    ("Badge ticker amber-100/75 di kiswah",     blend(AMBER[100], 0.75, SURF), SURF, 4.5),
    ("Teks CTA amber-950 di tombol amber-500",  hex2rgb(AMBER[950]), AMBER_500, 4.5),
    ("Heading deck amber-300 di deck 0.205",    hex2rgb(AMBER[300]), DECK, 4.5),
    ("Teks deck amber-100/70 di deck",          blend(AMBER[100], 0.70, DECK), DECK, 4.5),
    ("CTA sekunder amber-100 di deck (white/5)", blend(AMBER[100], 0.95, DECK), DECK, 4.5),
    ("Status 'operasional' amber-200 di kiswah", blend(AMBER[200], 0.90, SURF), SURF, 4.5),
    ("Jam WIB amber-100/75 di kiswah",          blend(AMBER[100], 0.75, SURF), SURF, 4.5),
]

print(f"{'Pairing':<44} {'Rasio':>7}  Ambang  Hasil")
print("-" * 72)
passed = 0
for label, fg, bg, need in TESTS:
    r = ratio(fg, bg)
    ok = r >= need
    passed += ok
    print(f"{label:<44} {r:>6.2f}:1   {need:>4.1f}   {'PASS' if ok else 'GAGAL'}")
print("-" * 72)
print(f"HASIL: {passed}/{len(TESTS)} PASS (WCAG 2.2 — normal text 4.5, ikon/UI 3.0)")
