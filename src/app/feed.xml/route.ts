import { getAllPosts } from "@/lib/mdx";

export async function GET() {
  const posts = getAllPosts();
  const articles = posts.filter((p) => p.type === "article");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nikcub.me";

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Nik Cubrilovic</title>
    <link>${siteUrl}</link>
    <description>Writing on security, privacy, and the intersection of technology and society</description>
    <language>en</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${articles
      .map((post) => {
        const postUrl = `${siteUrl}/posts/${post.slug}`;
        const pubDate = new Date(post.frontmatter.date).toUTCString();

        return `
    <item>
      <title><![CDATA[${post.frontmatter.title}]]></title>
      <link>${postUrl}</link>
      <guid>${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.frontmatter.excerpt || ""}]]></description>
    </item>`;
      })
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
