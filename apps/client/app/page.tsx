import { Suspense } from "react";

import { ListTopRecipientsBenchmark } from "@/account/benchmark/list-top-recipients";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";
import { DbInfoCard } from "@/db/info/components/card";
import { GetTransactionsSumBenchmark } from "@/transaction/components/get-sum-benchmark";
import { ListRecentTransactionsWithInfoBenchmark } from "@/transaction/components/list-recent-with-info-benchmark";

export const dynamic = "force-dynamic";

export default function Home() { 
  return (
    <>
      <Header />

      <main className="container mx-auto flex flex-1 flex-col gap-4 px-4">
        <div className="flex flex-wrap items-center gap-4">
          {(["singlestore", "mysql", "postgres"] as const).map((name) => (
            <Suspense
              key={name}
              fallback={<Skeleton className="h-[12.5rem] w-[14.375rem] grow md:grow-0" />}
            >
              <DbInfoCard
                key={name}
                className="grow md:grow-0"
                db={name}
              />
            </Suspense>
          ))}
        </div>
        <GetTransactionsSumBenchmark />
        <ListTopRecipientsBenchmark />
        <ListRecentTransactionsWithInfoBenchmark />
      </main>

      <Footer className="mt-8" />
    </>
  );
}
