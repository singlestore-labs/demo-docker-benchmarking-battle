import { DB_URL } from "@repo/postgres/constants";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./schema.ts",
  dbCredentials: { url: DB_URL },
});
