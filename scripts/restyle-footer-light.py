#!/usr/bin/env python3
"""Konversi footer.tsx gelap → terang ("Zamrud & Emas Terang").
Setiap replacement diverifikasi jumlahnya; fail keras bila meleset."""
import pathlib, sys

F = pathlib.Path("/home/z/my-project/src/components/landing/footer.tsx")
s = F.read_text(encoding="utf-8")

# (old, new, expected_count)
R = [
    # ROOT — kanvas porcelain terang + garis emas pembuka
    ('<footer className="relative mt-auto overflow-hidden bg-[oklch(0.175_0.025_78)] text-emerald-50/90">',
     '<footer className="relative mt-auto overflow-hidden bg-[oklch(0.972_0.014_150)] text-foreground/90">', 1),
    # Atmosfer — orb terang
    ('<div className="orb-drift absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-emerald-600/15 blur-3xl" />',
     '<div className="orb-drift absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-emerald-300/40 blur-3xl" />', 1),
    ('<div className="orb-drift-alt absolute -bottom-40 -right-32 h-[460px] w-[460px] rounded-full bg-amber-400/10 blur-3xl" />',
     '<div className="orb-drift-alt absolute -bottom-40 -right-32 h-[460px] w-[460px] rounded-full bg-amber-300/40 blur-3xl" />', 1),
    # Summit deck — panel putih
    ('<div className="relative overflow-hidden rounded-[1.6rem] bg-[oklch(0.205_0.03_78)]">',
     '<div className="relative overflow-hidden rounded-[1.6rem] bg-white">', 1),
    ('<div className="orb-drift absolute -top-24 -left-16 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />',
     '<div className="orb-drift absolute -top-24 -left-16 h-72 w-72 rounded-full bg-amber-200/60 blur-3xl" />', 1),
    ('<div className="orb-drift-alt absolute -bottom-28 -right-10 h-80 w-80 rounded-full bg-emerald-300/[0.12] blur-3xl" />',
     '<div className="orb-drift-alt absolute -bottom-28 -right-10 h-80 w-80 rounded-full bg-emerald-200/50 blur-3xl" />', 1),
    ('<div className="footer-grid-lines absolute inset-0 opacity-60" />',
     '<div className="footer-grid-lines absolute inset-0 opacity-50" />', 1),
    # Badge rilis + heading deck
    ('className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/[0.07] px-4 py-1.5 transition-colors hover:border-emerald-300/50"',
     'className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 transition-colors hover:border-primary/50"', 1),
    ('<Sparkles className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />',
     '<Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />', 1),
    ('<h2 className="mx-auto mt-5 max-w-3xl text-3xl font-extrabold tracking-tight leading-[1.12] text-white sm:text-4xl lg:text-[2.9rem]">',
     '<h2 className="mx-auto mt-5 max-w-3xl text-3xl font-extrabold tracking-tight leading-[1.12] text-foreground sm:text-4xl lg:text-[2.9rem]">', 1),
    ('<span className="bg-gradient-to-r from-emerald-300 via-amber-400 to-emerald-300 bg-clip-text text-transparent">',
     '<span className="bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-600 bg-clip-text text-transparent">', 1),
    ('<p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-emerald-100/70 sm:text-base">',
     '<p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-foreground/70 sm:text-base">', 1),
    # CTA WA — zamrud pekat
    ('className="animate-pulse-ring inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 py-3 text-sm font-bold text-emerald-950 shadow-[0_8px_24px_-8px_rgba(217,119,6,0.60)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-400 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:animate-none"',
     'className="animate-pulse-ring inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-bold text-primary-foreground shadow-[0_8px_24px_-8px_rgba(11,91,67,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:animate-none"', 1),
    # Cek Izin AI
    ('className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-emerald-100 transition-colors duration-200 hover:border-amber-400/40 hover:bg-white/10 hover:text-white"',
     'className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-white px-7 py-3 text-sm font-semibold text-foreground shadow-sm transition-colors duration-200 hover:border-gold/50 hover:bg-gold/10 hover:text-foreground"', 1),
    ('<Activity className="h-4 w-4 text-amber-400" aria-hidden="true" />',
     '<Activity className="h-4 w-4 text-gold" aria-hidden="true" />', 1),
    ('<ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-emerald-100/65">',
     '<ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-foreground/65">', 1),
    # Command strip
    ('<div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-sm">',
     '<div className="mt-6 rounded-2xl border border-primary/10 bg-white/70 px-5 py-4 shadow-sm">', 1),
    ('className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-emerald-200"',
     'className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-gold"', 1),
    ('className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-emerald-100/75"',
     'className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-white px-3 py-1 text-[11px] text-foreground/75"', 1),
    ('className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-emerald-100/70"',
     'className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-white px-3 py-1 text-[11px] text-foreground/70"', 1),
    # Ticker
    ('className="ticker relative mt-10 overflow-hidden border-y border-white/[0.07] bg-white/[0.02] py-3.5"',
     'className="ticker relative mt-10 overflow-hidden border-y border-primary/10 bg-white/50 py-3.5"', 1),
    ('<span className="px-4 text-sm font-medium tracking-wide text-emerald-100/75">{item}</span>',
     '<span className="px-4 text-sm font-medium tracking-wide text-foreground/75">{item}</span>', 1),
    ('<span aria-hidden="true" className="text-[10px] text-amber-400/80">',
     '<span aria-hidden="true" className="text-[10px] text-gold/80">', 1),
    ('className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[oklch(0.175_0.025_78)] to-transparent"',
     'className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[oklch(0.972_0.014_150)] to-transparent"', 1),
    ('className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[oklch(0.175_0.025_78)] to-transparent"',
     'className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[oklch(0.972_0.014_150)] to-transparent"', 1),
    # Kolom link
    ('{Icon && <Icon className="h-4 w-4 shrink-0 text-amber-400/90" aria-hidden="true" />}',
     '{Icon && <Icon className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />}', 1),
    ('<h3 className="text-xs font-bold uppercase tracking-[0.14em] text-white">{title}</h3>',
     '<h3 className="text-xs font-bold uppercase tracking-[0.14em] text-foreground">{title}</h3>', 1),
    ('className="group inline-block max-w-full text-sm leading-snug text-emerald-100/70 transition-all duration-200 hover:translate-x-0.5 hover:text-emerald-300 motion-reduce:transition-none motion-reduce:hover:translate-x-0"',
     'className="group inline-block max-w-full text-sm leading-snug text-foreground/70 transition-all duration-200 hover:translate-x-0.5 hover:text-primary motion-reduce:transition-none motion-reduce:hover:translate-x-0"', 1),
    # StatChip
    ('<span className="bg-gradient-to-r from-emerald-300 to-emerald-300 bg-clip-text text-sm font-extrabold text-transparent">',
     '<span className="bg-gradient-to-r from-emerald-700 to-emerald-600 bg-clip-text text-sm font-extrabold text-transparent">', 1),
    ('<span className="text-xs text-emerald-100/60">{label}</span>',
     '<span className="text-xs text-foreground/60">{label}</span>', 1),
    # Kolom brand
    ('<img src="/logo-icon-white.png" alt="Logo Arofahajj Universe" className="h-10 w-10" />',
     '<img src="/logo-icon.png" alt="Logo Arofahajj Universe" className="h-10 w-10" />', 1),
    ('<span className="font-bold text-lg text-white">',
     '<span className="font-bold text-lg text-foreground">', 1),
    ('Arofa<span className="text-amber-400">hajj</span>\n                <span className="text-amber-400">.com</span>',
     'Arofa<span className="text-gold">hajj</span>\n                <span className="text-gold">.com</span>', 1),
    ('<p className="mt-4 text-sm leading-relaxed text-emerald-100/70">{t("footerTagline")}</p>',
     '<p className="mt-4 text-sm leading-relaxed text-foreground/70">{t("footerTagline")}</p>', 1),
    ('<div className="mt-5 flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-3">',
     '<div className="mt-5 flex items-center gap-2 rounded-xl bg-white border border-primary/15 px-4 py-3 shadow-sm">', 1),
    ('<ShieldCheck className="h-5 w-5 text-amber-400 shrink-0" />',
     '<ShieldCheck className="h-5 w-5 text-gold shrink-0" />', 1),
    ('<p className="text-xs text-emerald-100/80">{t("footerVerified")}</p>',
     '<p className="text-xs text-foreground/80">{t("footerVerified")}</p>', 1),
    ('<div className="mt-4 [&_[role=combobox]]:border-white/15 [&_[role=combobox]]:bg-white/5 [&_[role=combobox]]:text-emerald-50 [&_[role=combobox]]:hover:bg-white/10 [&_[role=combobox]]:shadow-none">',
     '<div className="mt-4">', 1),
    # Wilayah & kontak headings
    ('<MapPin className="h-4 w-4 shrink-0 text-amber-400/90" aria-hidden="true" />',
     '<MapPin className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />', 1),
    ('<h3 className="text-xs font-bold uppercase tracking-[0.14em] text-white">Wilayah &amp; Kota</h3>',
     '<h3 className="text-xs font-bold uppercase tracking-[0.14em] text-foreground">Wilayah &amp; Kota</h3>', 1),
    ('className="inline-block max-w-full text-sm leading-snug text-emerald-100/70 transition-all duration-200 hover:translate-x-0.5 hover:text-emerald-300 motion-reduce:transition-none motion-reduce:hover:translate-x-0"',
     'className="inline-block max-w-full text-sm leading-snug text-foreground/70 transition-all duration-200 hover:translate-x-0.5 hover:text-primary motion-reduce:transition-none motion-reduce:hover:translate-x-0"', 1),
    ('className="inline-block max-w-full text-sm leading-snug text-emerald-100/50 transition-all duration-200 hover:translate-x-0.5 hover:text-emerald-300 motion-reduce:transition-none motion-reduce:hover:translate-x-0"',
     'className="inline-block max-w-full text-sm leading-snug text-foreground/50 transition-all duration-200 hover:translate-x-0.5 hover:text-primary motion-reduce:transition-none motion-reduce:hover:translate-x-0"', 1),
    ('<PhoneCall className="h-4 w-4 shrink-0 text-amber-400/90" aria-hidden="true" />',
     '<PhoneCall className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />', 1),
    ('<h3 className="text-xs font-bold uppercase tracking-[0.14em] text-white">\n                {t("footerColContact")}\n              </h3>',
     '<h3 className="text-xs font-bold uppercase tracking-[0.14em] text-foreground">\n                {t("footerColContact")}\n              </h3>', 1),
    ('className="flex items-start gap-2.5 text-sm text-emerald-100/70 hover:text-emerald-300 transition-colors"',
     'className="flex items-start gap-2.5 text-sm text-foreground/70 hover:text-primary transition-colors"', 1),
    ('<span className="text-xs text-emerald-200/50">{t("footerHours")}</span>',
     '<span className="text-xs text-foreground/50">{t("footerHours")}</span>', 1),
    ('<li className="flex items-start gap-2.5 text-sm text-emerald-100/70">\n                <Mail className="h-4 w-4 mt-0.5 shrink-0" />',
     '<li className="flex items-start gap-2.5 text-sm text-foreground/70">\n                <Mail className="h-4 w-4 mt-0.5 shrink-0" />', 1),
    ('<li className="flex items-start gap-2.5 text-sm text-emerald-100/70">\n                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />',
     '<li className="flex items-start gap-2.5 text-sm text-foreground/70">\n                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />', 1),
    ('<span className="block text-xs text-emerald-200/50 mt-0.5">{t("footerNote")}</span>',
     '<span className="block text-xs text-foreground/50 mt-0.5">{t("footerNote")}</span>', 1),
    # Trending
    ('<div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5">',
     '<div className="mt-10 rounded-2xl border border-primary/10 bg-white/60 p-5">', 1),
    ('<Flame className="h-4 w-4 text-amber-400" aria-hidden="true" />',
     '<Flame className="h-4 w-4 text-gold" aria-hidden="true" />', 1),
    ('<h3 className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-200/90">',
     '<h3 className="text-xs font-bold uppercase tracking-[0.14em] text-foreground/80">', 1),
    ('className="inline-block rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-emerald-100/75 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-emerald-200 motion-reduce:transition-none motion-reduce:hover:translate-y-0"',
     'className="inline-block rounded-full border border-primary/15 bg-white px-3.5 py-1.5 text-xs text-foreground/75 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/50 hover:bg-gold/10 hover:text-foreground motion-reduce:transition-none motion-reduce:hover:translate-y-0"', 1),
    # Legal
    ('<div className="mt-12 pt-7 border-t border-white/10 space-y-5">',
     '<div className="mt-12 pt-7 border-t border-primary/10 space-y-5">', 1),
    ('<p className="text-xs text-emerald-100/50 text-center lg:text-left">',
     '<p className="text-xs text-foreground/55 text-center lg:text-left">', 1),
    ('className="text-xs text-emerald-100/50 hover:text-emerald-300 transition-colors"',
     'className="text-xs text-foreground/55 hover:text-primary transition-colors"', 5),
    ('className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-400/25 bg-white/[0.05] px-3 py-1 text-[11px] font-semibold tracking-wide text-emerald-200/90 transition-colors hover:border-amber-400/50 hover:bg-white/10 hover:text-white"',
     'className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gold/30 bg-white px-3 py-1 text-[11px] font-semibold tracking-wide text-foreground/80 transition-colors hover:border-gold/60 hover:bg-gold/10 hover:text-foreground"', 1),
    ('<Tag className="h-3 w-3 text-amber-400" aria-hidden="true" />',
     '<Tag className="h-3 w-3 text-gold" aria-hidden="true" />', 1),
    ('className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-emerald-100/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-400/40 hover:text-white motion-reduce:transition-none motion-reduce:hover:translate-y-0"',
     'className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-white text-foreground/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/50 hover:text-foreground motion-reduce:transition-none motion-reduce:hover:translate-y-0"', 1),
    # Support credit
    ('className="inline-flex max-w-full items-center justify-center gap-2.5 rounded-full border border-amber-400/20 bg-white/[0.04] px-5 py-2.5 text-center shadow-[0_0_24px_-8px_rgba(217,119,6,0.30)] transition-colors hover:border-amber-400/50 hover:bg-white/10"',
     'className="inline-flex max-w-full items-center justify-center gap-2.5 rounded-full border border-gold/30 bg-white px-5 py-2.5 text-center shadow-sm transition-colors hover:border-gold/60 hover:bg-gold/5"', 1),
    ('<Globe className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />',
     '<Globe className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />', 1),
    ('<span className="text-xs leading-relaxed tracking-wide text-emerald-100/85">',
     '<span className="text-xs leading-relaxed tracking-wide text-foreground/85">', 1),
    # FOOTER_STYLES — grid lines gelap di atas kanvas terang
    ("""  .footer-grid-lines {
    background-image:
      linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
    background-size: 44px 44px;
  }""",
     """  .footer-grid-lines {
    background-image:
      linear-gradient(rgba(11,91,67,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(11,91,67,0.05) 1px, transparent 1px);
    background-size: 44px 44px;
  }""", 1),
]

errors = []
for old, new, n in R:
    c = s.count(old)
    if c != n:
        errors.append(f"COUNT {c} != {n}: {old[:90]!r}")
        continue
    s = s.replace(old, new)

if errors:
    print("GAGAL:")
    print("\n".join(errors))
    sys.exit(1)

F.write_text(s, encoding="utf-8")
print(f"OK — {len(R)} replacement diterapkan pada footer.tsx")
