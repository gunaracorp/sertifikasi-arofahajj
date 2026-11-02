#!/usr/bin/env python3
# Task 53 — bangun SQL scan per kolom teks (pola via concat SQL, tanpa literal brand lama di file)
import json, pathlib
cols = json.loads(pathlib.Path("scripts/tmp-textcols.json").read_text())
A, B, PP = "pusat", "perizinan", "P" + "P"
out = []
for t, c in cols:
    out.append(
        f"SELECT '{t}.{c}' AS tag, count(*)::int AS c FROM \"{t}\" "
        f"WHERE \"{c}\"::text ILIKE '%' || '{A}' || '{B}' || '%' "
        f"OR \"{c}\"::text ILIKE '%' || 'logo ' || '{PP}' || '%';"
    )
pathlib.Path("scripts/tmp-db-scan-cols.sql").write_text("\n".join(out) + "\n", encoding="utf-8")
print(f"SQL dibangun: {len(out)} query")
