import {
  byDateDesc,
  type ContentDoc,
  type ContentMeta,
  isVisible,
} from "@/lib/content"

/**
 * Blog posts from content/posts/*.md. Frontmatter index (`?meta`) is eager and
 * small — it drives every listing. Full bodies load lazily per slug so a post's
 * HTML only ships when that post is viewed.
 */

const metaModules = import.meta.glob<ContentMeta>("/content/posts/*.md", {
  query: "?meta",
  import: "default",
  eager: true,
})

const bodyModules = import.meta.glob<{ default: ContentDoc }>(
  "/content/posts/*.md",
)

const ALL_POSTS: ContentMeta[] = Object.values(metaModules)

/** Listings, feeds and sitemap: visible posts only — drafts never appear here. */
export const POSTS: ContentMeta[] = ALL_POSTS.filter(isVisible).sort(byDateDesc)

export const ARTICLES = POSTS.filter((p) => p.type === "article")
export const ASIDES = POSTS.filter((p) => p.type === "aside")

/** Includes drafts: a direct URL is the sharing mechanism for a draft. */
export function getPostMeta(slug: string): ContentMeta | undefined {
  return ALL_POSTS.find((p) => p.slug === slug)
}

/**
 * Drafts DO load here: knowing the URL is the access control (they carry
 * noindex and appear in no listing, feed or sitemap).
 */
export async function loadPost(slug: string): Promise<ContentDoc | null> {
  const load = bodyModules[`/content/posts/${slug}.md`]
  if (!load) return null
  const mod = await load()
  return mod.default
}

export function postSlugs(): string[] {
  return POSTS.map((p) => p.slug)
}
