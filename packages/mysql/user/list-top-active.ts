import { mysql } from "@repo/mysql";
import { accountsTable, transactionsTable, usersTable } from "@repo/mysql/schema";
import { subDays } from "date-fns";
import { and, count, countDistinct, desc, eq, gte, sum } from "drizzle-orm";

export async function listTopActiveUsers() {
  // Calculate the cutoff date: 90 days ago
  const cutoffDate = subDays(new Date(), 90);

  // Single aggregated query:
  // - Join transactions → accounts → users
  // - Filter for successful transfers in the last 90 days
  // - Group by userId and name
  // - Compute totalTransfers, uniqueRecipients, totalAmount
  // - Only include users with at least 5 distinct recipients
  // - Order by totalTransfers descending and limit to top 10
  const result = await mysql
    .select({
      userId: accountsTable.userId,
      name: usersTable.name,
      totalTransfers: count(),
      totalAmount: sum(transactionsTable.amount),
      uniqueRecipients: countDistinct(transactionsTable.accountIdTo),
    })
    .from(transactionsTable)
    .innerJoin(accountsTable, eq(transactionsTable.accountIdFrom, accountsTable.id))
    .innerJoin(usersTable, eq(accountsTable.userId, usersTable.id))
    .where(
      and(
        eq(transactionsTable.status, "success"),
        eq(transactionsTable.type, "transfer"),
        gte(transactionsTable.createdAt, cutoffDate),
      ),
    )
    .groupBy(accountsTable.userId, usersTable.name)
    .having(gte(countDistinct(transactionsTable.accountIdTo), 5))
    .orderBy(desc(count()))
    .limit(10);

  return result;
}
