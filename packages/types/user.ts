import type * as mysql from "@repo/mysql/user/schema";
import type * as postgres from "@repo/postgres/user/schema";
import type * as singlestore from "@repo/singlestore/user/schema";
import type { z } from "zod";

export type UserRecord =
  | z.infer<typeof mysql.userRecordSchema>
  | z.infer<typeof postgres.userRecordSchema>
  | z.infer<typeof singlestore.userRecordSchema>;

export type UserValues =
  | z.infer<typeof mysql.userValuesSchema>
  | z.infer<typeof postgres.userValuesSchema>
  | z.infer<typeof singlestore.userValuesSchema>;
