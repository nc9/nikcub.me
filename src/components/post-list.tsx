import { Calendar, Clock, User } from "lucide-react"
import { Link } from "@/components/link"
import type { ContentMeta } from "@/lib/content"
import { formatDate } from "@/lib/utils"

interface PostListProps {
  posts: ContentMeta[]
  showSections?: boolean
}

export function PostList({ posts, showSections = true }: PostListProps) {
  const articles = posts.filter((p) => p.type === "article")
  const asides = posts.filter((p) => p.type === "aside")

  if (!showSections) {
    return (
      <div className="space-y-10">
        {articles.map((post) => (
          <ArticleItem key={post.slug} post={post} />
        ))}
        {asides.map((post) => (
          <AsideItem key={post.slug} post={post} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-16">
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
  )
}

function ArticleItem({ post }: { post: ContentMeta }) {
  const updated =
    post.lastModified && post.lastModified !== post.date
      ? post.lastModified
      : null
  return (
    <article className="group">
      <Link href={`/posts/${post.slug}`} className="block">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold leading-tight text-foreground transition-colors group-hover:text-highlight">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <time
              dateTime={post.date}
              className="inline-flex items-center gap-1.5"
            >
              <Calendar className="h-3 w-3" />
              {formatDate(post.date)}
            </time>
            {updated && (
              <>
                <span className="text-border">·</span>
                <span className="inline-flex items-center gap-1">
                  Updated {formatDate(updated)}
                </span>
              </>
            )}
            {post.readingTime > 0 && (
              <>
                <span className="text-border">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  {post.readingTime} min read
                </span>
              </>
            )}
            <span className="text-border">·</span>
            <span className="inline-flex items-center gap-1">
              <User className="h-3 w-3" />
              Nik Cubrilovic
            </span>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-1 flex gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs text-muted-foreground/70">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  )
}

function AsideItem({ post }: { post: ContentMeta }) {
  return (
    <article className="group border-l-2 border-border pl-4 transition-colors hover:border-highlight">
      <Link href={`/posts/${post.slug}`} className="block">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-foreground transition-colors group-hover:text-highlight">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-sm text-muted-foreground">{post.excerpt}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <time
              dateTime={post.date}
              className="inline-flex items-center gap-1.5"
            >
              <Calendar className="h-3 w-3" />
              {formatDate(post.date)}
            </time>
            <span className="text-border">·</span>
            <span className="inline-flex items-center gap-1">
              <User className="h-3 w-3" />
              Nik Cubrilovic
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
