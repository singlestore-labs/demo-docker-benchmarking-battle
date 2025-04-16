import { postgres } from "@repo/postgres";
import { transactionsTable } from "@repo/postgres/schema";
import { and, eq, gt, sql } from "drizzle-orm";

export async function getTransactionsSum() {
  const result = await postgres
    .select({
      total_amount: sql<number>`SUM(${transactionsTable.amount})`,
    })
    .from(transactionsTable)
    .where(and(gt(transactionsTable.createdAt, sql`NOW() - INTERVAL '30 days'`), eq(transactionsTable.status, "success")));

  return result;
}
