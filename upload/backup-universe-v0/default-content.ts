// ============================================================
// AROFAHAJJ UNIVERSE — DEFAULT CMS CONTENT
// Semua konten situs dikontrol dari sini / Admin CMS Panel.
// Edit lewat Admin > CMS, tanpa menyentuh kode.
// ============================================================

export interface CertService {
  id: string;
  code: string;
  name: string;
  category: string;
  priceMin: number;
  priceMax: number;
  desc: string;
  requirements: string[];
  timeline: string;
  featured: boolean;
  tier: number; // 1..3 bintang flagship
  includes: string[];
  aiFeatures: string[];
}

export interface UniverseContent {
  site: {
    name: string;
    tagline: string;
    description: string;
    version: string;
    launchedAt: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    titleHighlight: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    image: string;
    marquee: string[];
  };
  stats: { label: string; value: number; suffix: string; icon: string }[];
  properties: {
    id: string;
    domain: string;
    name: string;
    desc: string;
    color: string;
    icon: string;
    features: string[];
    status: string;
    progress: number;
  }[];
  services: { categories: { id: string; name: string; icon: string; desc: string; flagship: boolean }[]; items: CertService[] };
  bundles: { id: string; name: string; price: number; save: number; desc: string; includes: string[]; tier: string; popular: boolean }[];
  packages: {
    id: string;
    slug: string;
    title: string;
    type: string;
    travel: string;
    price: number;
    oldPrice: number;
    durationDays: number;
    departureCity: string;
    hotelMakkah: string;
    starMakkah: number;
    hotelMadinah: string;
    starMadinah: number;
    departureMonth: string;
    quota: number;
    booked: number;
    rating: number;
    reviewCount: number;
    image: string;
    featured: boolean;
    facilities: string[];
    includes: string[];
  }[];
  products: {
    id: string;
    slug: string;
    name: string;
    category: string;
    price: number;
    oldPrice: number;
    rating: number;
    sold: number;
    desc: string;
    emoji: string;
    sla: string;
  }[];
  muhdin: {
    headline: string;
    sub: string;
    tiers: { name: string; price: number; period: string; features: string[]; highlight: boolean }[];
    directory: { name: string; city: string; ppiu: string; badge: string; score: number; tier: string }[];
    benefits: { icon: string; title: string; desc: string }[];
    stats: { members: number; cities: number; certified: number; events: number };
  };
  testimonials: { name: string; role: string; city: string; text: string; rating: number }[];
  contact: {
    headline: string;
    sub: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    hours: string;
  };
  wizardRules: {
    businessTypes: { id: string; label: string; recommended: string[]; note: string }[];
  };
}

