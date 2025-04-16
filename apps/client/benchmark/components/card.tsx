"use client";

import type { DB } from "@repo/types/db";
import { withMS } from "@repo/utils/with-ms";
import { formatMilliseconds } from "format-ms";
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  type TransitionStartFunction,
  useState,
  useTransition,
} from "react";

import { BenchmarkChart } from "@/benchmark/components/chart";
import type { BenchmarkData, BenchmarkResult } from "@/benchmark/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, type CardProps, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type BenchmarkCardProps = CardProps & {
  heading?: ReactNode;
  description?: ReactNode;
  actions: Record<DB, () => Promise<any>>;
};

export function BenchmarkCard({ className, heading, description, actions, ...props }: BenchmarkCardProps) {
  const [singleStoreResult, setSingleStoreResult] = useState<BenchmarkResult>({ value: undefined, ms: 0 });
  const [mysqlResult, setMysqlResult] = useState<BenchmarkResult>({ value: undefined, ms: 0 });
  const [postgresResult, setPostgresResult] = useState<BenchmarkResult>({ value: undefined, ms: 0 });

  const singleStoreTransition = useTransition();
  const mysqlTransition = useTransition();
  const postgresTransition = useTransition();

  const times = [singleStoreResult.ms, mysqlResult.ms, postgresResult.ms];
  const slowestTime = Math.max(...times);
  const calcXFaster = (ms: number) => (ms ? +(slowestTime / ms).toFixed(2) : 0);
  const isPending = singleStoreTransition[0] || mysqlTransition[0] || postgresTransition[0];

  const data = {
    singlestore: {
      label: "SingleStore",
      ms: singleStoreResult.ms,
      xFaster: calcXFaster(singleStoreResult.ms),
    },
    mysql: {
      label: "MySQL",
      ms: mysqlResult.ms,
      xFaster: calcXFaster(mysqlResult.ms),
    },
    postgres: {
      label: "PostgresSQL",
      ms: postgresResult.ms,
      xFaster: calcXFaster(postgresResult.ms),
    },
  } satisfies BenchmarkData;

  const actionHandlers = {
    singlestore: {
      startTransition: singleStoreTransition[1],
      setState: setSingleStoreResult,
    },
    mysql: {
      startTransition: mysqlTransition[1],
      setState: setMysqlResult,
    },
    postgres: {
      startTransition: postgresTransition[1],
      setState: setPostgresResult,
    },
  } satisfies Record<
    DB,
    {
      startTransition: TransitionStartFunction;
      setState: Dispatch<SetStateAction<BenchmarkResult>>;
    }
  >;

  const handleRunClick = () => {
    Object.values(actionHandlers).forEach(({ setState }) => {
      setState({ value: undefined, ms: 0 });
    });

    Object.entries(actions).map(([db, action]) => {
      const handler = actionHandlers[db as keyof typeof actionHandlers];

      handler.startTransition(async () => {
        try {
          const { value, ms } = await withMS(action);

          if ("error" in value) {
            console.error(value.error);
          } else {
            handler.setState({ value, ms });
          }
        } catch (error) {
          console.error(error);
        }
      });
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
              <span className="text-muted-foreground text-xs">{data.label}</span>
              <span
                className={cn("text-lg leading-none font-bold sm:text-3xl", data.label === "SingleStore" && "text-primary")}
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
