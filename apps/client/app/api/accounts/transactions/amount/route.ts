import * as mysql from "@repo/mysql/account/list-avg-transactions-amount";
import * as postgres from "@repo/postgres/account/list-avg-transactions-amount";
import * as singlestore from "@repo/singlestore/account/list-avg-transactions-amount";
import { withMS } from "@repo/utils/with-ms";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const db = request.nextUrl.searchParams.get("db");
  const limit = request.nextUrl.searchParams.get("limit");

  const params = {
    limit: limit ? +limit : undefined,
  };

  let query;
  if (db === "singlestore") {
    query = () => singlestore.listAccountAvgTransactionsAmount(params);
  } else if (db === "mysql") {
    query = () => mysql.listAccountAvgTransactionsAmount(params);
  } else if (db === "postgres") {
    query = () => postgres.listAccountAvgTransactionsAmount(params);
  } else {
    throw new Error("UnknownDatabaseError");
  }

  const { value, ms } = await withMS(query);

  return NextResponse.json({ value, ms });
}
