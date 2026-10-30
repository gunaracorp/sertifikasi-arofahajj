#!/usr/bin/env python3
# ============================================================
# Task 51 — v2.2.0 "Revaluasi Harga" — naikkan SELURUH harga
# jual 30% (perintah owner) dengan presisi bedah:
#   • Harga jual KITA  : jasa, paket, langganan, VO, franchise
#   • TIDAK disentuh   : PNBP/biaya resmi, denda pajak, modal
#     dasar legal (50jt/10M), omzet (4,8M dll.), gaji/UMP,
#     kurs konversi PMI, KUR, rentang pasar notaris/uji lab,
#     testimoni (transaksi historis), riwayat rilis version.ts
# Kebijakan transformasi (dokumen CHANGELOG):
#   ×1,3 EKSAK. Tampilan string: "rb" utk hasil <1jt (integer),
#   format jt desimal-koma (maks 3dp), angka penuh bila pecahan
#   rb. Numeric: ceil 10.000 (<20jt). Langganan tahunan = 10×
#   bulanan baru; strike tahunan = 12× strike bulanan baru.
#   Threshold tier katalog ikut ×1,3 (2jt→2,6jt; 15jt→19,5jt)
#   agar distribusi entry/mid/premium identik.
# ============================================================
import json
import math
import pathlib
import re

R = pathlib.Path("/home/z/my-project")
X = 1.3
changed = {}


def note(f, n):
    changed[f] = changed.get(f, 0) + n


def ceil10k(v):
    return int(math.ceil(v / 10_000.0) * 10_000)


def trim_num(x):
    s = f"{x:.6f}".rstrip("0").rstrip(".")
    return s.replace(".", ",")


def fmt_new(v, had_unit, space):
    """Format rupiah baru gaya konsisten dg sumber."""
    if had_unit in ("rb", "ribu"):
        rb = v / 1000.0
        if rb < 1000 and abs(rb - round(rb)) < 1e-9:
            return f"Rp{space}{int(round(rb))}rb"
        if rb >= 1000 and abs(rb - round(rb)) < 1e-9:
            return f"Rp{space}{trim_num(rb / 1000)}jt"
        return f"Rp{space}{v:,.0f}".replace(",", ".")  # pecahan → angka penuh
    if had_unit in ("jt", "juta"):
        return f"Rp{space}{trim_num(v / 1_000_000)}jt" if had_unit == "jt" else f"Rp{space}{trim_num(v / 1_000_000)} juta"
    # tanpa unit → angka penuh bertitik
    return f"Rp{space}{v:,.0f}".replace(",", ".")


def scale_token(m):
    space = m.group(2)
    raw = m.group(3)
    unit = m.group(5) or ""
    # parse angka: ribuan bertitik ATAU polos, opsional desimal koma
    base = 1000 if unit in ("rb", "ribu") else 1_000_000 if unit in ("jt", "juta") else 1
    if re.fullmatch(r"\d{1,3}(?:\.\d{3})+", raw):
        val = int(raw.replace(".", ""))
    else:
        fm = re.fullmatch(r"(\d+)(?:,(\d+))?", raw)
        if not fm:
            return m.group(0)
        num = int(fm.group(1))
        frac = fm.group(2)
        val = (num + (int(frac) / 10 ** len(frac) if frac else 0)) * base
    had_unit = unit if unit else ""
    new = val * X
    if had_unit in ("rb", "ribu") and (new / 1000.0) % 1 != 0 and new < 1_000_000:
        new = int(math.ceil(new / 25_000.0) * 25_000)  # pembulatan kasir 25rb
    elif not had_unit:
        new = ceil10k(new)
    return fmt_new(int(round(new)), had_unit, space)


RP_TOKEN = re.compile(r"(Rp)(\s?)(\d[\d.,]*)( ?)(rb|ribu|jt|juta)?")


def scale_price_fields(path, field="price"):
    """Transform hanya nilai di dalam field='...' (string literal)."""
    p = R / path
    t = p.read_text(encoding="utf-8")

    def repl(m):
        inner = m.group(2)
        new = RP_TOKEN.sub(scale_token, inner)
        if new != inner:
            note(path, 1)
        return f'{m.group(1)}"{new}"'

    t2 = re.sub(rf'({field}: )"([^"]*)"', repl, t)
    p.write_text(t2, encoding="utf-8")


def apply_pairs(path, pairs):
    p = R / path
    t = p.read_text(encoding="utf-8")
    n0 = note_count = 0
    for old, new in pairs:
        c = t.count(old)
        if c == 0:
            print(f"  !! TAK KETEMU di {path}: {old[:60]!r}")
        t = t.replace(old, new)
        note_count += c
    note(path, note_count)
    p.write_text(t, encoding="utf-8")


