import type { transactionRecordSchema, transactionValuesSchema } from "@repo/mysql/transaction/schema";
import type { z } from "zod";

export type TransactionRecord = z.infer<typeof transactionRecordSchema>;

export type TransactionValues = z.infer<typeof transactionValuesSchema>;
