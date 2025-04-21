import { DB_URL } from "@repo/mysql/constants";
import { drizzle } from "drizzle-orm/mysql2";
import { createReadStream } from "fs";
import { createPool } from "mysql2/promise";

const pool = createPool({
  uri: DB_URL,
  infileStreamFactory: (path) => createReadStream(path),
  multipleStatements: true,
});

export const mysql = drizzle({ client: pool });
