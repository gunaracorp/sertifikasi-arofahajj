import { db } from "/home/z/my-project/src/lib/db";

const count = await db.lead.count();
const last = await db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 2 });
console.log("JUMLAH LEAD:", count);
for (const l of last) {
  console.log("-", l.name, "|", l.businessType, "|", l.package, "|", l.status, "|", l.createdAt.toISOString());
}
process.exit(0);
