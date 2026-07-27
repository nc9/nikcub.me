import { createFileRoute } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"
import { Link } from "@/components/link"
import { PostList } from "@/components/post-list"
import { ARTICLES, ASIDES } from "@/lib/posts"
import { seo } from "@/lib/seo"

export const Route = createFileRoute("/")({
  head: () =>
    seo({
      title: "Nik Cubrilovic | AI, Data Engineering & Tech",
      description:
        "Engineer writing about AI, data engineering, and tech. Long-form articles and observations on technology.",
      path: "/",
    }),
  component: HomePage,
})

function HomePage() {
  const latestArticles = ARTICLES.slice(0, 5)
  const latestAsides = ASIDES.slice(0, 5)

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-16">
        <h1 className="sr-only">Nik Cubrilovic - Engineer</h1>
        <p className="text-lg leading-relaxed text-foreground">
          I write about AI, data engineering, and tech. Building systems,
          exploring ideas, and writing down what I learn along the way.
        </p>
        <Link
          href="/about"
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-highlight"
        >
          Read more about me
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {latestArticles.length > 0 && (
        <section className="mb-16">
          <div className="mb-8 flex items-center gap-4">
            <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Latest Articles
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <PostList posts={latestArticles} showSections={false} />
          <Link
            href="/posts"
            className="mt-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-highlight"
          >
            View all articles
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>
      )}

      {latestAsides.length > 0 && (
        <section>
          <div className="mb-8 flex items-center gap-4">
            <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Latest Asides
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <PostList posts={latestAsides} showSections={false} />
          <Link
            href="/asides"
            className="mt-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-highlight"
          >
            View all asides
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>
      )}
    </div>
  )
}
