import type { MetadataRoute } from "next";

import { getAllPageSlugs, getAllPosts } from "@/lib/mdx";

export default function sitemap(): MetadataRoute.Sitemap {
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nikcub.me";

	// Static routes
	const routes: MetadataRoute.Sitemap = [
		{
			url: siteUrl,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${siteUrl}/posts`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${siteUrl}/asides`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.7,
		},
		{
			url: `${siteUrl}/subscribe`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.6,
		},
	];

	// Add all posts
	const posts = getAllPosts();
	const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
		url: `${siteUrl}/posts/${post.slug}`,
		lastModified: new Date(post.frontmatter.date),
		changeFrequency: "monthly",
		priority: 0.6,
	}));

	// Add all pages
	const pageSlugs = getAllPageSlugs();
	const pageRoutes: MetadataRoute.Sitemap = pageSlugs.map((slug) => ({
		url: `${siteUrl}/${slug.join("/")}`,
		lastModified: new Date(),
		changeFrequency: "monthly",
		priority: 0.5,
	}));

	return [...routes, ...postRoutes, ...pageRoutes];
}
