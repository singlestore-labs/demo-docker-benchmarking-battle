import { postgres } from "@repo/postgres";
import { accountsTable, transactionsTable, usersTable } from "@repo/postgres/schema";
import { subDays } from "date-fns";
import { desc, eq, gte } from "drizzle-orm";

export async function listRecentTransactionsWithInfo() {
  // Calculate the cutoff date: 7 days before now
  const cutoffDate = subDays(new Date(), 7);

  // Fetch the most recent 100 transactions from the last week,
  // joining users → accounts → transactions
  const result = await postgres
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
