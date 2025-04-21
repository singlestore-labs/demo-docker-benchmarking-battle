import { singlestore } from "@repo/singlestore";
import { transactionsTable, transactionStatusesTable, transactionTypesTable } from "@repo/singlestore/schema";
import { and, count, desc, eq, sql } from "drizzle-orm";

export type ListTopRecipientsParams = {
  limit?: number;
};

export async function listTopRecipients(params: ListTopRecipientsParams) {
  const { limit = 10 } = params;

  const result = await singlestore
    .select({
      accountIdTo: transactionsTable.accountIdTo,
      transferCount: count(transactionsTable.id).as("transferCount"),
    })
    .from(transactionsTable)
    .innerJoin(transactionTypesTable, eq(transactionTypesTable.id, transactionsTable.typeId))
    .innerJoin(transactionStatusesTable, eq(transactionStatusesTable.id, transactionsTable.statusId))
    .where(and(eq(transactionTypesTable.name, "transfer"), eq(transactionStatusesTable.name, "success")))
    .groupBy(transactionsTable.accountIdTo)
    .orderBy(desc(sql`transferCount`))
    .limit(limit);

  return result;
}
