import { pgEnum } from "drizzle-orm/pg-core";

export const currencyEnum = pgEnum("currency", ["usd"]);

export const transactionTypeEnum = pgEnum("type", ["transfer", "payment", "withdrawal", "deposit"]);

export const transactionStatusEnum = pgEnum("status", ["success", "failed", "pending"]);
