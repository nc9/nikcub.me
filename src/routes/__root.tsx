import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router"
import type { ReactNode } from "react"
import { Link } from "@/components/link"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { siteConfig } from "@/lib/site"
import appCss from "../global.css?url"

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      publisher: { "@id": `${siteConfig.url}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: siteConfig.name,
      url: siteConfig.url,
      image: `${siteConfig.url}/avatar.webp`,
      sameAs: [
        "https://twitter.com/dir",
        "https://github.com/nc9",
        "https://en.wikipedia.org/wiki/Nik_Cubrilovic",
      ],
      jobTitle: "Engineer",
      description: siteConfig.description,
    },
  ],
}

// No-flash dark mode: honour a stored preference, else the OS setting. Runs
// before paint so the correct theme is applied without a flicker.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme:dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: siteConfig.title },
      { name: "description", content: siteConfig.description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:site_name", content: siteConfig.name },
      { property: "og:image", content: `${siteConfig.url}/og-default.png` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:creator", content: siteConfig.twitter },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { rel: "icon", href: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preload", href: "/avatar.webp", as: "image", type: "image/webp" },
    ],
    scripts: [
      { children: themeScript },
      { type: "application/ld+json", children: JSON.stringify(jsonLd) },
    ],
  }),
  shellComponent: RootShell,
  notFoundComponent: NotFound,
})

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-foreground focus:text-background focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to content
        </a>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main id="main-content" className="flex-1">
            {children ?? <Outlet />}
          </main>
          <SiteFooter />
        </div>
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24 text-center">
      <p className="text-6xl font-semibold text-highlight">404</p>
      <h1 className="mt-4 mb-3 text-3xl font-semibold text-foreground">
        Page not found
      </h1>
      <p className="mb-8 text-muted-foreground">
        That page doesn't exist. Let's get you back home.
      </p>
      <Link
        href="/"
        className="inline-flex items-center rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        Back to home
      </Link>
    </div>
  )
}
