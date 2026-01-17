import { Calendar, Clock } from "lucide-react";
import Link from "next/link";

import { formatDate } from "@/lib/utils";
import { type Post } from "@/types/post";

interface PostListProps {
  posts: Post[];
  showSections?: boolean;
}

export function PostList({ posts, showSections = true }: PostListProps) {
  const articles = posts.filter((p) => p.type === "article");
  const asides = posts.filter((p) => p.type === "aside");

  if (!showSections) {
    // Simple list without sections
    const hasArticles = articles.length > 0;
    const hasAsides = asides.length > 0;

    return (
      <div className="space-y-10">
        {hasArticles &&
          articles.map((post) => <ArticleItem key={post.slug} post={post} />)}
        {hasAsides &&
          asides.map((post) => <AsideItem key={post.slug} post={post} />)}
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Articles Section */}
      {articles.length > 0 && (
        <section>
          <div className="mb-8 flex items-center gap-4">
            <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Articles
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="space-y-10">
            {articles.map((post) => (
              <ArticleItem key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Asides Section */}
      {asides.length > 0 && (
        <section>
          <div className="mb-8 flex items-center gap-4">
            <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Asides
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="space-y-6">
            {asides.map((post) => (
              <AsideItem key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ArticleItem({ post }: { post: Post }) {
  return (
    <article className="group">
      <Link href={`/posts/${post.slug}`} className="block">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-semibold leading-tight text-foreground transition-colors group-hover:text-highlight">
            {post.frontmatter.title}
          </h3>
          {post.frontmatter.excerpt && (
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              {post.frontmatter.excerpt}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <time
              dateTime={post.frontmatter.date}
              className="inline-flex items-center gap-1.5"
            >
              <Calendar className="h-3 w-3" />
              {formatDate(post.frontmatter.date)}
            </time>
            {post.readingTime > 0 && (
              <>
                <span className="text-border">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  {post.readingTime} min read
                </span>
              </>
            )}
          </div>
          {post.frontmatter.tags && (
            <div className="mt-1 flex gap-2">
              {post.frontmatter.tags.map((tag) => (
                <span key={tag} className="text-xs text-muted-foreground/70">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}

function AsideItem({ post }: { post: Post }) {
  return (
    <article className="group border-l-2 border-border pl-4 transition-colors hover:border-highlight">
      <Link href={`/posts/${post.slug}`} className="block">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-highlight">
            {post.frontmatter.title}
          </h3>
          {post.frontmatter.excerpt && (
            <p className="text-sm text-muted-foreground">
              {post.frontmatter.excerpt}
            </p>
          )}
          <time
            dateTime={post.frontmatter.date}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <Calendar className="h-3 w-3" />
            {formatDate(post.frontmatter.date)}
          </time>
        </div>
      </Link>
    </article>
  );
}
