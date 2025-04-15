import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const usersTable = mysqlTable("users", {
  id: bigint({ mode: "number" }).autoincrement().primaryKey(),
  name: varchar({ length: 255 }),
  email: varchar({ length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const userId = bigint("user_id", { mode: "number" });

export const userRecordSchema = createSelectSchema(usersTable);
export const userValuesSchema = createInsertSchema(usersTable);
