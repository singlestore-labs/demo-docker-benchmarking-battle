import * as mysql from "@repo/mysql/transaction/get-sum";
import * as postgres from "@repo/postgres/transaction/get-sum";
import * as singlestore from "@repo/singlestore/transaction/get-sum";
import { withMS } from "@repo/utils/with-ms";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const db = request.nextUrl.searchParams.get("db");

  let query;
  if (db === "singlestore") {
    query = () => singlestore.getTransactionsSum();
  } else if (db === "mysql") {
    query = () => mysql.getTransactionsSum();
  } else if (db === "postgres") {
    query = () => postgres.getTransactionsSum();
  } else {
    throw new Error("UnknownDatabaseError");
  }

  const { value, ms } = await withMS(query);

  return NextResponse.json({ value, ms });
}
