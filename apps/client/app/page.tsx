import { BenchmarkCard } from "@/benchmark/components/card";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <>
      <Header />

      <main className="container mx-auto flex-1 px-4">
        <BenchmarkCard
          heading="Get user's 10 most recent transactions"
          description="Fetches the 10 latest transactions made by a specific user by joining accounts and transactions."
        />
      </main>

      <Footer />
    </>
  );
}
