"use client";

import { formatMilliseconds } from "format-ms";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import type { BenchmarkData } from "@/benchmark/types";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export type BenchmarkChartProps = { className?: string; data: BenchmarkData };

const chartConfig = {
  singlestore: {
    color: "var(--primary)",
  },
  mysql: {
    color: "var(--chart-6)",
  },
  postgres: {
    color: "var(--chart-6)",
  },
  ms: {
    label: "ms",
  },
} satisfies ChartConfig;

export function BenchmarkChart({ className, data }: BenchmarkChartProps) {
  const _data = [
    { ...data.singlestore, fill: "var(--color-singlestore)" },
    { ...data.mysql, fill: "var(--color-mysql)" },
    { ...data.postgres, fill: "var(--color-postgres)" },
  ];

  return (
    <ChartContainer
      className={cn("h-32 w-full max-w-full", className)}
      config={chartConfig}
    >
      <BarChart
        data={_data}
        layout="vertical"
        margin={{ left: 32 }}
        accessibilityLayer
      >
        <YAxis
          dataKey="label"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <XAxis
          dataKey="xFaster"
          type="number"
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => `x${value}`}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value, name, item, index, payload) => {
                const { ms, xFaster } = payload as unknown as BenchmarkData[keyof BenchmarkData];
                return `x${xFaster} (${ms ? formatMilliseconds(ms) : "0ms"})`;
              }}
            />
          }
        />
        <Bar
          dataKey="xFaster"
          layout="vertical"
          radius={5}
        />
      </BarChart>
    </ChartContainer>
  );
}