# ============================================================
# 1) SUMBER HARGA TERSTRUKTUR — engine pada field price
# ============================================================
for f in ["src/lib/landing-data.ts", "src/lib/tax-services.ts",
          "src/lib/pmi-services.ts", "src/lib/catalog/certifications.ts"]:
    scale_price_fields(f, "price")
print("1) price fields 4 sumber dasar OK")

# ============================================================
# 2) pricing.ts & kepatuhan-pro.ts — numeric + tagline
# ============================================================
NUMERIC_MAP = [
    ("499_000", "650_000"), ("750_000", "975_000"),
    ("1_490_000", "1_940_000"), ("2_250_000", "2_925_000"),
    ("3_990_000", "5_190_000"), ("5_990_000", "7_790_000"),
    ("4_990_000", "6_500_000"), ("8_988_000", "11_700_000"),
    ("14_900_000", "19_400_000"), ("26_880_000", "35_100_000"),
    ("39_900_000", "51_900_000"), ("71_880_000", "93_480_000"),
    ("99_000", "130_000"), ("250_000", "325_000"),
    ("350_000", "455_000"), ("600_000", "780_000"),
    ("650_000", "845_000"), ("1_050_000", "1_365_000"),
    ("500_000", "650_000"), ("900_000", "1_170_000"),
    ("1_500_000", "1_950_000"), ("2_500_000", "3_250_000"),
    ("3_500_000", "4_550_000"), ("6_000_000", "7_800_000"),
    ("1_200_000", "1_560_000"), ("2_000_000", "2_600_000"),
    ("4_000_000", "5_200_000"),
]
# Boundary-safe: 500_000 TIDAK boleh kena di dalam 1_500_000/2_500_000 dkk.
for f in ["src/lib/pricing.ts", "src/lib/kepatuhan-pro.ts"]:
    p = R / f
    t = p.read_text(encoding="utf-8")
    n = 0
    for old, new in NUMERIC_MAP:
        pat = re.compile(rf"(?<![\d_]){re.escape(old)}(?![\d_])")
        t, c = pat.subn(new, t)
        n += c
    p.write_text(t, encoding="utf-8")
    note(f, n)
# Verifikasi: tidak boleh ada literal IDR tak terpetakan tersisa
for f in ["src/lib/pricing.ts", "src/lib/kepatuhan-pro.ts"]:
    t = (R / f).read_text(encoding="utf-8")
    leftover = sorted(set(re.findall(r"(?<![\d_])\d{1,3}(?:_\d{3})+(?![\d_])", t)))
    print(f"   literal IDR tersisa di {f}: {leftover}")
apply_pairs("src/lib/pricing.ts", [
    ("hemat Rp 2,9 juta dibanding bulanan", "hemat Rp 5,2 juta dibanding bulanan"),
])
apply_pairs("src/lib/kepatuhan-pro.ts", [
    ("Mulai Rp 499rb/Bulan", "Mulai Rp 650rb/Bulan"),
])
print("2) pricing.ts + kepatuhan-pro.ts OK")

# ============================================================
# 3) virtual-office-data.ts — price fields + numerik + konten
# ============================================================
p = R / "src/lib/virtual-office-data.ts"
t = p.read_text(encoding="utf-8")
for field in ["priceMonthly", "priceYearly"]:
    def repl(m, field=field):
        inner = m.group(2)
        new = RP_TOKEN.sub(scale_token, inner)
        if new != inner:
            note("src/lib/virtual-office-data.ts", 1)
        return f'{m.group(1)}"{new}"'
    t = re.sub(rf'({field}: )"([^"]*)"', repl, t)
for old, new in [("priceNumeric: 4500000", "priceNumeric: 5850000"),
                 ("priceNumeric: 7500000", "priceNumeric: 9750000"),
                 ("priceNumeric: 9900000", "priceNumeric: 12870000"),
                 ("priceNumeric: 35000000", "priceNumeric: 45500000"),
                 ("priceNumeric: 250000", "priceNumeric: 325000"),
                 ("priceNumeric: 12000000", "priceNumeric: 15600000")]:
    c = t.count(old)
    t = t.replace(old, new)
    note("src/lib/virtual-office-data.ts", c)
