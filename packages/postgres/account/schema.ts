import { currencyEnum } from "@repo/postgres/lib/enum";
import { userId } from "@repo/postgres/user/schema";
import { uid } from "@repo/utils/uid";
import { decimal, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const accountsTable = pgTable("accounts", {
  id: varchar({ length: 255 }).$default(uid).primaryKey(),
  userId: userId.notNull(),
  balance: decimal({ precision: 18, scale: 2 }),
  currency: currencyEnum(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const accountId = varchar("account_id", { length: 255 });

export const accountRecordSchema = createSelectSchema(accountsTable);
export const accountValuesSchema = createInsertSchema(accountsTable);
