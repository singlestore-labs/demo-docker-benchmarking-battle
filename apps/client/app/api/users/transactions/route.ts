import * as mysql from "@repo/mysql/user/list-transactions";
import * as postgres from "@repo/postgres/user/list-transactions";
import * as singlestore from "@repo/singlestore/user/list-transactions";
import { withMS } from "@repo/utils/with-ms";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const db = request.nextUrl.searchParams.get("db");
  const userId = request.nextUrl.searchParams.get("userId");
  const limit = request.nextUrl.searchParams.get("limit");

  const params = {
    userId: userId ? +userId : undefined,
    limit: limit ? +limit : undefined,
  };

  let query;
  if (db === "singlestore") {
    query = () => singlestore.listUserTransactions(params);
  } else if (db === "mysql") {
    query = () => mysql.listUserTransactions(params);
  } else if (db === "postgres") {
    query = () => postgres.listUserTransactions(params);
  } else {
    throw new Error("UnknownDatabaseError");
  }

  const { value, ms } = await withMS(query);

  return NextResponse.json({ value, ms });
}
