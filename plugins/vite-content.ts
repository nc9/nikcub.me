import matter from "gray-matter"
import readingTime from "reading-time"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeRaw from "rehype-raw"
import rehypeSlug from "rehype-slug"
import rehypeStringify from "rehype-stringify"
import remarkGfm from "remark-gfm"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"
import type { Plugin } from "vite"

/**
 * Compiles content/{posts,pages}/*.{md,mdx} to a JS module. The old nikcub blog
 * markdown contains raw HTML and `<`/`{` characters that break MDX/JSX, so we
 * render to an HTML string via a remark→rehype pipeline (rehype-raw preserves
 * embedded HTML; rehype-pretty-code/Shiki highlights fenced code at build time)
 * instead of compiling to React components. The HTML lands in per-file lazy
 * chunks, keeping post bodies out of the listing bundles.
 *
 * Three import flavours (selected by query):
 *   `?meta`     → `export default <PostMeta>` (frontmatter + derived, no html).
 *                 Used eagerly by listing pages — small.
 *   `?markdown` → `export default <string>`: a clean agent-facing Markdown doc
 *                 (title/byline header + body, comments and diagram markers
 *                 stripped). Served via content negotiation and `.md` URLs.
 *   default     → `export default { ...meta, html }`. Loaded lazily per post.
 */

const CONTENT_RE = /\/content\/(?:posts|pages)\/[^/]+\.m(?:d|dx)$/
const WORD_COUNT_THRESHOLD = 150

// One shared processor. rehype-pretty-code is async, so process() is async.
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSlug)
  .use(rehypePrettyCode, { theme: "github-dark", keepBackground: true })
  .use(rehypeStringify, { allowDangerousHtml: true })

// Rewrite legacy asset references (`../assets/foo.jpg`) to the public path.
function rewriteAssets(text: string): string {
  return text.replace(/\.\.\/assets\//g, "/images/posts/")
}

interface Meta {
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

function buildMeta(slug: string, raw: string): Meta {
  const { data, content } = matter(raw)
  const body = rewriteAssets(content)
  const stats = readingTime(body)
  const explicitType = data.type as "article" | "aside" | undefined
  const type =
    explicitType ??
    (stats.words < WORD_COUNT_THRESHOLD ? "aside" : "article")
  const featureImage = data.featureImage
    ? rewriteAssets(String(data.featureImage))
    : undefined
  return {
    slug,
    title: String(data.title ?? slug),
    date: data.date ? String(data.date) : "",
    excerpt: String(data.excerpt ?? ""),
    type,
    readingTime: Math.ceil(stats.minutes),
    wordCount: stats.words,
    lastModified: data.lastModified ? String(data.lastModified) : undefined,
    status: data.status ? String(data.status) : undefined,
    featureImage,
    featureImageAlt: data.featureImageAlt
      ? String(data.featureImageAlt)
      : undefined,
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : undefined,
    summary: Array.isArray(data.summary)
      ? (data.summary as unknown[]).map(String)
      : undefined,
  }
}

/**
 * Agent-facing Markdown: the post body as authored, minus HTML comments
 * (drafting notes) and diagram markers (client-only React), with a plain
 * title/byline header instead of YAML frontmatter.
 */
function buildMarkdown(slug: string, raw: string): string {
  const { data, content } = matter(raw)
  const title = String(data.title ?? slug)
  const parsedDate = data.date ? new Date(String(data.date)) : null
  const date =
    parsedDate && !Number.isNaN(parsedDate.getTime())
      ? parsedDate.toISOString().slice(0, 10)
      : ""
  const body = rewriteAssets(content)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(
      /<div data-diagram="([\w-]+)"><\/div>/g,
      "> *[Interactive diagram “$1” — rendered on the web version of this post.]*",
    )
    .replace(/\n{3,}/g, "\n\n")
    .trim()
  const header = date ? `# ${title}\n\n*${date}*` : `# ${title}`
  return `${header}\n\n${body}\n`
}

async function buildHtml(raw: string): Promise<string> {
  const { content } = matter(raw)
  const file = await processor.process(rewriteAssets(content))
  return String(file)
}

export function markdownContent(): Plugin {
  return {
    name: "nikcub:markdown-content",
    enforce: "pre",
    async transform(code, id) {
      const [path, query] = id.split("?")
      if (!CONTENT_RE.test(path)) return null

      const slug = path.split("/").pop()?.replace(/\.mdx?$/, "") ?? path
      const meta = buildMeta(slug, code)

      if (query === "meta") {
        return {
          code: `export default ${JSON.stringify(meta)}`,
          map: null,
        }
      }

      if (query === "markdown") {
        return {
          code: `export default ${JSON.stringify(buildMarkdown(slug, code))}`,
          map: null,
        }
      }

      const html = await buildHtml(code)
      return {
        code: `export default ${JSON.stringify({ ...meta, html })}`,
        map: null,
      }
    },
  }
}
