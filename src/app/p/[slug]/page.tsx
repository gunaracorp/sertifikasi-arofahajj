import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  MessageCircleQuestion,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { BlogSection } from "@/lib/blog-content";
import {
  safeGetPublishedPages,
  safeGetCmsPageBySlug,
  type CmsPageData,
} from "@/lib/cms-pages";
import { ADMIN_COOKIE, verifyToken } from "@/lib/admin-auth";
import { fmtDateID } from "@/lib/format";
import { SITE_URL } from "@/lib/site";

// ============================================================
// AROFAHAJJ UNIVERSE — Studio CMS: /p/[slug] (v2.4.0)
// Halaman mandiri ala WordPress dikelola dari Mission Control →
// Studio Tema & Halaman. Server-rendered: H1 unik, breadcrumb,
// FAQ accordion, CTA, JSON-LD WebPage + BreadcrumbList + FAQPage.
//
// Mode runtime:
//  • Node standalone (Hostinger): dynamicParams=true → halaman
//    BARU yang belum di-build dirender on-demand dari DB (CMS hidup).
//  • Export statis (idwebhost/cPanel): build-static.mjs mem-patch
//    dynamicParams → false sementara; halaman ter-bake saat build.
// ============================================================

export const dynamicParams = true;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  // Halaman CMS terpublikasi ikut di-bake (build statis & standalone).
  const pages = await safeGetPublishedPages();
  // [fix] output:"export" menolak array kosong ("at least one route must be
  // generated") — pada clone baru/database belum memiliki halaman CMS,
  // kembalikan placeholder yang di-render notFound() (404) agar pipeline
  // build statis (build-static.mjs) tetap hijau tanpa halaman CMS apa pun.
  if (pages.length === 0) return [{ slug: "_cms-empty" }];
  return pages.map((p) => ({ slug: p.slug }));
}

async function resolvePage(
  slug: string,
  allowDraft: boolean
): Promise<{ page: CmsPageData; isDraft: boolean } | null> {
  const cms = await safeGetCmsPageBySlug(slug);
  if (cms && (cms.status === "PUBLISHED" || allowDraft)) {
    return { page: cms, isDraft: cms.status !== "PUBLISHED" };
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  // Static export: tanpa cookies() (request dinamis dilarang saat prerender)
  const authed = process.env.BUILD_STATIC === "1"
    ? false
    : verifyToken((await cookies()).get(ADMIN_COOKIE)?.value);
  const found = await resolvePage(slug, authed);
  if (!found) return {};

  const page = found.page;
  const metaTitle = page.metaTitle || page.title;
  const metaDescription = page.metaDescription;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: page.keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
    alternates: { canonical: `/p/${page.slug}` },
    robots: page.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `/p/${page.slug}`,
      type: "article",
      siteName: "Arofahajj Universe",
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
    },
  };
}

export default async function CmsPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const authed = process.env.BUILD_STATIC === "1"
    ? false
    : verifyToken((await cookies()).get(ADMIN_COOKIE)?.value);
  const found = await resolvePage(slug, authed);
  if (!found) notFound();

  const page = found.page;
  const firstParagraph =
    page.sections.find((s) => s.paragraphs.length > 0)?.paragraphs[0] ??
    page.metaDescription ??
    page.title;
  const keywords = page.keywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  // ---------- JSON-LD: WebPage + BreadcrumbList (+ FAQPage) ----------
  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.metaTitle || page.title,
      description: page.metaDescription || firstParagraph,
      url: `${SITE_URL}/p/${page.slug}`,
      inLanguage: "id-ID",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      datePublished: page.publishedAt,
      dateModified: page.updatedAt,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Beranda",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: page.title,
          item: `${SITE_URL}/p/${page.slug}`,
        },
      ],
    },
  ];
  if (page.faq.length > 0) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section className="hero-gradient border-b">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:py-20">
          {found.isDraft && (
            <div className="mb-4 rounded-lg border border-dashed border-amber-500/60 bg-amber-500/10 px-4 py-2 text-sm text-amber-700 dark:text-amber-400">
              Mode pratinjau draf — hanya terlihat oleh admin. Terbitkan dari
              Mission Control → Studio Tema &amp; Halaman.
            </div>
          )}
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-foreground">Beranda</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-foreground">{page.title}</li>
            </ol>
          </nav>
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            {page.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" aria-hidden="true" />
              Terbit {fmtDateID(page.publishedAt.slice(0, 10))}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden="true" />
              Diperbarui {fmtDateID(page.updatedAt.slice(0, 10))}
            </span>
            <Badge variant="secondary" className="gap-1">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Resmi · Arofahajj Universe
            </Badge>
          </div>
          {page.metaDescription && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {page.metaDescription}
            </p>
          )}
        </div>
      </section>

      {/* KONTEN SECTIONS */}
      <div className="mx-auto max-w-4xl px-4 py-12">
        {keywords.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {keywords.map((k) => (
              <Badge key={k} variant="outline">{k}</Badge>
            ))}
          </div>
        )}

        <article className="space-y-10">
          {page.sections.map((section: BlogSection, idx: number) => (
            <section key={idx} aria-labelledby={`sec-${idx}`}>
              <h2
                id={`sec-${idx}`}
                className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4">
                {section.paragraphs.map((p: string, pi: number) => (
                  <p key={pi} className="leading-relaxed text-foreground/90">
                    {p}
                  </p>
                ))}
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {section.bullets.map((b: string, bi: number) => (
                      <li key={bi} className="flex items-start gap-2.5">
                        <CheckCircle2
                          className="mt-0.5 size-5 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                        <span className="leading-relaxed text-foreground/90">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}

          {page.sections.length === 0 && (
            <p className="text-muted-foreground">
              Konten halaman ini belum diisi. Susun bagian dari Mission Control →
              Studio Tema &amp; Halaman.
            </p>
          )}
        </article>

        {/* FAQ */}
        {page.faq.length > 0 && (
          <section aria-labelledby="faq-title" className="mt-14">
            <h2
              id="faq-title"
              className="flex items-center gap-2 font-display text-2xl font-semibold tracking-tight"
            >
              <MessageCircleQuestion className="size-6 text-primary" aria-hidden="true" />
              Pertanyaan Umum
            </h2>
            <Accordion type="single" collapsible className="mt-5">
              {page.faq.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {f.question}
                  </AccordionTrigger>
                  <AccordionContent className="leading-relaxed text-foreground/90">
                    {f.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {/* CTA */}
        <section className="mt-14 rounded-2xl border bg-card p-6 sm:p-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                <Sparkles className="size-5 text-gold" aria-hidden="true" />
                {page.cta?.text || "Konsultasi Sekarang"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Gratis 15 menit bersama konsultan senior — tanpa komitmen.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href={page.cta?.anchor || "/#konsultasi"}>
                  {page.cta?.text || "Konsultasi Sekarang"}
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/katalog">Lihat Katalog</Link>
              </Button>
            </div>
          </div>
        </section>

        <div className="mt-10">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Kembali ke Beranda
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
