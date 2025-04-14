import { uid } from "@repo/utils/uid";
import { json, text, timestamp, varchar } from "drizzle-orm/singlestore-core";

export const id = varchar({ length: 255 }).$default(uid).primaryKey();
export const slug = varchar({ length: 255 }).unique().notNull();
export const name = varchar({ length: 255 }).notNull();
export const description = text();
export const image = varchar({ length: 2048 });
export const createdAt = timestamp("created_at").notNull().defaultNow();
export const updatedAt = timestamp("updated_at").notNull().defaultNow().onUpdateNow();
export const metadata = json();
