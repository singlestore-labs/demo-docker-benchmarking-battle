import { DB_URL } from "@repo/mysql/constants";
import { drizzle } from "drizzle-orm/mysql2";

export const mysql = drizzle(DB_URL);
