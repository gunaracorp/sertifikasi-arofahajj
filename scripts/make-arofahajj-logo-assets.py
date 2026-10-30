#!/usr/bin/env python3
# ============================================================
# AROFAHAJJ UNIVERSE — Generator Aset Identitas dari Logo ASLI
# Sumber: upload/logo-arofahajj-pt-arofah-global-sistem.png
# (Kaaba emas + "Arofa Hajj" + عرفة — properti resmi
#  PT AROFAH GLOBAL SISTEM, NIB 2503250053856)
#
# Output:
#   public/logo.png            — logo penuh (3x LANCZOS)
#   public/logo-icon.png       — ikon marka Kaaba 512x512 (transparan)
#   public/logo-icon-white.png — versi putih 512x512 (maskable/dark)
#   public/logo.svg            — wrapper SVG (base64 PNG asli)
#   public/favicon.svg         — wrapper SVG ikon
#   public/og-arofahajj.png    — OG image 1200x630 branded
# ============================================================
import base64
import io
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SRC = "/home/z/my-project/upload/logo-arofahajj-pt-arofah-global-sistem.png"
PUB = "/home/z/my-project/public"

src = Image.open(SRC).convert("RGBA")
W, H = src.size
alpha = src.getchannel("A")

# ------------------------------------------------------------
# 1) Deteksi band konten (pisah Kaaba vs teks) via baris alpha
# ------------------------------------------------------------
px = alpha.load()
rows = [any(px[x, y] > 8 for x in range(W)) for y in range(H)]
bands, start = [], None
for y, on in enumerate(rows):
    if on and start is None:
        start = y
    if not on and start is not None:
        bands.append((start, y))
        start = None
if start is not None:
    bands.append((start, H))
# gabung band berjarak < 6px
merged = []
for b in bands:
    if merged and b[0] - merged[-1][1] < 6:
        merged[-1] = (merged[-1][0], b[1])
    else:
        merged.append(list(b))
print("bands:", merged)

kaaba_band = merged[0]  # band teratas = marka Kaaba
kaaba = src.crop((0, kaaba_band[0], W, kaaba_band[1]))
# bbox presisi dalam band
kb = kaaba.getchannel("A").getbbox()
kaaba = kaaba.crop(kb)
print("kaaba mark:", kaaba.size)

# ------------------------------------------------------------
# 2) logo.png — logo penuh 3x
# ------------------------------------------------------------
logo3x = src.resize((W * 3, H * 3), Image.LANCZOS)
logo3x.save(f"{PUB}/logo.png", optimize=True)

# ------------------------------------------------------------
# 3) logo-icon.png — marka Kaaba center 512x512 (padding 12%)
# ------------------------------------------------------------
def make_icon(im, size=512, pad_ratio=0.12, tint=None):
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    inner = int(size * (1 - 2 * pad_ratio))
    ratio = min(inner / im.width, inner / im.height)
    nw, nh = max(1, int(im.width * ratio)), max(1, int(im.height * ratio))
    r = im.resize((nw, nh), Image.LANCZOS)
    if tint is not None:
        solid = Image.new("RGBA", r.size, tint)
        r = Image.composite(solid, Image.new("RGBA", r.size, (0, 0, 0, 0)), r.getchannel("A"))
    canvas.paste(r, ((size - nw) // 2, (size - nh) // 2), r)
    return canvas

icon = make_icon(kaaba)
icon.save(f"{PUB}/logo-icon.png", optimize=True)

# maskable: konten lebih kecil (safe zone 80%)
icon_mask = make_icon(kaaba, pad_ratio=0.22)
icon_mask.save(f"{PUB}/logo-icon-white.png", optimize=True)

# ------------------------------------------------------------
# 4) SVG wrappers (embed base64 — tampil di semua browser)
# ------------------------------------------------------------
def svg_wrap(png_bytes, w, h, label):
    b64 = base64.b64encode(png_bytes).decode("ascii")
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
        f'width="{w}" height="{h}" role="img" aria-label="{label}">'
        f'<image width="{w}" height="{h}" href="data:image/png;base64,{b64}"/></svg>'
    )

buf_icon = io.BytesIO(); icon.save(buf_icon, "PNG")
buf_logo = io.BytesIO(); logo3x.save(buf_logo, "PNG")
with open(f"{PUB}/favicon.svg", "w") as f:
    f.write(svg_wrap(buf_icon.getvalue(), 512, 512, "Arofahajj Universe — Kaaba"))
with open(f"{PUB}/logo.svg", "w") as f:
    f.write(svg_wrap(buf_logo.getvalue(), logo3x.width, logo3x.height, "Arofa Hajj — PT AROFAH GLOBAL SISTEM"))

# ------------------------------------------------------------
# 5) OG image 1200x630 — branded Arofahajj Universe
# ------------------------------------------------------------
GW, GH = 1200, 630
GOLD = (201, 162, 75)
GOLD_HI = (232, 200, 120)
DEEP = (23, 18, 8)  # kiswah — hitam hangat senada palet situs (Task 49)
og = Image.new("RGB", (GW, GH), DEEP)
d = ImageDraw.Draw(og)
# gradasi vertikal halus
for y in range(GH):
    t = y / GH
    d.line([(0, y), (GW, y)], fill=(int(DEEP[0] + 10 * (1 - t)), int(DEEP[1] + 14 * (1 - t)), int(DEEP[2] + 10 * (1 - t))))
# glow radial emas di belakang logo
glow = Image.new("L", (GW, GH), 0)
gd = ImageDraw.Draw(glow)
cx, cy, rr = GW // 2, 235, 300
gd.ellipse((cx - rr, cy - rr, cx + rr, cy + rr), fill=70)
glow = glow.filter(ImageFilter.GaussianBlur(90))
og = Image.composite(Image.new("RGB", (GW, GH), (48, 40, 24)), og, glow)
d = ImageDraw.Draw(og)
# ring emas tipis
d.ellipse((cx - 150, cy - 150, cx + 150, cy + 150), outline=GOLD, width=2)
# logo Kaaba di tengah ring
mark = kaaba.resize((190, int(190 * kaaba.height / kaaba.width)), Image.LANCZOS)
og.paste(mark, (cx - mark.width // 2, cy - mark.height // 2), mark)
# teks
def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

f_title = font("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 64)
f_sub = font("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 30)
f_small = font("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)

def center_text(y, text, fnt, fill):
    tw = d.textlength(text, font=fnt)
    d.text(((GW - tw) / 2, y), text, font=fnt, fill=fill)

center_text(430, "Arofahajj Universe", f_title, GOLD_HI)
center_text(515, "Haji & Umrah  ·  Perizinan Usaha  ·  Sertifikasi", f_sub, (238, 232, 218))
center_text(566, "PT AROFAH GLOBAL SISTEM  —  arofahajj.com", f_small, (168, 156, 132))
# garis aksen emas
d.line([(GW / 2 - 260, 500), (GW / 2 + 260, 500)], fill=GOLD, width=2)
og.save(f"{PUB}/og-arofahajj.png", optimize=True)

print("OK — semua aset identitas Arofahajj dibuat dari logo ASLI")
