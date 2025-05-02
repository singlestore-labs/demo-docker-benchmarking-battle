import { mysql } from "@repo/mysql";
import { postgres } from "@repo/postgres";
import { singlestore } from "@repo/singlestore";
import { sql } from "drizzle-orm";

const indexQueries = [
  // support users → accounts join
  `CREATE INDEX user_id_idx ON accounts (user_id);`,

  // support accounts → transactions (account_id_from) join
  `CREATE INDEX account_id_from_idx ON transactions (account_id_from);`,

  // support getTransactionsSum filter/join on status
  `CREATE INDEX status_id_idx ON transactions (transaction_status_id);`,

  // support listTopRecipients filter on type+status
  `CREATE INDEX type_status_idx ON transactions (transaction_type_id, transaction_status_id);`,
];

(async () => {
  await Promise.all(
    [singlestore, mysql, postgres].map(async (driver) => {
      for await (const query of indexQueries) {
        try {
          await (driver as any).execute(sql.raw(query));
        } catch (error) {
          console.error(error);
          continue;
        }
      }
    }),
  );

  process.exit(0);
})();
