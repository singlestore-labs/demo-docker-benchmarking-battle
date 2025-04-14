import { userId } from "@repo/singlestore/user/schema";
import { uid } from "@repo/utils/uid";
import { decimal, singlestoreEnum, singlestoreTable, timestamp, varchar } from "drizzle-orm/singlestore-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const accountsTable = singlestoreTable("accounts", {
  id: varchar({ length: 255 }).$default(uid).primaryKey(),
  userId: userId.notNull(),
  balance: decimal({ precision: 18, scale: 2 }),
  currency: singlestoreEnum(["usd"]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const accountId = varchar("account_id", { length: 255 });

export const accountRecordSchema = createSelectSchema(accountsTable);
export const accountValuesSchema = createInsertSchema(accountsTable);
