import type { Metadata } from "next";
import type React from "react";

import { Analytics } from "@vercel/analytics/next";
import { JetBrains_Mono, Source_Serif_4 } from "next/font/google";

import "./globals.css";

const sourceSerif = Source_Serif_4({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-serif",
});

const jetbrainsMono = JetBrains_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nikcub.me"),
  title: {
    default:
      "Nik Cubrilovic | Engineer writing about AI, data, and digital society",
    template: "%s | Nik Cubrilovic",
  },
  description:
    "Engineer writing about AI, data engineering, and digital society. Long-form articles and observations on technology's impact on our world.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nikcub.me",
    siteName: "Nik Cubrilovic",
    images: ["/og-default.png"],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@nikcub",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        url: "/favicon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/favicon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://nikcub.me/#website",
      url: "https://nikcub.me",
      name: "Nik Cubrilovic",
      description:
        "Engineer writing about AI, data engineering, and digital society",
      publisher: { "@id": "https://nikcub.me/#person" },
    },
    {
      "@type": "Person",
      "@id": "https://nikcub.me/#person",
      name: "Nik Cubrilovic",
      url: "https://nikcub.me",
      image: "https://nikcub.me/avatar.webp",
      sameAs: [
        "https://twitter.com/dir",
        "https://github.com/nc9",
        "https://en.wikipedia.org/wiki/Nik_Cubrilovic",
      ],
      jobTitle: "Engineer",
      description:
        "Engineer writing about AI, data engineering, and digital society",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="preload" href="/avatar.webp" as="image" type="image/webp" />
        <script
          type="application/ld+json"
          /* Safe: jsonLd is a static object defined in source code, not user input */
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-foreground focus:text-background focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
