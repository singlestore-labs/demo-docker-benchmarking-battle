import { postgres } from "@repo/postgres";
import { transactionsTable } from "@repo/postgres/schema";
import { and, count, desc, eq } from "drizzle-orm";

export type ListTopRecipientsParams = {
  limit?: number;
};

export async function listTopRecipients(params: ListTopRecipientsParams) {
  const { limit = 10 } = params;

  const result = await postgres
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
