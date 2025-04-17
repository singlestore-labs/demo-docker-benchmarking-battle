import { mysql } from "@repo/mysql";
import { postgresPool } from "@repo/postgres";
import { singlestore } from "@repo/singlestore";
import type { DB } from "@repo/types/db";
import { sql } from "drizzle-orm";
import { createReadStream } from "fs";
import { resolve } from "path";
import pgCopyStreams from "pg-copy-streams";

const postgresClient = await postgresPool.connect();

async function loadCSV(db: DB, tableName: string, path: string) {
  console.log(`[${db}] Loading CSV from ${path} to ${tableName}`);

  if (db === "singlestore" || db === "mysql") {
    const _db = { singlestore, mysql }[db];

    await _db.execute(
      sql.raw(`
        SET GLOBAL local_infile=1;

        LOAD DATA LOCAL INFILE '${path}'
        INTO TABLE ${tableName}
        FIELDS TERMINATED BY ','
        ENCLOSED BY '"';
      `),
    );
  }

  if (db === "postgres") {
    const stream = postgresClient.query(pgCopyStreams.from(`COPY ${tableName} FROM STDIN WITH CSV`));
    const fileStream = createReadStream(path);
    await new Promise((resolve, reject) => fileStream.pipe(stream).on("finish", resolve).on("error", reject));
  }
}

(async () => {
  try {
    await Promise.all(
      (["singlestore", "mysql", "postgres"] satisfies DB[]).map(async (db) => {
        for await (const [tableName, path] of [
          ["users", resolve("./export/users.csv")],
          ["accounts", resolve("./export/accounts.csv")],
          ["transaction_types", resolve("./export/transaction-types.csv")],
          ["transaction_statuses", resolve("./export/transaction-statuses.csv")],
          ["transactions", resolve("./export/transactions.csv")],
        ] as const) {
          await loadCSV(db, tableName, path);
        }
      }),
    );

    postgresClient.release();

    console.log("Done.");
    process.exit(0);
  } catch (error) {
    postgresClient.release();
    console.error(error);
    process.exit(1);
  }
})();
