"use client";

/**
 * AROFAHAJJ UNIVERSE — APP SHELL
 * Navbar glass futuristik + property switcher + view router SPA.
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUniverse, type ViewId } from "./store";
import { AuroraBackground, LiveDot, cn } from "./fx";
import { HomeView } from "./home-view";
import { UmrahView } from "./umrah-view";
import { CertificationView } from "./certification-view";
import { MuhdinView } from "./muhdin-view";
import { MarketView } from "./market-view";
import { GrandView } from "./grand-view";
import { AdminView } from "./admin-view";
import { Button } from "@/components/ui/button";
import { Menu, X, Rocket, ChevronDown } from "lucide-react";

const NAV: { id: ViewId; label: string; icon: string }[] = [
  { id: "home", label: "Universe", icon: "🪐" },
  { id: "umrah", label: "Umrah & Haji", icon: "🕋" },
  { id: "sertifikasi", label: "Sertifikasi", icon: "🏆" },
  { id: "muhdin", label: "MEHUDIN.ID", icon: "🤝" },
  { id: "market", label: "Marketplace", icon: "🛍️" },
  { id: "grand", label: "Grand Design", icon: "🧭" },
];

export function UniverseApp() {
  const { view, setView, content, refreshContent } = useUniverse();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    // deep-link via hash (juga saat hash berubah tanpa reload)
    const applyHash = () => {
      const hash = window.location.hash.replace("#", "") as ViewId;
      if (hash && [...NAV.map((n) => n.id), "admin"].includes(hash)) {
        useUniverse.getState().setView(hash);
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    refreshContent();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", applyHash);
    };
  }, [refreshContent]);

  return (
    <div className="relative min-h-screen flex flex-col">
      <AuroraBackground />

      {/* ===== NAVBAR ===== */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "py-2" : "py-4"
        )}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div
            className={cn(
              "aro-glass flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500",
              scrolled && "shadow-2xl shadow-emerald-950/40"
            )}
          >
            {/* Logo */}
            <button
              onClick={() => setView("home")}
              className="group flex items-center gap-2.5"
              aria-label="Arofahajj Universe — beranda"
            >
              <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-lg shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                🕌
              </span>
              <span className="text-left">
                <span className="block text-sm font-bold leading-tight tracking-wide">
                  AROFAHAJJ <span className="aro-gradient-text">UNIVERSE</span>
                </span>
                <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-300/70">
                  {content.site.version}
                </span>
              </span>
            </button>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
              {NAV.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={cn(
                    "relative rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                    view === item.id ? "text-emerald-200" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {view === item.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-emerald-400/15 ring-1 ring-emerald-400/30"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative flex items-center gap-1.5">
                    <span className="text-xs">{item.icon}</span>
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {/* Property switcher */}
              <div className="relative hidden md:block">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSwitcherOpen((o) => !o)}
                  className="gap-1.5 border-emerald-400/30 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20"
                >
                  <LiveDot />
                  Domain <ChevronDown className="h-3.5 w-3.5" />
                </Button>
                <AnimatePresence>
                  {switcherOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      className="aro-glass absolute right-0 mt-2 w-64 rounded-2xl p-2 shadow-2xl"
                    >
                      {content.properties.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setSwitcherOpen(false);
                            setView(p.id === "arofahajj" ? "umrah" : (p.id as ViewId));
                          }}
                          className="flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-white/5"
                        >
                          <span className="mt-0.5 text-lg">
                            {p.icon === "plane" ? "✈️" : p.icon === "award" ? "🏆" : p.icon === "users" ? "🤝" : "🛍️"}
                          </span>
                          <span>
                            <span className="block text-xs font-semibold">{p.domain}</span>
                            <span className="block text-[11px] text-muted-foreground">{p.status}</span>
                          </span>
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setSwitcherOpen(false);
                          setView("admin");
                        }}
                        className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-white/5"
                      >
                        <span className="mt-0.5 text-lg">⚙️</span>
                        <span>
                          <span className="block text-xs font-semibold">Admin CMS</span>
                          <span className="block text-[11px] text-muted-foreground">Kontrol seluruh konten</span>
                        </span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button
                size="sm"
                onClick={() => setView("sertifikasi")}
                className="hidden gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-600/30 transition-transform hover:scale-105 sm:flex"
              >
                <Rocket className="h-4 w-4" /> Mulai Sekarang
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile nav */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.nav
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="aro-glass mt-2 grid gap-1 rounded-2xl p-3 shadow-2xl lg:hidden"
                aria-label="Navigasi mobile"
              >
                {NAV.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setView(item.id);
                      setMobileOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      view === item.id
                        ? "bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-400/30"
                        : "text-muted-foreground hover:bg-white/5"
                    )}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setView("admin");
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-white/5"
                >
                  <span>⚙️</span> Admin CMS
                </button>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ===== VIEWS ===== */}
      <main className="relative z-10 flex-1 pt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {view === "home" && <HomeView />}
            {view === "umrah" && <UmrahView />}
            {view === "sertifikasi" && <CertificationView />}
            {view === "muhdin" && <MuhdinView />}
            {view === "market" && <MarketView />}
            {view === "grand" && <GrandView />}
            {view === "admin" && <AdminView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ===== FOOTER (sticky bottom) ===== */}
      <footer className="relative z-10 mt-auto">
        <div className="aro-glass mt-16 border-t border-emerald-400/10">
          <div className="mx-auto max-w-7xl px-4 py-10">
            <div className="grid gap-8 md:grid-cols-4">
              <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-bold">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600">🕌</span>
                  AROFAHAJJ UNIVERSE
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{content.site.tagline}</p>
                <p className="mt-3 text-[11px] text-muted-foreground/70">
                  © {new Date().getFullYear()} PT Arofah Global Sistem. Amanah adalah misi kami.
                </p>
              </div>
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-300">Ekosistem</h4>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {content.properties.map((p) => (
                    <li key={p.id}>
                      <button className="transition-colors hover:text-emerald-300" onClick={() => setView(p.id === "arofahajj" ? "umrah" : (p.id as ViewId))}>
                        {p.domain}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button className="transition-colors hover:text-emerald-300" onClick={() => setView("grand")}>
                      Grand Design & Roadmap
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-300">Layanan</h4>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li><button className="hover:text-emerald-300" onClick={() => setView("sertifikasi")}>PPIU / PIHK</button></li>
                  <li><button className="hover:text-emerald-300" onClick={() => setView("sertifikasi")}>ISO & Sertifikasi Mutu</button></li>
                  <li><button className="hover:text-emerald-300" onClick={() => setView("sertifikasi")}>Halal & BPOM</button></li>
                  <li><button className="hover:text-emerald-300" onClick={() => setView("umrah")}>Paket Umrah & Haji</button></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-300">Kontak</h4>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li>📧 {content.contact.email}</li>
                  <li>📱 {content.contact.phone}</li>
                  <li>📍 {content.contact.address}</li>
                  <li>🕒 {content.contact.hours}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
