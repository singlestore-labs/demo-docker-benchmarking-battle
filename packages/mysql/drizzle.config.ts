import { DB_URL } from "@repo/mysql/constants";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "mysql",
  out: "./drizzle",
  schema: "./schema.ts",
  dbCredentials: { url: DB_URL },
});
