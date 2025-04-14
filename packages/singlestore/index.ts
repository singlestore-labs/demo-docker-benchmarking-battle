import { DB_URL } from "@repo/singlestore/constants";
import { drizzle } from "drizzle-orm/singlestore";

export const singlestore = drizzle(DB_URL);
