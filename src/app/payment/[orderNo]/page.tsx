import type { Metadata } from "next";
import { StatusClient } from "@/components/payment/status-client";

// ============================================================
// AROFAHAJJ UNIVERSE — STATUS PESANAN
// /payment/INV-20261011-XXXXXX — noindex (data pribadi).
// ============================================================

export const metadata: Metadata = {
  title: "Status Pesanan | Arofahajj Universe",
  robots: { index: false, follow: false },
};

export default async function PaymentStatusPage({
  params,
}: {
  params: Promise<{ orderNo: string }>;
}) {
  const { orderNo } = await params;
  return <StatusClient orderNo={orderNo} />;
}
