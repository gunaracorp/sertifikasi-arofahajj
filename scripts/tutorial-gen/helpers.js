// ============================================================
// generate.js — Tutorial Pengembangan Arofahajj Universe v2.4.0
// Dokumen: panduan hulu-ke-hilir (Studio CMS, tema, full SEO,
// deployment statis & Node). Bahasa Indonesia, A4, cover R1,
// TOC 3-seksi (Roman/Arab), tabel & langkah bernomor.
// ============================================================
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, PageBreak, Footer, PageNumber, NumberFormat, SectionType,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  LevelFormat, TableOfContents, TableLayoutType,
} = require("docx");
const fs = require("fs");

// ---------- Palet (Kiswah & Emas) ----------
const P = {
  primary: "0B3D2E",   // hijau kiswah pekat — heading
  body: "1A2E24",      // near-black hijau — teks
  secondary: "5B6B62", // abu-hijau — caption
  accent: "B45309",    // emas perunggu — garis, tabel header
  surface: "F4F7F3",   // permukaan tabel
  codeBg: "F1F5EF",    // latar blok perintah
  cover: {
    bg: "0B3D2E",
    titleColor: "F8FAF5",
    subtitleColor: "CBD9CF",
    metaColor: "DCE7DF",
    accent: "D9A13B",
    footerColor: "9FB8AC",
  },
};

// ---------- Konstanta border ----------
const NONE = { style: BorderStyle.NONE, size: 0, color: "auto" };
const allNoBorders = {
  top: NONE, bottom: NONE, left: NONE, right: NONE,
  insideHorizontal: NONE, insideVertical: NONE,
};
const noBorders = { top: NONE, bottom: NONE, left: NONE, right: NONE };

