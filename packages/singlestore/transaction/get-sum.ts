import { singlestore } from "@repo/singlestore";
import { transactionsTable } from "@repo/singlestore/schema";
import { subDays } from "date-fns";
import { and, eq, gt, sum } from "drizzle-orm";

export async function getTransactionsSum() {
  const cutoffDate = subDays(new Date(), 30);

  const result = await singlestore
    .select({ sum: sum(transactionsTable.amount) })
    .from(transactionsTable)
    .where(and(gt(transactionsTable.createdAt, cutoffDate), eq(transactionsTable.status, "success")));

  return result;
}