p.write_text(t, encoding="utf-8")
apply_pairs("src/lib/virtual-office-data.ts", [
    ("hanya Rp 200rb/jam (harga langganan)", "hanya Rp 260rb/jam (harga langganan)"),
    ("Mulai Rp 250rb/jam untuk ruangan 4-8 orang di lokasi standar, dan Rp 350-450rb/jam untuk ruangan premium",
     "Mulai Rp 325rb/jam untuk ruangan 4-8 orang di lokasi standar, dan Rp 455-585rb/jam untuk ruangan premium"),
    ("(mulai Rp 500rb/bulan). Serviced office memberi kantor privat siap pakai dengan kontrak fleksibel (mulai Rp 3,5jt/bulan)",
     "(mulai Rp 650rb/bulan). Serviced office memberi kantor privat siap pakai dengan kontrak fleksibel (mulai Rp 4,55jt/bulan)"),
    ("Jasa administrasi mutasi mulai Rp 1,5jt", "Jasa administrasi mutasi mulai Rp 1,95jt"),
    ("mulai Rp 500rb/bulan atau Rp 4,5jt/tahun — sekitar biaya kopi 150rb/hari",
     "mulai Rp 650rb/bulan atau Rp 5,85jt/tahun — sekitar biaya kopi 150rb/hari"),
    ("Rp 4,5jt/tahun — lebih murah dari risiko kontrak batal", "Rp 5,85jt/tahun — lebih murah dari risiko kontrak batal"),
    ("(mulai Rp 500rb/bln) + NIB gratis", "(mulai Rp 650rb/bln) + NIB gratis"),
    ("biaya mulai Rp 500rb.", "biaya mulai Rp 650rb."),
    ("(mulai Rp 500rb, 2-3 hari)", "(mulai Rp 650rb, 2-3 hari)"),
])
print("3) virtual-office-data.ts OK")

# ============================================================
# 4) layanan-500.json — harga/harga_diskon/hemat (konvensi ceil10k)
# ============================================================
pj = R / "src/data/layanan-500.json"
raw_json = pj.read_text(encoding="utf-8")
m2 = re.match(r".*?\n(\s*)\"", raw_json, re.S)
JSON_INDENT = len(m2.group(1)) if m2 else 2
data = json.loads(raw_json)
# validasi konvensi asli dulu
ok = sum(1 for x in data if math.ceil(x["harga"] * (1 - x["diskon"]) / 10_000) * 10_000 == x["harga_diskon"])
print(f"   validasi konvensi ceil10k asli: {ok}/500")
n = 0
for x in data:
    h0 = x["harga"]
    h1 = ceil10k(h0 * X)
    hd1 = ceil10k(h1 * (1 - x["diskon"]))
    if (h1, hd1) != (h0, x["harga_diskon"]):
        n += 1
    x["harga"] = h1
    x["harga_diskon"] = hd1
    x["hemat"] = h1 - hd1
pj.write_text(json.dumps(data, ensure_ascii=False, indent=JSON_INDENT) + "\n", encoding="utf-8")
note("src/data/layanan-500.json", n)
print("4) layanan-500.json OK")

# ============================================================
# 5) katalog-v2 (catatan Hemat + tier) & katalog-v3 (tier)
# ============================================================
p = R / "src/lib/katalog-v2.ts"
t = p.read_text(encoding="utf-8")
t2 = re.sub(r"(Hemat )Rp ?([\d.,]+ ?(?:rb|jt)?)",
            lambda m: m.group(1) + RP_TOKEN.sub(scale_token, "Rp" + m.group(2)), t)
note("src/lib/katalog-v2.ts", 0 if t2 == t else 1)
t = t2
t = t.replace("if (price < 2_000_000)", "if (price < 2_600_000)")
t = t.replace("if (price < 15_000_000)", "if (price < 19_500_000)")
p.write_text(t, encoding="utf-8")
p = R / "src/lib/katalog-v3.ts"
t = p.read_text(encoding="utf-8")
t = t.replace("if (price < 2_000_000)", "if (price < 2_600_000)")
t = t.replace("if (price < 15_000_000)", "if (price < 19_500_000)")
p.write_text(t, encoding="utf-8")
print("5) katalog-v2/v3 OK")