// ---------- Helpers teks ----------
const FONT_BODY = { ascii: "Times New Roman", eastAsia: "Times New Roman" };
const FONT_HEAD = { ascii: "Arial", eastAsia: "Arial" };
const FONT_CODE = { ascii: "Courier New", eastAsia: "Courier New" };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 160, line: 312 },
    children: [new TextRun({ text, bold: true, size: 32, color: P.primary, font: FONT_HEAD })],
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 260, after: 120, line: 312 },
    children: [new TextRun({ text, bold: true, size: 28, color: P.primary, font: FONT_HEAD })],
  });
}
function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 220, after: 100, line: 312 },
    children: [new TextRun({ text, bold: true, size: 24, color: P.body, font: FONT_HEAD })],
  });
}
/** Paragraf isi — Indonesian (Latin): justified, tanpa indent CJK. */
function body(text, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 120, line: 312 },
    children: [new TextRun({ text, size: 24, color: P.body, font: FONT_BODY, ...opts })],
  });
}
/** Paragraf dari beberapa run (untuk penekanan inline). */
function bodyRuns(runs) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 120, line: 312 },
    children: runs.map((r) => new TextRun({ size: 24, color: P.body, font: FONT_BODY, ...r })),
  });
}
function caption(text) {
  return new Paragraph({
    spacing: { after: 160, line: 312 },
    children: [new TextRun({ text, size: 21, color: P.secondary, italics: true, font: FONT_BODY })],
  });
}
/** Blok perintah/kode — tabel 1 sel, latar terang, Consolas. */
function codeBlock(lines) {
  const paras = lines.map((ln, i) => new Paragraph({
    spacing: { after: i === lines.length - 1 ? 40 : 20, line: 276 },
    children: [new TextRun({ text: ln, size: 19, color: P.primary, font: FONT_CODE })],
  }));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: "C9D6CC" },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: "C9D6CC" },
      left: { style: BorderStyle.SINGLE, size: 8, color: P.accent },
      right: { style: BorderStyle.SINGLE, size: 2, color: "C9D6CC" },
      insideHorizontal: NONE, insideVertical: NONE,
    },
    rows: [new TableRow({
      cantSplit: true,
      children: [new TableCell({
        shading: { type: ShadingType.CLEAR, fill: P.codeBg },
        margins: { top: 120, bottom: 120, left: 200, right: 160 },
        width: { size: 100, type: WidthType.PERCENTAGE },
        children: paras,
      })],
    })],
  });
}
/** Tabel data generik (header + baris). */
function dataTable(headers, rows, widths, opts = {}) {
  const mkCell = (text, isHead, w, fill) => new TableCell({
    width: { size: w, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.CLEAR, fill: isHead ? P.accent : (fill || "FFFFFF") },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({
      spacing: { line: 312 },
      children: [new TextRun({
        text: String(text), bold: isHead, size: isHead ? 21 : 21,
        color: isHead ? "FFFFFF" : P.body,
        font: isHead ? FONT_HEAD : FONT_BODY,
      })],
    })],
  });
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: P.accent },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: P.accent },
      left: NONE, right: NONE,
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "D3DDD5" },
      insideVertical: NONE,
    },
    rows: [
      new TableRow({
        tableHeader: true, cantSplit: true,
        children: headers.map((t, i) => mkCell(t, true, widths[i])),
      }),
      ...rows.map((r, ri) => new TableRow({
        cantSplit: true,
        children: r.map((t, i) => mkCell(t, false, widths[i], ri % 2 === 1 ? P.surface : "FFFFFF")),
      })),
    ],
  });
}
/** Judul tabel (keepNext agar tak terpisah dari tabelnya). */
function tableTitle(text) {
  return new Paragraph({
    keepNext: true,
    spacing: { before: 160, after: 80, line: 312 },
    children: [new TextRun({ text, bold: true, size: 21, color: P.secondary, font: FONT_HEAD })],
  });
}
/** Langkah bernomor (referensi unik per daftar). */
function numbered(refName, items) {
  return items.map((t) => new Paragraph({
    numbering: { reference: refName, level: 0 },
    spacing: { after: 90, line: 312 },
    children: [new TextRun({ text: t, size: 24, color: P.body, font: FONT_BODY })],
  }));
}
function bullets(items) {
  return items.map((t) => new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80, line: 312 },
    children: [new TextRun({ text: t, size: 24, color: P.body, font: FONT_BODY })],
  }));
}
/** Gambar dengan rasio aspek asli (baca IHDR PNG). */
function pngSize(buf) {
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}
function image(path, displayWidth = 560) {
  const buf = fs.readFileSync(path);
  const { w, h } = pngSize(buf);
  const dh = Math.round(displayWidth * (h / w));
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 60 },
      children: [new ImageRun({ data: buf, transformation: { width: displayWidth, height: dh }, type: "png" })],
    }),
  ];
}
function imgCaption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200, line: 312 },
    children: [new TextRun({ text, size: 21, color: P.secondary, italics: true, font: FONT_BODY })],
  });
}

// ---------- Cover R1 (resep tervalidasi design-system) ----------
// Judul Latin: lebar karakter ~pt*10 twips (setengah lebar CJK pt*20).
function calcTitleLayoutLatin(title, maxWidthTwips, preferredPt = 40, minPt = 24) {
  const charW = (pt) => pt * 10;
  const cpl = (pt) => Math.floor(maxWidthTwips / charW(pt));
  let pt = preferredPt;
  let lines = [title];
  const split = (t, n) => {
    if (t.length <= n) return [t];
    const words = t.split(" ");
    const out = [];
    let cur = "";
    for (const w of words) {
      const cand = cur ? cur + " " + w : w;
      if (cand.length > n && cur) { out.push(cur); cur = w; } else cur = cand;
    }
    if (cur) out.push(cur);
    if (out.length > 1 && out[out.length - 1].length <= 4) {
      const last = out.pop();
      out[out.length - 1] += " " + last;
    }
    return out;
  };
  while (pt >= minPt) {
    lines = split(title, cpl(pt));
    if (lines.length <= 3) break;
    pt -= 2;
  }
  return { titlePt: pt, titleLines: lines };
}

