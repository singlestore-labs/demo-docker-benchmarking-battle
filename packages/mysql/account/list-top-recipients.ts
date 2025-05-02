import { mysql } from "@repo/mysql";
import { transactionsTable, transactionStatusesTable, transactionTypesTable } from "@repo/mysql/schema";
import { and, asc, count, desc, eq, sql } from "drizzle-orm";

export async function listTopRecipients() {
  const result = await mysql
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
