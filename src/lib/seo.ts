import { siteConfig } from "@/lib/site"
import { SITE_URL } from "@/lib/utils"

/**
 * Build a TanStack `head()` meta + links payload. Keeps titles, descriptions,
 * canonical and Open Graph consistent across every route. Titles get the
 * "| Nik Cubrilovic" suffix unless they already carry the brand.
 */
export function seo({
  title,
  description,
  path = "/",
  image,
  type = "website",
  publishedTime,
}: {
  title: string
  description: string
  path?: string
  image?: string
  type?: "website" | "article"
  publishedTime?: string
}) {
  const fullTitle = title.includes(siteConfig.name)
    ? title
    : `${title} | ${siteConfig.name}`
  const url = `${SITE_URL}${path}`
  const rawImg = image ?? siteConfig.ogImage
  const img = rawImg.startsWith("http") ? rawImg : `${SITE_URL}${rawImg}`

  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:type", content: type },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: img },
      { property: "og:site_name", content: siteConfig.name },
      ...(publishedTime
        ? [{ property: "article:published_time", content: publishedTime }]
        : []),
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:creator", content: siteConfig.twitter },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: img },
    ],
    links: [{ rel: "canonical", href: url }],
  }
}
