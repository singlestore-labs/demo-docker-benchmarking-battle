"use server";

import * as mysql from "@repo/mysql/user/get-transactions";
import * as postgres from "@repo/postgres/user/get-transactions";
import * as singlestore from "@repo/singlestore/user/get-transactions";
import type { DB } from "@repo/types/db";
import type { UserRecord } from "@repo/types/user";

export type GetUserTransactionsParams = {
  userId: UserRecord["id"];
  limit?: number;
};

export async function getUserTransactions(db: DB, params: GetUserTransactionsParams) {
  try {
    if (db === "singlestore") {
      return singlestore.getUserTransactions(params);
    } else if (db === "mysql") {
      return mysql.getUserTransactions(params);
    } else if (db === "postgres") {
      return postgres.getUserTransactions(params);
    } else {
      throw new Error("UnknownDatabaseError");
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "UnknownError" };
  }
}
