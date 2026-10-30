#!/usr/bin/env python3
"""Final polish: kontak office card, kalkulator FAQ, layout.tsx metadata."""
import pathlib

R = pathlib.Path("/home/z/my-project")

def patch(rel, pairs):
    p = R / rel
    t = p.read_text()
    for old, new in pairs:
        if old not in t:
            print(f"  !! NOT FOUND in {rel}: {old[:60]!r}")
            continue
        t = t.replace(old, new)
    p.write_text(t)
    print(f"  ok: {rel}")

patch("src/app/kontak/page.tsx", [
    ('Kantor Pusat — Jakarta\n                </figcaption>', 'Kantor Pusat — Tasikmalaya\n                </figcaption>'),
    ('Jakarta — SCBD\n                </h3>', 'Tasikmalaya — Mangkubumi\n                </h3>'),
    ('{CONTACT.address.postalCode}. Berada di kawasan Indonesia\n                  Stock Exchange Building — melayani seluruh Indonesia secara\n                  online dan tatap muka.',
     '{CONTACT.address.postalCode}. Melayani seluruh Indonesia\n                  secara online dan tatap muka — area Bandung & Jakarta dengan\n                  appointment.'),
    ('{/* BANDUNG — kantor cabang */}', '{/* BANDUNG — jangkauan area */}'),
])

patch("src/app/kalkulator/page.tsx", [
    ('didukung kantor fisik di SCBD Jakarta & Bandung.',
     'didukung kantor fisik di Tasikmalaya dengan jangkauan Bandung—Jakarta.'),
])

patch("src/app/layout.tsx", [
    ('Kantor SCBD se-lantai Bursa Efek Indonesia. Garansi 100% uang kembali.',
     'Kantor pusat Tasikmalaya (PT AROFAH GLOBAL SISTEM — NIB 2503250053856, KBLI 79121). Garansi 100% uang kembali.'),
    ('"konsultan perizinan jakarta", "jasa perizinan SCBD", "konsultan izin jakarta selatan",',
     '"konsultan perizinan tasikmalaya", "arofahajj", "arofahajj universe", "jasa haji umrah terpercaya",'),
    ('"Konsultan perizinan #1 Indonesia dari kantor SCBD. NIB 1 hari, PT 3 hari, Halal, BPOM, PBG/SLF, AMDAL, PMA, Izin Umroh/Haji (PPIU/PPIH), IATA, Arab Saudi (MISA), RKAB tambang — garansi 100%. Melayani 38 provinsi & 514 kabupaten/kota.',
     'Arofahajj Universe — Haji & Umrah, perizinan usaha & sertifikasi #1 Indonesia (PT AROFAH GLOBAL SISTEM). NIB 1 hari, PT 3 hari, Halal, BPOM, PBG/SLF, AMDAL, PMA, Izin Umroh/Haji (PPIU/PPIH), IATA, Arab Saudi (MISA), RKAB tambang — garansi 100%. Melayani 38 provinsi & 514 kabupaten/kota.'),
])

print("done")
