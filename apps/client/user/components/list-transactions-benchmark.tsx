"use client";

import type { DB } from "@repo/types/db";

import { BenchmarkCard, type BenchmarkCardProps } from "@/benchmark/components/card";

export type ListUserTransactionsBenchmarkProps = Omit<BenchmarkCardProps, "actions">;

export function ListUserTransactionsBenchmark({ ...props }: ListUserTransactionsBenchmarkProps) {
  const getParams = (db: DB) => new URLSearchParams({ db, userId: "1", limit: "10" });

  return (
    <BenchmarkCard
      heading="Get user's 10 most recent transactions"
      description="Fetches the 10 latest transactions made by a specific user by joining accounts and transactions."
      {...props}
      actions={{
        singlestore: () => fetch(`/api/users/transactions?${getParams("singlestore")}`),
        mysql: () => fetch(`/api/users/transactions?${getParams("mysql")}`),
        postgres: () => fetch(`/api/users/transactions?${getParams("postgres")}`),
      }}
    />
  );
}
