#!/usr/bin/env python3
# patch-footers.py — kompatibilitas WPS/Word untuk nomor halaman:
# 1) Footer instrText diberi switch format eksplisit (ROMAN / arabic)
# 2) Hapus <w:pgNumType/> kosong dari cover section
import zipfile, shutil, re, sys, os

DOC = sys.argv[1] if len(sys.argv) > 1 else "/home/z/my-project/download/Tutorial-Pengembangan-Arofahajj-v2.4.0.docx"
TMP = DOC + ".tmp"

with zipfile.ZipFile(DOC, "r") as zin:
    names = zin.namelist()
    items = {n: zin.read(n) for n in names}

# --- identifikasi footer mana dipakai section mana lewat document.xml ---
docxml = items["word/document.xml"].decode("utf-8")
# footer rIds dalam urutan kemunculan sectPr
rids = re.findall(r'<w:footerReference w:type="default" r:id="(rId\d+)"/>', docxml)
rels = items["word/_rels/document.xml.rels"].decode("utf-8")
rid2file = dict(re.findall(r'Id="(rId\d+)"[^>]*Target="(footer\d+\.xml)"', rels))
ordered_files = [rid2file[r] for r in rids if r in rid2file]
# footer pertama = seksi TOC (Romawi), berikutnya = isi (arab)
patch_plan = {}
if ordered_files:
    patch_plan["word/" + ordered_files[0]] = "ROMAN"
    for f in ordered_files[1:]:
        patch_plan.setdefault("word/" + f, "arabic")

for fname, fmt in patch_plan.items():
    if fname not in items:
        continue
    xml = items[fname].decode("utf-8")
    if fmt == "ROMAN":
        xml = re.sub(r'(<w:instrText[^>]*>)\s*PAGE\s*(</w:instrText>)',
                     r'\1 PAGE \\* ROMAN \\* MERGEFORMAT \2', xml)
    else:
        xml = re.sub(r'(<w:instrText[^>]*>)\s*PAGE\s*(</w:instrText>)',
                     r'\1 PAGE \\* arabic \\* MERGEFORMAT \2', xml)
    items[fname] = xml.encode("utf-8")
    print(f"patched {fname} -> {fmt}")

# --- hapus pgNumType kosong (dari cover) ---
docxml2, n = re.subn(r"<w:pgNumType/>", "", docxml)
if n:
    print(f"removed {n} empty <w:pgNumType/>")
items["word/document.xml"] = docxml2.encode("utf-8")

with zipfile.ZipFile(TMP, "w", zipfile.ZIP_DEFLATED) as zout:
    for n in names:
        zout.writestr(n, items[n])
shutil.move(TMP, DOC)
print("OK — footer & pgNumType dipatch:", DOC)
