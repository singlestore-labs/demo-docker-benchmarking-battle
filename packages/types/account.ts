import type * as mysql from "@repo/mysql/account/types";
import type * as postgres from "@repo/postgres/account/types";
import type * as singlestore from "@repo/singlestore/account/types";

export type AccountRecord = mysql.AccountRecord | postgres.AccountRecord | singlestore.AccountRecord;

export type AccountValues = mysql.AccountValues | postgres.AccountValues | singlestore.AccountValues;
