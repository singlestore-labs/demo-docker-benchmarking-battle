import Link from "next/link";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Logo from "@/public/logo.svg";

export type HeaderProps = ComponentProps<"header">;

export function Header({ className, ...props }: HeaderProps) {
  return (
    <header
      {...props}
      className={cn("container mx-auto flex items-center justify-between px-4 py-8", className)}
    >
      <div className="flex flex-wrap items-center gap-4">
        <span className="flex w-40 shrink-0 items-center justify-center">
          <Logo className="w-full shrink-0 [&_[fill]]:fill-current [&_[stroke]]:stroke-current" />
        </span>
        <span className="bg-border h-8 w-px" />
        <h1 className="text-xl">Docker Benchmarking Battle</h1>
      </div>

      <Button asChild>
        <Link
          href="https://portal.singlestore.com/intention/cloud?utm_source=yaroslav&utm_medium=app&utm_campaign=general-technical&utm_content=database-benchmark-mysql-vs-postgresql-vs-singlestore-performance-in-docker-100m-records"
          target="_blank"
        >
          Try SingleStore Free
        </Link>
      </Button>
    </header>
  );
}
