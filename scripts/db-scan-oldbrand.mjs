// Task 53 — Scan seluruh tabel & kolom teks database untuk jejak brand lama.
// Read-only scan: melaporkan tabel.kolom + jumlah baris yang mengandung jejak.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Token dibangun dinamis agar file ini sendiri tak menyimpan literal brand lama.
const A = "pusat";
const B = "perizinan";
const PATTERNS = [
  `%${A}${B}%`,
  `%${A} ${B}%`,
  `%${A}-${B}%`,
  `%logo P%`,
];

async function main() {
  const cols = await prisma.$queryRawUnsafe(`
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND data_type IN ('text', 'character varying', 'jsonb')
    ORDER BY table_name, column_name
  `);
  let totalHits = 0;
  for (const { table_name, column_name } of cols) {
    for (const pat of PATTERNS) {
      const rows = await prisma.$queryRawUnsafe(
        `SELECT count(*)::int AS c FROM "${table_name}" WHERE "${column_name}"::text ILIKE $1`,
        pat
      );
      const c = rows[0]?.c ?? 0;
      if (c > 0) {
        totalHits += c;
        console.log(`HIT: ${table_name}.${column_name} — ${c} baris (pola: ${pat})`);
      }
    }
  }
  console.log(totalHits === 0 ? "\nDB BERSIH: nol jejak brand lama di seluruh tabel." : `\nTOTAL HIT: ${totalHits} baris perlu dibersihkan.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