# ============================================================
# 6) PROSE — pasangan eksplisit (hanya harga jual kita)
# ============================================================
apply_pairs("src/lib/blog-content.ts", [
    ("kami tawarkan mulai Rp 350 ribu", "kami tawarkan mulai Rp 455 ribu"),
    ("milik kami mulai Rp 1,2 juta", "milik kami mulai Rp 1,56 juta"),
    ("paket internasional kami mulai Rp 45 juta", "paket internasional kami mulai Rp 58,5 juta"),
    ("kami mulai Rp 12 juta", "kami mulai Rp 15,6 juta"),
    ("pengurusannya mulai Rp 2 juta per dokumen", "pengurusannya mulai Rp 2,6 juta per dokumen"),
    ("pendampingan kami mulai Rp 2 juta per dokumen", "pendampingan kami mulai Rp 2,6 juta per dokumen"),
    ("paket Bisnis mulai Rp 3,5 juta", "paket Bisnis mulai Rp 4,55 juta"),
    ("biaya mulai Rp 750 ribu", "biaya mulai Rp 975 ribu"),
    ("biaya mulai Rp 3,5 juta", "biaya mulai Rp 4,55 juta"),
    ("biaya mulai Rp 25 juta", "biaya mulai Rp 32,5 juta"),
])
apply_pairs("src/lib/seo-content.ts", [
    ('cost: "Rp 350rb (jasa kami, termasuk konsultasi KBLI)', 'cost: "Rp 455rb (jasa kami, termasuk konsultasi KBLI)'),
    ("Mulai Rp 350rb per KBLI (jasa pemetaan + pengurusan)", "Mulai Rp 455rb per KBLI (jasa pemetaan + pengurusan)"),
    ("SPPL mulai Rp 750rb • UKL-UPL mulai Rp 3,5jt • AMDAL mulai Rp 25jt",
     "SPPL mulai Rp 975rb • UKL-UPL mulai Rp 4,55jt • AMDAL mulai Rp 32,5jt"),
])
apply_pairs("src/lib/faq-data.ts", [
    ("Kenapa harga layanan mulai Rp 350 ribu? Itu", "Kenapa harga layanan mulai Rp 455 ribu? Itu"),
    ("Rp 350 ribu adalah titik masuk", "Rp 455 ribu adalah titik masuk"),
    ("Why do services start from Rp 350 thousand", "Why do services start from Rp 455 thousand"),
    ("Rp 350 thousand is the entry point", "Rp 455 thousand is the entry point"),
    ("الأسعار من 350 ألف روبية", "الأسعار من 455 ألف روبية"),
    ("مبلغ 350 ألف روبية", "مبلغ 455 ألف روبية"),
    ("empiezan en Rp 350 mil", "empiezan en Rp 455 mil"),
    ("Rp 350 mil es el punto de entrada", "Rp 455 mil es el punto de entrada"),
])
apply_pairs("src/lib/comparisons.ts", [
    ("jasa opsional mulai Rp350 ribu", "jasa opsional mulai Rp455 ribu"),
    ("jasa pendampingan opsional Rp350-750 ribu", "jasa pendampingan opsional Rp455-975 ribu"),
    ("jasa opsional Rp350-750 ribu", "jasa opsional Rp455-975 ribu"),
])
apply_pairs("src/lib/catalog/detail-licenses.ts", [
    ("Mulai Rp3,5 juta untuk paket TD", "Mulai Rp4,55 juta untuk paket TD"),
    ("Mulai Rp12,5 juta per standar", "Mulai Rp16,25 juta per standar"),
    ("Mulai Rp10 juta untuk izin", "Mulai Rp13 juta untuk izin"),
])
apply_pairs("src/app/api/chat/route.ts", [
    ("jasa Rp 15-25jt", "jasa Rp 19,5-32,5jt"),
    ("jasa Rp 25-40jt", "jasa Rp 32,5-52jt"),
    ("Rp 5-15jt/musim", "Rp 6,5-19,5jt/musim"),
    ('"GO UMRAH!" Rp 45jt', '"GO UMRAH!" Rp 58,5jt'),
    ('"UPGRADE PPIU KE PIHK" Rp 30jt', '"UPGRADE PPIU KE PIHK" Rp 39jt'),
    ("Rp 30jt (9001+14001+45001)", "Rp 39jt (9001+14001+45001)"),
    ('"PERIZINAN HOTEL COMPLETE" Rp 55jt', '"PERIZINAN HOTEL COMPLETE" Rp 71,5jt'),
    ("jasa mulai Rp 450rb untuk registrasi", "jasa mulai Rp 585rb untuk registrasi"),
])
apply_pairs("src/app/api/roadmap/route.ts", [
    ("Rp350.000", "Rp455.000"),
    ("Rp3,5-6,5 juta", "Rp4,55-8,45 juta"),
    ("Rp150.000", "Rp195.000"),
    ("Rp2,5 juta", "Rp3,25 juta"),
    ("Rp900.000", "Rp1.170.000"),
    ("Rp2 juta", "Rp2,6 juta"),
    ("Rp1,2 juta (subsidi UMKM", "Rp1,56 juta (subsidi UMKM"),
    ("Rp12,5 juta", "Rp16,25 juta"),
    ("Rp750rb/bln (jasa)", "Rp975rb/bln (jasa)"),
    ("Rp1,5 juta/tahun", "Rp1,95 juta/tahun"),
    ("Rp250rb-2,5 jt (jasa)", "Rp325rb-3,25 jt (jasa)"),
])
apply_pairs("src/app/mitra/page.tsx", [
    ('"Rp4 – 7 jt"', '"Rp5,2 – 9,1 jt"'),
    ('"Rp15 – 35 jt"', '"Rp19,5 – 45,5 jt"'),
    ('"Rp500 rb – 3 jt / bln"', '"Rp650 rb – 3,9 jt / bln"'),
    ("Rp25 juta sekali", "Rp32,5 juta sekali"),
    ("Rp100 juta untuk hak kaw", "Rp130 juta untuk hak kaw"),
])
apply_pairs("src/components/landing/catalog-teaser.tsx", [
    ("mulai Rp 450 ribu.", "mulai Rp 585 ribu."),
])
apply_pairs("src/components/landing/seo-jsonld.tsx", [
    ('priceRange: "Rp 150.000 - Rp 45.000.000"', 'priceRange: "Rp 195.000 - Rp 58.500.000"'),
])
apply_pairs("src/components/admin/notifications.tsx", [
    ('"Rp 7.500.000"', '"Rp 9.750.000"'),
])
apply_pairs("src/components/landing/hero.tsx", [
    ('line-through">Rp 500rb</p>', 'line-through">Rp 650rb</p>'),
])
apply_pairs("src/components/landing/header.tsx", [
    ("mulai Rp 499rb", "mulai Rp 650rb"),
])
apply_pairs("src/app/kepatuhan-pro/page.tsx", [
    ("Rp 499rb/bulan", "Rp 650rb/bulan"),
])
apply_pairs("src/app/virtual-office/page.tsx", [
    ("— Mulai Rp 500rb/bln", "— Mulai Rp 650rb/bln"),
    ("Virtual Office Address mulai Rp 500rb/bulan atau Rp 4,5jt/tahun", "Virtual Office Address mulai Rp 650rb/bulan atau Rp 5,85jt/tahun"),
    ("Virtual Office Address mulai Rp 500rb/bulan (Rp 4,5jt/tahun)", "Virtual Office Address mulai Rp 650rb/bulan (Rp 5,85jt/tahun)"),
])
print("6) prose files OK")

