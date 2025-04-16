import { mysql } from "@repo/mysql";
import { accountsTable, transactionsTable } from "@repo/mysql/schema";
import type { UserRecord } from "@repo/mysql/user/types";
import { and, desc, eq, getTableColumns, type SQL } from "drizzle-orm";

export type GetUserTransactionsParams = {
  userId?: UserRecord["id"];
  limit?: number;
};

export async function getUserTransactions(params: GetUserTransactionsParams) {
  const { userId, limit = 10 } = params;

  const query = mysql
    .select(getTableColumns(transactionsTable))
    .from(transactionsTable)
    .leftJoin(accountsTable, eq(accountsTable.id, transactionsTable.accountIdFrom))
    .orderBy(desc(transactionsTable.createdAt))
    .limit(limit);

  const whereClauses: SQL[] = [];

  if (userId) {
    whereClauses.push(eq(accountsTable.userId, userId));
  }

  if (whereClauses.length) {
    query.where(and(...whereClauses));
  }

  const result = await query;

  return result;
}
