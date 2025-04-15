import { bigint, decimal, mysqlEnum, mysqlTable, timestamp } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const transactionsTable = mysqlTable("transactions", {
  id: bigint({ mode: "number" }).autoincrement().primaryKey(),
  accountIdFrom: bigint("account_id_from", { mode: "number" }),
  accountIdTo: bigint("account_id_to", { mode: "number" }),
  amount: decimal({ precision: 18, scale: 2 }),
  currency: mysqlEnum(["USD"]),
  type: mysqlEnum(["transfer", "payment", "withdrawal", "deposit"]),
  status: mysqlEnum(["success", "failed", "pending"]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const transactionId = bigint("transcation_id", { mode: "number" });

export const transactionRecordSchema = createSelectSchema(transactionsTable);
export const transactionValuesSchema = createInsertSchema(transactionsTable);
