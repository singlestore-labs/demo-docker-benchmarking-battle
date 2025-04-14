import type * as mysql from "@repo/mysql/account/schema";
import type * as postgres from "@repo/postgres/account/schema";
import type * as singlestore from "@repo/singlestore/account/schema";
import type { z } from "zod";

export type AccountRecord =
  | z.infer<typeof mysql.accountRecordSchema>
  | z.infer<typeof postgres.accountRecordSchema>
  | z.infer<typeof singlestore.accountRecordSchema>;

export type AccountValues =
  | z.infer<typeof mysql.accountValuesSchema>
  | z.infer<typeof postgres.accountValuesSchema>
  | z.infer<typeof singlestore.accountValuesSchema>;
