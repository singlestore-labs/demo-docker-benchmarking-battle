import type { accountRecordSchema, accountValuesSchema } from "@repo/singlestore/account/schema";
import type { z } from "zod";

export type AccountRecord = z.infer<typeof accountRecordSchema>;

export type AccountValues = z.infer<typeof accountValuesSchema>;
