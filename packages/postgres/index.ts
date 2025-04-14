import { DB_URL } from "@repo/postgres/constants";
import { drizzle } from "drizzle-orm/node-postgres";

export const postgres = drizzle(DB_URL);
