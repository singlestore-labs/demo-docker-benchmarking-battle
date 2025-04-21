import { userId } from "@repo/mysql/user/schema";
import { bigint, decimal, mysqlTable, timestamp } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const accountsTable = mysqlTable("accounts", {
  id: bigint({ mode: "number" }).autoincrement().primaryKey(),
  userId: userId.notNull(),
  balance: decimal({ precision: 18, scale: 2 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const accountId = bigint("account_id", { mode: "number" });

export const accountRecordSchema = createSelectSchema(accountsTable);
export const accountValuesSchema = createInsertSchema(accountsTable);
