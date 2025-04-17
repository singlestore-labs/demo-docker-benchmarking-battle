import { DB_URL } from "@repo/singlestore/constants";
import { drizzle } from "drizzle-orm/singlestore";
import { createReadStream } from "fs";
import { createPool } from "mysql2/promise";

const pool = createPool({
  uri: DB_URL,
  infileStreamFactory: (path) => createReadStream(path),
  multipleStatements: true,
});

export const singlestore = drizzle({ client: pool });
