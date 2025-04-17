import { mysql } from "@repo/mysql";
import { transactionsTable } from "@repo/mysql/schema";
import { and, count, desc, eq } from "drizzle-orm";

export type ListTopRecipientsParams = {
  limit?: number;
};

export async function listTopRecipients(params: ListTopRecipientsParams) {
  const { limit = 10 } = params;

  const result = await mysql
    .select({
      accountIdTo: transactionsTable.accountIdTo,
      transferCount: count(),
    })
    .from(transactionsTable)
    .where(and(eq(transactionsTable.type, "transfer"), eq(transactionsTable.status, "success")))
    .groupBy(transactionsTable.accountIdTo)
    .orderBy(desc(count()))
    .limit(limit);

  return result;
}