export const defaultContent: UniverseContent = {
  site: {
    name: "Arofahajj Universe",
    tagline: "Satu Ekosistem Digital untuk Perjalanan Ibadah, Perizinan & Ekonomi Halal",
    description:
      "Platform nomor 1 Indonesia untuk perizinan & sertifikasi usaha, booking haji-umrah, asosiasi industri MEHUDIN, dan marketplace halal — terintegrasi dalam satu super app.",
    version: "MVP 1.0",
    launchedAt: "2026",
  },
  hero: {
    badge: "🚀 Super App Ekosistem Halal #1 Indonesia",
    titleLine1: "Satu Universe.",
    titleLine2: "Seluruh Kebutuhan",
    titleHighlight: "Haji, Umrah & Legalitas Usaha.",
    subtitle:
      "Dari izin PPIU/PIHK hingga sertifikasi ISO, dari booking umrah hingga marketplace halal — semuanya terhubung dalam satu platform dengan AI Compliance Copilot & verifikasi blockchain.",
    ctaPrimary: "Mulai Perjalanan Anda",
    ctaSecondary: "Jelajahi Ekosistem",
    image: "/images/hero-kaaba.png",
    marquee: [
      "PPIU & PIHK Terpercaya",
      "ISO 9001 · 14001 · 45001 · 27001",
      "AI Compliance Copilot",
      "Verifikasi QR + Blockchain",
      "MEHUDIN Accredited",
      "Escrow Pembayaran Syariah",
      "160+ Layanan Perizinan",
      "Tracking Real-Time",
    ],
  },
  stats: [
    { label: "Layanan Perizinan", value: 160, suffix: "+", icon: "shield" },
    { label: "Kategori Industri", value: 18, suffix: "", icon: "grid" },
    { label: "Travel Terdaftar", value: 3000, suffix: "+", icon: "building" },
    { label: "Jamaah Dilayani", value: 25000, suffix: "+", icon: "users" },
  ],
  properties: [
    {
      id: "arofahajj",
      domain: "arofahajj.com",
      name: "Arofahajj Travel & Booking",
      desc: "Katalog paket haji-umrah dengan harga transparan, escrow syariah, tracking real-time ala pizza tracker, dan FamilyView opt-in.",
      color: "emerald",
      icon: "plane",
      features: ["Katalog & filter cerdas", "Escrow & split payment", "Status visa/tasrih real-time", "Integrasi Nusuk (roadmap)"],
      status: "MVP Live",
      progress: 65,
    },
    {
      id: "sertifikasi",
      domain: "sertifikasi.arofahajj.com",
      name: "Sertifikasi & Perizinan",
      desc: "Layanan perizinan & sertifikasi usaha #1 — 160+ layanan dari pendirian PT hingga ISO & BPOM, dengan wizard KBLI dan audit terstruktur.",
      color: "amber",
      icon: "award",
      features: ["Wizard KBLI → syarat otomatis", "AI Document Checker", "SLA engine & alert WA", "e-Sertifikat QR on-chain"],
      status: "MVP Live",
      progress: 75,
    },
    {
      id: "muhdin",
      domain: "MUHDIN.ID",
      name: "MEHUDIN Asosiasi",
      desc: "Asosiasi travel haji-umrah: SSO tunggal, direktori anggota tersertifikasi, badge kepercayaan, e-voting, dan jaringan 3.000+ mitra.",
      color: "teal",
      icon: "users",
      features: ["Registrasi & verifikasi anggota", "Badge MEHUDIN-Accredited", "Direktori publik QR", "Event & e-voting"],
      status: "Beta",
      progress: 45,
    },
    {
      id: "marketplace",
      domain: "arofahajj.id",
      name: "Marketplace Halal",
      desc: "Marketplace pascapulang: souvenir, kurban, asuransi perjalanan, lounge bandara — dengan SLA fulfillment & pickup bandara.",
      color: "lime",
      icon: "shopping",
      features: ["Produk fisik & digital", "SLA fulfillment", "Pickup bandara/gerai", "Multi-bahasa & currency"],
      status: "Coming Soon",
      progress: 25,
    },
  ],
  services: {
    categories: [
      { id: "R", name: "Ibadah & Perjalanan Haji-Umrah", icon: "mosque", desc: "Spesialisasi #1 Arofahajj — PPIU, PIHK, tour leader", flagship: true },
      { id: "A", name: "Pendirian Badan Usaha", icon: "building", desc: "PT, CV, Firma, Yayasan, PMA, UD", flagship: false },
      { id: "B", name: "Perpajakan & Registrasi", icon: "receipt", desc: "NPWP, SKT, PKP, EFIN", flagship: false },
      { id: "C", name: "Izin Usaha & Perdagangan", icon: "store", desc: "NIB OSS, SIUP, API, IUMK, KITE", flagship: false },
      { id: "D", name: "Pariwisata & Perhotelan", icon: "hotel", desc: "TDUP, hotel, MICE, BPW, halal hospitality", flagship: false },
      { id: "G", name: "ISO & Mutu Internasional", icon: "award", desc: "ISO 9001/14001/45001/27001 + bundel", flagship: false },
      { id: "H", name: "Kesehatan & Farmasi", icon: "heart", desc: "BPOM, halal BPJPH, klinik, apotek, PBF", flagship: false },
      { id: "E", name: "Konstruksi & Properti", icon: "hardhat", desc: "SBU/SIUJK, PBG, SLF", flagship: false },
      { id: "L", name: "Digital & Teknologi", icon: "laptop", desc: "PSE Kominfo, PMSE, e-commerce", flagship: false },
      { id: "F", name: "Lingkungan", icon: "leaf", desc: "AMDAL, UKL-UPL, SPPL", flagship: false },
      { id: "I", name: "Ketenagakerjaan & TKA", icon: "idcard", desc: "RPTKA, KITAS, KITAP", flagship: false },
      { id: "J", name: "Keselamatan Kerja (K3)", icon: "helmet", desc: "Ahli K3, APAR, proteksi kebakaran", flagship: false },
    ],
    items: [
      {
        id: "r1", code: "R.1", name: "PPIU — Penyelenggara Perjalanan Ibadah Umrah", category: "R",
        priceMin: 15000000, priceMax: 25000000,
        desc: "Izin fondasi bisnis travel umrah dari Kemenag RI. WAJIB dimiliki sebelum bisa apply PIHK. Membuka peluang bisnis umrah ke Tanah Suci dengan standar compliance penuh.",
        requirements: ["PT dengan KBLI 79120", "SIUP Pariwisata (TDUP) aktif", "NIB via OSS", "NPWP Perusahaan", "Kantor operasional tetap (min. 500 m²)", "Registrasi SISKOPATUH", "Rekomendasi Kanwil Kemenag"],
        timeline: "90–120 hari", featured: true, tier: 3,
        includes: ["Pendirian PT (jika belum ada)", "SIUP Pariwisata efektif", "NIB & Izin Usaha OSS RBA", "Koordinasi Kemenag Pusat & Kanwil", "Training guideline operasional PPIU 2025", "Template SOP & manajemen keuangan", "Akses komunitas MEHUDIN"],
        aiFeatures: ["Document Checker AI", "Compliance Status Dashboard", "Regulatory Update Alerts", "Compliance Calendar 60 hari"],
      },
      {
        id: "r2", code: "R.2", name: "PIHK — Penyelenggara Ibadah Haji Khusus", category: "R",
        priceMin: 25000000, priceMax: 40000000,
        desc: "Izin haji plus/khusus — revenue multiplier terbesar untuk travel besar. Margin Rp 8–15 juta per jamaah, potensi Rp 5–7,5 M per musim dengan kuota 500 jamaah.",
        requirements: ["PPIU aktif min. 2 tahun", "Track record 2.000+ jamaah umrah", "Laporan keuangan audit 2 tahun", "Nol keluhan signifikan", "Izin dari Ditjen PHU Kemenag", "Surat rekomendasi asosiasi (MEHUDIN)"],
        timeline: "120–150 hari", featured: true, tier: 3,
        includes: ["Analisis kelayakan & proyeksi revenue", "Dokumentasi pengalaman PPIU", "Koordinasi intensif Kemenag & Ditjen PHU", "Training pengurusan tamu haji", "Template perjanjian jamaah syariah", "Integrasi SISKOHAT", "Networking operator Saudi"],
        aiFeatures: ["Jamaah Profiling AI", "Package Recommendation Engine", "Compliance Scorecard", "Earnings Simulator"],
      },
      {
        id: "r3", code: "R.3", name: "Izin Keberangkatan Haji Plus (Kuota Tambahan)", category: "R",
        priceMin: 5000000, priceMax: 15000000,
        desc: "Layanan RECURRING tahunan untuk tambahan kuota haji plus. Proses 30–60 hari per musim — passive income terbaik untuk pemilik PIHK.",
        requirements: ["Memiliki PIHK aktif", "Dokumen permohonan musim haji"],
        timeline: "30–60 hari", featured: true, tier: 3,
        includes: ["Verifikasi kelengkapan dokumen", "Pengajuan resmi ke Ditjen PHU", "Follow-up hingga approval", "Konsultasi strategi marketing kuota"],
        aiFeatures: ["Auto-reminder musim haji", "SLA tracking"],
      },
      {
        id: "r4", code: "R.4", name: "Sertifikasi Tour Leader Haji-Umrah", category: "R",
        priceMin: 5000000, priceMax: 8000000,
        desc: "Sertifikasi resmi Kemenag untuk pemandu jamaah — valid 5 tahun. Membuktikan kompetensi kepemimpinan, pengetahuan ibadah, dan manajemen krisis.",
        requirements: ["Minimal SMA/SMK", "Pengalaman guide 1–2 tahun", "Pelatihan 40 jam", "Ujian teori & praktik", "Sehat fisik & mental"],
        timeline: "30–60 hari", featured: false, tier: 2,
        includes: ["Pendaftaran lembaga terakreditasi", "Materi training komprehensif", "Simulasi jamaah nyata", "Persiapan ujian", "Akses komunitas tour leader MEHUDIN"],
        aiFeatures: ["Reminder renewal 5 tahun"],
      },
      {
        id: "r6", code: "R.6", name: "Paket Legalitas Perusahaan Haji-Umrah", category: "R",
        priceMin: 3000000, priceMax: 8000000,
        desc: "All-in-one pendirian perusahaan + izin dasar untuk startup travel. Langsung siap apply PPIU setelah proses ini.",
        requirements: ["Nama & KBLI 79120", "Data pendiri & modal"],
        timeline: "60–90 hari", featured: false, tier: 2,
        includes: ["Pendirian PT (akta, SK Menteri)", "NIB & NPWP", "SIUP Pariwisata (TDUP)", "Izin OSS lengkap", "Virtual office 1 tahun (opsional)", "Setup akun SISKOPATUH"],
        aiFeatures: ["Checklist otomatis dokumen"],
      },
      {
        id: "r8", code: "R.8", name: "Perpanjangan PPIU/PIHK", category: "R",
        priceMin: 8000000, priceMax: 15000000,
        desc: "PPIU & PIHK berlaku 5 tahun — pastikan bisnis tetap legal dengan layanan perpanjangan menyeluruh, dimulai 60–90 hari sebelum kadaluarsa.",
        requirements: ["Izin aktif mendekati expired", "Laporan compliance periode berjalan"],
        timeline: "60–90 hari", featured: false, tier: 2,
        includes: ["Verifikasi & update data", "Persiapan laporan compliance", "Pengajuan ke Kemenag", "Follow-up hingga terbit"],
        aiFeatures: ["Auto-reminder 60 hari", "Compliance gap report"],
      },
      {
        id: "a1", code: "A.1", name: "Pendirian PT (Perseroan Terbatas)", category: "A",
        priceMin: 2000000, priceMax: 7900000,
        desc: "6 pilihan paket pendirian PT — dari PT Perorangan hingga PT + Izin + Virtual Office Premium. SK Menteri hingga 20 KBLI.",
        requirements: ["Nama PT (3 alternatif)", "KTP & NPWP pendiri", "Alamat domisili"],
        timeline: "3–14 hari", featured: true, tier: 2,
        includes: ["Pengecekan nama", "Akta notaris", "SK Kemenkumham", "NPWP & NIB", "Rekening & stempel (paket atas)"],
        aiFeatures: ["Pilih KBLI otomatis via wizard"],
      },
      {
        id: "a2", code: "A.2", name: "Pendirian CV (Commanditaire Vennootschap)", category: "A",
        priceMin: 2250000, priceMax: 6900000,
        desc: "3 paket pendirian CV: Dasar, + Izin, + Virtual Office. Cocok untuk usaha keluarga & kemitraan komanditer.",
        requirements: ["Nama CV", "KTP para sekutu", "Perjanjian sekutu"],
        timeline: "3–10 hari", featured: false, tier: 1,
        includes: ["Akta notaris", "Pengesahan", "NPWP", "NIB & izin (paket lengkap)"],
        aiFeatures: [],
      },
      {
        id: "a5", code: "A.5", name: "Pendirian Yayasan", category: "A",
        priceMin: 3000000, priceMax: 8400000,
        desc: "Pendirian yayasan sosial, religi & pendidikan: Dasar, + Izin, + Virtual Office. Termasuk TDY (Tanda Daftar Yayasan).",
        requirements: ["Nama & bidang kegiatan", "Pembina & pengurus", "Rencana anggaran"],
        timeline: "7–14 hari", featured: false, tier: 1,
        includes: ["Akta notaris", "SK Kemenkumham", "NPWP", "TDY (opsional)"],
        aiFeatures: [],
      },
      {
        id: "a7", code: "A.7", name: "Pendirian PMA (Penanaman Modal Asing)", category: "A",
        priceMin: 5250000, priceMax: 12400000,
        desc: "Pendirian PT PMA untuk investor asing — Dasar, + Izin, + Virtual Office. Termasuk koordinasi BKPM/OSS.",
        requirements: ["Paspor asing / KITAS", "Rencana investasi", "Deed dari notaris asing jika ada"],
        timeline: "14–30 hari", featured: false, tier: 2,
        includes: ["Persetujuan BKPM", "Akta & SK", "NIB", "Domicile letter"],
        aiFeatures: [],
      },
      {
        id: "b1", code: "B.1", name: "NPWP Badan", category: "B",
        priceMin: 450000, priceMax: 450000,
        desc: "Pengurusan NPWP badan untuk PT, CV, Firma, Yayasan — dasar semua kewajiban pajak perusahaan.",
        requirements: ["Akta & SK", "KTP pengurus", "Domisili"],
        timeline: "1–3 hari", featured: false, tier: 1,
        includes: ["Registrasi DJP online", "Kartu NPWP digital"],
        aiFeatures: [],
      },
      {
        id: "b3", code: "B.3", name: "Pengukuhan PKP", category: "B",
        priceMin: 1800000, priceMax: 1800000,
        desc: "Penetapan sebagai Pengusaha Kena Pajak — wajib jika omzet melewati batas PPN atau diperlukan partner korporat.",
        requirements: ["NPWP badan aktif", "Omzet / proyeksi", "Formulir DJP"],
        timeline: "7–14 hari", featured: false, tier: 1,
        includes: ["Pengajuan SPPKP", "Pengukuhan & faktur pajak"],
        aiFeatures: [],
      },
      {
        id: "c1", code: "C.1", name: "NIB di OSS", category: "C",
        priceMin: 1800000, priceMax: 1800000,
        desc: "Nomor Induk Berusaha via OSS-RBA — identitas tunggal legalitas usaha digital pertama dan wajib di Indonesia.",
        requirements: ["Badan usaha terdaftar", "KBLI ditentukan"],
        timeline: "1–5 hari", featured: false, tier: 1,
        includes: ["Akun OSS", "Pernyataan mandiri", "NIB & izin sesuai risiko"],
        aiFeatures: ["Mapping KBLI otomatis"],
      },
      {
        id: "c5", code: "C.5", name: "IUMK — Izin Usaha Mikro Kecil", category: "C",
        priceMin: 1350000, priceMax: 1350000,
        desc: "Izin usaha UMKM — pintu masuk akses kredit, pengadaan pemerintah, dan program pembinaan.",
        requirements: ["KTP", "Foto usaha", "Surat keterangan domisili"],
        timeline: "1–5 hari", featured: false, tier: 1,
        includes: ["Registrasi", "Sertifikat IUMK"],
        aiFeatures: [],
      },
      {
        id: "d1", code: "D.1", name: "TDUP — Tanda Daftar Usaha Pariwisata", category: "D",
        priceMin: 12000000, priceMax: 12000000,
        desc: "Status Efektif, prasyarat utama PPIU. Untuk travel, restoran, coffee shop, event organizer.",
        requirements: ["NIB", "NPWP", "Bukti tempat usaha"],
        timeline: "14–30 hari", featured: true, tier: 2,
        includes: ["Pengurusan Kemenpar", "Sertifikat TDUP Efektif"],
        aiFeatures: ["Reminder renewal"],
      },
      {
        id: "d2", code: "D.2", name: "Izin Usaha Hotel", category: "D",
        priceMin: 15000000, priceMax: 15000000,
        desc: "NIB KBLI perhotelan + Sertifikat Standar Usaha Hotel + SLF + izin operasional lengkap.",
        requirements: ["PBG/SLF bangunan", "Standar fasilitas hotel", "Klasifikasi bintang"],
        timeline: "30–60 hari", featured: false, tier: 2,
        includes: ["SSU Hotel", "SLF", "Pengawasan operasional"],
        aiFeatures: [],
      },
      {
        id: "d6", code: "D.6", name: "Sertifikasi Halal Hospitality", category: "D",
        priceMin: 4500000, priceMax: 4500000,
        desc: "Sertifikat halal BPJPH untuk hotel dengan catering halal — fatwa MUI terintegrasi.",
        requirements: ["Dokumen produk/material", "Proses produksi", "Auditor LPH"],
        timeline: "30–60 hari", featured: true, tier: 2,
        includes: ["Pengajuan SIHALAL", "Pendampingan audit LPH", "Fatwa MUI", "Sertifikat resmi"],
        aiFeatures: ["Reminder masa berlaku"],
      },
      {
        id: "g1", code: "G.1", name: "ISO 9001:2015 Quality Management", category: "G",
        priceMin: 9000000, priceMax: 9000000,
        desc: "Sistem manajemen mutu internasional — tunjukkan komitmen kualitas kepada jamaah dan partner.",
        requirements: ["Dokumentasi proses bisnis", "Audit internal awal"],
        timeline: "45–90 hari", featured: true, tier: 2,
        includes: ["Gap analysis", "Penyusunan manual QMS", "Audit internal", "Sertifikasi badan independen"],
        aiFeatures: ["Template dokumen QMS"],
      },
      {
        id: "g3", code: "G.3", name: "ISO 45001:2018 Health & Safety", category: "G",
        priceMin: 9000000, priceMax: 9000000,
        desc: "Manajemen K3 — critical untuk travel haji/umrah (risk management jamaah) dan konstruksi.",
        requirements: ["Identifikasi bahaya K3", "Prosedur darurat"],
        timeline: "45–90 hari", featured: false, tier: 2,
        includes: ["Risk assessment", "Manual K3", "Sertifikasi"],
        aiFeatures: [],
      },
      {
        id: "g4", code: "G.4", name: "ISO 27001:2022 Information Security", category: "G",
        priceMin: 12000000, priceMax: 12000000,
        desc: "Keamanan informasi global — wajib bagi travel dengan sistem booking online & perlindungan data jamaah (UU PDP).",
        requirements: ["Inventaris aset informasi", "Kebijakan keamanan"],
        timeline: "60–120 hari", featured: true, tier: 2,
        includes: ["Risk assessment ISMS", "Kebijakan & kontrol", "Sertifikasi"],
        aiFeatures: ["Gap scanner kebijakan"],
      },
      {
        id: "g5", code: "G.5", name: "Bundel Travel Excellence (ISO 9001+14001+45001)", category: "G",
        priceMin: 30000000, priceMax: 30000000,
        desc: "BEST VALUE — 3 ISO sekaligus dengan diskon Rp 6 juta. Tampil profesional di 3 dimensi: quality, environment, safety.",
        requirements: ["Kombinasi syarat G.1–G.3"],
        timeline: "90–150 hari", featured: true, tier: 3,
        includes: ["3 sertifikasi lengkap", "Implementasi terpadu", "Audit gabungan efisien"],
        aiFeatures: ["Roadmap integrasi ISO"],
      },
      {
        id: "h3", code: "H.3", name: "Izin Edar BPOM (MD)", category: "H",
        priceMin: 9500000, priceMax: 9500000,
        desc: "Izin edar makanan/minuman domestik — kebutuhan utama brand F&B sebelum masuk ritel modern & marketplace.",
        requirements: ["Sertifikat CPPOB/PIRT produk", "Label sesuai regulasi", "Data pabrik"],
        timeline: "30–60 hari", featured: true, tier: 2,
        includes: ["Registrasi BPOM", "Notifikasi & cek label", "MD number resmi"],
        aiFeatures: ["Cek komposisi & label AI"],
      },
      {
        id: "h5", code: "H.5", name: "PIRT — Produk Industri Rumah Tangga", category: "H",
        priceMin: 2500000, priceMax: 2500000,
        desc: "Pemberitahuan PIRT untuk UMKM pangan — legalitas tercepat untuk jualan di marketplace & pasar lokal.",
        requirements: ["Produk & kemasan", "Uji lab (sebagian kategori)"],
        timeline: "7–14 hari", featured: false, tier: 1,
        includes: ["Registrasi Dinkes", "Nomor PIRT resmi"],
        aiFeatures: [],
      },
      {
        id: "h6", code: "H.6", name: "Sertifikat Halal BPJPH", category: "H",
        priceMin: 4500000, priceMax: 4500000,
        desc: "Sertifikasi halal resmi dari BPJPH — kewajiban produk F&B, kosmetik, dan obat tradisional di Indonesia.",
        requirements: ["Data produk & bahan", "Proses produksi", "Surveyor LPH"],
        timeline: "30–90 hari", featured: true, tier: 2,
        includes: ["Pengajuan SIHALAL", "Pendampingan audit LPH", "Sertifikat halal resmi"],
        aiFeatures: ["Reminder perpanjangan"],
      },
      {
        id: "e1", code: "E.1", name: "SBU + SIUJK K1 (Kelas Kecil)", category: "E",
        priceMin: 31500000, priceMax: 31500000,
        desc: "Sertifikat Badan Usaha + SIUJK kelas kecil status efektif — tiket masuk tender konstruksi pemerintah.",
        requirements: ["PT/CV konstruksi", "Tenaga teknik bersertifikat", "Peralatan"],
        timeline: "30–60 hari", featured: false, tier: 2,
        includes: ["SBU LPJK", "SIUJK", "Pendampingan verifikasi"],
        aiFeatures: [],
      },
      {
        id: "e6", code: "E.6", name: "SLF — Sertifikat Laik Fungsi", category: "E",
        priceMin: 18000000, priceMax: 18000000,
        desc: "Sertifikat laik fungsi bangunan — wajib sebelum operasional gedung, hotel, dan fasilitas umum.",
        requirements: ["PBG/IMB", "Dokumen teknis bangunan", "As-built drawing"],
        timeline: "30–60 hari", featured: false, tier: 2,
        includes: ["Pengajuan ke Pemda/SIMBG", "Verifikasi lapangan", "SLF resmi"],
        aiFeatures: [],
      },
      {
        id: "l3", code: "L.3", name: "PSE — Penyelenggara Sistem Elektronik", category: "L",
        priceMin: 5000000, priceMax: 5000000,
        desc: "Registrasi PSE Kominfo — wajib untuk website, aplikasi & platform digital sebelum menampung data pengguna.",
        requirements: ["Domain & entity", "Kebijakan privasi", "Dokumen sistem"],
        timeline: "7–21 hari", featured: true, tier: 2,
        includes: ["Registrasi PSE lokal/asing", "Tanda daftar resmi"],
        aiFeatures: ["Template kebijakan privasi"],
      },
      {
        id: "l2", code: "L.2", name: "PMSE — Perdagangan Sistem Elektronik", category: "L",
        priceMin: 11000000, priceMax: 11000000,
        desc: "Pendaftaran PMSE Kemendag untuk marketplace & platform jual-beli online skala nasional.",
        requirements: ["NIB", "Dokumen platform", "Kebijakan transaksi"],
        timeline: "14–30 hari", featured: false, tier: 2,
        includes: ["Registrasi PMSE", "Kepatuhan aturan e-commerce"],
        aiFeatures: [],
      },
      {
        id: "f2", code: "F.2", name: "UKL-UPL", category: "F",
        priceMin: 15000000, priceMax: 15000000,
        desc: "Upaya Pengelolaan & Pemantauan Lingkungan — dokumen lingkungan wajib untuk usaha berdampak menengah.",
        requirements: ["Rencana kegiatan", "Lokasi & peta", "Baseline lingkungan"],
        timeline: "30–60 hari", featured: false, tier: 2,
        includes: ["Penyusunan dokumen", "Koordinasi DLH", "Persetujuan lingkungan"],
        aiFeatures: [],
      },
      {
        id: "i1", code: "I.1", name: "RPTKA", category: "I",
        priceMin: 15000000, priceMax: 15000000,
        desc: "Rencana Penggunaan Tenaga Kerja Asing — prasyarat utama mengontrak tenaga kerja asing (TKA).",
        requirements: ["PT berbadan hukum", "Posisi & justifikasi TKA", "NKP (Rp100 juta/posisi)"],
        timeline: "14–30 hari", featured: false, tier: 2,
        includes: ["Pengajuan Kemnaker", "Persetujuan RPTKA", "DKPTKA"],
        aiFeatures: [],
      },
      {
        id: "j2", code: "J.2", name: "Ahli K3 Umum (Kemnaker)", category: "J",
        priceMin: 6500000, priceMax: 6500000,
        desc: "Pelatihan 12 hari + sertifikat Ahli K3 Umum Kemnaker — wajib untuk proyek & perusahaan berisiko menengah-tinggi.",
        requirements: ["D3/S1 bidang teknik/K3", "Pengalaman kerja", "Sehat jasmani"],
        timeline: "14–21 hari", featured: false, tier: 2,
        includes: ["Pelatihan 12 hari", "Ujian nasional", "Sertifikat + SKK"],
        aiFeatures: [],
      },
      {
        id: "n1", code: "N.1", name: "Sertifikasi SNI", category: "J",
        priceMin: 12000000, priceMax: 12000000,
        desc: "Standar Nasional Indonesia untuk produk tertentu (helm, kabel, baja, dll) — kewajiban sesuai regulasi teknis.",
        requirements: ["Fasilitas produksi", "Uji lab (SGS/Sucofindo)", "Sistem mutu"],
        timeline: "60–120 hari", featured: false, tier: 2,
        includes: ["Audit pabrik", "Uji sampel", "Lisensi SNI"],
        aiFeatures: [],
      },
      {
        id: "p1", code: "P.1", name: "Perubahan Data Perusahaan", category: "A",
        priceMin: 3500000, priceMax: 3500000,
        desc: "Update alamat, pengurus, modal, atau maksud-tujuan perusahaan — cepat & rapi di akta, SK, dan OSS.",
        requirements: ["Akta terakhir", "Rups/persetujuan", "Data perubahan"],
        timeline: "3–10 hari", featured: false, tier: 1,
        includes: ["Akta perubahan", "SK Kemenkumham", "Update OSS & NPWP"],
        aiFeatures: [],
      },
    ],
  },
  bundles: [
    {
      id: "go-umrah", name: "PAKET \"GO UMRAH!\"", price: 45000000, save: 5000000,
      desc: "Untuk startup travel yang ingin langsung operasi umrah — dari nol sampai izin PPIU terbit.",
      includes: ["Pendirian PT lengkap", "Semua izin usaha (NPWP, NIB, SIUP/TDUP)", "Izin PPIU (Kemenag)", "Virtual Office 1 tahun", "Training operasional PPIU basic", "Akses MEHUDIN member network"],
      tier: "MOST POPULAR", popular: true,
    },
    {
      id: "go-haji-plus", name: "PAKET \"GO HAJI PLUS!\"", price: 80000000, save: 10000000,
      desc: "Untuk travel yang serius jadi PIHK revenue generator — jalan tol revenue industri haji.",
      includes: ["Pendirian PT + semua izin", "Izin PPIU (Umrah)", "Izin PIHK (Haji Plus)", "Virtual Office Premium", "Training & guidance operasional", "Konsultasi strategi PIHK", "Jaringan MEHUDIN + Saudi partners", "AI Compliance Dashboard"],
      tier: "FLAGSHIP", popular: true,
    },
    {
      id: "upgrade-pihk", name: "UPGRADE PPIU → PIHK", price: 30000000, save: 5000000,
      desc: "Untuk travel yang sudah punya PPIU dan ingin naik level ke haji plus.",
      includes: ["Analisis kelayakan upgrade", "Persiapan dokumentasi lengkap", "Koordinasi intensif Kemenag", "Support hingga approval", "Training operasional PIHK"],
      tier: "GROWTH", popular: false,
    },
    {
      id: "iso-bundle", name: "SERTIFIKASI ISO LENGKAP", price: 30000000, save: 5000000,
      desc: "ISO 9001 + 14001 + 45001 sekaligus — upgrade kredibilitas travel di 3 dimensi.",
      includes: ["ISO 9001 Quality", "ISO 14001 Environmental", "ISO 45001 Health & Safety", "Konsultasi + audit + implementasi"],
      tier: "CREDIBILITY", popular: false,
    },
    {
      id: "startup-legal", name: "LEGALITAS LENGKAP STARTUP", price: 25000000, save: 3500000,
      desc: "Untuk startup apapun yang butuh semua izin dasar rapi sejak hari pertama.",
      includes: ["Pendirian PT", "NPWP + NIB + SIUP", "Virtual office 3 bulan", "Konsultasi bisnis basic"],
      tier: "STARTER", popular: false,
    },
  ],
  packages: [
    {
      id: "pkg-1", slug: "umrah-reguler-9d-madinah-first", title: "Umrah Reguler 9 Hari — Madinah First",
      type: "UMRAH_REGULER", travel: "Arofahajj Syariah", price: 28500000, oldPrice: 31500000,
      durationDays: 9, departureCity: "Jakarta (CGK)", hotelMakkah: "Hotel Dar Al Eiman", starMakkah: 4,
      hotelMadinah: "Al Madinah Harmony", starMadinah: 4, departureMonth: "Maret 2026", quota: 45, booked: 32,
      rating: 4.9, reviewCount: 128, image: "/images/package-umrah.png", featured: true,
      facilities: ["Visa & handling", "Tiket PP direct", "Muthawif berbahasa Indonesia", "Ziarah lengkap", "Catering Indonesia"],
      includes: ["Visa umrah + asuransi", "Hotel 4★ 150m dari Haram", "Bus full AC", "Air zamzam 5L/jamaah", "Manasik pre-departure"],
    },
    {
      id: "pkg-2", slug: "umrah-plus-turki-12d", title: "Umrah Plus Turki 12 Hari",
      type: "UMRAH_PLUS", travel: "Arofahajj Syariah", price: 36500000, oldPrice: 39900000,
      durationDays: 12, departureCity: "Jakarta (CGK)", hotelMakkah: "Swissotel Makkah", starMakkah: 5,
      hotelMadinah: "The Oberoi Madinah", starMadinah: 5, departureMonth: "April 2026", quota: 40, booked: 21,
      rating: 4.8, reviewCount: 96, image: "/images/package-hajj.png", featured: true,
      facilities: ["Istanbul city tour", "Visa multi-negara", "5★ dekat Haram", "Tour leader bersertifikat", "Bimbingan manasik"],
      includes: ["Umrah penuh + 3 hari Istanbul", "Blue Mosque & Aya Sofia", "Internal flight JED–IST", "Semua tiket masuk museum", "Asuransi perjalanan internasional"],
    },
    {
      id: "pkg-3", slug: "umrah-ekonomis-11d", title: "Umrah Ekonomis 11 Hari — Ramah Keluarga",
      type: "UMRAH_REGULER", travel: "Mitra MEHUDIN Terverifikasi", price: 23500000, oldPrice: 25900000,
      durationDays: 11, departureCity: "Surabaya (SUB)", hotelMakkah: "Hotel Ajyad", starMakkah: 3,
      hotelMadinah: "Mark Al Madinah", starMadinah: 3, departureMonth: "Mei 2026", quota: 50, booked: 44,
      rating: 4.7, reviewCount: 211, image: "/images/madinah-nabawi.png", featured: false,
      facilities: ["Harga family friendly", "Kelompok keluarga", "Muthawif khusus keluarga", "Kamar quad", "Cicilan 6x"],
      includes: ["Visa + handling lengkap", "Hotel 3★ nyaman", "Breakfast", "Ziarah Madinah & Makkah", "Pembimbing doa keluarga"],
    },
  ],
  products: [
    { id: "pr-1", slug: "kurban-qurban-2026", name: "Kurban Kambing Premium (Domba Arabia)", category: "Kurban", price: 2850000, oldPrice: 3200000, rating: 4.9, sold: 1240, desc: "Domba arabiah standar bagus, disedekahkan langsung di Makkah dengan laporan foto & video ke jamaah.", emoji: "🐐", sla: "Pelaksanaan hari-A · laporan 24 jam" },
    { id: "pr-2", slug: "asuransi-perjalanan-umrah", name: "Asuransi Perjalanan Umrah Plus", category: "Asuransi", price: 450000, oldPrice: 0, rating: 4.8, sold: 3210, desc: "Perlindungan medis hingga USD 50.000, kecelakaan, kehilangan bagasi, dan repatriasi selama di Tanah Suci.", emoji: "🛡️", sla: "Aktif instan setelah pembayaran" },
    { id: "pr-3", slug: "airport-lounge-jeddah", name: "Airport Lounge Jeddah (One-Way)", category: "Lounge", price: 750000, oldPrice: 900000, rating: 4.7, sold: 890, desc: "Akses lounge premium di King Abdulaziz International — makanan hangat, WiFi, ruang sholat & showers.", emoji: "✈️", sla: "Voucher e-ticket 5 menit" },
    { id: "pr-4", slug: "souvenir-air-zamzam", name: "Paket Souvenir Air Zamzam + Kurma Ajwa", category: "Souvenir", price: 1250000, oldPrice: 1450000, rating: 4.9, sold: 2450, desc: "5 liter air zamzam asli + 1kg kurma Ajwa Madinah, packing aman kabin, siap dibawa pulang.", emoji: "🎁", sla: "Pickup bandara / kirim 3 hari" },
    { id: "pr-5", slug: "mushaf-digital-tajwid", name: "Mushaf Digital Al-Quran + Tajwid Interaktif", category: "Digital", price: 249000, oldPrice: 399000, rating: 4.8, sold: 5120, desc: "Mushaf digital dengan penjelasan tajwid interaktif, murotal pilihan qari, dan bookmark perjalanan ibadah.", emoji: "📖", sla: "Akses instan via email" },
    { id: "pr-6", slug: "laundry-jamaah-makkah", name: "Layanan Laundry Jamaah Makkah (3 Hari)", category: "Layanan", price: 350000, oldPrice: 0, rating: 4.6, sold: 1670, desc: "Jemput antar dari hotel, cuci setrika 6kg, siap dalam 3 hari — jamaah fokus ibadah saja.", emoji: "🧺", sla: "Same-day pickup" },
  ],
  muhdin: {
    headline: "MEHUDIN — Majelis Ekosistem Haji-Umrah Digital Indonesia",
    sub: "Asosiasi industri travel haji-umrah: satu SSO untuk semua portal, badge kepercayaan, dan standar compliance bersama.",
    tiers: [
      { name: "Member Dasar", price: 2500000, period: "tahun", features: ["Registrasi & verifikasi anggota", "Badge MEHUDIN-Accredited", "Akses forum komunitas", "Newsletter regulasi"], highlight: false },
      { name: "Member Tersertifikasi", price: 7500000, period: "tahun", features: ["Semua benefit Dasar", "Prioritas program sertifikasi Arofahajj", "Direktori publik + QR verifikasi", "E-voting & rapat anggota", "Job board tour leader"], highlight: true },
      { name: "Strategic Partner", price: 25000000, period: "tahun", features: ["Semua benefit Tersertifikasi", "Slot prioritas katalog Arofahajj.com", "Co-branding event & webinar", "Akses data pasar industri", "Dukungan legal compliance dedicated"], highlight: false },
    ],
    directory: [
      { name: "Arofahajj Syariah", city: "Jakarta Selatan", ppiu: "U-1500123", badge: "PLATINUM", score: 98, tier: "platinum" },
      { name: "Travel Hikmah Barokah", city: "Bandung", ppiu: "U-1500287", badge: "GOLD", score: 92, tier: "gold" },
      { name: "Zamzam Tour & Travel", city: "Surabaya", ppiu: "U-1500334", badge: "GOLD", score: 90, tier: "gold" },
      { name: "Raudhah Wisata Nusantara", city: "Medan", ppiu: "U-1500401", badge: "SILVER", score: 84, tier: "silver" },
      { name: "Anwarul Haramain", city: "Makassar", ppiu: "U-1500466", badge: "GOLD", score: 89, tier: "gold" },
      { name: "Baitul Maqdis Perjalanan", city: "Semarang", ppiu: "U-1500512", badge: "SILVER", score: 81, tier: "silver" },
    ],
    benefits: [
      { icon: "shield", title: "Verifikasi Terpusat", desc: "Setiap anggota melewati due diligence 2 lapis: legalitas & track record operasional." },
      { icon: "award", title: "Badge Kepercayaan", desc: "Badge MEHUDIN-Accredited tampil di profil travel di seluruh ekosistem Arofahajj." },
      { icon: "users", title: "Jaringan 3.000+ Mitra", desc: "Networking, sharing best practice, dan akses job board tour leader & muthawif." },
      { icon: "bell", title: "Alert Regulasi", desc: "Notifikasi perubahan regulasi Kemenag & Nusuk lebih cepat dari kanal manapun." },
    ],
    stats: { members: 3000, cities: 124, certified: 480, events: 36 },
  },
  testimonials: [
    { name: "H. Ahmad Fauzi", role: "Pemilik Travel Umrah", city: "Bekasi", text: "Dari bingung urus PPIU selama 2 tahun, sekarang izin terbit dan jamaah naik 3x. Wizard KBLI-nya luar biasa memudahkan.", rating: 5 },
    { name: "Siti Rahmawati", role: "Direktur PT Wisata Halal", city: "Jakarta", text: "Paket GO HAJI PLUS benar-benar lengkap — koordinasi Kemenag sampai training PIHK semua di-handle. Recommended!", rating: 5 },
    { name: "Ust. Bambang Sutrisno", role: "Muthawif & Tour Leader", city: "Solo", text: "Sertifikasi tour leader membuat saya lebih dipercaya jamaah. Dashboard tracking real-time-nya canggih.", rating: 5 },
    { name: "Dra. Nurhayati", role: "Jamaah Umrah", city: "Yogyakarta", text: "Escrow-nya membuat keluarga saya tenang — dana baru dicairkan setelah keberangkatan aman. Ini masa depan umrah.", rating: 5 },
  ],
  contact: {
    headline: "Siap Memulai Perjalanan Digital Anda?",
    sub: "Tim expert kami siap membantu — dari konsultasi izin pertama hingga operasional ekosistem penuh.",
    email: "hello@arofahajj.com",
    phone: "+62 812 3456 7890",
    whatsapp: "6281234567890",
    address: "PT Arofah Global Sistem — Jakarta, Indonesia",
    hours: "Senin–Sabtu · 09.00–18.00 WIB",
  },
  wizardRules: {
    businessTypes: [
      { id: "travel-umrah", label: "Buka travel umrah baru", recommended: ["r6", "d1", "r1"], note: "Jalur paling umum: PT dulu → TDUP → PPIU. Estimasi total 90–120 hari." },
      { id: "travel-haji-plus", label: "Upgrade ke haji plus (PIHK)", recommended: ["r2", "r3"], note: "Butuh PPIU aktif 2 tahun + track record 2.000 jamaah. Mari cek kelayakan Anda." },
      { id: "startup-umum", label: "Startup umum (non-travel)", recommended: ["a1", "c1", "b1"], note: "Fondasi legalitas: PT + NIB OSS + NPWP. Bisa selesai dalam 2 minggu." },
      { id: "fnb-halal", label: "Bisnis F&B / produk halal", recommended: ["h5", "h6", "h3"], note: "PIRT dulu untuk UMKM, lanjut Halal BPJPH & BPOM MD untuk masuk ritel modern." },
      { id: "kredibilitas", label: "Upgrade kredibilitas perusahaan", recommended: ["g1", "g5", "l3"], note: "ISO + PSE menaikkan kepercayaan partner & kepatuhan UU PDP." },
      { id: "konstruksi", label: "Bisnis konstruksi", recommended: ["e1", "e6", "j2"], note: "SBU/SIUJK + SLF + Ahli K3 — tiket masuk tender & operasional aman." },
    ],
  },
};
