"use client";

import { formatMilliseconds } from "format-ms";
import { type ReactNode, useState } from "react";

import { BenchmarkChart } from "@/benchmark/components/chart";
import type { BenchmarkResult } from "@/benchmark/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, type CardProps, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type BenchmarkCardProps = CardProps & { heading?: ReactNode; description?: ReactNode };

export function BenchmarkCard({ className, heading, description, ...props }: BenchmarkCardProps) {
  const [singleStoreResult, setSingleStoreResult] = useState<BenchmarkResult>([[], 100]);
  const [mysqlResult, setMysqlResult] = useState<BenchmarkResult>([[], 1000]);
  const [postgresResult, setPostgresResult] = useState<BenchmarkResult>([[], 10000]);

  const isPending = false;

  return (
    <Card
      {...props}
      className={cn("", className)}
    >
      <CardHeader>
        {heading && <CardTitle>{heading}</CardTitle>}

        {description && <CardDescription>{description}</CardDescription>}

        <div className="flex">
          {(
            [
              ["SingleStore", singleStoreResult[1]],
              ["MySQL", mysqlResult[1]],
              ["PostgresSQL", postgresResult[1]],
            ] as const
          ).map(([label, ms]) => (
            <div
              key={label}
              className="mt-4 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
            >
              <span className="text-muted-foreground text-xs">{label}</span>
              <span className="text-lg leading-none font-bold sm:text-3xl">{formatMilliseconds(ms)}</span>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <BenchmarkChart
          results={{
            singlestore: singleStoreResult[1],
            mysql: mysqlResult[1],
            postgres: postgresResult[1],
          }}
        />
      </CardContent>

      <CardFooter>
        <Button
          className="ml-auto"
          disabled={isPending}
        >
          Run
        </Button>
      </CardFooter>
    </Card>
  );
}
