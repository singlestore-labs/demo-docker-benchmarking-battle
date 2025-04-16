"use client";

import { BenchmarkCard, type BenchmarkCardProps } from "@/benchmark/components/card";
import { getUserTransactions } from "@/user/transaction/actions/get";

export type GetUserTransactionsBenchmarkProps = Omit<BenchmarkCardProps, "actions">;

export function GetUserTransactionsBenchmark({ ...props }: GetUserTransactionsBenchmarkProps) {
  const userId = 1;
  const limit = 10;

  return (
    <BenchmarkCard
      heading="Get user's 10 most recent transactions"
      description="Fetches the 10 latest transactions made by a specific user by joining accounts and transactions."
      {...props}
      actions={{
        singlestore: () => getUserTransactions("singlestore", { userId, limit }),
        mysql: () => getUserTransactions("mysql", { userId, limit }),
        postgres: () => getUserTransactions("postgres", { userId, limit }),
      }}
    />
  );
}
