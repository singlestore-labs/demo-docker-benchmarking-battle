import { faker } from "@faker-js/faker";
import type { AccountRecord } from "@repo/types/account";
import type { TransactionRecord, TransactionStatusRecord, TransactionTypeRecord } from "@repo/types/transaction";
import type { UserRecord } from "@repo/types/user";
import { once } from "events";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { resolve } from "path";

const NOW = new Date();
const USERS_NUMBER = 1_000_000;
const ACCOUNTS_NUMBER = 10_000_000;
const TRANSACTIONS_NUMBER = 100_000_000;

const EXPORT_PATH = "./export";
const CHUNK_SIZE = 1_000_000;
const BATCH_SIZE = 10_000;
const PROGRESS_INTERVAL = BATCH_SIZE;
const HIGH_WATER_MARK = 16 * 1024 * 1024;

if (!existsSync(EXPORT_PATH)) {
  mkdirSync(EXPORT_PATH, { recursive: true });
}

function printProgress(label: string, count: number) {
  process.stdout.write(`\r${label}: ${count.toLocaleString()} generated`);
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

async function generateChunkedCsv<T>(
  count: number,
  makeRecord: (i: number) => T,
  filenamePrefix: string,
  stringifyRecord: (record: T) => string,
) {
  let fileIndex = 1;
  let recordCountInFile = 0;
  let totalWritten = 0;

  let stream = createWriteStream(resolve(EXPORT_PATH, `${filenamePrefix}-${fileIndex}.csv`), {
    highWaterMark: HIGH_WATER_MARK,
  });

  let batchLines: string[] = [];

  const flushBatch = async () => {
    if (batchLines.length === 0) return;
    const chunk = batchLines.join("\n") + "\n";
    batchLines = [];

    if (!stream.write(chunk)) {
      await once(stream, "drain");
    }
  };

  const closeStream = async () => {
    await flushBatch();
    stream.end();
    await once(stream, "finish");
    console.log(`\nFinished ${filenamePrefix}-${fileIndex}.csv`);
  };

  for (let i = 0; i < count; i++) {
    if (recordCountInFile === CHUNK_SIZE) {
      await closeStream();
      fileIndex++;
      recordCountInFile = 0;
      stream = createWriteStream(resolve(EXPORT_PATH, `${filenamePrefix}-${fileIndex}.csv`), {
        highWaterMark: HIGH_WATER_MARK,
      });
    }

    const record = makeRecord(i);
    batchLines.push(stringifyRecord(record));
    recordCountInFile++;
    totalWritten++;

    if (batchLines.length === BATCH_SIZE) {
      await flushBatch();
    }

    if (totalWritten % PROGRESS_INTERVAL === 0) {
      printProgress(`${filenamePrefix}-${fileIndex}`, recordCountInFile);
    }
  }

  await closeStream();
}

async function generateUsers() {
  await generateChunkedCsv<UserRecord>(
    USERS_NUMBER,
    (i) => {
      return {
        id: i + 1,
        email: faker.internet.email(),
        name: faker.person.fullName(),
        createdAt: NOW,
        updatedAt: NOW,
      };
    },
    "users",
    (record) => {
      return Object.values({
        ...record,
        createdAt: toSQLDate(record.createdAt),
        updatedAt: toSQLDate(record.updatedAt),
      }).join(",");
    },
  );
}

async function generateAccounts() {
  await generateChunkedCsv<AccountRecord>(
    ACCOUNTS_NUMBER,
    (i) => {
      return {
        id: i + 1,
        userId: faker.number.int({ min: 1, max: USERS_NUMBER }),
        balance: faker.finance.amount({ dec: 2 }),
        createdAt: NOW,
        updatedAt: NOW,
      };
    },
    "accounts",
    (record) => {
      return Object.values({
        ...record,
        createdAt: toSQLDate(record.createdAt),
        updatedAt: toSQLDate(record.updatedAt),
      }).join(",");
    },
  );
}

async function generateTransactions() {
  await generateChunkedCsv<TransactionRecord>(
    TRANSACTIONS_NUMBER,
    (i) => {
      const from = faker.number.int({ min: 1, max: ACCOUNTS_NUMBER });
      let to = faker.number.int({ min: 1, max: ACCOUNTS_NUMBER });
      while (to === from) {
        to = faker.number.int({ min: 1, max: ACCOUNTS_NUMBER });
      }
      return {
        id: i + 1,
        accountIdFrom: from,
        accountIdTo: to,
        typeId: faker.helpers.arrayElement(TRANSACTION_TYPES).id,
        statusId: faker.helpers.arrayElement(TRANSACTION_STATUSES).id,
        amount: faker.finance.amount({ dec: 2 }),
        createdAt: NOW,
      };
    },
    "transactions",
    (record) => {
      return Object.values({
        ...record,
        createdAt: toSQLDate(record.createdAt),
      }).join(",");
    },
  );
}

async function generateReferenceList<T extends { id: number; name: string }>(list: T[], filename: string) {
  const stream = createWriteStream(resolve(EXPORT_PATH, filename), {
    highWaterMark: HIGH_WATER_MARK,
  });

  for (const record of list) {
    const line = `${record.id},${record.name}\n`;

    if (!stream.write(line)) {
      await once(stream, "drain");
    }
  }

  stream.end();
  await once(stream, "finish");
  console.log(`Finished ${filename}`);
}

(async () => {
  try {
    console.log("Start generating CSVs…");
    await generateUsers();
    await generateAccounts();
    await generateReferenceList(TRANSACTION_TYPES, "transaction-types-1.csv");
    await generateReferenceList(TRANSACTION_STATUSES, "transaction-statuses-1.csv");
    await generateTransactions();
    console.log("All CSVs generated.");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
