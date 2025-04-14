import { createdAt, id, image, updatedAt } from "@repo/schemas/lib/fields";
import { singlestoreTable, varchar } from "drizzle-orm/singlestore-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const usersTable = singlestoreTable("users", {
  id,
  name: varchar({ length: 255 }),
  email: varchar({ length: 255 }),
  image,
  createdAt,
  updatedAt,
});

export const userId = varchar("user_id", { length: 255 });

export const userRecordSchema = createSelectSchema(usersTable);
export const userValuesSchema = createInsertSchema(usersTable);

export const userCreateValuesSchema = userValuesSchema;
export const userUpdateValuesSchema = userCreateValuesSchema.pick({ name: true, email: true, image: true }).partial();
