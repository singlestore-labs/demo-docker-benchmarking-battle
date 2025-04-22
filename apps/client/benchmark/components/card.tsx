"use client";

import type { DB } from "@repo/types/db";
import { formatMilliseconds } from "format-ms";
import { type Dispatch, type ReactNode, type SetStateAction, useState } from "react";

import { BenchmarkChart } from "@/benchmark/components/chart";
import type { BenchmarkData, BenchmarkResult } from "@/benchmark/types";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, type CardProps, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type BenchmarkCardProps = CardProps & {
  heading?: ReactNode;
  description?: ReactNode;
  actions: Record<DB, () => Promise<Response>>;
};

export function BenchmarkCard({ className, heading, description, actions, ...props }: BenchmarkCardProps) {
  const [singleStoreResult, setSingleStoreResult] = useState<BenchmarkResult>({ value: undefined, ms: 0, isPending: false });
  const [mysqlResult, setMysqlResult] = useState<BenchmarkResult>({ value: undefined, ms: 0, isPending: false });
  const [postgresResult, setPostgresResult] = useState<BenchmarkResult>({ value: undefined, ms: 0, isPending: false });

  const times = [singleStoreResult.ms, mysqlResult.ms, postgresResult.ms];
  const slowestTime = Math.max(...times);
  const calcXFaster = (ms: number) => (ms ? +(slowestTime / ms).toFixed(2) : 0);
  const isPending = singleStoreResult.isPending || mysqlResult.isPending || postgresResult.isPending;

  const data = {
    singlestore: {
      label: "SingleStore",
      ms: singleStoreResult.ms,
      xFaster: calcXFaster(singleStoreResult.ms),
      isPending: singleStoreResult.isPending,
    },
    mysql: {
      label: "MySQL",
      ms: mysqlResult.ms,
      xFaster: calcXFaster(mysqlResult.ms),
      isPending: mysqlResult.isPending,
    },
    postgres: {
      label: "Postgres",
      ms: postgresResult.ms,
      xFaster: calcXFaster(postgresResult.ms),
      isPending: postgresResult.isPending,
    },
  } satisfies BenchmarkData;

  const actionHandlers = {
    singlestore: {
      setState: setSingleStoreResult,
    },
    mysql: {
      setState: setMysqlResult,
    },
    postgres: {
      setState: setPostgresResult,
    },
  } satisfies Record<DB, { setState: Dispatch<SetStateAction<BenchmarkResult>> }>;

  const handleRunClick = () => {
    Object.values(actionHandlers).forEach(({ setState }) => {
      setState({ value: undefined, ms: 0, isPending: false });
    });

    Object.entries(actions).map(async ([db, action]) => {
      const handler = actionHandlers[db as keyof typeof actionHandlers];

      try {
        handler.setState((i) => ({ ...i, isPending: true }));
        const response = await action();
        const result = await response.json();
        handler.setState({ value: result.value, ms: result.ms, isPending: false });
      } catch (error) {
        console.error(error);
        handler.setState((i) => ({ ...i, isPending: false }));
      }
    });
  };

  return (
    <Card
      {...props}
      className={cn("", className)}
    >
      <CardHeader>
        {heading && <CardTitle>{heading}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}

        <div className="flex">
          {Object.values(data).map((data) => (
            <div
              key={data.label}
              className="mt-4 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
            >
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                {data.label}
                {data.isPending && <Spinner />}
              </span>
              <span
                className={cn(
                  "text-lg leading-none font-bold sm:text-3xl",
                  data.label === "SingleStore" && "text-primary",
                  data.isPending && "text-foreground/25",
                )}
              >
                <span>x{data.xFaster}</span>
                <span className="ml-2 text-lg">({data.ms ? formatMilliseconds(data.ms) : "0ms"})</span>
              </span>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <BenchmarkChart data={data} />
      </CardContent>

      <CardFooter>
        <Button
          className="ml-auto"
          disabled={isPending}
          onClick={handleRunClick}
        >
          Run
        </Button>
      </CardFooter>
    </Card>
  );
}
