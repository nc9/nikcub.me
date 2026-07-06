import { createFileRoute, notFound } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { Link } from "@/components/link"
import { getPageMeta, loadPage } from "@/lib/pages"
import { seo } from "@/lib/seo"

export const Route = createFileRoute("/$")({
  loader: async ({ params }) => {
    const page = await loadPage(params._splat ?? "")
    if (!page) throw notFound()
    return page
  },
  head: ({ params }) => {
    const meta = getPageMeta(params._splat ?? "")
    if (!meta) return {}
    return seo({
      title: meta.title,
      description:
        meta.excerpt || "Engineer writing about AI, data, and digital society",
      path: `/${meta.slug}`,
      image: meta.featureImage,
    })
  },
  component: PageView,
})

function PageView() {
  const page = Route.useLoaderData()

  return (
    <article className="mx-auto max-w-2xl px-6 py-12">
      <header className="mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
        <h1 className="mt-6 text-3xl font-semibold text-foreground">
          {page.title}
        </h1>
        {page.excerpt && (
          <p className="mt-4 text-lg text-muted-foreground">{page.excerpt}</p>
        )}
      </header>

      {page.featureImage && (
        <div className="mb-8 border-b border-border pb-8">
          <img
            src={page.featureImage}
            alt={page.featureImageAlt || page.title}
            className="w-full rounded-lg border border-border"
          />
        </div>
      )}

      {/* Content is trusted build-time HTML compiled from our own markdown. */}
      <div
        className="prose max-w-none"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted first-party markdown
        dangerouslySetInnerHTML={{ __html: page.html }}
      />
    </article>
  )
}
