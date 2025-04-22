import * as mysql from "@repo/mysql/info/get";
import * as postgres from "@repo/postgres/info/get";
import * as singlestore from "@repo/singlestore/info/get";
import type { DB } from "@repo/types/db";
import { type ComponentProps } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DBInfo } from "@/db/info/types";
import { cn } from "@/lib/utils";

export type DbInfoCards = ComponentProps<"div"> & { db: DB };

const DB_CONFIGS = {
  singlestore: {
    title: "SingleStore",
  },
  mysql: {
    title: "MySQL",
  },
  postgres: {
    title: "Postgres",
  },
} satisfies Record<DB, { title: string }>;

export async function DbInfoCard({ className, db, ...props }: DbInfoCards) {
  const config = DB_CONFIGS[db];

  let value: DBInfo | undefined;
  if (db === "singlestore") {
    value = await singlestore.getDbInfo();
  } else if (db === "mysql") {
    value = await mysql.getDbInfo();
  } else if (db === "postgres") {
    value = await postgres.getDbInfo();
  }

  return (
    <Card
      {...props}
      className={cn("", className)}
    >
      <CardHeader>
        <CardTitle>{config.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 text-sm font-medium">
          <p className="min-w-[6rem]">Table</p>
          <p>Rows</p>
        </div>
        <ul className="mt-2 flex flex-col gap-2 text-sm">
          {Object.entries({ Users: value?.users, Accounts: value?.accounts, Transactions: value?.transactions }).map(
            ([key, value]) => (
              <li
                key={key}
                className="flex items-center gap-2"
              >
                <span className="min-w-[6rem]">{key}</span>
                <span>{new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value || 0)}</span>
              </li>
            ),
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
