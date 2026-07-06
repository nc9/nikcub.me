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
  excerpt: string
  type: "article" | "aside"
  draft: boolean
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
        slug: f.replace(new RegExp(`${ext}$`), ""),
        title: String(data.title ?? ""),
        date: data.date ? String(data.date) : "",
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

// --- sitemap.xml ---
const staticRoutes = [
  { url: "/", priority: "1.0", freq: "weekly" },
  { url: "/posts", priority: "0.8", freq: "weekly" },
  { url: "/asides", priority: "0.7", freq: "weekly" },
  { url: "/subscribe", priority: "0.6", freq: "monthly" },
]
const sitemapRows = [
  ...staticRoutes,
  ...posts.map((p) => ({
    url: `/posts/${p.slug}`,
    priority: "0.6",
    freq: "monthly",
  })),
  ...pages.map((p) => ({
    url: `/${p.slug}`,
    priority: "0.5",
    freq: "monthly",
  })),
]
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRows
  .map(
    (r) => `  <url>
    <loc>${SITE_URL}${r.url}</loc>
    <lastmod>${today}</lastmod>
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
