"use client";

import type { DB } from "@repo/types/db";
import { formatMilliseconds } from "format-ms";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import type { BenchmarkResult } from "@/benchmark/types";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export type BenchmarkChartProps = { className?: string; results: Record<DB, BenchmarkResult[1]> };

const chartConfig = {
  singlestore: {
    label: "SingleStore",
    color: "var(--primary)",
  },
  mysql: {
    label: "MySQL",
    color: "var(--chart-6)",
  },
  postgres: {
    label: "PostgresSQL",
    color: "var(--chart-6)",
  },
  ms: {
    label: "ms",
  },
} satisfies ChartConfig;

export function BenchmarkChart({ className, results }: BenchmarkChartProps) {
  const data = [
    { db: "singlestore", ms: results.singlestore, fill: "var(--color-singlestore)" },
    { db: "mysql", ms: results.mysql, fill: "var(--color-mysql)" },
    { db: "postgres", ms: results.postgres, fill: "var(--color-postgres)" },
  ].sort((a, b) => a.ms - b.ms);

  return (
    <ChartContainer
      className={cn("h-32 w-full max-w-full", className)}
      config={chartConfig}
    >
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{ left: 32 }}
      >
        <YAxis
          dataKey="db"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
        />
        <XAxis
          dataKey="ms"
          type="number"
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => (value === 0 ? "0" : formatMilliseconds(value, { largestOnly: true }))}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value) => {
                if (typeof value === "number") {
                  const diff = value / data[0]!.ms;
                  return `${formatMilliseconds(value)}${diff > 1 ? ` (x${diff.toFixed(1)} slower)` : ""}`;
                }
              }}
            />
          }
        />
        <Bar
          dataKey="ms"
          layout="vertical"
          radius={5}
        />
      </BarChart>
    </ChartContainer>
  );
}
