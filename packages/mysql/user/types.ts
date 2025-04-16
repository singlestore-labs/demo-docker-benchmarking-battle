import type { userRecordSchema, userValuesSchema } from "@repo/mysql/user/schema";
import type { z } from "zod";

export type UserRecord = z.infer<typeof userRecordSchema>;

export type UserValues = z.infer<typeof userValuesSchema>;
