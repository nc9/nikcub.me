import { createFileRoute } from "@tanstack/react-router"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { Link } from "@/components/link"
import { PostList } from "@/components/post-list"
import { ARTICLES } from "@/lib/posts"
import { seo } from "@/lib/seo"

const PER_PAGE = 10

type PostsSearch = { page?: number }

export const Route = createFileRoute("/posts/")({
  validateSearch: (search: Record<string, unknown>): PostsSearch => {
    const page = Math.max(1, Number(search.page) || 1)
    // Omit page=1 so the bare /posts URL doesn't redirect to /posts?page=1.
    return page > 1 ? { page } : {}
  },
  head: () =>
    seo({
      title: "Articles & Blog Posts",
      description:
        "Explore in-depth articles and blog posts on security research, privacy investigations, and technology analysis. Long-form writing from an engineer's perspective.",
      path: "/posts",
    }),
  component: PostsPage,
})

function PostsPage() {
  const { page = 1 } = Route.useSearch()
  const totalPages = Math.ceil(ARTICLES.length / PER_PAGE)
  const current = Math.min(page, totalPages || 1)
  const start = (current - 1) * PER_PAGE
  const paginated = ARTICLES.slice(start, start + PER_PAGE)

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
        <h1 className="mt-6 text-3xl font-semibold text-foreground">Articles</h1>
        <p className="mt-2 text-muted-foreground">
          Long-form writing on security, privacy, and technology
        </p>
      </div>

      <PostList posts={paginated} showSections={false} />

      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-between border-t border-border pt-8">
          <div className="text-sm text-muted-foreground">
            Page {current} of {totalPages}
          </div>
          <div className="flex gap-2">
            {current > 1 && (
              <Link
                href={`/posts?page=${current - 1}`}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Link>
            )}
            {current < totalPages && (
              <Link
                href={`/posts?page=${current + 1}`}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
