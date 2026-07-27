import type { ContentMeta } from "@/lib/content"
import { ARTICLES, ASIDES, getPostMeta } from "@/lib/posts"
import { siteConfig } from "@/lib/site"
import { SITE_URL } from "@/lib/utils"

/**
 * Agent Experience surface: Markdown representations of the site for AI agents
 * (squirrelscan ax/markdown-response + ax/llms-txt).
 *
 *   /llms.txt            curated Markdown map of the site
 *   /llms-full.txt       the map + every article's full Markdown body
 *   /index.md            Markdown variant of the homepage
 *   /posts/<slug>.md     Markdown variant of a post
 *   Accept: text/markdown on `/` and `/posts/<slug>` negotiates the same docs.
 *
 * Handled in src/server-entry.ts before the TanStack handler. Draft posts are
 * excluded the same way as HTML (lib/posts filters by isVisible).
 */

const markdownModules = import.meta.glob<string>("/content/posts/*.md", {
  query: "?markdown",
  import: "default",
})

const POST_MD_RE = /^\/posts\/([\w-]+)\.md$/
const POST_HTML_RE = /^\/posts\/[\w-]+$/

async function loadPostMarkdown(slug: string): Promise<string | null> {
  // getPostMeta includes drafts, matching the HTML route: a direct URL serves them.
  if (!getPostMeta(slug)) return null
  const load = markdownModules[`/content/posts/${slug}.md`]
  return load ? await load() : null
}

function isoDate(date: string): string {
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime())
    ? date
    : parsed.toISOString().slice(0, 10)
}

function postLine(p: ContentMeta): string {
  const excerpt = p.excerpt ? `: ${p.excerpt}` : ""
  return `- [${p.title}](${SITE_URL}/posts/${p.slug}.md) (${isoDate(p.date)})${excerpt}`
}

function llmsTxt(): string {
  return [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    `Personal site of ${siteConfig.author} (${siteConfig.social.github}).`,
    "Every post is available as Markdown: append `.md` to a post URL, or send",
    "`Accept: text/markdown` to the canonical URL.",
    "",
    "## Articles",
    "",
    ...ARTICLES.map(postLine),
    "",
    "## Asides",
    "",
    ...ASIDES.map(postLine),
    "",
    "## Pages",
    "",
    `- [About](${SITE_URL}/about)`,
    `- [Contact](${SITE_URL}/contact)`,
    "",
    "## Optional",
    "",
    `- [Full content](${SITE_URL}/llms-full.txt): this file plus the complete Markdown body of every article`,
    "",
  ].join("\n")
}

async function llmsFullTxt(): Promise<string> {
  const bodies = await Promise.all(ARTICLES.map((p) => loadPostMarkdown(p.slug)))
  const divider = "\n\n---\n\n"
  return llmsTxt() + divider + bodies.filter(Boolean).join(divider)
}

function homeMarkdown(): string {
  return [
    `# ${siteConfig.name}`,
    "",
    siteConfig.description,
    "",
    "## Articles",
    "",
    ...ARTICLES.map(postLine),
    "",
    "## Asides",
    "",
    ...ASIDES.map(postLine),
    "",
  ].join("\n")
}

/** Paths whose HTML responses must carry `Vary: Accept` (they negotiate). */
export function isNegotiatedPath(pathname: string): boolean {
  return pathname === "/" || POST_HTML_RE.test(pathname)
}

function markdownResponse(
  body: string,
  { status = 200, head = false, vary = false } = {},
): Response {
  const headers = new Headers({
    "Content-Type": "text/markdown; charset=utf-8",
    "Cache-Control": "public, max-age=300",
  })
  if (vary) headers.set("Vary", "Accept")
  return new Response(head ? null : body, { status, headers })
}

/** Explicit `text/markdown` in Accept, honouring `;q=0` as a refusal. */
function acceptsMarkdown(accept: string | null): boolean {
  if (!accept) return false
  return accept.split(",").some((part) => {
    const [range, ...params] = part.trim().split(";")
    if (range.trim().toLowerCase() !== "text/markdown") return false
    const q = params
      .map((p) => p.trim().toLowerCase())
      .find((p) => p.startsWith("q="))
    return !q || Number.parseFloat(q.slice(2)) > 0
  })
}

/**
 * Serve a Markdown representation when the request asks for one, else null so
 * the caller falls through to the TanStack HTML handler.
 */
export async function handleAgentMarkdown(
  request: Request,
  url: URL,
): Promise<Response | null> {
  if (request.method !== "GET" && request.method !== "HEAD") return null
  const head = request.method === "HEAD"
  const { pathname } = url

  if (pathname === "/llms.txt") return markdownResponse(llmsTxt(), { head })
  if (pathname === "/llms-full.txt") {
    return markdownResponse(await llmsFullTxt(), { head })
  }
  if (pathname === "/index.md") return markdownResponse(homeMarkdown(), { head })

  const mdMatch = pathname.match(POST_MD_RE)
  if (mdMatch) {
    const md = await loadPostMarkdown(mdMatch[1])
    if (!md) {
      return markdownResponse("# 404\n\nNo such post.\n", { status: 404, head })
    }
    return markdownResponse(md, { head })
  }

  // Content negotiation on canonical URLs. Only an explicit text/markdown in
  // Accept opts in — browsers' */* keeps getting HTML.
  const wantsMarkdown = acceptsMarkdown(request.headers.get("accept"))
  if (!wantsMarkdown || !isNegotiatedPath(pathname)) return null

  if (pathname === "/") {
    return markdownResponse(homeMarkdown(), { head, vary: true })
  }
  const slug = pathname.slice("/posts/".length)
  const md = await loadPostMarkdown(slug)
  // Unknown slug: fall through so TanStack renders its 404.
  return md ? markdownResponse(md, { head, vary: true }) : null
}
