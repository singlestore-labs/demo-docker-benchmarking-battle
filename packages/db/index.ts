import { DB_URL } from "@repo/db/constants";
import { drizzle } from "drizzle-orm/singlestore";

export const db = drizzle(DB_URL);
