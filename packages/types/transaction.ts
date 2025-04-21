import type * as mysql from "@repo/mysql/transaction/types";
import type * as postgres from "@repo/postgres/transaction/types";
import type * as singlestore from "@repo/singlestore/transaction/types";

export type TransactionRecord = mysql.TransactionRecord | postgres.TransactionRecord | singlestore.TransactionRecord;

export type TransactionValues = mysql.TransactionValues | postgres.TransactionValues | singlestore.TransactionValues;

export type TransactionTypeRecord =
  | mysql.TransactionTypeRecord
  | postgres.TransactionTypeRecord
  | singlestore.TransactionTypeRecord;

export type TransactionTypeValues =
  | mysql.TransactionTypeValues
  | postgres.TransactionTypeValues
  | singlestore.TransactionTypeValues;

export type TransactionStatusRecord =
  | mysql.TransactionStatusRecord
  | postgres.TransactionStatusRecord
  | singlestore.TransactionStatusRecord;

export type TransactionStatusValues =
  | mysql.TransactionStatusValues
  | postgres.TransactionStatusValues
  | singlestore.TransactionStatusValues;
