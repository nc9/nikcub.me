import { createFileRoute, notFound } from "@tanstack/react-router"
import { Calendar, Clock } from "lucide-react"
import { PostContent } from "@/components/post-content"
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
      // Drafts are reachable by direct URL only — keep crawlers from widening that.
      meta: [
        ...(base.meta ?? []),
        ...(meta.status === "draft"
          ? [{ name: "robots", content: "noindex, nofollow" }]
          : []),
      ],
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
    <article className="mx-auto max-w-4xl px-6 py-12">
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
          {post.status === "draft" && (
            <>
              <span className="text-border">·</span>
              <span className="rounded bg-amber-500/15 px-2 py-0.5 text-xs font-medium uppercase text-amber-600 dark:text-amber-400">
                Draft
              </span>
            </>
          )}
        </div>
        {post.excerpt && post.type === "article" && (
          <p className="text-lg text-muted-foreground">{post.excerpt}</p>
        )}
        {post.summary && post.summary.length > 0 && (
          <aside
            aria-label="Article summary"
            className="mt-6 rounded-lg border border-border bg-card/50 p-5"
          >
            <h2 className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Summary
            </h2>
            <ul className="space-y-2">
              {post.summary.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-[0.95rem] leading-relaxed text-foreground/90"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </aside>
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
      <PostContent html={post.html} className="prose max-w-none" />
    </article>
  )
}
