"use client";

import type { DB } from "@repo/types/db";

import { BenchmarkCard, type BenchmarkCardProps } from "@/benchmark/components/card";

export type ListAccountAvgTransactionsAmountsBenchmarkProps = Omit<BenchmarkCardProps, "actions">;

export function ListAccountAvgTransactionsAmountsBenchmark({ ...props }: ListAccountAvgTransactionsAmountsBenchmarkProps) {
  const getParams = (db: DB) => new URLSearchParams({ db, limit: "10" });

  return (
    <BenchmarkCard
      heading="Get average transaction amount per account"
      description="Calculates the average transaction amount and the total number of successful transactions grouped by sender account."
      {...props}
      actions={{
        singlestore: () => fetch(`/api/accounts/transactions/amount?${getParams("singlestore")}`),
        mysql: () => fetch(`/api/accounts/transactions/amount?${getParams("mysql")}`),
        postgres: () => fetch(`/api/accounts/transactions/amount?${getParams("postgres")}`),
      }}
    />
  );
}
