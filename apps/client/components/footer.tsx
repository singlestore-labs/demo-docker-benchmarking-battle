import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export type FooterProps = ComponentProps<"footer">;

export function Footer({ className, ...props }: FooterProps) {
  return (
    <footer
      {...props}
      className={cn("border-t", className)}
    >
      <div className="container mx-auto flex items-center p-4">
        <Link
          href="https://github.com/singlestore-labs/docker-benchmarking-battle"
          target="_blank"
          className="text-muted-foreground hover:text-foreground text-sm hover:underline"
        >
          GitHub Repository
        </Link>
        <p className="text-muted-foreground ml-auto text-sm">© SingleStore, Inc.</p>
      </div>
    </footer>
  );
}
