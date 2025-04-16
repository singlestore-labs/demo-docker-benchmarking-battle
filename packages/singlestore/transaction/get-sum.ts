import { singlestore } from "@repo/singlestore";
import { transactionsTable } from "@repo/singlestore/schema";
import { and, eq, gt, sql, sum } from "drizzle-orm";

export async function getTransactionsSum() {
  const result = await singlestore
    .select({
      sum: sum(transactionsTable.amount),
    })
    .from(transactionsTable)
    .where(and(gt(transactionsTable.createdAt, sql`NOW() - INTERVAL 30 DAY`), eq(transactionsTable.status, "success")));

  return result;
}
