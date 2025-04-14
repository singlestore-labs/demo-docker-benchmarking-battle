import { accountId } from "@repo/singlestore/account/schema";
import { uid } from "@repo/utils/uid";
import { decimal, singlestoreEnum, singlestoreTable, timestamp, varchar } from "drizzle-orm/singlestore-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const transactionsTable = singlestoreTable("transactions", {
  id: varchar({ length: 255 }).$default(uid).primaryKey(),
  accountIdFrom: accountId.notNull(),
  accountIdTo: accountId.notNull(),
  amount: decimal({ precision: 18, scale: 2 }),
  currency: singlestoreEnum(["usd"]),
  type: singlestoreEnum(["transfer", "payment", "withdrawal", "deposit"]),
  status: singlestoreEnum(["success", "failed", "pending"]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const transactionId = varchar("transaction_id", { length: 255 });

export const transactionRecordSchema = createSelectSchema(transactionsTable);
export const transactionValuesSchema = createInsertSchema(transactionsTable);
