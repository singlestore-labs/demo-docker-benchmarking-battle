import * as mysql from "@repo/mysql/user/list-top-active";
import * as postgres from "@repo/postgres/user/list-top-active";
import * as singlestore from "@repo/singlestore/user/list-top-active";
import { withMS } from "@repo/utils/with-ms";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const db = request.nextUrl.searchParams.get("db");

  let query;
  if (db === "singlestore") {
    query = () => singlestore.listTopActiveUsers();
  } else if (db === "mysql") {
    query = () => mysql.listTopActiveUsers();
  } else if (db === "postgres") {
    query = () => postgres.listTopActiveUsers();
  } else {
    throw new Error("UnknownDatabaseError");
  }

  const { value, ms } = await withMS(query);

  return NextResponse.json({ value, ms });
}
