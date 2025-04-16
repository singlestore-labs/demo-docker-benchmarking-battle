import { singlestore } from "@repo/singlestore";
import { transactionsTable } from "@repo/singlestore/schema";
import { and, count, desc, eq, sql } from "drizzle-orm";

export type ListTopRecipientsParams = {
  limit?: number;
};

export async function listTopRecipients(params: ListTopRecipientsParams) {
  const { limit = 10 } = params;

  const result = await singlestore
    .select({
      accountIdTo: transactionsTable.accountIdTo,
      transferCount: count(),
    })
    .from(transactionsTable)
    .where(and(eq(transactionsTable.type, "transfer"), eq(transactionsTable.status, "success")))
    .groupBy(transactionsTable.accountIdTo)
    .orderBy(desc(sql`COUNT(*)`))
    .limit(limit);

  return result;
}
