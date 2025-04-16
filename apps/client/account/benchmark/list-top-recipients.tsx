"use client";

import type { DB } from "@repo/types/db";

import { BenchmarkCard, type BenchmarkCardProps } from "@/benchmark/components/card";

export type ListTopRecipientsBenchmarkProps = Omit<BenchmarkCardProps, "actions">;

export function ListTopRecipientsBenchmark({ ...props }: ListTopRecipientsBenchmarkProps) {
  const getParams = (db: DB) => new URLSearchParams({ db, limit: "10" });

  return (
    <BenchmarkCard
      heading="Find top transfer recipients"
      description="Finds the most common recipients of successful transfers by counting how many times each account received a transfer."
      {...props}
      actions={{
        singlestore: () => fetch(`/api/accounts/recipients/top?${getParams("singlestore")}`),
        mysql: () => fetch(`/api/accounts/recipients/top?${getParams("mysql")}`),
        postgres: () => fetch(`/api/accounts/recipients/top?${getParams("postgres")}`),
      }}
    />
  );
}
