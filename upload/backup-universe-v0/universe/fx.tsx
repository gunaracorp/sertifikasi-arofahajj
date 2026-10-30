"use client";

/**
 * AROFAHAJJ UNIVERSE — FX PRIMITIVES
 * Kumpulan komponen animasi futuristik yang dipakai di semua portal.
 */

import { motion, useInView, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

export { cn };

/* ============ Aurora Background ============ */
export function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <div className="aro-grid-bg absolute inset-0" />
      <div
        className="aro-aurora h-[480px] w-[480px] bg-emerald-500/25"
        style={{ top: "-140px", left: "-120px" }}
      />
      <div
        className="aro-aurora h-[420px] w-[420px] bg-amber-400/15"
        style={{ top: "10%", right: "-140px", animationDelay: "-4s" }}
      />
      <div
        className="aro-aurora h-[520px] w-[520px] bg-teal-400/15"
        style={{ bottom: "-180px", left: "25%", animationDelay: "-8s" }}
      />
      <div
        className="aro-aurora h-[300px] w-[300px] bg-lime-300/10"
        style={{ top: "45%", left: "-80px", animationDelay: "-2s" }}
      />
      {/* starfield */}
      {Array.from({ length: 26 }).map((_, i) => (
        <span
          key={i}
          className="aro-star absolute h-1 w-1 rounded-full bg-emerald-200"
          style={
            {
              top: `${(i * 37) % 100}%`,
              left: `${(i * 53) % 100}%`,
              animationDelay: `${(i % 7) * 0.5}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/* ============ Scroll Reveal ============ */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ============ Animated Counter ============ */
export function Counter({
  value,
  suffix = "",
  duration = 1.8,
  className,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {display.toLocaleString("id-ID")}
      {suffix}
    </span>
  );
}

/* ============ Spotlight Card (mouse glow) ============ */
export function SpotlightCard({
  children,
  className,
  glow = "var(--aro-emerald)",
}: {
  children: ReactNode;
  className?: string;
  glow?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
        el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
      }}
      className={cn("aro-spotlight aro-glass rounded-2xl", className)}
      style={{ ["--spot-color" as string]: glow } as CSSProperties}
    >
      {children}
    </div>
  );
}

/* ============ 3D Tilt Card ============ */
export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 18 });
  const sry = useSpring(ry, { stiffness: 220, damping: 18 });
  return (
    <motion.div
      ref={ref}
      style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d", perspective: 800 }}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        ry.set(px * 12);
        rx.set(-py * 12);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}

/* ============ Gradient Title ============ */
export function GradientText({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("aro-gradient-text", className)}>{children}</span>;
}

/* ============ Marquee ============ */
export function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-3" aria-hidden="true">
      <div className="aro-marquee-track gap-10">
        {doubled.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-3 whitespace-nowrap text-sm text-emerald-200/70"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300/80" />
            {t}
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--background)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--background)] to-transparent" />
    </div>
  );
}

/* ============ Live Dot ============ */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex h-2.5 w-2.5", className)}>
      <span className="aro-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
    </span>
  );
}

/* ============ Progress with shimmer ============ */
export function ShimmerProgress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("relative h-2 overflow-hidden rounded-full bg-white/10", className)}>
      <div
        className="aro-progress-shimmer relative h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300 transition-all duration-1000"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

/* ============ Section heading ============ */
export function SectionHeading({
  kicker,
  title,
  sub,
  align = "center",
}: {
  kicker: string;
  title: ReactNode;
  sub?: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal className={cn("mb-10", align === "center" ? "text-center" : "text-left")}>
      <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-300">
        {kicker}
      </span>
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      {sub && <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">{sub}</p>}
    </Reveal>
  );
}

/* ============ Orbiting badge (untuk hero) ============ */
export function OrbitBadge({ icon, label, delay = 0 }: { icon: string; label: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 15 }}
      className="aro-float flex items-center gap-2 rounded-full border border-emerald-400/25 bg-black/40 px-3 py-1.5 text-xs font-medium text-emerald-100 shadow-lg shadow-emerald-900/30 backdrop-blur-md"
    >
      <span>{icon}</span>
      {label}
    </motion.div>
  );
}

/* ============ Formatting helper ============ */
export function rupiah(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}
