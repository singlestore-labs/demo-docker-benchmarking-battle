import { bigint, decimal, index, singlestoreEnum, singlestoreTable, timestamp } from "drizzle-orm/singlestore-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const transactionsTable = singlestoreTable(
  "transactions",
  {
    id: bigint({ mode: "number" }).autoincrement().primaryKey(),
    accountIdFrom: bigint("account_id_from", { mode: "number" }),
    accountIdTo: bigint("account_id_to", { mode: "number" }),
    amount: decimal({ precision: 18, scale: 2 }),
    currency: singlestoreEnum(["USD"]),
    type: singlestoreEnum(["transfer", "payment", "withdrawal", "deposit"]),
    status: singlestoreEnum(["success", "failed", "pending"]),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    fromIdx: index("account_id_from_idx").on(table.accountIdFrom),
    toIdx: index("account_id_to_idx").on(table.accountIdTo),
  }),
);

export const transactionId = bigint("transaction_id", { mode: "number" });

export const transactionRecordSchema = createSelectSchema(transactionsTable);
export const transactionValuesSchema = createInsertSchema(transactionsTable);
