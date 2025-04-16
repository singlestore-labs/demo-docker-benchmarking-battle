import { postgres } from "@repo/postgres";
import { accountsTable, transactionsTable } from "@repo/postgres/schema";
import type { UserRecord } from "@repo/postgres/user/types";
import { and, desc, eq, getTableColumns, type SQL } from "drizzle-orm";

export type ListUserTransactionsParams = {
  userId?: UserRecord["id"];
  limit?: number;
};

export async function listUserTransactions(params: ListUserTransactionsParams) {
  const { userId, limit = 10 } = params;

  const query = postgres
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
