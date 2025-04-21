import { mysql } from "@repo/mysql";
import { postgresPool } from "@repo/postgres";
import { singlestore } from "@repo/singlestore";
import type { DB } from "@repo/types/db";
import { sql } from "drizzle-orm";
import { createReadStream, existsSync } from "fs";
import { resolve } from "path";
import pgCopyStreams from "pg-copy-streams";

const EXPORT_PATH = "./export";

const ENTITIES = [
  { table: "users", prefix: "users" },
  { table: "accounts", prefix: "accounts" },
  { table: "transaction_types", prefix: "transaction-types" },
  { table: "transaction_statuses", prefix: "transaction-statuses" },
  { table: "transactions", prefix: "transactions" },
] as const;

async function loadFileToSQL(driver: typeof singlestore | typeof mysql, tableName: string, path: string) {
  await driver.execute(
    sql.raw(`
      LOAD DATA LOCAL INFILE '${path}'
      INTO TABLE ${tableName}
      FIELDS TERMINATED BY ','
      ENCLOSED BY '"';
    `),
  );
}

async function loadFileToPostgres(client: any, tableName: string, path: string) {
  const copyStream = client.query(pgCopyStreams.from(`COPY ${tableName} FROM STDIN WITH CSV`));
  const fileStream = createReadStream(path);
  return new Promise<void>((resolve, reject) => {
    fileStream
      .pipe(copyStream)
      .on("finish", () => resolve())
      .on("error", (error: unknown) => reject(error));
  });
}

(async () => {
  try {
    console.log("Start loading CSVs…");

    const tasks = (["singlestore", "mysql"] satisfies DB[]).map(async (db) => {
      if (db === "singlestore") return;
      const driver = { singlestore, mysql }[db];
      await driver.execute(
        sql.raw(`
        SET GLOBAL local_infile = 1;
        SET autocommit = 0;
        SET unique_checks = 0;
        SET foreign_key_checks = 0;
      `),
      );

      for (const { table, prefix } of ENTITIES) {
        for (let idx = 1; ; idx++) {
          const filePath = resolve(EXPORT_PATH, `${prefix}-${idx}.csv`);
          if (!existsSync(filePath)) break;
          console.log(`[${db}] Loading ${filePath} → ${table}`);
          await loadFileToSQL(driver, table, filePath);
          await driver.execute(sql.raw("COMMIT;"));
        }
      }

      await driver.execute(
        sql.raw(`
          SET GLOBAL local_infile = 0;
          SET autocommit = 1;
          SET unique_checks = 1;
          SET foreign_key_checks = 1;
      `),
      );
    });

    const pgTask = (async () => {
      const client = await postgresPool.connect();

      try {
        await client.query(`SET session_replication_role = 'replica';`);

        for (const { table, prefix } of ENTITIES) {
          if (table !== "transactions") continue;
          for (let idx = 1; ; idx++) {
            const filePath = resolve(EXPORT_PATH, `${prefix}-${idx}.csv`);
            if (!existsSync(filePath)) break;
            console.log(`[postgres] Loading ${filePath} → ${table}`);
            await loadFileToPostgres(client, table, filePath);
          }
        }

        await client.query(`SET session_replication_role = 'origin';`);
      } finally {
        client.release();
      }
    })();

    await Promise.all([...tasks, pgTask]);

    console.log("All CSVs loaded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error loading CSVs:", error);
    process.exit(1);
  }
})();
