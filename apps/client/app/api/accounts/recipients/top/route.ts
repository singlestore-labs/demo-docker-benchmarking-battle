import * as mysql from "@repo/mysql/account/list-top-recipients";
import * as postgres from "@repo/postgres/account/list-top-recipients";
import * as singlestore from "@repo/singlestore/account/list-top-recipients";
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
    query = () => singlestore.listTopRecipients(params);
  } else if (db === "mysql") {
    query = () => mysql.listTopRecipients(params);
  } else if (db === "postgres") {
    query = () => postgres.listTopRecipients(params);
  } else {
    throw new Error("UnknownDatabaseError");
  }

  const { value, ms } = await withMS(query);

  return NextResponse.json({ value, ms });
}
