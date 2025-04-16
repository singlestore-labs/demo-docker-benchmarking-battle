import { ListAccountAvgTransactionsAmountsBenchmark } from "@/account/benchmark/list-avg-transactions-amount";
import { ListTopRecipientsBenchmark } from "@/account/benchmark/list-top-recipients";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { GetTransactionsSumBenchmark } from "@/transaction/components/get-sum-benchmark";

export default function Home() {
  return (
    <>
      <Header />

      <main className="container mx-auto flex flex-1 flex-col gap-4 px-4">
        <GetTransactionsSumBenchmark />
        <ListTopRecipientsBenchmark />
        <ListAccountAvgTransactionsAmountsBenchmark />
      </main>

      <Footer className="mt-8" />
    </>
  );
}
