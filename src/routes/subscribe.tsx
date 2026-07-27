import { createFileRoute } from "@tanstack/react-router"
import { Mail, Rss } from "lucide-react"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { seo } from "@/lib/seo"

export const Route = createFileRoute("/subscribe")({
  head: () =>
    seo({
      title: "Subscribe to Updates & Newsletter",
      description:
        "Subscribe to get notified when new articles are published. Join via email newsletter or RSS feed for updates on technology, security, and engineering topics.",
      path: "/subscribe",
    }),
  component: SubscribePage,
})

function SubscribePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Subscribe
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Get notified when I publish new articles. No spam, unsubscribe
          anytime.
        </p>
      </header>

      <section className="mb-16">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <h2 className="font-medium text-foreground">Email Newsletter</h2>
        </div>
        <NewsletterSignup variant="inline" />
      </section>

      <section>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Rss className="h-5 w-5 text-primary" />
          </div>
          <h2 className="font-medium text-foreground">RSS Feed</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Prefer a reader? Subscribe to the{" "}
          <a
            href="/feed.xml"
            className="text-primary underline underline-offset-2 hover:text-primary/80"
          >
            RSS feed
          </a>{" "}
          for every new article.
        </p>
      </section>
    </div>
  )
}
