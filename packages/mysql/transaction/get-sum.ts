import { mysql } from "@repo/mysql";
import { transactionsTable } from "@repo/mysql/schema";
import { and, eq, gt, sql } from "drizzle-orm";

export async function getTransactionsSum() {
  const result = await mysql
    .select({
      total_amount: sql<number>`SUM(${transactionsTable.amount})`,
    })
    .from(transactionsTable)
    .where(and(gt(transactionsTable.createdAt, sql`NOW() - INTERVAL 30 DAY`), eq(transactionsTable.status, "success")));

  return result;
}
