import { DB_URL } from "@repo/singlestore/constants";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "singlestore",
  out: "./drizzle",
  schema: "./schema.ts",
  dbCredentials: { url: DB_URL },
});
