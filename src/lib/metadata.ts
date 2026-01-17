import type { Metadata } from "next";

interface PageMetadataConfig {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}

const SITE_NAME = "Nik Cubrilovic";
const SITE_URL = "https://nikcub.me";
const DEFAULT_OG_IMAGE = "/og-default.png";

/**
 * Ensure title meets minimum length (30 chars) by appending site name suffix
 */
export function ensureMinTitle(title: string, minLength = 30): string {
  if (title.length >= minLength) return title;
  return `${title} | ${SITE_NAME}`;
}

/**
 * Generate complete metadata object for pages with SEO best practices
 */
export function generatePageMetadata(config: PageMetadataConfig): Metadata {
  const fullTitle = ensureMinTitle(config.title);
  const canonicalUrl = `${SITE_URL}${config.path}`;
  const ogImage = config.image || DEFAULT_OG_IMAGE;

  return {
    title: fullTitle,
    description: config.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: config.type || "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: [ogImage],
      creator: "@nikcub",
    },
  };
}
