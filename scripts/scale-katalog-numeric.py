#!/usr/bin/env python3
"""Skala normalPrice/discountPrice di katalog-v2.ts & katalog-v3.ts (×1,3).
normalPrice_new = ceil10k(n×1,3) · discountPrice_new = halfup10k(n_new × rasio_asli).
Pasangan dipetakan berurutan (pola berulang normalPrice→discountPrice)."""
import math
import pathlib
import re

R = pathlib.Path("/home/z/my-project")
TOKEN = re.compile(r"(normalPrice|discountPrice): (\d+)")

for rel in ["src/lib/katalog-v2.ts", "src/lib/katalog-v3.ts"]:
    p = R / rel
    t = p.read_text(encoding="utf-8")
    toks = list(TOKEN.finditer(t))
    # pasangkan berurutan: normal dulu, lalu discount
    out, i, n_pair, cur_normal = [], 0, 0, None
    while i < len(toks):
        m = toks[i]
        name, val = m.group(1), int(m.group(2))
        if name == "normalPrice":
            cur_normal = int(math.ceil(val * 1.3 / 10_000) * 10_000)
            newv = cur_normal
        else:
            if cur_normal is None:
                raise SystemExit(f"{rel}: discountPrice sebelum normalPrice!")
            # cari normalPrice asli utk rasio: butuh nilai normal ASLI (belum diskala)
            # simpan asli saat ketemu normalPrice:
            pass
        out.append((m, name, val, newv if name == "normalPrice" else None))
        i += 1
    # Re-walk: butuh pasangan asli → buat peta dari asli dulu
    t2 = p.read_text(encoding="utf-8")
    pairs = []
    pend_n = None
    for m in TOKEN.finditer(t2):
        if m.group(1) == "normalPrice":
            pend_n = int(m.group(2))
        else:
            if pend_n is None:
                continue
            pairs.append((pend_n, int(m.group(2))))
            pend_n = None
    assert len(pairs) * 2 == len(toks), (rel, len(pairs), len(toks))
    # bangun string baru berurutan
    res, pos, k = [], 0, 0
    for m in toks:
        res.append(t[pos:m.start()])
        name, val = m.group(1), int(m.group(2))
        if name == "normalPrice":
            res.append(f"normalPrice: {int(math.ceil(val * 1.3 / 10_000) * 10_000)},")
        else:
            n_orig, d_orig = pairs[k]
            ratio = d_orig / n_orig
            nd = int(math.floor(n_orig * 1.3 * ratio / 10_000 + 0.5) * 10_000)
            res.append(f"discountPrice: {nd},")
            k += 1
        pos = m.end()
    res.append(t[pos:])
    p.write_text("".join(res), encoding="utf-8")
    print(f"{rel}: {len(pairs)} pasangan diskalakan")

# Sanity: baca ulang, pastikan discount < normal & nol nilai lama tersisa
for rel in ["src/lib/katalog-v2.ts", "src/lib/katalog-v3.ts"]:
    t = (R / rel).read_text(encoding="utf-8")
    ns = [int(x) for x in re.findall(r"normalPrice: (\d+)", t)]
    ds = [int(x) for x in re.findall(r"discountPrice: (\d+)", t)]
    bad = sum(1 for n, d in zip(ns, ds) if d >= n)
    non10k = sum(1 for x in ns + ds if x % 10_000 != 0)
    print(f"{rel}: pasangan={len(ns)}/{len(ds)} discount≥normal={bad} non-kelipatan10rb={non10k}")