# ============================================================
# 7) i18n — 14 bahasa + CJK
# ============================================================
apply_pairs("src/lib/i18n/translations-core.ts", [
    ("Mulai dari Rp 350 ribu", "Mulai dari Rp 455 ribu"),
    ("Starting from Rp 350 thousand", "Starting from Rp 455 thousand"),
])
apply_pairs("src/lib/i18n/translations-a.ts", [
    ("35万印尼盾起", "45.5万印尼盾起"),
    ("35万ルピアから", "45.5万ルピアから"),
    ("Mula Rp 350,000", "Mula Rp 455,000"),
    ("Bermula Rp 350 ribu", "Bermula Rp 455 ribu"),
])
apply_pairs("src/lib/i18n/translations-b.ts", [
    ("350 हज़ार", "455 हज़ार"), ("350 ஆயிரம்", "455 ஆயிரம்"),
    ("350 ألف", "455 ألف"), ("350 هزار", "455 هزار"),
    ("350 ہزار", "455 ہزار"), ("350 אלף", "455 אלף"),
])
apply_pairs("src/lib/i18n/translations-c.ts", [
    ("350 mil rupias indonésias", "455 mil rupias indonésias"),  # spesifik dulu
    ("350 mil rupias", "455 mil rupias"),
    ("350 000 roupies", "455 000 roupies"),
    ("350.000 Rupien", "455.000 Rupien"),
    ("350 mila rupie", "455 mila rupie"),
    ("350.000 roepia", "455.000 roepia"),
    ("350 χιλιάδες", "455 χιλιάδες"),
])
apply_pairs("src/lib/i18n/translations-d.ts", [
    ("350 тысяч", "455 тысяч"), ("350 tysięcy", "455 tysięcy"),
    ("350 тисяч", "455 тисяч"),
])
print("7) i18n OK")

# ============================================================
# LAPORAN
# ============================================================
print("\n=== RINGKASAN PER FILE ===")
for f, n in sorted(changed.items(), key=lambda kv: -kv[1]):
    print(f"  {n:>4}  {f}")
print(f"TOTAL penggantian: {sum(changed.values())}")
