import { userCreateValuesSchema, userRecordSchema, userUpdateValuesSchema, userValuesSchema } from "@repo/schemas/user";
import { z } from "zod";

export type UserRecord = z.infer<typeof userRecordSchema>;
export type UserValues = z.infer<typeof userValuesSchema>;

export type UserCreateValues = z.infer<typeof userCreateValuesSchema>;
export type UserUpdateValues = z.infer<typeof userUpdateValuesSchema>;

export type User = UserRecord;
