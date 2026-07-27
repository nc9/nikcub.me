/** Shape emitted by plugins/vite-content.ts for every content file. */
export interface ContentMeta {
  slug: string
  title: string
  date: string
  excerpt: string
  type: "article" | "aside"
  readingTime: number
  wordCount: number
  lastModified?: string
  status?: string
  featureImage?: string
  featureImageAlt?: string
  tags?: string[]
  summary?: string[]
}

export type ContentDoc = ContentMeta & { html: string }

/** Sort by ISO date, newest first. */
export function byDateDesc(a: ContentMeta, b: ContentMeta): number {
  return new Date(b.date).getTime() - new Date(a.date).getTime()
}

const isDev = import.meta.env.DEV

/** Drafts render in dev, hidden in production — matches the old Next behaviour. */
export function isVisible(meta: ContentMeta): boolean {
  return isDev || meta.status !== "draft"
}
