import { accountId } from "@repo/mysql/account/schema";
import { uid } from "@repo/utils/uid";
import { decimal, mysqlEnum, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const transactionsTable = mysqlTable("transactions", {
  id: varchar({ length: 255 }).$default(uid).primaryKey(),
  accountIdFrom: accountId.notNull(),
  accountIdTo: accountId.notNull(),
  amount: decimal({ precision: 18, scale: 2 }),
  currency: mysqlEnum(["usd"]),
  type: mysqlEnum(["transfer", "payment", "withdrawal", "deposit"]),
  status: mysqlEnum(["success", "failed", "pending"]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const transactionId = varchar("transaction_id", { length: 255 });

export const transactionRecordSchema = createSelectSchema(transactionsTable);
export const transactionValuesSchema = createInsertSchema(transactionsTable);
