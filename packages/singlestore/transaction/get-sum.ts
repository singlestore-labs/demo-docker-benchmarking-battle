import { singlestore } from "@repo/singlestore";
import { transactionsTable, transactionStatusesTable } from "@repo/singlestore/schema";
import { subDays } from "date-fns";
import { and, eq, gt, sum } from "drizzle-orm";

export async function getTransactionsSum() {
  const cutoffDate = subDays(new Date(), 30);

  const result = await singlestore
    .select({ sum: sum(transactionsTable.amount) })
    .from(transactionsTable)
    .innerJoin(transactionStatusesTable, eq(transactionStatusesTable.id, transactionsTable.statusId))
    .where(and(gt(transactionsTable.createdAt, cutoffDate), eq(transactionStatusesTable.name, "success")));

  return result;
}
