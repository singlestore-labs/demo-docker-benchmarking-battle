import type {
  transactionRecordSchema,
  transactionStatusRecordSchema,
  transactionStatusValuesSchema,
  transactionTypeRecordSchema,
  transactionTypeValuesSchema,
  transactionValuesSchema,
} from "@repo/mysql/transaction/schema";
import type { z } from "zod";

export type TransactionRecord = z.infer<typeof transactionRecordSchema>;
export type TransactionValues = z.infer<typeof transactionValuesSchema>;

export type TransactionStatusRecord = z.infer<typeof transactionStatusRecordSchema>;
export type TransactionStatusValues = z.infer<typeof transactionStatusValuesSchema>;

export type TransactionTypeRecord = z.infer<typeof transactionTypeRecordSchema>;
export type TransactionTypeValues = z.infer<typeof transactionTypeValuesSchema>;
