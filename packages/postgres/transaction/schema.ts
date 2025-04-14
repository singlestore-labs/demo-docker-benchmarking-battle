import { accountId } from "@repo/postgres/account/schema";
import { currencyEnum, transactionStatusEnum, transactionTypeEnum } from "@repo/postgres/lib/enum";
import { uid } from "@repo/utils/uid";
import { decimal, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const transactionsTable = pgTable("transactions", {
  id: varchar({ length: 255 }).$default(uid).primaryKey(),
  accountIdFrom: accountId.notNull(),
  accountIdTo: accountId.notNull(),
  amount: decimal({ precision: 18, scale: 2 }),
  currency: currencyEnum(),
  type: transactionTypeEnum(),
  status: transactionStatusEnum(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const transactionId = varchar("transaction_id", { length: 255 });

export const transactionRecordSchema = createSelectSchema(transactionsTable);
export const transactionValuesSchema = createInsertSchema(transactionsTable);