function calcCoverSpacing(params) {
  const { titleLineCount = 1, titlePt = 36, hasSubtitle = false, hasEnglishLabel = false,
    metaLineCount = 0, fixedHeight = 800, pageHeight = 16838, marginTop = 0, marginBottom = 0 } = params;
  const SAFETY = 1200;
  const usable = pageHeight - marginTop - marginBottom - SAFETY;
  const titleH = titleLineCount * (titlePt * 23 + 200);
  const subH = hasSubtitle ? (12 * 23 + 600) : 0;
  const engH = hasEnglishLabel ? (9 * 23 + 600) : 0;
  const metaH = metaLineCount * (10 * 23 + 100);
  const implicit = 3 * 300;
  const content = titleH + subH + engH + metaH + fixedHeight + implicit;
  const remaining = Math.max(usable - content, 400);
  const FOOTER_MIN = 800;
  const rawTop = Math.floor(remaining * 0.45);
  const rawBottom = Math.floor(remaining * 0.45);
  const bottomSpacing = Math.max(rawBottom, FOOTER_MIN);
  const topSpacing = Math.max(rawTop - Math.max(0, FOOTER_MIN - rawBottom), 400);
  const midSpacing = Math.max(remaining - topSpacing - bottomSpacing, 0);
  return { topSpacing, midSpacing, bottomSpacing };
}

function buildCoverR1(config) {
  const C = config.palette;
  const padL = 1200, padR = 800;
  const availableWidth = 11906 - padL - padR - 300;
  const { titlePt, titleLines } = calcTitleLayoutLatin(config.title, availableWidth, 40, 24);
  const titleSize = titlePt * 2;
  const spacing = calcCoverSpacing({
    titleLineCount: titleLines.length, titlePt,
    hasSubtitle: !!config.subtitle, hasEnglishLabel: !!config.englishLabel,
    metaLineCount: (config.metaLines || []).length,
    fixedHeight: 400,
  });
  const accentLeft = { style: BorderStyle.SINGLE, size: 8, color: C.accent, space: 12 };
  const children = [];
  children.push(new Paragraph({ spacing: { before: spacing.topSpacing } }));
  if (config.englishLabel) {
    children.push(new Paragraph({
      indent: { left: padL, right: padR }, spacing: { after: 500 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.accent, space: 8 } },
      children: [new TextRun({ text: config.englishLabel.split("").join("  "), size: 18, color: C.accent, font: { ascii: "Arial", eastAsia: "Arial" }, characterSpacing: 40 })],
    }));
  }
  for (let i = 0; i < titleLines.length; i++) {
    children.push(new Paragraph({
      indent: { left: padL },
      spacing: { after: i < titleLines.length - 1 ? 100 : 300, line: Math.ceil(titlePt * 23), lineRule: "atLeast" },
      children: [new TextRun({ text: titleLines[i], size: titleSize, bold: true, color: C.titleColor, font: FONT_HEAD })],
    }));
  }
  if (config.subtitle) {
    children.push(new Paragraph({
      indent: { left: padL }, spacing: { after: 800 },
      children: [new TextRun({ text: config.subtitle, size: 24, color: C.subtitleColor, font: FONT_HEAD })],
    }));
  }
  for (const line of (config.metaLines || [])) {
    children.push(new Paragraph({
      indent: { left: padL + 200 }, spacing: { after: 80 },
      border: { left: accentLeft },
      children: [new TextRun({ text: line, size: 24, color: C.metaColor, font: FONT_HEAD })],
    }));
  }
  children.push(new Paragraph({ spacing: { before: spacing.bottomSpacing } }));
  children.push(new Paragraph({
    indent: { left: padL, right: padR },
    border: { top: { style: BorderStyle.SINGLE, size: 2, color: C.accent, space: 8 } },
    spacing: { before: 200 },
    children: [
      new TextRun({ text: config.footerLeft || "", size: 16, color: C.footerColor, font: { ascii: "Arial" } }),
      new TextRun({ text: "                                        " }),
      new TextRun({ text: config.footerRight || "", size: 16, color: C.footerColor, font: { ascii: "Arial" } }),
    ],
  }));
  return [new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: allNoBorders,
    rows: [new TableRow({
      height: { value: 16838, rule: "exact" },
      children: [new TableCell({
        shading: { type: ShadingType.CLEAR, fill: C.bg }, borders: noBorders,
        children,
      })],
    })],
  })];
}

module.exports = {
  P, allNoBorders, noBorders, h1, h2, h3, body, bodyRuns, caption, codeBlock,
  dataTable, tableTitle, numbered, bullets, image, imgCaption, buildCoverR1,
  FONT_BODY, FONT_HEAD, FONT_CODE,
};
