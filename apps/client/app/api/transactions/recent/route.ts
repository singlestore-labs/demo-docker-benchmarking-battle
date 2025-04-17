import * as mysql from "@repo/mysql/transaction/list-recent-with-info";
import * as postgres from "@repo/postgres/transaction/list-recent-with-info";
import * as singlestore from "@repo/singlestore/transaction/list-recent-with-info";
import { withMS } from "@repo/utils/with-ms";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const db = request.nextUrl.searchParams.get("db");

  let query;
  if (db === "singlestore") {
    query = () => singlestore.listRecentTransactionsWithInfo();
  } else if (db === "mysql") {
    query = () => mysql.listRecentTransactionsWithInfo();
  } else if (db === "postgres") {
    query = () => postgres.listRecentTransactionsWithInfo();
  } else {
    throw new Error("UnknownDatabaseError");
  }

  const { value, ms } = await withMS(query);

  return NextResponse.json({ value, ms });
}
