#!/usr/bin/env python3
"""Finalisasi numerik katalog:
- v2: savings := normalPrice − discountPrice (keduanya sudah ×1,3).
- v3: blok normalPrice/discountPct/discountPrice(/savings) diskalakan ×1,3
  (normal=ceil10k, discount=halfup10k(normal×rasio), savings=selisih)."""
import math
import pathlib
import re

R = pathlib.Path("/home/z/my-project")

# ---------- v2: recompute savings ----------
p2 = R / "src/lib/katalog-v2.ts"
t = p2.read_text(encoding="utf-8")
ns = [int(x) for x in re.findall(r"normalPrice: (\d+)", t)]
ds = [int(x) for x in re.findall(r"discountPrice: (\d+)", t)]
it = iter(ns)
k = [0]

def fix_savings(m):
    new = ns[k[0]] - ds[k[0]]
    k[0] += 1
    return f"savings: {new},"

t, c = re.subn(r"savings: \d+,", fix_savings, t)
assert c == 500 and k[0] == 500, (c, k[0])
p2.write_text(t, encoding="utf-8")
print(f"v2 savings direkomputasi: {c}")

# ---------- v3: blok penuh ----------
BLOCK = re.compile(
    r"normalPrice: (\d+),(\s+)discountPct: (\d+),(\s+)discountPrice: (\d+),"
    r"(?:(\s*)savings: (\d+),)?"
)

p3 = R / "src/lib/katalog-v3.ts"
t3 = p3.read_text(encoding="utf-8")
stats = {"n": 0, "with_savings": 0}

def scale_block(m):
    n_old = int(m.group(1))
    d_old = int(m.group(5))
    pct = m.group(3)
    n_new = math.ceil(n_old * 1.3 / 10_000) * 10_000
    d_new = math.floor(n_new * (d_old / n_old) / 10_000 + 0.5) * 10_000  # half-up 10rb
    stats["n"] += 1
    s1, s2 = m.group(2), m.group(4)
    head = f"normalPrice: {n_new},{s1}discountPct: {pct},{s2}discountPrice: {d_new},"
    if m.group(7) is not None:
        stats["with_savings"] += 1
        head += f"{m.group(6)}savings: {n_new - d_new},"
    return head

t3, c3 = BLOCK.subn(scale_block, t3)
p3.write_text(t3, encoding="utf-8")
print(f"v3 blok diskalakan: {c3} {stats}")

# ---------- verifikasi ketiga dataset ----------
for rel in ["src/lib/katalog-v2.ts", "src/lib/katalog-v3.ts"]:
    t = (R / rel).read_text(encoding="utf-8")
    ns = [int(x) for x in re.findall(r"normalPrice: (\d+)", t)]
    ds = [int(x) for x in re.findall(r"discountPrice: (\d+)", t)]
    sv = [int(x) for x in re.findall(r"savings: (\d+)", t)]
    bad_d = sum(1 for n, d in zip(ns, ds) if d >= n)
    non10 = sum(1 for x in ns + ds if x % 10_000 != 0)
    bad_s = sum(1 for n, d, s in zip(ns, ds, sv) if s != n - d)
    print(f"{rel}: n={len(ns)} d={len(ds)} s={len(sv)} · discount≥normal={bad_d} · non-10rb={non10} · savings-salah={bad_s}")
print(",, tersisa:", t.count(",,") + t3.count(",,"))
