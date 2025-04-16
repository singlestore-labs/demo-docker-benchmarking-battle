import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { GetUserTransactionsBenchmark } from "@/user/transaction/components/get-benchmark";

export default function Home() {
  return (
    <>
      <Header />

      <main className="container mx-auto flex-1 px-4">
        <GetUserTransactionsBenchmark />
      </main>

      <Footer />
    </>
  );
}
