import { createFileRoute, notFound } from "@tanstack/react-router"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import { Link } from "@/components/link"
import { getPostMeta, loadPost } from "@/lib/posts"
import { seo } from "@/lib/seo"
import { siteConfig } from "@/lib/site"
import { SITE_URL } from "@/lib/utils"
import { formatDate } from "@/lib/utils"

export const Route = createFileRoute("/posts/$slug")({
  loader: async ({ params }) => {
    const post = await loadPost(params.slug)
    if (!post) throw notFound()
    return post
  },
  head: ({ params }) => {
    const meta = getPostMeta(params.slug)
    if (!meta) return {}
    const base = seo({
      title: meta.title,
      description: meta.excerpt || "Security research and technology analysis",
      path: `/posts/${meta.slug}`,
      image: meta.featureImage,
      type: "article",
      publishedTime: meta.date,
    })
    const articleLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: meta.title,
      description: meta.excerpt,
      url: `${SITE_URL}/posts/${meta.slug}`,
      datePublished: meta.date,
      dateModified: meta.lastModified ?? meta.date,
      image: meta.featureImage
        ? `${SITE_URL}${meta.featureImage}`
        : `${SITE_URL}/og-default.png`,
      author: {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: siteConfig.author,
        url: SITE_URL,
      },
      publisher: {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: siteConfig.author,
        image: `${SITE_URL}/avatar.webp`,
      },
      mainEntityOfPage: `${SITE_URL}/posts/${meta.slug}`,
    }
    return {
      ...base,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(articleLd) },
      ],
    }
  },
  component: PostPage,
})

function PostPage() {
  const post = Route.useLoaderData()

  return (
    <article className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8">
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to writing
        </Link>
      </div>

      <header className="mb-12">
        <h1 className="mb-4 text-3xl font-semibold text-foreground">
          {post.title}
        </h1>
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground/80">
            {siteConfig.author}
          </span>
          <span className="text-border">·</span>
          <time dateTime={post.date} className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.date)}
          </time>
          {post.readingTime > 0 && (
            <>
              <span className="text-border">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {post.readingTime} min read
              </span>
            </>
          )}
          {post.type === "aside" && (
            <>
              <span className="text-border">·</span>
              <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium uppercase">
                Aside
              </span>
            </>
          )}
        </div>
        {post.excerpt && post.type === "article" && (
          <p className="text-lg text-muted-foreground">{post.excerpt}</p>
        )}
      </header>

      {post.featureImage && (
        <figure className="mb-8 border-b border-border pb-8">
          <img
            src={post.featureImage}
            alt={post.featureImageAlt || post.title}
            className="w-full rounded-lg border border-border"
          />
          {post.featureImageAlt && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {post.featureImageAlt}
            </figcaption>
          )}
        </figure>
      )}

      {/* Content is trusted build-time HTML compiled from our own markdown. */}
      <div
        className="prose max-w-none"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted first-party markdown
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </article>
  )
}
