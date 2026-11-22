// ============================================================
// content1.js — Bab 1–5 tutorial (teks bahasa Indonesia)
// ============================================================

function chapters1(H) {
  const { h1, h2, h3, body, bodyRuns, codeBlock, dataTable, tableTitle, numbered, bullets, image, imgCaption } = H;
  const c = [];

  // ================= BAB 1 =================
  c.push(h1("1. Ringkasan Eksekutif"));
  c.push(body("Dokumen ini adalah panduan praktis lengkap untuk mengembangkan, mengoperasikan, dan men-deploy Arofahajj Universe versi 2.4.0 dengan nama rilis \u201cStudio CMS\u201d. Ia disusun dari hulu ke hilir: mulai dari arsitektur dan lingkungan pengembangan, penguasaan Studio CMS yang bekerja seperti WordPress, pengembangan tema, playbook full SEO, hingga dua jalur deployment produksi. Setiap bab ditutup dengan perintah konkret yang bisa Anda salin-tempel langsung ke terminal."));
  c.push(body("Rilis v2.4.0 membawa tiga lompatan besar. Pertama, situs kini memiliki CMS ala WordPress bernama Studio CMS: pengelolaan halaman mandiri di URL /p/{slug}, katalog lima tema visual yang mengganti identitas seluruh halaman publik sekali klik, dan ekspor konten JSON untuk cadangan maupun migrasi. Kedua, pipeline hosting statis dihidupkan kembali \u2014 paket arofahajj-static-hosting.tar.gz (268 halaman HTML, 29,29 MB) kini berhasil dibangun dan siap diunggah ke shared hosting tanpa Node.js. Ketiga, tiga bug lama ditutup total: saklar BUILD_STATIC di next.config.ts yang sejak v2.3.0 diabaikan, artefak .next/dev yang mengacaukan type check build statis, dan guard ensure-pg.sh yang keliru mengklasifikasi .env sehingga sandbox tidak pernah pulih otomatis."));
  c.push(body("Semua perubahan telah lulus audit penuh: ESLint bersih, TypeScript 0 error, smoke test database 17/17 model PASS, verifikasi kontrak Prisma hijau, dan pengujian visual end-to-end di browser (halaman CMS, panel admin, tema terang dan gelap). Gunakan dokumen ini sebagai buku pegangan resmi tim \u2014 disarankan dibaca berurutan saat pertama kali, lalu dijadikan referensi cepat melalui Daftar Isi."));

  // ================= BAB 2 =================
  c.push(h1("2. Arsitektur Proyek (Hulu: Anatom Sistem)"));
  c.push(h2("2.1 Tumpuan Teknologi"));
  c.push(body("Arofahajj Universe dibangun sebagai satu codebase Next.js yang melayani situs publik, katalog 1.500 layanan, alat bantu AI, pembayaran, dan panel operasional. Tumpuan teknologinya dapat diringkas sebagai berikut."));
  c.push(tableTitle("Tabel 2.1 \u2014 Tumpuan teknologi dan fungsinya"));
  c.push(dataTable(
    ["Lapisan", "Teknologi", "Peran"],
    [
      ["Framework", "Next.js 16 (App Router) + React 19", "Situs publik, admin, API route"],
      ["Bahasa", "TypeScript 5.9 (ketat)", "Kualitas kode \u2014 dilarang any baru di jalur kritis"],
      ["Styling", "Tailwind CSS 4 + shadcn/ui", "Token warna oklch, tema lewat CSS variable"],
      ["Database", "PostgreSQL via Prisma ORM 8 (contract-first)", "17 model: lead, order, post, cmsPage, siteSetting, dll."],
      ["Runtime", "Bun 1.3+ / Node 22.18+", "Dev, build, standalone"],
      ["AI", "z-ai-web-dev-sdk (backend saja)", "RIZKI 24/7, cek dokumen, roadmap"],
    ],
    [18, 40, 42],
  ));
  c.push(h2("2.2 Struktur Folder yang Wajib Dipahami"));
  c.push(tableTitle("Tabel 2.2 \u2014 Struktur folder kunci"));
  c.push(dataTable(
    ["Folder / Berkas", "Isi"],
    [
      ["src/app", "App Router: semua halaman publik, /admin, /p/[slug] (halaman CMS), /api"],
      ["src/components", "landing/, admin/ (dashboard + tab), ui/ (shadcn), theme-bridge.tsx"],
      ["src/lib", "Logika inti: version.ts, db.ts, blog-cms.ts, cms-pages.ts, themes.ts, site-settings.ts, seo.ts"],
      ["src/prisma", "contract.prisma \u2014 sumber kebenaran skema + db.ts runtime ORM 8"],
      ["generated/prisma8", "Kontrak terkompilasi (artifact, tidak di-commit)"],
      ["scripts", "ensure-pg.sh, build-static.mjs, deploy-pack.mjs, ver.json, bump-v240.py"],
      [".zscripts", "dev.sh, build.sh, start.sh \u2014 bootstrap khas sandbox platform"],
      ["out/", "Hasil static export (dibuat saat build:static)"],
    ],
    [30, 70],
  ));
  c.push(h2("2.3 Alur Data CMS \u2014 dari Admin sampai Pengunjung"));
  c.push(body("Memahami alur ini adalah kunci menguasai platform. Konten yang Anda tulis di panel admin hidup di database PostgreSQL (model Post untuk artikel blog, CmsPage untuk halaman mandiri, SiteSetting untuk tema aktif dan pengaturan situs). Saat pengunjung membuka halaman, server membaca database dan merender HTML. Pada mode hosting Node standalone (Hostinger), pembacaan ini terjadi setiap request sehingga perubahan langsung tampil. Pada mode hosting statis (idwebhost/cPanel), konten database dibekukan menjadi HTML saat proses build \u2014 berarti setiap selesai mengedit konten, Anda menjalankan ulang build:static dan mengunggah paket baru."));
  c.push(body("Alur kontrak database juga unik dan wajib dipatuhi: skema tidak pernah diubah lewat migrasi biasa, melainkan melalui siklus contract-first \u2014 edit src/prisma/contract.prisma, lalu jalankan prisma contract emit, prisma db init, prisma db sign, dan prisma db verify. Marker tanda tangan menjamin database selalu identik dengan kontrak, dan bun run db:verify adalah cara cepat memastikan semuanya hijau."));

  // ================= BAB 3 =================
  c.push(h1("3. Menyiapkan Lingkungan Pengembangan"));
  c.push(h2("3.1 Prasyarat"));
  c.push(tableTitle("Tabel 3.1 \u2014 Perangkat lunak wajib"));
  c.push(dataTable(
    ["Perangkat", "Versi Minimum", "Cara Cek", "Catatan"],
    [
      ["Bun", "1.3", "bun --version", "Runtime utama + package manager"],
      ["Node.js", "22.18", "node --version", "Dibutuhkan build Next.js & standalone"],
      ["Git", "2.x", "git --version", "Clone & versioning"],
      ["PostgreSQL", "otomatis", "\u2014", "Sandbox pakai embedded PG; produksi pakai Prisma Postgres cloud"],
    ],
    [22, 20, 26, 32],
  ));
  c.push(h2("3.2 Clone dan Install"));
  c.push(body("Unduh repositori dan pasang dependensi. Postinstall otomatis menjalankan prisma contract emit \u2014 karena itu .env harus sudah berisi DATABASE_URL sebelum perintah install pertama dijalankan."));
  c.push(codeBlock([
    "git clone https://github.com/gunaracorp/sertifikasi-arofahajj.git arofahajj",
    "cd arofahajj",
    "cp .env.example .env   # bila tersedia, atau buat .env manual (lihat 3.3)",
    "bun install",
  ]));
  c.push(h2("3.3 Berkas .env \u2014 Kunci Pertama"));
  c.push(body("Semua rahasia hidup di .env di root proyek dan tidak pernah di-commit. Berikut variabel yang wajib dan opsional beserta contoh nilainya untuk mode sandbox lokal."));
  c.push(tableTitle("Tabel 3.2 \u2014 Variabel environment"));
  c.push(dataTable(
    ["Variabel", "Wajib", "Contoh nilai sandbox", "Fungsi"],
    [
      ["DATABASE_URL", "Ya", "postgresql://postgres@127.0.0.1:5432/arofahajj", "Koneksi PostgreSQL"],
      ["ADMIN_PASSWORD", "Ya", "admin-sandbox-2026", "Login panel /admin"],
      ["ADMIN_SECRET", "Ya", "hex acak 48 karakter", "Penandatangan sesi admin (HMAC)"],
      ["CRON_SECRET", "Tidak", "hex acak 48 karakter", "Auth job terjadwal"],
      ["PAYMENT_DEMO_MODE", "Tidak", "true", "Checkout escrow simulasi"],
      ["FOLLOWUP_SWEEP_MINUTES", "Tidak", "0", "Interval sweep follow-up"],
      ["NEXT_PUBLIC_GA_ID", "Tidak", "G-XXXXXXXXXX", "Google Analytics 4"],
    ],
    [26, 10, 34, 30],
  ));
  c.push(body("Tips penting: jika .env hilang atau tercemar templat SQLite (DATABASE_URL=file:...), jangan panik \u2014 jalankan bash scripts/ensure-pg.sh. Guard v2.4.0 kini mampu memulihkan .env sandbox secara idempoten, memulai cluster PostgreSQL embedded (.pgdata), membuat database arofahajj, dan menginisialisasi skema lengkap dengan marker .schema-ready yang membuatnya aman dijalankan berkali-kali."));
  c.push(h2("3.4 Dua Mode Database"));
  c.push(body("Guard predev memilih mode secara otomatis. Mode remote: bila .env menunjuk database cloud (mis. pooled.db.prisma.io), guard melewatkan cluster lokal dan tidak pernah menimpa .env Anda. Mode sandbox: bila .env lokal/hilang, guard menyiapkan embedded PostgreSQL di .pgdata dan menginisialisasi skema otomatis. Untuk kerja harian di laptop, mode sandbox adalah pilihan paling sederhana \u2014 tidak perlu instalasi PostgreSQL terpisah."));

  // ================= BAB 4 =================
  c.push(h1("4. Menjalankan dan Debugging Harian"));
  c.push(h2("4.1 Perintah Sehari-hari"));
  c.push(tableTitle("Tabel 4.1 \u2014 Perintah wajib hafal"));
  c.push(dataTable(
    ["Perintah", "Fungsi"],
    [
      ["bun run dev", "Dev server :3000 \u2014 predev guard menyiapkan DB otomatis"],
      ["bun run lint", "ESLint seluruh proyek \u2014 wajib bersih sebelum commit"],
      ["bunx tsc --noEmit", "Type check penuh \u2014 wajib 0 error"],
      ["bun run db:smoke", "Uji create/read 17 model end-to-end"],
      ["bun run db:verify", "Verifikasi kontrak vs database (marker + skema)"],
      ["bun run build", "Build produksi standalone (Hostinger)"],
      ["bun run build:static", "Static export ke out/ (idwebhost/cPanel)"],
      ["bun run pack:static", "Paket tar.gz siap unggah dari out/"],
    ],
    [30, 70],
  ));
  c.push(h2("4.2 Disiplin Debugging"));
  c.push(body("Ketiga lapisan pemeriksaan berikut adalah standar minimum sebelum perubahan dinyatakan selesai. Pertama, lint dan type check \u2014 keduanya harus nol temuan. Kedua, smoke database setiap kali skema atau logika data disentuh. Ketiga, verifikasi visual di browser: buka halaman yang diubah, periksa tampilan desktop dan ponsel, serta pantau log dev (dev.log di root proyek) untuk error runtime, kegagalan fetch API, atau hydration mismatch."));
  c.push(codeBlock([
    "# Ritual sebelum commit:",
    "bun run lint          # harus kosong",
    "bunx tsc --noEmit     # harus: TSC EXIT 0",
    "bun run db:smoke      # semua model PASS",
    "bun run db:verify     # match contract",
  ]));
  c.push(body("Jika dev server mati mendadak (mis. setelah restart mesin), pola pemulihan yang benar adalah: jalankan bash scripts/ensure-pg.sh untuk memulihkan database, lalu nyalakan dev server kembali. Di lingkungan sandbox platform, gunakan nohup bash .zscripts/dev.sh yang akan melakukan bun install, db:push (no-op), dev server, health check, dan mini-services secara berurutan."));

  // ================= BAB 5 =================
  c.push(h1("5. Studio CMS \u2014 Konten ala WordPress"));
  c.push(h2("5.1 Masuk ke Mission Control"));
  c.push(numbered("ch5-admin", [
    "Buka https://domainanda/admin (di sandbox: /admin).",
    "Masukkan ADMIN_PASSWORD dari .env, lalu klik \u201cMasuk Mission Control\u201d.",
    "Sesi admin bertahan 12 jam melalui cookie aman (HMAC ADMIN_SECRET); keluar melalui tombol logout.",
  ]));
  c.push(body("Mission Control adalah dashboard satu halaman bertab. Untuk konten, dua tab terpenting adalah Konten & SEO (artikel blog dan kalender editorial) dan Studio Tema (tema situs + halaman mandiri)."));
  c.push(h2("5.2 Mengelola Artikel Blog (Tab Konten & SEO)"));
  c.push(body("Artikel blog tersimpan di tabel Post. Editor menyediakan struktur bagian (heading + paragraf + bullet), FAQ, CTA, dan bidang SEO lengkap: metaTitle, metaDescription, focusKeyword, keywords, serta saklar noindex. Skor SEO live menghitung panjang meta, keberadaan kata kunci fokus di meta, dan panjang konten \u2014 kejar skor di atas 80 sebelum menerbitkan. Kalender editorial (Editorial Board) otomatis mengusulkan topik tiga kali seminggu (Senin Panduan, Rabu Regulasi, Jumat Tips Pajak) dan bisa langsung dijadikan draf."));
  c.push(h2("5.3 Mengelola Halaman Mandiri (Tab Studio Tema)"));
  c.push(body("Halaman mandiri adalah fitur ala WordPress Pages: konten tetap seperti Tentang Kami, Kebijakan Refund, atau landing khusus kampanye, yang tampil di URL /p/{slug}. Berikut alur lengkap membuatnya."));
  c.push(numbered("ch5-page", [
    "Masuk ke tab Studio Tema, gulir ke kartu Halaman CMS (/p/...), klik Halaman Baru.",
    "Isi Judul dan Slug \u2014 biarkan slug kosong untuk di-generate otomatis dari judul.",
    "Lengkapi Meta Title (ideal 30\u201360 karakter) dan Meta Description (ideal 110\u2013160 karakter).",
    "Isi Kata Kunci Fokus dan kata kunci tambahan \u2014 fokus harus muncul di meta title dan description.",
    "Susun Bagian Konten: satu bagian = satu H2; paragraf dipisahkan baris kosong; bullet satu per baris.",
    "Tambahkan FAQ bila relevan \u2014 FAQ halaman otomatis menjadi FAQPage JSON-LD (berpeluang rich result Google).",
    "Pilih Status: Draf untuk pratinjau admin, Terbitkan untuk memublikasikan.",
    "Centang Tampil di footer dan atur Urutan bila halaman harus tersambung dari footer seluruh situs.",
    "Klik Simpan \u2014 skor SEO tampil langsung; buka /p/{slug} untuk melihat hasilnya.",
  ]));
  c.push(...image("/home/z/my-project/.zscripts/verify-cms-page.png", 560));
  c.push(imgCaption("Gambar 5.1 \u2014 Halaman /p/tentang-kami hasil Studio CMS dengan tema Tirta Zamrud"));
  c.push(body("Halaman yang sudah terbit otomatis: masuk ke sitemap seksi halaman.xml, ikut dalam generateStaticParams blog saat build, dan muncul di footer bila dicentang. Draf hanya terlihat oleh admin yang sedang login (mode pratinjau), sehingga aman untuk review internal."));
  c.push(h2("5.4 Mengganti Tema Situs"));
  c.push(body("Bagian atas tab Studio Tema menampilkan lima kartu tema dengan swatch warna. Klik Terapkan pada tema pilihan \u2014 tema aktif tersimpan di tabel SiteSetting dan langsung berlaku pada semua halaman publik. Tombol Pratinjau situs membuka beranda dengan parameter ?theme= untuk melihat hasil sebelum final. Tema gelap (Kiswah Malam) otomatis mengaktifkan token mode gelap."));
  c.push(tableTitle("Tabel 5.1 \u2014 Katalog tema bawaan v2.4.0"));
  c.push(dataTable(
    ["Tema", "Suasana", "Mode", "Cocok untuk"],
    [
      ["Zamrud & Emas (Default)", "Kertas porselen, zamrud pekat, emas logo", "Terang", "Identitas brand resmi"],
      ["Kiswah Malam", "Kain kiswah hijau-hitam, mint & emas terang", "Gelap", "Kenyamanan baca malam"],
      ["Emas Nusantara", "Gading hangat, perunggu premium", "Terang", "Katalog & brosur digital"],
      ["Tirta Zamrud", "Putih kabut, teal segar", "Terang", "Audiens muda"],
      ["Terra Tasik", "Pasir hangat, terakota", "Terang", "Sentuhan UMKM lokal"],
    ],
    [26, 34, 12, 28],
  ));
  c.push(...image("/home/z/my-project/.zscripts/verify-studio2.png", 560));
  c.push(imgCaption("Gambar 5.2 \u2014 Studio Tema di Mission Control: katalog tema dan status tema aktif"));
  c.push(h2("5.5 Ekspor dan Cadangan Konten"));
  c.push(body("Tombol Ekspor JSON mengunduh seluruh konten CMS \u2014 posts, pages, dan tema aktif \u2014 dalam satu berkas arofahajj-cms-export-YYYY-MM-DD.json (ala fitur Export WordPress). Biasakan mengunduh cadangan ini setiap selesai sesi editing besar; berkas tersebut juga dapat menjadi sumber data bagi skrip migrasi atau restore di kemudian hari."));
  c.push(h2("5.6 Bagaimana Konten CMS Sampai ke Hosting Statis"));
  c.push(body("Pada build statis, generateStaticParams blog dan halaman CMS membaca database saat build berjalan \u2014 sehingga semua post dan halaman berstatus PUBLISHED dibekukan menjadi berkas HTML. Artinya workflow hosting statis adalah: edit konten di admin (server dev atau Node produksi) \u2192 jalankan bun run build:static \u2192 bun run pack:static \u2192 unggah paket baru. Pada hosting Node standalone, tidak perlu rebuild: halaman baru dirender on-demand dari database."));

  return c;
}

module.exports = { chapters1 };
