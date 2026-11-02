#!/usr/bin/env python3
"""Gelombang 2 — sisa harga jual kita yang lolos dari wave-1
(varian FAQ, komponen VO, header EN, bundel katalog-lengkap penuh)."""
import pathlib

R = pathlib.Path("/home/z/my-project")
MISS = []

def ap(path, pairs):
    p = R / path
    t = p.read_text(encoding="utf-8")
    for old, new in pairs:
        if old not in t:
            MISS.append(f"{path} :: {old[:70]}")
            continue
        t = t.replace(old, new)
    p.write_text(t, encoding="utf-8")

ap("src/app/api/chat/route.ts", [
    ('"GO HAJI PLUS!" Rp 80jt', '"GO HAJI PLUS!" Rp 104jt'),
    ('"LEGALITAS LENGKAP STARTUP" Rp 25jt', '"LEGALITAS LENGKAP STARTUP" Rp 32,5jt'),
    ("paket pendirian PT mulai Rp 3jt, PPIU mulai Rp 15jt",
     "paket pendirian PT mulai Rp 3,9jt, PPIU mulai Rp 19,5jt"),
])
ap("src/app/bumdes/page.tsx", [
    ('price: "Rp 1,8jt / unit"', 'price: "Rp 2,34jt / unit"'),
])
ap("src/app/mitra/page.tsx", [
    ('avg: "Rp1,5 – 2,5 jt"', 'avg: "Rp1,95 – 3,25 jt"'),
    ('avg: "Rp3 – 6 jt"', 'avg: "Rp3,9 – 7,8 jt"'),
    ('avg: "Rp5 – 12 jt"', 'avg: "Rp6,5 – 15,6 jt"'),
    ('avg: "Rp4 – 10 jt"', 'avg: "Rp5,2 – 13 jt"'),
    ('avg: "Rp1,2 – 3 jt / thn"', 'avg: "Rp1,56 – 3,9 jt / thn"'),
])
ap("src/app/paket-usaha/page.tsx", [
    ('price: "Rp 6,9jt"', 'price: "Rp 8,97jt"'),
])
ap("src/lib/blog-content.ts", [
    ("Paket jasa lengkap kami mulai dari Rp 3,5 juta termasuk akta",
     "Paket jasa lengkap kami mulai dari Rp 4,55 juta termasuk akta"),
])
ap("src/lib/seo-content.ts", [
    ("Mulai Rp 3,5jt (jasa + akta; biaya resmi notaris sesuai modal)",
     "Mulai Rp 4,55jt (jasa + akta; biaya resmi notaris sesuai modal)"),
    ("Rp 1,2jt (jasa pendampingan penuh)", "Rp 1,56jt (jasa pendampingan penuh)"),
    ("PIRT mulai Rp 1,5jt • MD BPOM mulai Rp 2,5jt (jasa, uji lab diatur terpisah)",
     "PIRT mulai Rp 1,95jt • MD BPOM mulai Rp 3,25jt (jasa, uji lab diatur terpisah)"),
    ("Mulai Rp 2jt per dokumen (jasa; biaya resmi daerah diatur terpisah)",
     "Mulai Rp 2,6jt per dokumen (jasa; biaya resmi daerah diatur terpisah)"),
    ("Mulai Rp 1,5jt (jasa + akta notaris)", "Mulai Rp 1,95jt (jasa + akta notaris)"),
])
ap("src/lib/catalog/detail-tax-pmi.ts", [
    ("Mulai Rp750 ribu/bulan untuk:", "Mulai Rp975 ribu/bulan untuk:"),
])
ap("src/lib/katalog-lengkap.ts", [
    ("paket legalitas perusahaan (R.6) mulai Rp 3 juta dan PPIU mulai Rp 15 juta",
     "paket legalitas perusahaan (R.6) mulai Rp 3,9 juta dan PPIU mulai Rp 19,5 juta"),
    ("diskon bundel Rp 6 juta", "diskon bundel Rp 7,8 juta"),
    ("CV Dasar Rp 2,25 juta; CV + Izin Rp 4,5 juta; CV + Izin + Virtual Office Rp 6,9 juta.",
     "CV Dasar Rp 2,93 juta; CV + Izin Rp 5,85 juta; CV + Izin + Virtual Office Rp 8,97 juta."),
    ("Firma Dasar Rp 2,25 juta; Firma + Izin Rp 4,5 juta; Firma + Izin + Virtual Office Rp 6,9 juta.",
     "Firma Dasar Rp 2,93 juta; Firma + Izin Rp 5,85 juta; Firma + Izin + Virtual Office Rp 8,97 juta."),
    ("Persekutuan Perdata Dasar Rp 2,25 juta; + Izin Rp 4,5 juta; + Izin + Virtual Office Rp 6,9 juta.",
     "Persekutuan Perdata Dasar Rp 2,93 juta; + Izin Rp 5,85 juta; + Izin + Virtual Office Rp 8,97 juta."),
    ("Yayasan Dasar Rp 3 juta; Yayasan + Izin Rp 6 juta; Yayasan + Izin + Virtual Office Rp 8,4 juta.",
     "Yayasan Dasar Rp 3,9 juta; Yayasan + Izin Rp 7,8 juta; Yayasan + Izin + Virtual Office Rp 10,92 juta."),
    ("PMA Dasar Rp 5,25 juta; PMA + Izin Rp 10,5 juta; PMA + Izin + Virtual Office Rp 12,4 juta.",
     "PMA Dasar Rp 6,83 juta; PMA + Izin Rp 13,65 juta; PMA + Izin + Virtual Office Rp 16,12 juta."),
])
ap("src/app/virtual-office/page.tsx", [
    ("Mulai Rp 500rb/bulan (Rp 4,5jt/tahun) untuk alamat standar",
     "Mulai Rp 650rb/bulan (Rp 5,85jt/tahun) untuk alamat standar"),
    ('Mulai <strong className="text-gold">Rp 500rb/bulan</strong>',
     'Mulai <strong className="text-gold">Rp 650rb/bulan</strong>'),
])
ap("src/components/landing/virtual-office.tsx", [
    ('Mulai <strong className="text-gold">Rp 500rb/bulan</strong>',
     'Mulai <strong className="text-gold">Rp 650rb/bulan</strong>'),
])
ap("src/components/landing/header.tsx", [
    ("Monthly LKPM & tax care, from Rp 499k", "Monthly LKPM & tax care, from Rp 650k"),
])

print("MISS:", len(MISS))
for m in MISS:
    print("  !", m)
print("WAVE-2 SELESAI")
