import { mysql } from "@repo/mysql";
import { transactionsTable, transactionStatusesTable } from "@repo/mysql/schema";
import { subDays } from "date-fns";
import { and, eq, gt, sum } from "drizzle-orm";

export async function getTransactionsSum() {
  const result = await mysql
    .select({ sum: sum(transactionsTable.amount) })
    .from(transactionsTable)
    .innerJoin(transactionStatusesTable, eq(transactionStatusesTable.id, transactionsTable.statusId))
    .where(and(gt(transactionsTable.createdAt, subDays(new Date(), 30)), eq(transactionStatusesTable.name, "success")));

  return +(result.at(0)?.sum ?? 0);
}
