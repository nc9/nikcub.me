import type { ContentDoc, ContentMeta } from "@/lib/content"

/**
 * Standalone pages from content/pages/*.mdx (about, contact, privacy, …), served
 * at the site root via the /$ catch-all route. Same eager-meta / lazy-body split
 * as posts.
 */

const metaModules = import.meta.glob<ContentMeta>("/content/pages/*.mdx", {
  query: "?meta",
  import: "default",
  eager: true,
})

const bodyModules = import.meta.glob<{ default: ContentDoc }>(
  "/content/pages/*.mdx",
)

export const PAGES: ContentMeta[] = Object.values(metaModules)

export function getPageMeta(slug: string): ContentMeta | undefined {
  return PAGES.find((p) => p.slug === slug)
}

export async function loadPage(slug: string): Promise<ContentDoc | null> {
  const load = bodyModules[`/content/pages/${slug}.mdx`]
  if (!load) return null
  return (await load()).default
}

export function pageSlugs(): string[] {
  return PAGES.map((p) => p.slug)
}
