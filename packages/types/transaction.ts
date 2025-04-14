import type * as mysql from "@repo/mysql/transaction/schema";
import type * as postgres from "@repo/postgres/transaction/schema";
import type * as singlestore from "@repo/singlestore/transaction/schema";
import type { z } from "zod";

export type TransactionRecord =
  | z.infer<typeof mysql.transactionRecordSchema>
  | z.infer<typeof postgres.transactionRecordSchema>
  | z.infer<typeof singlestore.transactionRecordSchema>;

export type TransactionValues =
  | z.infer<typeof mysql.transactionValuesSchema>
  | z.infer<typeof postgres.transactionValuesSchema>
  | z.infer<typeof singlestore.transactionValuesSchema>;
