import { singlestore } from "@repo/singlestore";
import { transactionsTable, transactionStatusesTable, transactionTypesTable } from "@repo/singlestore/schema";
import { and, asc, count, desc, eq, sql } from "drizzle-orm";

export async function listTopRecipients() {
  const result = await singlestore
    .select({
      accountId: transactionsTable.accountIdTo,
      count: count(transactionsTable.id).as("count"),
    })
    .from(transactionsTable)
    .innerJoin(transactionTypesTable, eq(transactionTypesTable.id, transactionsTable.typeId))
    .innerJoin(transactionStatusesTable, eq(transactionStatusesTable.id, transactionsTable.statusId))
    .where(and(eq(transactionTypesTable.name, "transfer"), eq(transactionStatusesTable.name, "success")))
    .groupBy(transactionsTable.accountIdTo)
    .orderBy(desc(sql`count`), asc(transactionsTable.accountIdTo))
    .limit(10);

  return result.at(0);
}
