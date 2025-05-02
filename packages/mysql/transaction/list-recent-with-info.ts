import { mysql } from "@repo/mysql";
import { accountsTable, transactionsTable, transactionTypesTable, usersTable } from "@repo/mysql/schema";
import { subDays } from "date-fns";
import { desc, eq, gte } from "drizzle-orm";

export async function listRecentTransactionsWithInfo() {
  const cutoffDate = subDays(new Date(), 7);

  const result = await mysql
    .select({
      userId: usersTable.id,
      name: usersTable.name,
      accountId: accountsTable.id,
      amount: transactionsTable.amount,
      type: transactionTypesTable.name,
      createdAt: transactionsTable.createdAt,
    })
    .from(usersTable)
    .innerJoin(accountsTable, eq(accountsTable.userId, usersTable.id))
    .innerJoin(transactionsTable, eq(transactionsTable.accountIdFrom, accountsTable.id))
    .innerJoin(transactionTypesTable, eq(transactionTypesTable.id, transactionsTable.typeId))
    .where(gte(transactionsTable.createdAt, cutoffDate))
    .orderBy(desc(transactionsTable.createdAt), desc(transactionsTable.id))
    .limit(100);

  return result;
}
