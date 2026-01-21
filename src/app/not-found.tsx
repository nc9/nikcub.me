import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center">
        <div className="px-6 py-16 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            404
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Page not found
          </h1>
          <p className="mt-4 text-muted-foreground">
            The page you're looking for doesn't exist.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block text-sm text-primary transition-colors hover:text-primary/80"
          >
            Return home
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
