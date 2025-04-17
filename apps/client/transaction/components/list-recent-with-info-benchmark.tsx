"use client";

import type { DB } from "@repo/types/db";

import { BenchmarkCard, type BenchmarkCardProps } from "@/benchmark/components/card";

export type ListRecentTransactionsWithInfoBenchmarkProps = Omit<BenchmarkCardProps, "actions">;

export function ListRecentTransactionsWithInfoBenchmark({ ...props }: ListRecentTransactionsWithInfoBenchmarkProps) {
  const getParams = (db: DB) => new URLSearchParams({ db });

  return (
    <BenchmarkCard
      heading="Join users, accounts, and transactions"
      description="Retrieves recent transactions from the past 7 days and includes associated user and account information using multi-table joins."
      {...props}
      actions={{
        singlestore: () => fetch(`/api/transactions/recent?${getParams("singlestore")}`),
        mysql: () => fetch(`/api/transactions/recent?${getParams("mysql")}`),
        postgres: () => fetch(`/api/transactions/recent?${getParams("postgres")}`),
      }}
    />
  );
}
