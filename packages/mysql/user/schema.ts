import { uid } from "@repo/utils/uid";
import { mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const usersTable = mysqlTable("users", {
  id: varchar({ length: 255 }).$default(uid).primaryKey(),
  name: varchar({ length: 255 }),
  email: varchar({ length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const userId = varchar("user_id", { length: 255 });

export const userRecordSchema = createSelectSchema(usersTable);
export const userValuesSchema = createInsertSchema(usersTable);
