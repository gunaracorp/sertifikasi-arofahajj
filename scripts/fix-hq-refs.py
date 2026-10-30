#!/usr/bin/env python3
"""Fix remaining SCBD HQ references → Tasikmalaya (Arofahajj Universe)."""
import pathlib

R = pathlib.Path("/home/z/my-project")

def patch(rel, pairs, must=True):
    p = R / rel
    t = p.read_text()
    orig = t
    for old, new in pairs:
        if old not in t:
            if must:
                print(f"  !! NOT FOUND in {rel}: {old[:70]!r}")
            continue
        t = t.replace(old, new)
    if t != orig:
        p.write_text(t)
        print(f"  ok: {rel}")
    else:
        print(f"  -- no change: {rel}")

patch("src/app/kontak/page.tsx", [
    ('{/* Alamat SCBD */}', '{/* Alamat kantor pusat */}'),
    ('Kantor Jakarta (SCBD)', 'Kantor Pusat (Tasikmalaya)'),
    ('Kantor utama kami di Indonesia Stock Exchange Building, Tower 2,\n                  Lantai 5, SCBD Lot 13, Jl. Jend. Sudirman Kav. 52-53, Jakarta\n                  Selatan 12190. Kami juga punya kantor cabang Bandung (lihat di\n                  bawah) yang melayani seluruh Jawa Barat — kunjungan dengan\n                  appointment via WhatsApp.',
     'Kantor utama kami di Andalusia Garden Cluster Granada No.11,\n                  Jl. Abdi Negara II, Kel. Mangkubumi, Kota Tasikmalaya,\n                  Jawa Barat 46181. Kunjungan area Bandung—Jakarta tersedia\n                  dengan appointment via WhatsApp.'),
    ('Kontak — Konsultasi Gratis 15 Menit | Kantor SCBD Jakarta',
     'Kontak — Konsultasi Gratis 15 Menit | Kantor Tasikmalaya'),
    ('{/* JAKARTA — kantor pusat SCBD */}', '{/* TASIKMALAYA — kantor pusat */}'),
    ('Papan nama Arofahajj Universe pada gedung kantor Jakarta',
     'Suasana kantor Arofahajj Universe'),
])

patch("src/app/layanan/[...slug]/page.tsx", [
    ('streetAddress: "Indonesia Stock Exchange Building, Tower 2, Lantai 5, SCBD Lot 13, Jl. Jend. Sudirman Kav. 52-53",',
     'streetAddress: "Andalusia Garden Cluster Granada No.11, Jl. Abdi Negara II, Kel. Mangkubumi",'),
])

patch("src/app/pma-company-registration/page.tsx", [
    ('office in SCBD Jakarta. 38 provinces covered',
     'Tasikmalaya HQ with Jakarta virtual-office options. 38 provinces covered'),
])

print("done")
