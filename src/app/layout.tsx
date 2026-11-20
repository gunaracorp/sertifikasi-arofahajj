import type { Metadata, Viewport } from "next";
import { Geist_Mono, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SeoJsonLd } from "@/components/landing/seo-jsonld";
import { Analytics } from "@/components/landing/analytics";
import { FloatingWhatsApp } from "@/components/landing/floating-whatsapp";
import { ActivityFeed } from "@/components/landing/activity-feed";
import { MotionProvider } from "@/components/motion/motion-provider";
import VitalsReporter from "@/components/seo/vitals-reporter";
import { LanguageProvider } from "@/lib/i18n/language-provider";
import { SITE_URL, LEGAL_ENTITY } from "@/lib/site";
import { SpeedInsights } from "@vercel/speed-insights/next";

// ============================================================
// REDESIGN 2026 — Tipografi "Zamrud & Emas Editorial"
// Display: Playfair Display (serif mewah — judul besar berkelas
// hotel/biro perjalanan premium) · Body: Plus Jakarta Sans
// (sans humanis karya desainer Indonesia — sangat cocok untuk
// brand Indonesia, beda total dari Geist geometric lama).
// Mono tetap Geist Mono untuk angka/kode teknis.
// ============================================================
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ============================================================
// GOOGLE ANALYTICS 4 — G-KMZRQJQXCB (AKTIF DI SETIAP HALAMAN)
// Ditulis langsung di <head> root layout → tercetak di HTML semua
// halaman (satu pintu, nol terlewat). NEXT_PUBLIC_GA_ID bisa menimpa
// bila kelak ganti properti; fallback hardcode menjamin GA tetap
// aktif walau .env tidak ikut saat deploy statis cPanel.
// Event konversi yang mengalir otomatis dari komponen situs:
//   generate_lead  (hero, lead-form, final-cta, kalkulator, kontak)
//   sign_up        (kursus email)
//   chat_message   (AI chat RIZKI)
//   whatsapp_click (tombol WhatsApp mengambang)
// ============================================================
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-KMZRQJQXCB";

// ============================================================
// AROFAHAJJ UNIVERSE — Metadata SEO Supercharged
// Dibangun untuk mendominasi pencarian perizinan Indonesia
// ============================================================



