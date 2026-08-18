// Build-time generator for public/sitemap.xml + public/feed.xml. Reads the
// markdown content, mirrors the article/aside split (word-count threshold) and
// skips drafts. Run before `vite build` (see package.json build script).
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import matter from "gray-matter"
import readingTime from "reading-time"

const SITE_URL = "https://nikcub.me"
const WORD_COUNT_THRESHOLD = 150

interface Doc {
  slug: string
  title: string
  date: string
  /** Frontmatter `lastModified`, when the post has been revised. */
  lastModified: string
  excerpt: string
  type: "article" | "aside"
  draft: boolean
  /** Source path, for the git-date fallback. */
  file: string
}

function readDocs(dir: string, ext: string): Doc[] {
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith(ext))
    .map((f) => {
      const { data, content } = matter(readFileSync(join(dir, f), "utf-8"))
      const words = readingTime(content).words
      const type =
        (data.type as "article" | "aside" | undefined) ??
        (words < WORD_COUNT_THRESHOLD ? "aside" : "article")
      return {
        file: join(dir, f),
        slug: f.replace(new RegExp(`${ext}$`), ""),
        title: String(data.title ?? ""),
        date: data.date ? String(data.date) : "",
        lastModified: data.lastModified ? String(data.lastModified) : "",
        excerpt: String(data.excerpt ?? ""),
        type,
        draft: data.status === "draft",
      }
    })
}

const posts = readDocs("content/posts", ".md").filter((d) => !d.draft)
const pages = readDocs("content/pages", ".mdx").filter((d) => !d.draft)
const articles = posts
  .filter((p) => p.type === "article")
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

const today = new Date().toISOString().split("T")[0]
/** gray-matter turns unquoted YAML dates into Date objects, so frontmatter
 *  reaches us as either "2014-09-14T14:41:46+0000" or
 *  "Wed Oct 27 2010 20:20:57 GMT+1100". Normalise both to YYYY-MM-DD. */
const day = (d: string) => {
  if (!d) return ""
  const parsed = new Date(d)
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().split("T")[0]
}

/**
 * `lastmod` must agree with what the page itself reports. The post route
 * renders `dateModified: lastModified ?? date`, so the sitemap uses exactly the
 * same expression. Previously every URL was stamped with the build date, which
 * put the sitemap up to 5,589 days ahead of the page's own dateModified and
 * meant all 44 URLs shared one value that moved on every deploy — the field
 * carried no information at all.
 */
/** Last commit that touched a path, so undated pages still get a real date
 *  instead of the build day (which would move on every deploy). */
const gitDate = (path: string): string => {
  if (!existsSync(path)) return ""
  const out = new TextDecoder()
    .decode(Bun.spawnSync(["git", "log", "-1", "--format=%cs", "--", path]).stdout)
    .trim()
  return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : ""
}

const docLastmod = (d: Doc) =>
  day(d.lastModified) ||
  day(d.date) ||
  gitDate(d.file) ||
  today
const newest = (docs: Doc[]) =>
  docs.map(docLastmod).sort().at(-1) ?? today

// --- sitemap.xml ---
const asides = posts.filter((p) => p.type === "aside")
// Index pages change when their newest entry does.
const staticRoutes = [
  { url: "/", priority: "1.0", freq: "weekly", lastmod: newest(posts) },
  { url: "/posts", priority: "0.8", freq: "weekly", lastmod: newest(articles) },
  {
    url: "/subscribe",
    priority: "0.6",
    freq: "monthly",
    lastmod: gitDate("src/routes/subscribe.tsx") || today,
  },
]
const sitemapRows = [
  ...staticRoutes,
  // /asides is a real route but currently lists nothing (every post clears the
  // 150-word article threshold). An empty index page is not worth submitting,
  // so it only enters the sitemap once it has entries.
  ...(asides.length
    ? [
        {
          url: "/asides",
          priority: "0.7",
          freq: "weekly",
          lastmod: newest(asides),
        },
      ]
    : []),
  ...posts.map((p) => ({
    url: `/posts/${p.slug}`,
    priority: "0.6",
    freq: "monthly",
    lastmod: docLastmod(p),
  })),
  ...pages.map((p) => ({
    url: `/${p.slug}`,
    priority: "0.5",
    freq: "monthly",
    lastmod: docLastmod(p),
  })),
]
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRows
  .map(
    (r) => `  <url>
    <loc>${SITE_URL}${r.url}</loc>
    <lastmod>${r.lastmod}</lastmod>
    <changefreq>${r.freq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`

// --- feed.xml (articles only) ---
const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Nik Cubrilovic</title>
    <link>${SITE_URL}</link>
    <description>Writing on security, privacy, and the intersection of technology and society</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${articles
  .map((post) => {
    const url = `${SITE_URL}/posts/${post.slug}`
    const pubDate = post.date ? new Date(post.date).toUTCString() : ""
    return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
    </item>`
  })
  .join("\n")}
  </channel>
</rss>`

await Bun.write("public/sitemap.xml", sitemap)
await Bun.write("public/feed.xml", feed)
console.log(
  `feeds: sitemap ${sitemapRows.length} urls, rss ${articles.length} articles`,
)
