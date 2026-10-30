"use client";

/**
 * ADMIN VIEW — JSON-CMS Control Center
 * Edit konten seluruh situs via form/JSON tanpa menyentuh kode.
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUniverse } from "./store";
import { Reveal, SectionHeading, SpotlightCard, GradientText, LiveDot } from "./fx";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2, Save, RotateCcw, CheckCircle2, XCircle, Download, Upload,
  Inbox, BookOpen, ScrollText, KeyRound, Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionMeta { key: string; label: string; desc: string; updatedAt: string | null }
interface LeadRow { id: string; name: string; email: string; phone: string; business: string | null; interest: string; message: string; status: string; createdAt: string }
interface BookingRow { id: string; code: string; packageTitle: string; travelName: string; fullName: string; paxCount: number; totalPrice: number; status: string; createdAt: string }
interface CertRow { code: string; holder: string; service: string; status: string; dataHash: string; createdAt: string }

const ADMIN_TOKEN = "arofahajj-mvp-admin"; // MVP demo — produksi: NextAuth + role ADMIN

export function AdminView() {
  const { refreshContent } = useUniverse();
  const { toast } = useToast();
  const [sections, setSections] = useState<SectionMeta[]>([]);
  const [activeKey, setActiveKey] = useState<string>("hero");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [certs, setCerts] = useState<CertRow[]>([]);

  const authHeaders = { "x-admin-token": ADMIN_TOKEN, "Content-Type": "application/json" };

  async function loadAll() {
    setLoading(true);
    try {
      const [cmsRes, leadsRes, certRes] = await Promise.all([
        fetch("/api/admin/cms", { headers: authHeaders, cache: "no-store" }),
        fetch("/api/leads", { headers: authHeaders, cache: "no-store" }),
        fetch("/api/certificates", { cache: "no-store" }),
      ]);
      const cms = (await cmsRes.json()) as { ok: boolean; sections?: SectionMeta[]; content?: Record<string, unknown> };
      if (cms.ok && cms.sections && cms.content) {
        setSections(cms.sections);
        setDraft(JSON.stringify(cms.content[activeKey] ?? {}, null, 2));
      }
      const ld = (await leadsRes.json()) as { ok: boolean; leads?: LeadRow[] };
      if (ld.ok) setLeads(ld.leads ?? []);
      const ct = (await certRes.json()) as { ok: boolean; certificates?: CertRow[] };
      if (ct.ok) setCerts(ct.certificates ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAll();
  }, []);

  useEffect(() => {
    // update draft saat pindah section
    fetch("/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((j: { ok: boolean; content?: Record<string, unknown> }) => {
        if (j.ok && j.content) setDraft(JSON.stringify(j.content[activeKey] ?? {}, null, 2));
      })
      .catch(() => {});
  }, [activeKey]);

  async function saveSection() {
    setSaving(true);
    try {
      const data = JSON.parse(draft); // validasi JSON
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ key: activeKey, data }),
      });
      const j = (await res.json()) as { ok: boolean; error?: string };
      if (j.ok) {
        toast({ title: "✅ Section tersimpan", description: `Konten "${activeKey}" sudah live di seluruh situs.` });
        await refreshContent();
        await loadAll();
      } else toast({ title: "Gagal menyimpan", description: j.error, variant: "destructive" });
    } catch (e) {
      toast({ title: "JSON tidak valid", description: (e as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function resetSection(key: string) {
    const res = await fetch(`/api/admin/cms?key=${key}`, { method: "DELETE", headers: authHeaders });
    const j = (await res.json()) as { ok: boolean; error?: string };
    if (j.ok) {
      toast({ title: "↺ Section direset ke default" });
      await refreshContent();
      await loadAll();
    } else toast({ title: "Gagal reset", description: j.error, variant: "destructive" });
  }

  function exportContent() {
    fetch("/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((j: { ok: boolean; content?: unknown }) => {
        if (j.ok) {
          const blob = new Blob([JSON.stringify(j.content, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "arofahajj-universe-content.json";
          a.click();
          URL.revokeObjectURL(url);
          toast({ title: "📤 Konten diekspor", description: "arofahajj-universe-content.json" });
        }
      });
  }

  function importContent(file: File) {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as Record<string, unknown>;
        const keys = Object.keys(parsed);
        let okCount = 0;
        for (const k of keys) {
          const res = await fetch("/api/admin/cms", {
            method: "PUT",
            headers: authHeaders,
            body: JSON.stringify({ key: k, data: parsed[k] }),
          });
          const j = (await res.json()) as { ok: boolean };
          if (j.ok) okCount++;
        }
        toast({ title: `📥 Import selesai (${okCount}/${keys.length} section)` });
        await refreshContent();
      } catch (e) {
        toast({ title: "File tidak valid", description: (e as Error).message, variant: "destructive" });
      }
    };
    reader.readAsText(file);
  }

  const statusBadge = (s: string) =>
    s === "VALID" || s === "CONFIRMED" || s === "NEW" ? (
      <Badge className="bg-emerald-500/20 text-[10px] text-emerald-300"><CheckCircle2 className="mr-1 h-3 w-3" />{s}</Badge>
    ) : s === "PENDING_PAYMENT" || s === "ESCROW_HELD" ? (
      <Badge className="bg-amber-500/20 text-[10px] text-amber-300">{s}</Badge>
    ) : (
      <Badge className="bg-red-500/20 text-[10px] text-red-300"><XCircle className="mr-1 h-3 w-3" />{s}</Badge>
    );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <SectionHeading
        kicker="⚙️ Admin Control Center"
        title={<>JSON-CMS — <GradientText>Kendali Penuh Tanpa Kode</GradientText></>}
        sub="Edit hero, statistik, katalog layanan, paket, produk, tier MEHUDIN — semua live seketika. Tambahkan konten baru cukup lewat JSON."
      />

      {loading ? (
        <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-400" /></div>
      ) : (
        <Tabs defaultValue="cms" className="w-full">
          <TabsList className="aro-glass mb-6 flex h-auto flex-wrap gap-1 rounded-2xl p-2">
            <TabsTrigger value="cms" className="rounded-xl data-[state=active]:bg-emerald-500/20">📝 CMS Konten</TabsTrigger>
            <TabsTrigger value="leads" className="rounded-xl data-[state=active]:bg-emerald-500/20">📥 Leads ({leads.length})</TabsTrigger>
            <TabsTrigger value="certs" className="rounded-xl data-[state=active]:bg-emerald-500/20">📜 Sertifikat ({certs.length})</TabsTrigger>
            <TabsTrigger value="backup" className="rounded-xl data-[state=active]:bg-emerald-500/20">💾 Backup</TabsTrigger>
          </TabsList>

          {/* ===== CMS EDITOR ===== */}
          <TabsContent value="cms">
            <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
              <Reveal>
                <SpotlightCard className="p-4">
                  <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300"><ScrollText className="h-4 w-4" /> Section ({sections.length})</p>
                  <div className="aro-scroll max-h-[480px] space-y-1.5 overflow-y-auto pr-1">
                    {sections.map((s) => (
                      <button
                        key={s.key}
                        onClick={() => setActiveKey(s.key)}
                        className={cn(
                          "w-full rounded-xl border p-3 text-left transition-all",
                          activeKey === s.key ? "border-emerald-400/40 bg-emerald-500/10" : "border-white/10 bg-black/20 hover:bg-white/5"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">{s.label}</span>
                          <span className="font-mono text-[9px] text-muted-foreground">{s.key}</span>
                        </div>
                        <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">{s.desc}</p>
                        {s.updatedAt && (
                          <p className="mt-1 flex items-center gap-1 text-[9px] text-amber-300"><Eye className="h-2.5 w-2.5" /> di-edit {new Date(s.updatedAt).toLocaleString("id-ID")}</p>
                        )}
                      </button>
                    ))}
                  </div>
                </SpotlightCard>
              </Reveal>
              <Reveal delay={0.08}>
                <SpotlightCard className="flex flex-col p-5">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold">{sections.find((s) => s.key === activeKey)?.label ?? activeKey}</h3>
                      <p className="font-mono text-[10px] text-muted-foreground">key: {activeKey}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => resetSection(activeKey)} className="gap-1 border-white/20 text-xs">
                        <RotateCcw className="h-3.5 w-3.5" /> Reset default
                      </Button>
                      <Button size="sm" onClick={saveSection} disabled={saving} className="gap-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs">
                        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Simpan & Publish
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className="aro-scroll min-h-[440px] flex-1 resize-none border-white/10 bg-black/40 font-mono text-[11px] leading-relaxed"
                    spellCheck={false}
                    aria-label={`Editor JSON untuk section ${activeKey}`}
                  />
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    💡 Edit bebas: tambah layanan baru ke <b>services.items</b>, ubah harga, ganti headline — klik Simpan & halaman langsung berubah.
                  </p>
                </SpotlightCard>
              </Reveal>
            </div>
          </TabsContent>

          {/* ===== LEADS ===== */}
          <TabsContent value="leads">
            <Reveal>
              <SpotlightCard className="p-5">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold"><Inbox className="h-4 w-4 text-emerald-400" /> Leads Konsultasi Masuk</h3>
                {leads.length === 0 ? (
                  <p className="py-8 text-center text-xs text-muted-foreground">Belum ada lead. Form kontak & pendaftaran MEHUDIN akan mengisi tabel ini otomatis.</p>
                ) : (
                  <ScrollArea className="max-h-[480px]">
                    <div className="grid gap-2 pr-3">
                      {leads.map((l) => (
                        <div key={l.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="text-xs font-bold">{l.name} {l.business && <span className="font-normal text-muted-foreground">· {l.business}</span>}</p>
                              <p className="text-[10px] text-muted-foreground">{l.email} · {l.phone} · minat: {l.interest}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {statusBadge(l.status)}
                              <span className="text-[9px] text-muted-foreground">{new Date(l.createdAt).toLocaleString("id-ID")}</span>
                            </div>
                          </div>
                          {l.message && <p className="mt-2 rounded-lg bg-black/30 p-2 text-[11px] text-foreground/80">&ldquo;{l.message}&rdquo;</p>}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </SpotlightCard>
            </Reveal>
          </TabsContent>

          {/* ===== CERTS ===== */}
          <TabsContent value="certs">
            <Reveal>
              <SpotlightCard className="p-5">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold"><BookOpen className="h-4 w-4 text-emerald-400" /> Registry Sertifikat Terbit</h3>
                {certs.length === 0 ? (
                  <p className="py-8 text-center text-xs text-muted-foreground">Belum ada sertifikat. Terbitkan demo dari portal Sertifikasi → Public Trust Layer.</p>
                ) : (
                  <ScrollArea className="max-h-[480px]">
                    <div className="grid gap-2 pr-3">
                      {certs.map((c) => (
                        <div key={c.code} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/20 p-4">
                          <div>
                            <p className="font-mono text-xs font-bold text-emerald-300">{c.code}</p>
                            <p className="text-[11px]">{c.holder} — {c.service}</p>
                            <p className="break-all font-mono text-[9px] text-muted-foreground">hash: {c.dataHash.slice(0, 40)}…</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {statusBadge(c.status)}
                            <span className="text-[9px] text-muted-foreground">{new Date(c.createdAt).toLocaleDateString("id-ID")}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </SpotlightCard>
            </Reveal>
          </TabsContent>

          {/* ===== BACKUP ===== */}
          <TabsContent value="backup">
            <Reveal>
              <SpotlightCard className="p-6">
                <h3 className="mb-4 text-sm font-bold">💾 Backup & Restore Konten</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <p className="mb-1 text-xs font-bold">Export seluruh konten</p>
                    <p className="mb-3 text-[11px] text-muted-foreground">Unduh snapshot JSON semua section — cocok untuk versioning di Git atau staging.</p>
                    <Button onClick={exportContent} className="gap-2 bg-emerald-500/90 text-white"><Download className="h-4 w-4" /> Unduh JSON</Button>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <p className="mb-1 text-xs font-bold">Import konten</p>
                    <p className="mb-3 text-[11px] text-muted-foreground">Unggah file JSON hasil export. Section yang cocok akan dioverwrite.</p>
                    <Label htmlFor="import-file" className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90">
                      <Upload className="h-4 w-4" /> Pilih File JSON
                    </Label>
                    <Input id="import-file" type="file" accept=".json" className="hidden" onChange={(e) => e.target.files?.[0] && importContent(e.target.files[0])} />
                  </div>
                </div>
                <div className="mt-5 rounded-xl border border-amber-400/25 bg-amber-400/5 p-4 text-[11px] leading-relaxed text-muted-foreground">
                  <p className="mb-1 flex items-center gap-1.5 font-bold text-amber-300"><KeyRound className="h-3.5 w-3.5" /> Catatan keamanan MVP</p>
                  Token admin demo (<code className="rounded bg-black/40 px-1 font-mono">{ADMIN_TOKEN}</code>) dikirim via header <code className="rounded bg-black/40 px-1 font-mono">x-admin-token</code>. Roadmap langkah #5 (SSO NextAuth) & #76 (SOC/DLP) akan menggantinya dengan RBAC penuh + MFA.
                </div>
              </SpotlightCard>
            </Reveal>
          </TabsContent>
        </Tabs>
      )}

      {/* Realtime hint */}
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 flex items-center justify-center gap-2 text-center text-[11px] text-muted-foreground">
        <LiveDot /> Semua perubahan CMS langsung tampil di sisi pengunjung tanpa deploy ulang.
      </motion.p>
    </div>
  );
}
