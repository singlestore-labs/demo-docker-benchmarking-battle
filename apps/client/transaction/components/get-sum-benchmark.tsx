"use client";

import type { DB } from "@repo/types/db";

import { BenchmarkCard, type BenchmarkCardProps } from "@/benchmark/components/card";

export type GetTransactionsSumBenchmarkProps = Omit<BenchmarkCardProps, "actions">;

export function GetTransactionsSumBenchmark({ ...props }: GetTransactionsSumBenchmarkProps) {
  const getParams = (db: DB) => new URLSearchParams({ db });

  return (
    <BenchmarkCard
      heading="Calculate total transaction volume in the last 30 days"
      description="Calculates the sum of all successful transactions made within the past 30 days across the entire system."
      {...props}
      actions={{
        singlestore: () => fetch(`/api/transactions/sum?${getParams("singlestore")}`),
        mysql: () => fetch(`/api/transactions/sum?${getParams("mysql")}`),
        postgres: () => fetch(`/api/transactions/sum?${getParams("postgres")}`),
      }}
    />
  );
}
