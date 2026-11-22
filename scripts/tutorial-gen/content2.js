// ============================================================
// content2.js — Bab 6–10 tutorial (teks bahasa Indonesia)
// ============================================================

function chapters2(H) {
  const { h1, h2, h3, body, bodyRuns, codeBlock, dataTable, tableTitle, numbered, bullets } = H;
  const c = [];

  // ================= BAB 6 =================
  c.push(h1("6. Mengembangkan Tema Baru (Hulu ke Hilir)"));
  c.push(body("Sistem tema dirancang agar menambah tema baru hanya menyentuh dua berkas, tanpa mengubah satu pun komponen UI. Prinsipnya: tema adalah kumpulan token warna oklch yang menimpa variabel :root melalui atribut data-theme pada tag html. Tema default (zamrud) sengaja tidak memiliki blok CSS \u2014 tanpa atribut data-theme, situs tampil persis seperti palet asli, sehingga nol risiko regresi visual."));
  c.push(h2("6.1 Enam Langkah Menambah Tema"));
  c.push(numbered("ch6-steps", [
    "Rancang palet di oklch.space: pilih warna utama (tombol/tautan), latar kanvas, dan aksen emas; pastikan kontras teks minimal 4,5:1 (AA).",
    "Daftarkan tema di src/lib/themes.ts \u2014 tambahkan entri THEMES dengan id unik tanpa spasi, nama, deskripsi, flag dark, dan tiga warna swatch untuk pratinjau admin.",
    "Tambahkan blok CSS di src/app/globals.css \u2014 salin struktur blok tema lain (html[data-theme=\u201c-id-anda\u201d]) dan isi seluruh token: background, foreground, card, popover, primary, secondary, muted, accent, border, input, ring, chart 1-5, gold, sidebar, dan radius.",
    "Override tiga kelas brand agar area hero ikut berganti nuansa: .hero-gradient, .band-sun, dan .text-gradient-brand dengan hue palet Anda (lihat blok tema tirta sebagai contoh terlengkap).",
    "Untuk tema gelap: tidak perlu blok token \u2014 cukup set dark: true di themes.ts; layout dan ThemeBridge otomatis menambahkan class dark yang memuat token .dark bawaan.",
    "Uji: buka /?theme=id-anda di browser, cek halaman beranda, katalog, dan blog di lebar ponsel maupun desktop; bila puas, Terapkan dari tab Studio Tema (tersimpan permanen di database).",
  ]));
  c.push(body("Tidak ada langkah build atau migrasi \u2014 hot reload langsung menampilkan hasilnya. Picker di admin dan pratinjau ?theme= otomatis mengenali tema baru karena keduanya membaca registri THEMES."));
  c.push(h2("6.2 Aturan Emas Tema"));
  c.push(bullets([
    "Jangan pernah mengubah nilai token di :root atau .dark bawaan \u2014 itu identitas default seluruh pengguna lama.",
    "Satu tema = satu blok html[data-theme=...] \u2014 jangan menyebar override di banyak tempat.",
    "Kontras dulu, estetika kemudian: uji tombol utama, teks di latar kartin, dan teks di atas warna aksen.",
    "Tema gelap cukup flag dark: true \u2014 menggandakan token .dark akan menyulitkan pemeliharaan.",
    "Gunakan oklch (bukan hex) untuk semua token agar konsisten dengan sistem warna proyek.",
  ]));

  // ================= BAB 7 =================
  c.push(h1("7. Playbook Full SEO dari Hulu ke Hilir"));
  c.push(body("SEO Arofahajj Universe berdiri di atas fondasi teknis yang sudah terpasang otomatis \u2014 tugas Anda adalah mengelola konten di atas fondasi itu dan menjaga mesin distribusinya tetap berputar. Bab ini menyusun semuanya dalam enam lapis kerja berurutan."));
  c.push(h2("7.1 Lapis 1 \u2014 Fondasi Teknis (Sudah Terpasang, Tetap Dirawat)"));
  c.push(bullets([
    "Metadata per halaman: title template, canonical per URL, hreflang id-ID + x-default, OG/Twitter card, dan robots mengikuti noindex dari CMS.",
    "Data terstruktur: JSON-LD Organization, WebSite+SearchAction, Blog, BreadcrumbList sitewide; BlogPosting + FAQPage per artikel; WebPage + FAQPage per halaman CMS.",
    "Sitemap 16 seksi (11.000+ URL) dengan indeks /sitemap.xml, lastmod deterministik dari hash URL, plus seksi blog dan halaman yang memakai tanggal asli konten.",
    "robots.txt permissive untuk Googlebot/Bing/sosial dan crawler AI (GPTBot, ClaudeBot, PerplexityBot) + daftar 16 sitemap.",
    "feed.xml (RSS), llms.txt dan llms-full.txt untuk GEO (Generative Engine Optimization).",
    "Core Web Vitals: font next/font, preconnect, animasi compositor-only, VitalsReporter (RUM) ke /api/vitals.",
  ]));
  c.push(body("Rutinitas penjagaan: pastikan bun run db:verify hijau sebelum deploy (sitemap membaca database), dan cek /sitemap.xml serta /sitemap/halaman.xml setelah deploy konten baru."));
  c.push(h2("7.2 Lapis 2 \u2014 On-Page Saat Membuat Konten"));
  c.push(body("Setiap artikel dan halaman harus lolos checklist berikut sebelum diterbitkan. Skor SEO live di editor sudah menghitung sebagian besar poin ini \u2014 targetkan minimal 80/100."));
  c.push(tableTitle("Tabel 7.1 \u2014 Checklist on-page per konten"));
  c.push(dataTable(
    ["Elemen", "Aturan"],
    [
      ["Meta title", "30\u201360 karakter; memuat kata kunci fokus di awal; ditutup merek bila perlu"],
      ["Meta description", "110\u2013160 karakter; memuat kata kunci; ada ajakan bertindak"],
      ["Kata kunci fokus", "Satu frasa per konten; muncul di H1, meta title, meta description, dan paragraf awal"],
      ["Struktur", "Satu H1; setiap bagian satu H2 bermakna; bullet untuk daftar praktis"],
      ["Panjang", "Minimal 300 kata (editor menghitung); ideal 600\u20131.200 untuk panduan"],
      ["FAQ", "2\u20134 pertanyaan nyata dari pelanggan \u2014 menjadi FAQPage JSON-LD"],
      ["Tautan internal", "Tautkan ke katalog layanan terkait, /kbli, atau panduan lain"],
      ["noindex", "Hanya untuk halaman internal/kampanye tertutup \u2014 jangan centang sembarangan"],
    ],
    [28, 72],
  ));
  c.push(h2("7.3 Lapis 3 \u2014 Ritme Konten"));
  c.push(body("Gunakan kalender editorial bawaan (tab Konten & SEO): tiga slot per minggu dengan pilar tetap \u2014 Senin Panduan, Rabu Regulasi, Jumat Tips Pajak \u2014 dari bank 36 topik terkurasi yang bergulir 12 minggu. Alur kerjanya: buka slot \u2192 klik Mulai Draf (post terisi otomatis dengan judul dan kata kunci usulan) \u2192 tulis dan tingkatkan skor SEO \u2192 terbitkan. Slot status otomatis mengikuti post (PLANNED menjadi DRAFTED, lalu PUBLISHED)."));
  c.push(h2("7.4 Lapis 4 \u2014 Distribusi dan Indexing"));
  c.push(numbered("ch7-index", [
    "Daftarkan properti di Google Search Console dan kirim sitemap indeks https://domainanda/sitemap.xml.",
    "Aktifkan IndexNow: taruh kunci di env INDEXNOW_KEY dan pastikan berkas /{kunci}.txt tersajak \u2014 setiap post yang diterbitkan otomatis di-ping ke Bing/Yandex (Google tidak memakai IndexNow; jalur resminya GSC URL Inspection).",
    "Untuk Google, gunakan URL Inspection pada URL baru yang penting dan pantau laporan Pages \u2014 tangani Discovered not indexed dengan memperkuat konten (bukan sekadar menunggu).",
    "Cron SEO harian: /api/cron/seo-ping melakukan ping berbasis snapshot diff; jadwalkan bila hosting mendukung cron (lihat Bab 8).",
    "RSS feed (feed.xml) untuk pembaca dan agregator; llms.txt untuk mesin jawaban AI.",
  ]));
  c.push(h2("7.5 Lapis 5 \u2014 SEO Lokal dan GEO"));
  c.push(body("Dua medan tumbuh tercepat. SEO lokal: 38 provinsi sudah tercakup di data; perkuat halaman wilayah (langkah 7 ROADMAP-99) dan konsisten mencantumkan NIB 2503250053856, alamat Tasikmalaya, dan nomor WhatsApp yang sama di seluruh properti. GEO (keterlihatan di jawaban AI): konten terstruktur + FAQ + llms-full.txt membuat situs mudah dikutip ChatGPT/Perplexity/Copilot \u2014 pastikan fakta (harga resmi, kanal resmi) selalu terbaru karena AI membaca halaman lama lebih lama."));
  c.push(h2("7.6 Lapis 6 \u2014 Pengukuran dan Iterasi"));
  c.push(body("GA4 aktif di semua halaman (event generate_lead, sign_up, chat_message, whatsapp_click otomatis); Microsoft Clarity dan GSC melengkapi gambaran. Siklus bulanan yang disarankan: lihat halaman dengan impresi tinggi tapi CTR rendah (perbaiki meta title/description via CMS) \u2192 halaman dengan traffic nol setelah 60 hari (perkuat atau gabungkan) \u2192 kata kunci naik peringkat 8\u201315 (perdalam konten hingga masuk top 5)."));

  // ================= BAB 8 =================
  c.push(h1("8. Build dan Deployment"));
  c.push(h2("8.1 Memilih Jalur"));
  c.push(tableTitle("Tabel 8.1 \u2014 Perbandingan dua jalur deployment"));
  c.push(dataTable(
    ["Aspek", "A: Hosting Statis (idwebhost/cPanel)", "B: Node Standalone (Hostinger/VPS)"],
    [
      ["Perintah", "build:static lalu pack:static", "build lalu start"],
      ["Konten CMS", "Beku saat build \u2014 rebuild tiap update", "Langsung hidup (on-demand)"],
      ["Form/AI/pembayaran", "Fallback WhatsApp", "Penuh (API live)"],
      ["Biaya", "Termurah (shared hosting)", "VPS/hosting Node"],
      ["Pemeliharaan", "Unggah tar.gz berkala", "pm2 + monitoring"],
      ["Cocok untuk", "Situs brosur cepat & murah", "Operasi bisnis penuh (rekomendasi utama)"],
    ],
    [20, 40, 40],
  ));
  c.push(h2("8.2 Jalur A \u2014 Hosting Statis (idwebhost/cPanel)"));
  c.push(numbered("ch8-static", [
    "Pastikan database hidup dan konten CMS final (konten dibekukan saat build).",
    "Jalankan bun run build:static \u2014 script menggeser API dan rute long-tail (PACK_LIGHT), membangun export, menempel .htaccess, memangkas sitemap/RSS, lalu memulihkan semuanya.",
    "Jalankan bun run pack:static \u2014 hasilnya public/download/arofahajj-static-hosting.tar.gz berisi seluruh situs (mode LIGHT: 268 halaman inti, sekitar 29 MB).",
    "Masuk cPanel \u2192 File Manager \u2192 buka public_html domain tujuan.",
    "Unggah tar.gz, klik kanan \u2192 Extract, lalu hapus arsipnya.",
    "Pastikan .htaccess ikut terekstrak (DirectoryIndex, 404.html, gzip, cache) \u2014 tanpa ini routing 404 dan cache tidak aktif.",
    "Buka domain untuk verifikasi; cek juga /404.html, /sitemap.xml, dan satu halaman /p/ hasil CMS.",
    "Subdomain sertifikasi.arofahajj.com: buat subdomain di cPanel (DocumentRoot ke folder paket), arahkan A record ke IP hosting, tunggu propagasi, lalu unggah paket yang sama ke folder subdomain.",
  ]));
  c.push(body("Mode paket: PACK_LIGHT=1 (default skrip) hanya membawa halaman inti \u2014 cocok untuk shared hosting. Tanpa flag, export penuh 9.500+ halaman berjalan (butuh RAM/waktu besar). Setiap build statis menuliskan marker .pack-mode dan pack-info.json berisi jumlah halaman, ukuran, dan MD5 untuk verifikasi."));
  c.push(h2("8.3 Jalur B \u2014 Node Standalone (Rekomendasi Produksi)"));
  c.push(numbered("ch8-node", [
    "Set DATABASE_URL menunjuk Prisma Postgres cloud (sslmode=require) di environment hosting \u2014 jangan menaruh .env sandbox.",
    "bun run build \u2014 rantai: contract emit, verify contract, next build --webpack, postbuild (menyematkan public/generated ke bundle).",
    "bun run start (atau pm2 start npm -- start) \u2014 server standalone berjalan di port yang ditentukan.",
    "Jadwalkan cron: /api/cron/followup dan /api/cron/recovery dengan header CRON_SECRET untuk follow-up lead dan pemulihan checkout; /api/cron/seo-ping untuk ping harian.",
    "Isi kredensial produksi: Midtrans/Tripay untuk pembayaran sungguhan, INDEXNOW_KEY, Telegram/Fonnte untuk notifikasi \u2014 semua fitur runtime langsung hidup.",
  ]));
  c.push(h2("8.4 Setelah Deploy \u2014 Checklist 10 Menit"));
  c.push(bullets([
    "GET /api/version mengembalikan versi dan statistik yang benar.",
    "Login /admin berhasil dan skor konten tampil.",
    "Satu halaman /p/{slug} terbuka dan tema aktif terlihat.",
    "sitemap.xml, feed.xml, robots.txt tersajak dengan URL domain tujuan.",
    "Tombol WhatsApp dan form konsultasi berfungsi (atau fallback WA di jalur statis).",
  ]));

  // ================= BAB 9 =================
  c.push(h1("9. Troubleshooting \u2014 Masalah Umum dan Solusinya"));
  c.push(body("Tabel ini merangkum masalah yang benar-benar pernah terjadi pada proyek ini beserta solusi tervalidasi. Bila menemui gejala baru, selalu mulai dari dev.log dan output guard predev."));
  c.push(tableTitle("Tabel 9.1 \u2014 Diagnosa cepat"));
  c.push(dataTable(
    ["Gejala", "Penyebab", "Solusi"],
    [
      [".env berisi DATABASE_URL=file:...", "Sandbox/laptop pulih dan menimpa .env dengan templat", "bash scripts/ensure-pg.sh (v2.4.0 sudah tahan format kutip)"],
      ["Prisma CLI.CONFIG_UNREADABLE saat install", "DATABASE_URL belum diisi saat postinstall emit", "Isi .env PostgreSQL dulu, lalu bun install ulang"],
      ["Port 3000 terpakai / server mati", "Sesi lama belum bersih", "pkill -f next dev; bash scripts/ensure-pg.sh; nyalakan dev.sh"],
      ["Build statis gagal: Cannot find module .../api/...", "Artefak dev .next/dev mereferensi rute yang digeser", "Sudah difix di build-static.mjs (membersihkan .next/dev) \u2014 perbarui repo"],
      ["export build gagal: rewrites/redirects", "next.config lama mengabaikan BUILD_STATIC", "Sudah difix v2.4.0 \u2014 pull repo terbaru"],
      ["Halaman CMS tak muncul di hosting statis", "Konten berubah setelah build terakhir", "Jalankan ulang build:static + pack:static, unggah paket baru"],
      ["Footer tak menampilkan halaman CMS", "API footer tak tersedia di hosting statis", "Perilaku normal (fallback); paket baru akan menampilkannya via build"],
      ["db:verify mismatch", "Skema DB tidak sinkron kontrak", "bun run prisma8:emit; bun run db:init; bun run db:sign; bun run db:verify"],
      ["Perubahan CSS tak muncul", "Cache Tailwind dev", "Restart dev server (cold restart) \u2014 catatan audit Task 50"],
      ["500 di /api/admin/posts", "Era lama: DateTime eksotis Prisma 8", "Sudah dimitigasi toIsoSafe() \u2014 pastikan repo v2.4.0"],
    ],
    [28, 32, 40],
  ));

  // ================= BAB 10 =================
  c.push(h1("10. Checklist Rilis dan Peta Jalan"));
  c.push(h2("10.1 Disiplin Versioning \u2014 8 Titik Wajib"));
  c.push(body("Setiap rilis wajib menyinkronkan kedelapan titik berikut sebelum commit (skrip bantu: scripts/bump-v240.py dapat disalin dan disesuaikan untuk versi berikutnya)."));
  c.push(tableTitle("Tabel 10.1 \u2014 Delapan titik sinkron versi"));
  c.push(dataTable(
    ["No.", "Titik", "Isi perubahan"],
    [
      ["1", "src/lib/version.ts", "APP_VERSION, RELEASE_NAME, RELEASE_DATE, entri RELEASES"],
      ["2", "package.json", "field version"],
      ["3", "scripts/ver.json", "blok version, releases.total, releases.current"],
      ["4", "CHANGELOG.md", "badge, entri ber-anker, ladder tabel"],
      ["5", "WORKLOG.md", "entri Task ID baru di akhir berkas"],
      ["6", "STATE.md", "baris versi aplikasi"],
      ["7", "README.md", "badge versi + kalimat statistik rilis"],
      ["8", "Kontrak Prisma", "bun run db:verify hijau"],
    ],
    [8, 30, 62],
  ));
  c.push(h2("10.2 Quick Wins Top-10 (dari ROADMAP-99)"));
  c.push(body("ROADMAP-99 adalah rencana induk 12 fase dan 99 langkah menuju platform nomor satu. Sepuluh langkah berikut dipilih langsung oleh dokumen roadmap sebagai prioritas pendapatan \u2014 kerjakan berurutan."));
  c.push(tableTitle("Tabel 10.2 \u2014 Quick Wins berprioritas"));
  c.push(dataTable(
    ["#", "Langkah", "Mengapa dulu"],
    [
      ["1", "Aktifkan pembayaran produksi (Midtrans/Tripay)", "Situs masih demo mode \u2014 1.500 layanan belum menghasilkan"],
      ["2", "Submit 16 sitemap ke GSC + Bing", "11.000+ URL belum terpantau performanya"],
      ["3", "CTA Pesan Sekarang di halaman detail layanan", "Jalur order instan di tempat traffic berada"],
      ["4", "Pasang GA4 + Microsoft Clarity", "Tanpa data, keputusan berikutnya menebak-nebak"],
      ["5", "Floating WhatsApp di semua halaman katalog", "Saluran closing favorit pasar Indonesia"],
      ["6", "Follow-up otomatis lead 24 jam", "80% penjualan datang dari follow-up"],
      ["7", "Halaman /wilayah/[provinsi] 38 provinsi", "SEO lokal = traffic gratis berniat tinggi"],
      ["8", "Bundle Sering Diambil Bersama di checkout", "Naikkan nilai transaksi rata-rata"],
      ["9", "Abandoned checkout recovery 3 langkah", "Selamatkan keranjang yang hampir jadi"],
      ["10", "Testimoni asli + widget live", "Trust = konversi; bukti sosial wajib"],
    ],
    [6, 44, 50],
  ));
  c.push(h2("10.3 Peta 30 / 60 / 90 Hari"));
  c.push(numbered("ch10-30", [
    "Hari 1\u201330: selesaikan Quick Wins 1\u20135; publikasikan 12 artikel editorial dengan skor SEO 80+; terbitkan 3 halaman CMS inti (Tentang, Kebijakan, FAQ Layanan) dan tautkan di footer.",
    "Hari 31\u201360: Quick Wins 6\u20138; bangun ritme GSC mingguan; uji dua tema non-default sebagai kampanye musiman; mulai A/B meta title di 10 halaman teratas.",
    "Hari 61\u201390: Quick Wins 9\u201310; evaluasi GEO (kutipan di mesin AI); audit CWV; siapkan rilis v2.5.0 sesuai antrean ROADMAP-99 fase berikutnya.",
  ]));
  c.push(body("Terakhir, satu prinsip yang menuntun semua bab di atas: perubahan kecil yang diverifikasi penuh selalu mengalahkan perubahan besar yang belum diuji. Jalankan ritual lint, tsc, smoke, verify, dan verifikasi visual pada setiap langkah \u2014 itulah disiplin yang membuat Arofahajj Universe tumbuh dari 52 ke 53 rilis tanpa pernah memecahkan produksi."));

  return c;
}

module.exports = { chapters2 };
