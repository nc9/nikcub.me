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

export const POSTS: ContentMeta[] = Object.values(metaModules)
  .filter(isVisible)
  .sort(byDateDesc)

export const ARTICLES = POSTS.filter((p) => p.type === "article")
export const ASIDES = POSTS.filter((p) => p.type === "aside")

export function getPostMeta(slug: string): ContentMeta | undefined {
  return POSTS.find((p) => p.slug === slug)
}

export async function loadPost(slug: string): Promise<ContentDoc | null> {
  const load = bodyModules[`/content/posts/${slug}.md`]
  if (!load) return null
  const mod = await load()
  return isVisible(mod.default) ? mod.default : null
}

export function postSlugs(): string[] {
  return POSTS.map((p) => p.slug)
}