export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Arofahajj Universe — Haji & Umrah, Perizinan Usaha & Sertifikasi #1 Indonesia | NIB, PT, PMA, PPIU/PPIH, Halal",
    template: "%s | Arofahajj Universe",
  },
  description:
    "Konsultan perizinan usaha terbaik Indonesia: NIB 1 hari, pendirian PT 3 hari, sertifikasi halal, izin BPOM/PIRT, PBG & SLF, izin lingkungan, PMA, izin umroh (PPIU) & haji (PPIH), registrasi IATA, izin usaha Arab Saudi (MISA), RKAB tambang. Melayani 38 provinsi & 514 kabupaten/kota. Panduan perizinan terlengkap + AI checker + kalkulator biaya gratis. Kantor pusat Tasikmalaya (PT AROFAH GLOBAL SISTEM — NIB 2503250053856, KBLI 79121). Garansi 100% uang kembali.",
  keywords: [
    // inti layanan
    "jasa perizinan usaha", "jasa pengurusan izin usaha", "konsultan perizinan", "konsultan izin usaha",
    "jasa pendirian PT", "biaya pendirian PT", "cara mendirikan PT", "syarat pendirian PT",
    "jasa pendirian CV", "biaya pendirian CV", "syarat pendirian CV",
    "jasa pendirian PMA", "pendirian PMA untuk asing", "syarat PMA Indonesia",
    // NIB & OSS
    "cara membuat NIB", "biaya NIB", "syarat NIB", "NIB online", "NIB tanpa badan usaha",
    "OSS RBA", "cara daftar OSS", "sertifikat standar", "level risiko KBLI", "OSS beli",
    // sertifikasi produk
    "sertifikasi halal", "biaya sertifikasi halal", "cara daftar sertifikat halal", "SEHATI halal",
    "izin BPOM", "cara daftar BPOM", "PIRT online", "biaya PIRT", "izin edar produk",
    "CPPOB", "sertifikat CPPOB home industry",
    // bangunan & lingkungan
    "PBG online", "cara mengurus PBG", "SLF gedung", "biaya SLF", "pengganti IMB",
    "AMDAL", "UKL UPL", "SPPL online", "biaya AMDAL", "izin lingkungan usaha",
    // sektor
    "izin usaha kuliner", "izin kafe", "izin restoran", "izin klinik", "SIA klinik", "izin apotek",
    "TDAU pariwisata", "izin travel", "izin tambang", "IUP", "IUPK", "izin ekspor impor",
    "izin konstruksi", "SBU konstruksi", "izin logistik", "TDUP",
    // travel ibadah & aviasi & internasional
    "izin umroh", "izin haji", "syarat izin umroh", "biaya izin umroh", "PPIU", "PPIH", "SIPU", "SPPU",
    "izin travel umroh", "cara jadi PPIU", "registrasi IATA", "akreditasi IATA", "IATA agent Indonesia",
    "izin usaha arab saudi", "MISA license", "MISA saudi arabia", "buka usaha di arab saudi", "commercial registration saudi",
    "RKAB", "RKAB 3 tahunan", "perpanjangan IUP", "izin jual batubara", "MODI minerba", "izin pertambangan",
    // jangkauan
    "konsultan perizinan se indonesia", "jasa perizinan 38 provinsi", "perizinan 514 kabupaten kota",
    // pajak
    "NPWP usaha", "PPh final 0.5", "pajak UMKM", "SPPKP", "pengukuhan PKP", "LKPM",
    // KBLI & panduan
    "KBLI", "cari KBLI usaha", "daftar KBLI", "KBLI terlaris", "panduan perizinan",
    "izin usaha", "legalitas usaha", "legalitas UMKM", "urus izin murah",
    // blog & content hub
    "blog perizinan", "artikel perizinan usaha", "panduan perizinan lengkap", "kursus email perizinan gratis",
    "panduan NIB 2026", "biaya pendirian PT 2026", "syarat izin usaha 2026", "pusat pengetahuan perizinan",
    // lokasi
    "konsultan perizinan tasikmalaya", "arofahajj", "arofahajj universe", "jasa haji umrah terpercaya",
    "jasa perizinan bandung", "jasa perizinan surabaya", "jasa perizinan bali", "perizinan PMA bali",
    // brand
    "arofahajj", "arofahajj.com",
  ],
  authors: [{ name: "Arofahajj Universe", url: SITE_URL }],
  creator: "Arofahajj Universe",
  publisher: LEGAL_ENTITY,
  alternates: {
    canonical: "/",
    // M04 (audit): hreflang id-ID + x-default — situs satu bahasa (i18n via
    // client-side ?lang=), sinyal ini menegaskan bahasa kanonikal ke mesin
    // pencari tanpa risiko duplikat. Halaman dengan generateMetadata sendiri
    // memakai langAlternates() dari src/lib/seo.ts (pola yang sama).
    languages: {
      "id-ID": SITE_URL,
      "x-default": SITE_URL,
    },
    // RSS feed blog — jalur penemuan konten tambahan (reader, agregator, GNews)
    types: { "application/rss+xml": "/feed.xml" },
  },
  category: "Business Legal Services",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo-icon.png",
    shortcut: "/logo-icon.png",
    apple: "/logo-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "Arofahajj Universe",
    title: "Arofahajj Universe — Urus Semua Izin Usaha, Tinggal Terima Beres",
    description:
      "Arofahajj Universe — Haji & Umrah, perizinan usaha & sertifikasi #1 Indonesia (PT AROFAH GLOBAL SISTEM). NIB 1 hari, PT 3 hari, Halal, BPOM, PBG/SLF, AMDAL, PMA, Izin Umroh/Haji (PPIU/PPIH), IATA, Arab Saudi (MISA), RKAB tambang — garansi 100%. Melayani 38 provinsi & 514 kabupaten/kota.",
    images: [
      {
        url: "/og-arofahajj.png",
        width: 1440,
        height: 736,
        alt: "Arofahajj Universe — Urus Izin Usaha, Tinggal Beres. Konsultan Perizinan #1 Indonesia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arofahajj Universe — Konsultan Perizinan Usaha #1 Indonesia",
    description:
      "NIB 1 hari, PT 3 hari, garansi 100%. Panduan perizinan terlengkap Indonesia + Cek Izin AI gratis.",
    images: ["/og-arofahajj.png"],
  },
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b3d30",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* RESOURCE HINTS — preconnect ke origin pihak ketiga kritis
            (analytics + WhatsApp CTA): hemat DNS+TLS ~100-300ms,
            menyehatkan Core Web Vitals → sinyal ranking. */}
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.clarity.ms" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://wa.me" />
        {/* CATATAN AUDIT: canonical hardcode DIHAPUS — sebelumnya menyebabkan
            canonical GANDA di semua 2.830 halaman (hardcode homepage vs canonical
            per-halaman dari generateMetadata). Homepage kini memakai canonical
            dari alternates.canonical di atas. */}
        {/* M25 (audit): verifikasi Search Console via env — set
            NEXT_PUBLIC_GSC_VERIFICATION=<token> tanpa perlu ubah kode. */}
        {/* WEBMASTER TOOLS MASTER: verifikasi kepemilikan lintas mesin
            pencari (Google #1, lalu Bing/Yahoo, Yandex, Baidu, Naver,
            Seznam). Semua via env — tanpa token, tag tidak dirender. */}
        {([
          ["google-site-verification", process.env.NEXT_PUBLIC_GSC_VERIFICATION],
          ["msvalidate.01", process.env.NEXT_PUBLIC_BING_VERIFICATION],
          ["yandex-verification", process.env.NEXT_PUBLIC_YANDEX_VERIFICATION],
          ["baidu-site-verification", process.env.NEXT_PUBLIC_BAIDU_VERIFICATION],
          ["naver-site-verification", process.env.NEXT_PUBLIC_NAVER_VERIFICATION],
          ["seznam-wmt", process.env.NEXT_PUBLIC_SEZNAM_VERIFICATION],
        ] as const).map(([name, content]) =>
          content ? <meta key={name} name={name} content={content} /> : null
        )}
        {/* M05 (audit): geo default kantor pusat SCBD — halaman berlokasi
            (/layanan/<layanan>-<provinsi>, dst.) menimpa dengan geoMetaForSlug()
            dari src/lib/geo.ts via metadata.other di generateMetadata masing-masing. */}
        <meta name="geo.region" content="ID-JK" />
        <meta name="geo.placename" content="Jakarta Selatan" />
        <meta name="geo.position" content="-6.2249;106.809" />
        <meta name="ICBM" content="-6.2249, 106.809" />
        {/* GOOGLE TAG (gtag.js) — GA4, dirender di <head> SETIAP halaman.
            React 19 hoist & dedupe <script async> berdasarkan src. */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_ID}');`,
          }}
        />
      </head>
      <body
        className={`${jakarta.variable} ${playfair.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {/* MotionProvider: MotionConfig reducedMotion="user" — seluruh animasi
            framer-motion situs otomatis dinonaktifkan bagi pengguna
            prefers-reduced-motion (WCAG 2.2). */}
        <MotionProvider>
          <LanguageProvider>
            {children}
            <SeoJsonLd />
            <Analytics />
            <VitalsReporter />
            <SpeedInsights />
            <Toaster />
            {/* ROADMAP-99 langkah 5: Floating WhatsApp CTA sitewide —
                komponen menyembunyikan dirinya di /, /admin, /webmaster,
                /checkout (lihat floating-whatsapp.tsx). */}
            <FloatingWhatsApp />
            {/* ROADMAP-99 langkah 46: Live activity feed (data nyata
                ter-anonimkan; sembunyi di /, /admin, /webmaster, /checkout). */}
            <ActivityFeed />
          </LanguageProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
