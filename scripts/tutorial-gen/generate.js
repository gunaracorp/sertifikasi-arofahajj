// ============================================================
// generate.js — Rakitan final dokumen tutorial
// 3 seksi: Cover (tanpa nomor) → TOC (Roman) → Isi (Arab, mulai 1)
// ============================================================
const {
  Document, Packer, Paragraph, TextRun, Footer, PageNumber, NumberFormat,
  AlignmentType, SectionType, LevelFormat, TableOfContents, PageBreak,
} = require("docx");
const fs = require("fs");
const H = require("./helpers");
const { chapters1 } = require("./content1");
const { chapters2 } = require("./content2");

const OUT = "/home/z/my-project/download/Tutorial-Pengembangan-Arofahajj-v2.4.0.docx";

// ---------- Footer nomor halaman ----------
function pageFooter() {
  return new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: H.P.secondary, font: { ascii: "Arial" } })],
    })],
  });
}
function docHeader() {
  return new (require("docx").Header)({
    children: [new Paragraph({
      alignment: AlignmentType.RIGHT,
      border: { bottom: { style: require("docx").BorderStyle.SINGLE, size: 2, color: H.P.accent, space: 4 } },
      children: [new TextRun({ text: "Tutorial Pengembangan Arofahajj Universe \u00b7 v2.4.0 Studio CMS", size: 16, color: H.P.secondary, font: { ascii: "Arial" } })],
    })],
  });
}

// ---------- Konfigurasi cover ----------
const coverConfig = {
  title: "Tutorial Pengembangan Arofahajj Universe",
  subtitle: "Studio CMS, Sistem Tema & Playbook Full SEO \u2014 dari Hulu ke Hilir",
  englishLabel: "PANDUAN RESMI",
  metaLines: [
    "Versi proyek: v2.4.0 \u201cStudio CMS\u201d \u00b7 22 November 2026",
    "Cakupan: Arsitektur \u00b7 CMS \u00b7 Tema \u00b7 Full SEO \u00b7 Deployment",
    "PT Arofah Global Sistem \u00b7 Kota Tasikmalaya, Jawa Barat",
  ],
  footerLeft: "arofahajj.com \u00b7 Arofahajj Universe",
  footerRight: "Dokumen internal tim \u00b7 2026",
  palette: H.P.cover,
};

// ---------- Susun isi ----------
const bodyChildren = [...chapters1(H), ...chapters2(H)];

const doc = new Document({
  creator: "Arofahajj Universe",
  title: "Tutorial Pengembangan Arofahajj Universe v2.4.0",
  description: "Panduan hulu-ke-hilir: Studio CMS, tema, full SEO, deployment",
  styles: {
    default: {
      document: {
        run: { font: { ascii: "Times New Roman", eastAsia: "Times New Roman" }, size: 24, color: H.P.body },
        paragraph: { spacing: { line: 312 } },
      },
      heading1: {
        run: { font: { ascii: "Arial", eastAsia: "Arial" }, size: 32, bold: true, color: H.P.primary },
        paragraph: { spacing: { before: 360, after: 160, line: 312 }, outlineLevel: 0 },
      },
      heading2: {
        run: { font: { ascii: "Arial", eastAsia: "Arial" }, size: 28, bold: true, color: H.P.primary },
        paragraph: { spacing: { before: 260, after: 120, line: 312 }, outlineLevel: 1 },
      },
      heading3: {
        run: { font: { ascii: "Arial", eastAsia: "Arial" }, size: 24, bold: true, color: H.P.body },
        paragraph: { spacing: { before: 220, after: 100, line: 312 }, outlineLevel: 2 },
      },
    },
  },
  numbering: {
    config: ["ch5-admin", "ch5-page", "ch6-steps", "ch7-index", "ch8-static", "ch8-node", "ch10-30"].map((ref) => ({
      reference: ref,
      levels: [{
        level: 0,
        format: LevelFormat.DECIMAL,
        text: "%1.",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } },
      }],
    })),
  },
  sections: [
    // ===== Seksi 1: Cover (margin 0, tanpa nomor halaman) =====
    {
      properties: {
        page: { size: { width: 11906, height: 16838 }, margin: { top: 0, bottom: 0, left: 0, right: 0 } },
      },
      children: H.buildCoverR1(coverConfig),
    },
    // ===== Seksi 2: Daftar Isi (Romawi) =====
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
          pageNumbers: { start: 1, formatType: NumberFormat.UPPER_ROMAN },
        },
      },
      footers: { default: pageFooter() },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 480, after: 360 },
          children: [new TextRun({ text: "DAFTAR ISI", bold: true, size: 32, color: H.P.primary, font: { ascii: "Arial", eastAsia: "Arial" } })],
        }),
        new TableOfContents("Daftar Isi", { hyperlink: true, headingStyleRange: "1-2" }),
        new Paragraph({
          spacing: { before: 200 },
          children: [new TextRun({
            text: "Catatan: Daftar isi dibuat dengan field code. Setelah mengedit dokumen, klik kanan daftar isi lalu pilih \u201cUpdate Field\u201d untuk memperbarui nomor halaman.",
            italics: true, size: 18, color: "888888", font: H.FONT_BODY,
          })],
        }),
        // Catatan: PageBreak eksplisit TIDAK diperlukan di sini — seksi berikutnya
        // sudah SectionType.NEXT_PAGE; PageBreak + NEXT_PAGE = halaman kosong.
      ],
    },
    // ===== Seksi 3: Isi (Arab, mulai 1) =====
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
          pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
        },
      },
      headers: { default: docHeader() },
      footers: { default: pageFooter() },
      children: bodyChildren,
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(OUT, buf);
  console.log("OK — dokumen tersimpan:", OUT, `(${(buf.length / 1024).toFixed(0)} KB)`);
});
