import type { accountRecordSchema, accountValuesSchema } from "@repo/mysql/account/schema";
import type { z } from "zod";

export type AccountRecord = z.infer<typeof accountRecordSchema>;

export type AccountValues = z.infer<typeof accountValuesSchema>;
