import { faker } from "@faker-js/faker";
import type { AccountRecord } from "@repo/types/account";
import type { TransactionRecord, TransactionStatusRecord, TransactionTypeRecord } from "@repo/types/transaction";
import type { UserRecord } from "@repo/types/user";
import { once } from "events";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { resolve } from "path";

const USERS_NUMBER = 1_000_000;
const ACCOUNTS_NUMBER = 10_000_000;
const TRANSACTIONS_NUMBER = 100_000_000;
const PROGRESS_INTERVAL = 100_000;
const EXPORT_PATH = "./export";

if (!existsSync(EXPORT_PATH)) {
  try {
    mkdirSync(EXPORT_PATH);
  } catch (err) {
    console.error("Error creating export folder:", err);
    process.exit(1);
  }
}

function printProgress(label: string, count: number) {
  process.stdout.write(`\r${label}: ${count.toLocaleString()} records generated`);
}

function toSQLDate(date: Date) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

const TRANSACTION_TYPES = [
  { id: 1, name: "transfer" },
  { id: 2, name: "withdrawal" },
  { id: 3, name: "deposit" },
] satisfies TransactionTypeRecord[];

const TRANSACTION_STATUSES = [
  { id: 1, name: "success" },
  { id: 2, name: "failed" },
  { id: 3, name: "pending" },
] satisfies TransactionStatusRecord[];

async function generateUsers() {
  console.log("Generating users CSV");

  const stream = createWriteStream(resolve(EXPORT_PATH, "users.csv"));

  for (let i = 0; i < USERS_NUMBER; i++) {
    const createdAt = new Date();

    const record: UserRecord = {
      id: i + 1,
      email: faker.internet.email(),
      name: faker.person.fullName(),
      createdAt,
      updatedAt: createdAt,
    };

    const line =
      Object.values({
        ...record,
        createdAt: toSQLDate(record.createdAt),
        updatedAt: toSQLDate(record.updatedAt),
      }).join(",") + "\n";

    if (!stream.write(line)) {
      await once(stream, "drain");
    }

    if ((i + 1) % PROGRESS_INTERVAL === 0 || i + 1 === USERS_NUMBER) {
      printProgress("Users", i + 1);
    }
  }

  stream.end();
  await once(stream, "finish");
  process.stdout.write("\nUsers CSV generated\n");
}

async function generateAccounts() {
  console.log("Generating accounts CSV");

  const stream = createWriteStream(resolve(EXPORT_PATH, "accounts.csv"));

  for (let i = 0; i < ACCOUNTS_NUMBER; i++) {
    const createdAt = new Date();

    const record: AccountRecord = {
      id: i + 1,
      userId: faker.number.int({ min: 1, max: USERS_NUMBER }),
      balance: faker.finance.amount({ dec: 2 }),
      createdAt,
      updatedAt: createdAt,
    };

    const line =
      Object.values({
        ...record,
        createdAt: toSQLDate(record.createdAt),
        updatedAt: toSQLDate(record.updatedAt),
      }).join(",") + "\n";

    if (!stream.write(line)) {
      await once(stream, "drain");
    }

    if ((i + 1) % PROGRESS_INTERVAL === 0 || i + 1 === ACCOUNTS_NUMBER) {
      printProgress("Accounts", i + 1);
    }
  }

  stream.end();
  await once(stream, "finish");
  process.stdout.write("\nAccounts CSV generated\n");
}

async function generateTransactionTypes() {
  console.log("Generating transaction types CSV");

  const stream = createWriteStream(resolve(EXPORT_PATH, "transaction-types.csv"));

  for await (const record of TRANSACTION_TYPES) {
    const line = Object.values(record).join(",") + "\n";

    if (!stream.write(line)) {
      await once(stream, "drain");
    }
  }

  stream.end();
  await once(stream, "finish");
  process.stdout.write("\nTransaction types CSV generated\n");
}

async function generateTransactionStatuses() {
  console.log("Generating transaction statuses CSV");

  const stream = createWriteStream(resolve(EXPORT_PATH, "transaction-statuses.csv"));

  for await (const record of TRANSACTION_STATUSES) {
    const line = Object.values(record).join(",") + "\n";

    if (!stream.write(line)) {
      await once(stream, "drain");
    }
  }

  stream.end();
  await once(stream, "finish");
  process.stdout.write("\nTransaction statuses CSV generated\n");
}

async function generateTransactions() {
  console.log("Generating transactions CSV");

  const stream = createWriteStream(resolve(EXPORT_PATH, "transactions.csv"));

  for (let i = 0; i < TRANSACTIONS_NUMBER; i++) {
    const createdAt = new Date();
    const accountIdFrom = faker.number.int({ min: 1, max: ACCOUNTS_NUMBER });
    let accountIdTo = faker.number.int({ min: 1, max: ACCOUNTS_NUMBER });

    while (accountIdTo === accountIdFrom) {
      accountIdTo = faker.number.int({ min: 1, max: ACCOUNTS_NUMBER });
    }

    const record: TransactionRecord = {
      id: i + 1,
      accountIdFrom,
      accountIdTo,
      typeId: faker.helpers.arrayElement(TRANSACTION_TYPES).id,
      statusId: faker.helpers.arrayElement(TRANSACTION_STATUSES).id,
      amount: faker.finance.amount({ dec: 2 }),
      createdAt,
    };

    const line =
      Object.values({
        ...record,
        createdAt: toSQLDate(record.createdAt),
      }).join(",") + "\n";

    if (!stream.write(line)) {
      await once(stream, "drain");
    }

    if ((i + 1) % PROGRESS_INTERVAL === 0 || i + 1 === TRANSACTIONS_NUMBER) {
      printProgress("Transactions", i + 1);
    }
  }

  stream.end();
  await once(stream, "finish");
  process.stdout.write("\nTransactions CSV generated\n");
}

(async () => {
  try {
    await generateUsers();
    await generateAccounts();
    await generateTransactionTypes();
    await generateTransactionStatuses();
    await generateTransactions();
    console.log("Done.");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
