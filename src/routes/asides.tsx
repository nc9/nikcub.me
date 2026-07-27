import { createFileRoute } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { Link } from "@/components/link"
import { PostList } from "@/components/post-list"
import { ASIDES } from "@/lib/posts"
import { seo } from "@/lib/seo"

export const Route = createFileRoute("/asides")({
  head: () =>
    seo({
      title: "Brief Notes on Tech & Security",
      description:
        "Quick observations on security developments, technology trends, digital privacy, and current events. Short-form writing from an engineer's perspective.",
      path: "/asides",
    }),
  component: AsidesPage,
})

function AsidesPage() {
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
        <h1 className="mt-6 text-3xl font-semibold text-foreground">Asides</h1>
        <p className="mt-2 text-muted-foreground">
          Brief notes and observations
        </p>
      </div>

      <PostList posts={ASIDES} showSections={false} />
    </div>
  )
}
