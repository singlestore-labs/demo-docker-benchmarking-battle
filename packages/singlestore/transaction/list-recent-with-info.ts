import { singlestore } from "@repo/singlestore";
import { accountsTable, transactionsTable, usersTable } from "@repo/singlestore/schema";
import { subDays } from "date-fns";
import { desc, eq, gte } from "drizzle-orm";

export async function listRecentTransactionsWithInfo() {
  const cutoffDate = subDays(new Date(), 7);

  const result = await singlestore
    .select({
      userId: usersTable.id,
      name: usersTable.name,
      accountId: accountsTable.id,
      amount: transactionsTable.amount,
      type: transactionsTable.type,
      createdAt: transactionsTable.createdAt,
    })
    .from(usersTable)
    .innerJoin(accountsTable, eq(accountsTable.userId, usersTable.id))
    .innerJoin(transactionsTable, eq(transactionsTable.accountIdFrom, accountsTable.id))
    .where(gte(transactionsTable.createdAt, cutoffDate))
    .orderBy(desc(transactionsTable.createdAt))
    .limit(100);

  return result;
}
