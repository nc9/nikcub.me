export const siteConfig = {
  name: "Nik Cubrilovic",
  title:
    "Nik Cubrilovic | Engineer writing about AI, data, and digital society",
  description:
    "Engineer writing about AI, data engineering, and digital society. Long-form articles and observations on technology's impact on our world.",
  url: "https://nikcub.me",
  ogImage: "/og-default.png",
  author: "Nik Cubrilovic",
  twitter: "@nikcub",
  social: {
    twitter: "https://twitter.com/dir",
    github: "https://github.com/nc9",
    email: "mailto:nik@nikcub.me",
  },
} as const

export type SiteConfig = typeof siteConfig
