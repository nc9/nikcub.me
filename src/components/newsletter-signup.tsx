"use client";

import type React from "react";

import { useState } from "react";

interface NewsletterSignupProps {
  variant?: "section" | "inline";
}

export function NewsletterSignup({
  variant = "section",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      return;
    }

    setStatus("loading");
    // Simulate API call - replace with actual newsletter API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("success");
    setEmail("");
  };

  if (variant === "inline") {
    return (
      <div>
        {status === "success" ? (
          <p className="text-sm text-primary">
            Thanks for subscribing. Check your inbox to confirm.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="email-inline" className="sr-only">
              Email address
            </label>
            <input
              id="email-inline"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              aria-describedby={
                status === "error" ? "email-error-inline" : undefined
              }
              className="h-11 flex-1 rounded-sm border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="h-11 rounded-sm bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          I'll only email you when I publish something new. Unsubscribe anytime.
        </p>
      </div>
    );
  }

  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="text-center">
          <h3 className="font-serif text-xl text-foreground">
            Subscribe to the newsletter
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Occasional updates on security research, tech, and long-form
            writing. No spam.
          </p>
        </div>

        {status === "success" ? (
          <p className="mt-6 text-center text-sm text-primary">
            Thanks for subscribing. Check your inbox to confirm.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <label htmlFor="email-section" className="sr-only">
              Email address
            </label>
            <input
              id="email-section"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              aria-describedby={
                status === "error" ? "email-error-section" : undefined
              }
              className="h-10 rounded-sm border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 sm:w-64"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="h-10 rounded-sm bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
