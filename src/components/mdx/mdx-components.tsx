import type { MDXComponents } from "mdx/types";

import Image from "next/image";
import Link from "next/link";

import { FootnoteContent, FootnoteRef } from "./footnote";

export const mdxComponents: MDXComponents = {
  // Custom image component with Next.js optimization
  img: ({ src, alt, ...props }) => {
    if (!src) return null;

    // External images
    if (src.startsWith("http")) {
      return (
        <figure className="my-8">
          <img
            src={src}
            alt={alt || ""}
            {...props}
            loading="lazy"
            className="w-full rounded-lg border-2 border-gray-200"
          />
          {alt && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {alt}
            </figcaption>
          )}
        </figure>
      );
    }

    // Local images - use Next.js Image
    return (
      <figure className="my-8">
        <Image
          src={src}
          alt={alt || ""}
          width={800}
          height={600}
          className="w-full rounded-lg border-2 border-gray-200"
          {...props}
        />
        {alt && (
          <figcaption className="mt-2 text-center text-sm text-muted-foreground">
            {alt}
          </figcaption>
        )}
      </figure>
    );
  },

  // Style links
  a: ({ href, children, ...props }) => {
    if (!href) return <a {...props}>{children}</a>;

    // Handle GFM footnote backref links: fix WCAG 2.5.3 (Label in Name) by ensuring
    // the aria-label contains the visible ↩ character so the accessible name matches.
    const isFootnoteBackref =
      (props as Record<string, unknown>)["data-footnote-backref"] !== undefined;
    if (isFootnoteBackref) {
      const existingLabel = props["aria-label"] as string | undefined;
      const accessibleLabel = existingLabel ? `↩ ${existingLabel}` : undefined;
      return (
        <a href={href} {...props} aria-label={accessibleLabel}>
          {children}
        </a>
      );
    }

    // External links
    if (href.startsWith("http")) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 decoration-purple-400/40 underline decoration-dashed underline-offset-4 hover:text-purple-700 hover:decoration-purple-600/60"
          {...props}
        >
          {children}
        </a>
      );
    }

    // Internal links
    return (
      <Link
        href={href}
        className="text-gray-700 decoration-purple-400/40 underline decoration-dashed underline-offset-4 hover:text-purple-700 hover:decoration-purple-600/60"
        {...props}
      >
        {children}
      </Link>
    );
  },

  // Blockquotes
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-4 border-purple-600/30 bg-gray-50 py-2 pl-6 pr-4 italic text-gray-700">
      {children}
    </blockquote>
  ),

  // Add more custom components as needed
  // Preserve id and className from generated HTML (e.g. GFM footnote labels, rehype-slug anchors)
  h1: ({ children, className, id, ...props }) => (
    <h1 id={id} className={className || "mb-4 mt-8 text-4xl font-bold"} {...props}>{children}</h1>
  ),
  h2: ({ children, className, id, ...props }) => (
    <h2 id={id} className={className || "mb-3 mt-6 text-3xl font-semibold"} {...props}>{children}</h2>
  ),
  h3: ({ children, className, id, ...props }) => (
    <h3 id={id} className={className || "mb-2 mt-4 text-2xl font-semibold"} {...props}>{children}</h3>
  ),
  h4: ({ children, className, id, ...props }) => (
    <h4 id={id} className={className || "mb-2 mt-4 text-xl font-semibold"} {...props}>{children}</h4>
  ),
  h5: ({ children, className, id, ...props }) => (
    <h5 id={id} className={className || "mb-2 mt-3 text-lg font-semibold"} {...props}>{children}</h5>
  ),
  h6: ({ children, className, id, ...props }) => (
    <h6 id={id} className={className || "mb-2 mt-3 text-base font-semibold"} {...props}>{children}</h6>
  ),
  p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
  code: ({ children, ...props }) => (
    <code
      className="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm"
      {...props}
    >
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-gray-100">
      {children}
    </pre>
  ),

  // Footnote support for GFM and HTML
  sup: ({ children, id, ...props }) => {
    // GFM footnote references
    if (
      id &&
      typeof id === "string" &&
      (id.startsWith("fnref-") || id.startsWith("user-content-fnref-"))
    ) {
      const footnoteId = id
        .replace("user-content-", "")
        .replace("fnref-", "fn-");
      return <FootnoteRef id={footnoteId}>{children}</FootnoteRef>;
    }
    return <sup {...props}>{children}</sup>;
  },

  sub: ({ children, ...props }) => {
    // Handle HTML footnote references like <sub>[1]</sub>
    const text = String(children);
    if (text.match(/^\[\d+\]$/)) {
      const num = text.match(/\d+/)?.[0];
      return <FootnoteRef id={`fn-${num}`}>[{num}]</FootnoteRef>;
    }
    return <sub {...props}>{children}</sub>;
  },

  small: ({ children, ...props }) => {
    // Check if this is a footnote content section
    const childText = String(children);
    if (childText.match(/^\[\d+\]/)) {
      return (
        <small className="block border-t border-gray-200 pt-4 mt-8" {...props}>
          {children}
        </small>
      );
    }
    return <small {...props}>{children}</small>;
  },

  // Footnote section styling (GFM generates a section with class "footnotes")
  section: ({ children, className, ...props }) => {
    if (
      className &&
      typeof className === "string" &&
      className.includes("footnotes")
    ) {
      return (
        <section
          className="mt-12 border-t border-gray-200 pt-6 text-sm text-gray-700"
          {...props}
        >
          {children}
        </section>
      );
    }
    return <section {...props}>{children}</section>;
  },

  // Lists in footnotes
  ol: ({ children, ...props }) => (
    <ol className="my-4 ml-6 list-decimal space-y-2" {...props}>
      {children}
    </ol>
  ),
  ul: ({ children, ...props }) => (
    <ul className="my-4 ml-6 list-disc space-y-2" {...props}>
      {children}
    </ul>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
};
