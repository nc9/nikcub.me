import type React from "react";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { formatDate } from "@/lib/utils";
import { type Post } from "@/types/post";

// import { RelatedPosts } from "./related-posts";

interface ArticleLayoutProps {
  post: Post;
  children: React.ReactNode;
}

export function ArticleLayout({ post, children }: ArticleLayoutProps) {
  return (
    <article className="mx-auto max-w-2xl px-6 py-12">
      {/* Back link */}
      <Link
        href="/"
        className="mb-12 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-highlight"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all posts
      </Link>

      {/* Article header */}
      <header className="mb-12">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <time dateTime={post.frontmatter.date}>
            {formatDate(post.frontmatter.date)}
          </time>
          {post.readingTime > 0 && (
            <>
              <span className="text-border">·</span>
              <span>{post.readingTime} min read</span>
            </>
          )}
          {/* Categories not yet implemented */}
          {post.type === "aside" && (
            <>
              <span className="text-border">·</span>
              <span className="rounded bg-highlight/10 text-highlight px-2 py-0.5 text-xs font-medium uppercase tracking-wide">
                Aside
              </span>
            </>
          )}
        </div>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl text-balance">
          {post.frontmatter.title}
        </h1>
        {post.frontmatter.excerpt && post.type === "article" && (
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            {post.frontmatter.excerpt}
          </p>
        )}
        {post.frontmatter.tags && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.frontmatter.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${tag}`}
                className="rounded-sm bg-muted px-2 py-1 text-xs text-muted-foreground hover:bg-highlight/10 hover:text-highlight transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Article content */}
      <div className="prose-article">{children}</div>

      {/* Related posts not yet implemented */}

      {/* Article footer */}
      <footer className="mt-16 border-t border-border pt-8">
        <p className="text-sm text-muted-foreground">
          Thanks for reading. Follow me on{" "}
          <a
            href="https://twitter.com/nikcub"
            className="text-highlight underline underline-offset-2 hover:text-highlight/80"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>{" "}
          for more, or{" "}
          <Link
            href="/subscribe"
            className="text-highlight underline underline-offset-2 hover:text-highlight/80"
          >
            subscribe to the newsletter
          </Link>{" "}
          to get new posts.
        </p>
      </footer>
    </article>
  );
}
