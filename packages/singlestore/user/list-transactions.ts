import { singlestore } from "@repo/singlestore";
import { accountsTable, transactionsTable } from "@repo/singlestore/schema";
import type { UserRecord } from "@repo/singlestore/user/types";
import { and, desc, eq, getTableColumns, type SQL } from "drizzle-orm";

export type ListUserTransactionsParams = {
  userId?: UserRecord["id"];
  limit?: number;
};

export async function listUserTransactions(params: ListUserTransactionsParams) {
  const { userId, limit = 10 } = params;

  const query = singlestore
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
