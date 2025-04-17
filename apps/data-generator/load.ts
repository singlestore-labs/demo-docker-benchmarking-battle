import { mysql } from "@repo/mysql";
import * as mysqlTables from "@repo/mysql/schema";
import { postgres } from "@repo/postgres";
import * as postgresTables from "@repo/postgres/schema";
import { singlestore } from "@repo/singlestore";
import * as singlestoreTables from "@repo/singlestore/schema";
import type { AccountRecord } from "@repo/types/account";
import type { TransactionRecord, TransactionStatusRecord, TransactionTypeRecord } from "@repo/types/transaction";
import type { UserRecord } from "@repo/types/user";
import { parse } from "csv-parse";
import { createReadStream } from "fs";
import { resolve } from "path";

const EXPORT_PATH = "./export";
const BATCH_SIZE = 5_000;

async function loadAndInsertCSV<T>(
  label: string,
  filename: string,
  parseRow: (record: string[]) => T,
  insertFn: (chunk: T[]) => Promise<void>,
) {
  const stream = createReadStream(resolve(EXPORT_PATH, filename));
  const parser = stream.pipe(parse({ delimiter: ",", from_line: 1 }));

  let chunk: T[] = [];
  let count = 0;

  for await (const record of parser) {
    chunk.push(parseRow(record));

    if (chunk.length >= BATCH_SIZE) {
      await insertFn(chunk);
      count += chunk.length;
      chunk = [];
      process.stdout.write(`\r${label}: Inserted ${count.toLocaleString()} rows`);
    }
  }

  if (chunk.length > 0) {
    await insertFn(chunk);
    count += chunk.length;
    process.stdout.write(`\r${label}: Inserted ${count.toLocaleString()} rows`);
  }

  process.stdout.write(`\n${label}: Completed\n`);
}

(async () => {
  try {
    await loadAndInsertCSV<UserRecord>(
      "Users",
      "users.csv",
      ([id, email, name, createdAt, updatedAt]) => ({
        id: Number(id),
        email: email as UserRecord["email"],
        name: name as UserRecord["name"],
        createdAt: createdAt ? new Date(createdAt) : new Date(),
        updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
      }),
      async (chunk) => {
        await Promise.all([
          singlestore.insert(singlestoreTables.usersTable).values(chunk),
          mysql.insert(mysqlTables.usersTable).values(chunk),
          postgres.insert(postgresTables.usersTable).values(chunk),
        ]);
      },
    );

    await loadAndInsertCSV<AccountRecord>(
      "Accounts",
      "accounts.csv",
      ([id, userId, balance, createdAt, updatedAt]) => ({
        id: Number(id),
        userId: Number(userId),
        balance: balance as AccountRecord["balance"],
        createdAt: createdAt ? new Date(createdAt) : new Date(),
        updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
      }),
      async (chunk) => {
        await Promise.all([
          singlestore.insert(singlestoreTables.accountsTable).values(chunk),
          mysql.insert(mysqlTables.accountsTable).values(chunk),
          postgres.insert(postgresTables.accountsTable).values(chunk),
        ]);
      },
    );

    await loadAndInsertCSV<TransactionTypeRecord>(
      "Transaction Types",
      "transaction-types.csv",
      ([id, name]) => ({
        id: Number(id),
        name: name || "",
      }),
      async (chunk) => {
        await Promise.all([
          singlestore.insert(singlestoreTables.transactionTypesTable).values(chunk),
          mysql.insert(mysqlTables.transactionTypesTable).values(chunk),
          postgres.insert(postgresTables.transactionTypesTable).values(chunk),
        ]);
      },
    );

    await loadAndInsertCSV<TransactionStatusRecord>(
      "Transaction Statuses",
      "transaction-statuses.csv",
      ([id, name]) => ({
        id: Number(id),
        name: name || "",
      }),
      async (chunk) => {
        await Promise.all([
          singlestore.insert(singlestoreTables.transactionStatusesTable).values(chunk),
          mysql.insert(mysqlTables.transactionStatusesTable).values(chunk),
          postgres.insert(postgresTables.transactionStatusesTable).values(chunk),
        ]);
      },
    );

    await loadAndInsertCSV<TransactionRecord>(
      "Transactions",
      "transactions.csv",
      ([id, accountIdFrom, accountIdTo, typeId, statusId, amount, createdAt]) => ({
        id: Number(id),
        accountIdFrom: Number(accountIdFrom),
        accountIdTo: Number(accountIdTo),
        typeId: Number(typeId),
        statusId: Number(statusId),
        amount: amount || "0",
        createdAt: createdAt ? new Date(createdAt) : new Date(),
      }),
      async (chunk) => {
        await Promise.all([
          singlestore.insert(singlestoreTables.transactionsTable).values(chunk),
          mysql.insert(mysqlTables.transactionsTable).values(chunk),
          postgres.insert(postgresTables.transactionsTable).values(chunk),
        ]);
      },
    );

    console.log("Done.");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
