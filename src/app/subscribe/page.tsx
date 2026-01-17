import { Rss, Mail } from "lucide-react";

import { NewsletterSignup } from "@/components/newsletter-signup";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "Subscribe",
  description:
    "Get notified when I publish new articles. Subscribe via email newsletter or RSS feed. No spam, unsubscribe anytime.",
  path: "/subscribe",
});

export default function SubscribePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Subscribe
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Get notified when I publish new articles. No spam, unsubscribe
              anytime.
            </p>
          </header>

          {/* Email Newsletter */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-medium text-foreground">
                  Email Newsletter
                </h2>
                <p className="text-sm text-muted-foreground">
                  New posts delivered to your inbox
                </p>
              </div>
            </div>
            <div className="rounded-sm border border-border bg-card p-6">
              <NewsletterSignup variant="inline" />
            </div>
          </section>

          {/* RSS Feed */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Rss className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-medium text-foreground">RSS Feed</h2>
                <p className="text-sm text-muted-foreground">
                  For readers who prefer RSS
                </p>
              </div>
            </div>
            <div className="rounded-sm border border-border bg-card p-6">
              <p className="mb-4 text-sm text-muted-foreground">
                Add this URL to your favorite feed reader to get updates:
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <code className="flex-1 rounded-sm bg-muted px-4 py-3 font-mono text-sm text-foreground">
                  https://nikcub.me/feed.xml
                </code>
                <a
                  href="/feed.xml"
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-foreground px-4 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
                >
                  <Rss className="h-4 w-4" />
                  Open Feed
                </a>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href="https://feedly.com/i/subscription/feed%2Fhttps%3A%2F%2Fnikcub.me%2Ffeed.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Add to Feedly →
                </a>
                <span className="text-border">·</span>
                <a
                  href="https://www.inoreader.com/search/feeds/https%3A%2F%2Fnikcub.me%2Ffeed.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Add to Inoreader →
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
