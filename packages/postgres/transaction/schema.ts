import { bigint, decimal, index, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const transactionTypesTable = pgTable("transaction_types", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const transactionTypeId = bigint("transaction_type_id", { mode: "number" });
export const transactionTypeRecordSchema = createSelectSchema(transactionTypesTable);
export const transactionTypeValuesSchema = createInsertSchema(transactionTypesTable);

export const transactionStatusesTable = pgTable("transaction_statuses", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const transactionStatusId = bigint("transaction_status_id", { mode: "number" });
export const transactionStatusRecordSchema = createSelectSchema(transactionStatusesTable);
export const transactionStatusValuesSchema = createInsertSchema(transactionStatusesTable);

export const transactionsTable = pgTable(
  "transactions",
  {
    id: bigint({ mode: "number" }).primaryKey(),
    accountIdFrom: bigint("account_id_from", { mode: "number" }),
    accountIdTo: bigint("account_id_to", { mode: "number" }),
    typeId: transactionTypeId.notNull(),
    statusId: transactionStatusId.notNull(),
    amount: decimal({ precision: 18, scale: 2 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    fromIdx: index("account_id_from_idx").on(table.accountIdFrom),
    toIdx: index("account_id_to_idx").on(table.accountIdTo),
    typeIdx: index("type_id_idx").on(table.typeId),
    statusIdx: index("status_id_idx").on(table.statusId),
    typeStatusIdx: index("type_status_idx").on(table.typeId, table.statusId),
  }),
);

export const transactionId = bigint("transaction_id", { mode: "number" });
export const transactionRecordSchema = createSelectSchema(transactionsTable);
export const transactionValuesSchema = createInsertSchema(transactionsTable);
