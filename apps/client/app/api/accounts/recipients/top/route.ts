import * as mysql from "@repo/mysql/account/list-top-recipients";
import * as postgres from "@repo/postgres/account/list-top-recipients";
import * as singlestore from "@repo/singlestore/account/list-top-recipients";
import { withMS } from "@repo/utils/with-ms";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const db = request.nextUrl.searchParams.get("db");

  let query;
  if (db === "singlestore") {
    query = () => singlestore.listTopRecipients();
  } else if (db === "mysql") {
    query = () => mysql.listTopRecipients();
  } else if (db === "postgres") {
    query = () => postgres.listTopRecipients();
  } else {
    throw new Error("UnknownDatabaseError");
  }

  const { value, ms } = await withMS(query);

  return NextResponse.json({ value, ms });
}
