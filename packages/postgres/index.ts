import { DB_URL } from "@repo/postgres/constants";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

export const postgresPool = new pg.Pool({ connectionString: DB_URL });

export const postgres = drizzle(postgresPool);
