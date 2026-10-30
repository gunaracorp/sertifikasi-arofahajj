#!/usr/bin/env python3
"""Regenerasi layanan-500.json pasca ×1,3 dengan semantik bersih:
harga = ceil10k(asli×1,3) · harga_diskon = halfup10k(harga×(1−diskon)) · hemat = selisih.
Sumber asli: git index (scripts/orig-layanan.json)."""
import json
import math
import pathlib

R = pathlib.Path("/home/z/my-project")
orig = json.loads((R / "scripts/orig-layanan.json").read_text(encoding="utf-8"))
pj = R / "src/data/layanan-500.json"
cur = json.loads(pj.read_text(encoding="utf-8"))
assert len(orig) == len(cur) == 500
for o, c in zip(orig, cur):
    assert o["kode"] == c["kode"], (o["kode"], c["kode"])
    h1 = math.ceil(o["harga"] * 1.3 / 10_000) * 10_000
    hd1 = int(math.floor(o["harga"] * 1.3 * (1 - o["diskon"]) / 10_000 + 0.5) * 10_000)  # half-up
    c["harga"] = h1
    c["harga_diskon"] = hd1
    c["hemat"] = h1 - hd1
out = json.dumps(cur, ensure_ascii=False, indent=2) + "\n"
pj.write_text(out, encoding="utf-8")
# sanity
s = json.loads(out)
assert all(x["hemat"] == x["harga"] - x["harga_diskon"] for x in s)
ratios = [x["harga_diskon"] / x["harga"] for x in s]
print("OK 500 item · rasio diskon min/max:", round(min(ratios), 4), round(max(ratios), 4))
print("contoh:", {k: s[0][k] for k in ("kode", "harga", "diskon", "harga_diskon", "hemat")})
