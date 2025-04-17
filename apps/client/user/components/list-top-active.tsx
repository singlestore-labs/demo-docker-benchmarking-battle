"use client";

import type { DB } from "@repo/types/db";

import { BenchmarkCard, type BenchmarkCardProps } from "@/benchmark/components/card";

export type ListTopActiveUsersBenchmarkProps = Omit<BenchmarkCardProps, "actions">;

export function ListTopActiveUsersBenchmark({ ...props }: ListTopActiveUsersBenchmarkProps) {
  const getParams = (db: DB) => new URLSearchParams({ db });

  return (
    <BenchmarkCard
      heading="Top transfer-heavy users with high recipient diversity"
      description="Finds the top 10 users who made the most successful transfers in the last 90 days, only considering users who sent money to at least 5 different recipients. This query performs multi-level joins, filters, and grouped aggregations, pushing the database to its limits."
      {...props}
      actions={{
        singlestore: () => fetch(`/api/users/top-active?${getParams("singlestore")}`),
        mysql: () => fetch(`/api/users/top-active?${getParams("mysql")}`),
        postgres: () => fetch(`/api/users/top-active?${getParams("postgres")}`),
      }}
    />
  );
}
