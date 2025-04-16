import type { DB } from "@repo/types/db";

export type BenchmarkResult = {
  value: any;
  ms: number;
};

export type BenchmarkResults = Record<DB, BenchmarkResult>;

export type BenchmarkData = Record<DB, { label: string; ms: number; xFaster: number }>;
