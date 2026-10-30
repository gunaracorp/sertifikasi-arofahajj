"use client";

/**
 * MARKET VIEW — arofahajj.id marketplace halal
 * Katalog produk pascapulang dengan SLA badge + keranjang sederhana.
 */

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUniverse } from "./store";
import { Reveal, SectionHeading, SpotlightCard, GradientText, rupiah } from "./fx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Star, ShoppingCart, Truck, Plus, Minus, X, Zap } from "lucide-react";

export function MarketView() {
  const { content } = useUniverse();
  const { toast } = useToast();
  const [cat, setCat] = useState("ALL");
  const [q, setQ] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);

  const categories = useMemo(() => ["ALL", ...Array.from(new Set(content.products.map((p) => p.category)))], [content.products]);

  const filtered = content.products.filter(
    (p) => (cat === "ALL" || p.category === cat) && (q === "" || p.name.toLowerCase().includes(q.toLowerCase()))
  );

  const cartItems = content.products
    .filter((p) => cart[p.id])
    .map((p) => ({ ...p, qty: cart[p.id] }));
  const cartTotal = cartItems.reduce((a, p) => a + p.price * p.qty, 0);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  function addToCart(id: string) {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
    const p = content.products.find((x) => x.id === id);
    toast({ title: "🛍️ Masuk keranjang", description: p?.name });
  }

  function setQty(id: string, qty: number) {
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <SectionHeading
        kicker="🛍️ arofahajj.id — Marketplace Halal"
        title={<>Lanjutan Perjalanan Ibadah, <GradientText>Barokah Pascapulang</GradientText></>}
        sub="Kurban, asuransi, lounge bandara, souvenir — semua dengan SLA fulfillment jelas & opsi pickup bandara."
      />

      {/* Filter */}
      <Reveal className="mb-8">
        <div className="aro-glass flex flex-col gap-3 rounded-2xl p-4 md:flex-row md:items-center md:justify-between">
          <div className="aro-scroll flex gap-2 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${cat === c ? "bg-lime-500/20 text-lime-200 ring-1 ring-lime-400/40" : "bg-white/5 text-muted-foreground hover:bg-white/10"}`}
              >
                {c === "ALL" ? "✨ Semua" : c}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari produk..." className="w-44 border-white/10 bg-black/25" aria-label="Cari produk" />
            <Button variant="outline" onClick={() => setCartOpen(true)} className="relative gap-2 border-lime-400/30 bg-lime-400/10 text-lime-200 hover:bg-lime-400/20">
              <ShoppingCart className="h-4 w-4" /> Keranjang
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-lime-400 text-[10px] font-bold text-black"
                >
                  {cartCount}
                </motion.span>
              )}
            </Button>
          </div>
        </div>
      </Reveal>

      {/* Products */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
            >
              <SpotlightCard glow="var(--aro-lime)" className="group flex h-full flex-col p-5">
                <div className="mb-4 flex items-start justify-between">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-400/20 to-emerald-500/10 text-4xl transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-6">
                    {p.emoji}
                  </span>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-1 border-white/15 text-[9px]">{p.category}</Badge>
                    <p className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
                      <Star className="h-3 w-3 fill-amber-300 text-amber-300" /> {p.rating} · {p.sold.toLocaleString("id-ID")} terjual
                    </p>
                  </div>
                </div>
                <h3 className="mb-1.5 text-sm font-bold leading-snug">{p.name}</h3>
                <p className="mb-3 flex-1 text-[11px] leading-relaxed text-muted-foreground">{p.desc}</p>
                <div className="mb-3 flex items-center gap-1.5 text-[10px] font-medium text-lime-300">
                  <Zap className="h-3 w-3" /> SLA: {p.sla}
                </div>
                <div className="mb-4 flex items-baseline gap-2">
                  <span className="text-lg font-extrabold text-lime-300">{rupiah(p.price)}</span>
                  {p.oldPrice > p.price && <span className="text-[11px] text-muted-foreground line-through">{rupiah(p.oldPrice)}</span>}
                </div>
                <Button onClick={() => addToCart(p.id)} className="w-full gap-2 bg-gradient-to-r from-lime-500 to-emerald-500 text-black transition-transform hover:scale-[1.02]">
                  <Plus className="h-4 w-4" /> Tambah ke Keranjang
                </Button>
              </SpotlightCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Info band */}
      <Reveal className="mt-12">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: "🚚", title: "SLA Fulfillment Jelas", desc: "Setiap produk punya SLA layanan terukur — dari instan digital hingga pickup bandara same-day." },
            { icon: "🕌", title: "100% Halal Terverifikasi", desc: "Produk F&B wajib bersertifikat halal BPJPH sebelum listing di marketplace." },
            { icon: "🤝", title: "Slot untuk Anggota MEHUDIN", desc: "Travel anggota bisa jual ancillary & souvenir dengan bagi hasil transparan via escrow split." },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <SpotlightCard className="h-full p-6 text-center">
                <div className="mb-2 text-3xl">{f.icon}</div>
                <h3 className="mb-1.5 text-sm font-bold">{f.title}</h3>
                <p className="text-[11px] leading-relaxed text-muted-foreground">{f.desc}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* CART DRAWER */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="aro-glass fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-white/10"
              role="dialog" aria-label="Keranjang belanja"
            >
              <div className="flex items-center justify-between border-b border-white/10 p-5">
                <h3 className="text-lg font-bold">🛍️ Keranjang ({cartCount})</h3>
                <Button variant="ghost" size="icon" onClick={() => setCartOpen(false)} aria-label="Tutup keranjang"><X className="h-5 w-5" /></Button>
              </div>
              <div className="aro-scroll flex-1 overflow-y-auto p-5">
                {cartItems.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                    <span className="text-5xl">🧺</span>
                    <p className="text-sm">Keranjang masih kosong</p>
                    <Button size="sm" variant="outline" onClick={() => setCartOpen(false)}>Jelajahi Produk</Button>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {cartItems.map((p) => (
                      <div key={p.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-3">
                        <span className="text-3xl">{p.emoji}</span>
                        <div className="flex-1">
                          <p className="text-xs font-semibold leading-snug">{p.name}</p>
                          <p className="text-[11px] text-lime-300">{rupiah(p.price)}</p>
                          <p className="flex items-center gap-1 text-[9px] text-muted-foreground"><Truck className="h-2.5 w-2.5" /> {p.sla}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setQty(p.id, p.qty - 1)} aria-label="Kurangi"><Minus className="h-3 w-3" /></Button>
                          <span className="w-6 text-center text-xs font-bold">{p.qty}</span>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setQty(p.id, p.qty + 1)} aria-label="Tambah"><Plus className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {cartItems.length > 0 && (
                <div className="border-t border-white/10 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold">Total</span>
                    <span className="text-lg font-extrabold text-lime-300">{rupiah(cartTotal)}</span>
                  </div>
                  <Button
                    className="w-full gap-2 bg-gradient-to-r from-lime-500 to-emerald-500 text-black"
                    onClick={() => {
                      toast({ title: "🎉 Checkout (demo MVP)", description: "Produksi: terhubung Midtrans/Xendit + SLA engine fulfillment." });
                    }}
                  >
                    Checkout Sekarang →
                  </Button>
                  <p className="mt-2 text-center text-[10px] text-muted-foreground">Escrow split otomatis ke vendor setelah milestone terpenuhi</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
