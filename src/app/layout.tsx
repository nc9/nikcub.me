import type React from "react";

import { Analytics } from "@vercel/analytics/next";
import { type Metadata } from "next";
import { Source_Serif_4, JetBrains_Mono } from "next/font/google";

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
  description:
    "Security researcher, technologist, and writer. Long-form articles and short observations on technology, privacy, and the web.",
  generator: "v0.app",
  icons: {
    apple: "/apple-icon.png",
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/icon-light-32x32.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/icon-dark-32x32.png",
      },
      {
        type: "image/svg+xml",
        url: "/icon.svg",
      },
    ],
  },
  title: "Nik Cubrilovic",
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
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
