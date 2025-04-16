import { singlestore } from "@repo/singlestore";
import { transactionsTable } from "@repo/singlestore/schema";
import { avg, count, desc, eq, sql } from "drizzle-orm";

export type ListAccountAvgTransactionsAmountParams = {
  limit?: number;
};

export async function listAccountAvgTransactionsAmount(params: ListAccountAvgTransactionsAmountParams) {
  const { limit = 10 } = params;

  const result = await singlestore
    .select({
      accountIdFrom: transactionsTable.accountIdFrom,
      transcationCount: count(),
      avgAmount: avg(transactionsTable.amount),
    })
    .from(transactionsTable)
    .where(eq(transactionsTable.status, "success"))
    .groupBy(transactionsTable.accountIdFrom)
    .orderBy(desc(sql`COUNT(*)`))
    .limit(limit);

  return result;
}
