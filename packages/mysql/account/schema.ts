import { userId } from "@repo/mysql/user/schema";
import { uid } from "@repo/utils/uid";
import { decimal, mysqlEnum, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const accountsTable = mysqlTable("accounts", {
  id: varchar({ length: 255 }).$default(uid).primaryKey(),
  userId: userId.notNull(),
  balance: decimal({ precision: 18, scale: 2 }),
  currency: mysqlEnum(["usd"]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const accountId = varchar("account_id", { length: 255 });

export const accountRecordSchema = createSelectSchema(accountsTable);
export const accountValuesSchema = createInsertSchema(accountsTable);
