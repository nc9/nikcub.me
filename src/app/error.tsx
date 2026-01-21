"use client";

import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center">
        <div className="px-6 py-16 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Error
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Something went wrong
          </h1>
          <p className="mt-4 text-muted-foreground">
            An unexpected error occurred.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={reset}
              type="button"
              className="text-sm text-primary transition-colors hover:text-primary/80"
            >
              Try again
            </button>
            <span className="text-muted-foreground">·</span>
            <Link
              href="/"
              className="text-sm text-primary transition-colors hover:text-primary/80"
            >
              Return home
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
