import { singlestore } from "@repo/singlestore/index";
import { accountsTable, transactionsTable, usersTable } from "@repo/singlestore/schema";
import { count } from "drizzle-orm";

export async function getDbInfo() {
  const [users, accounts, transactions] = (await Promise.all(
    [usersTable, accountsTable, transactionsTable].map(async (table) => {
      const result = await singlestore.select({ count: count(table.id) }).from(table);
      return result[0]?.count || 0;
    }),
  )) as [number, number, number];

  return { users, accounts, transactions };
}
