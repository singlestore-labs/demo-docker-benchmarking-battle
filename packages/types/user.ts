import type * as mysql from "@repo/mysql/user/types";
import type * as postgres from "@repo/postgres/user/types";
import type * as singlestore from "@repo/singlestore/user/types";

export type UserRecord = mysql.UserRecord | postgres.UserRecord | singlestore.UserRecord;

export type UserValues = mysql.UserValues | postgres.UserValues | singlestore.UserValues;
