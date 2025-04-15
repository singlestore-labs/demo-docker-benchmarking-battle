import { currencyEnum, transactionStatusEnum, transactionTypeEnum } from "@repo/postgres/lib/enum";
import { bigint, decimal, pgTable, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const transactionsTable = pgTable("transactions", {
  id: bigint({ mode: "number" }).primaryKey(),
  accountIdFrom: bigint("account_id_from", { mode: "number" }),
  accountIdTo: bigint("account_id_to", { mode: "number" }),
  amount: decimal({ precision: 18, scale: 2 }),
  currency: currencyEnum(),
  type: transactionTypeEnum(),
  status: transactionStatusEnum(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const transactionId = bigint("transcation_id", { mode: "number" });

export const transactionRecordSchema = createSelectSchema(transactionsTable);
export const transactionValuesSchema = createInsertSchema(transactionsTable);
