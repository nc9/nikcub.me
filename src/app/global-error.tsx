"use client";

import { Source_Serif_4, JetBrains_Mono } from "next/font/google";

const sourceSerif = Source_Serif_4({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-serif",
});

const jetbrainsMono = JetBrains_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased bg-background text-foreground">
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Error
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
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
              <a
                href="/"
                className="text-sm text-primary transition-colors hover:text-primary/80"
              >
                Return home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
