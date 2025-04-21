import { userId } from "@repo/postgres/user/schema";
import { bigint, decimal, pgTable, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const accountsTable = pgTable("accounts", {
  id: bigint({ mode: "number" }).primaryKey(),
  userId: userId.notNull(),
  balance: decimal({ precision: 18, scale: 2 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const accountId = bigint("account_id", { mode: "number" });

export const accountRecordSchema = createSelectSchema(accountsTable);
export const accountValuesSchema = createInsertSchema(accountsTable);
