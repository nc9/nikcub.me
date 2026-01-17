import Link from "next/link";

import { type Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface RelatedPostsProps {
  currentPost: Post;
  allPosts: Post[];
}

export function RelatedPosts({ currentPost, allPosts }: RelatedPostsProps) {
  // Find related posts by matching tags or category
  const relatedPosts = allPosts
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => {
      let score = 0;

      // Score by shared tags
      if (currentPost.tags && post.tags) {
        const sharedTags = currentPost.tags.filter((tag) =>
          post.tags?.includes(tag)
        );
        score += sharedTags.length * 2;
      }

      // Score by same category
      if (currentPost.category && post.category === currentPost.category) {
        score += 3;
      }

      // Slight boost for same type
      if (post.type === currentPost.type) {
        score += 1;
      }

      return { post, score };
    })
    .filter(({ score }) => score > 0)
    .toSorted((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ post }) => post);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 border-t border-border pt-8">
      <h2 className="mb-6 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Related Reading
      </h2>
      <div className="space-y-4">
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="group block"
          >
            <article className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                {post.type === "aside" && (
                  <>
                    <span className="text-border">·</span>
                    <span className="uppercase tracking-wide">Aside</span>
                  </>
                )}
              </div>
              <h3 className="text-[15px] font-medium text-foreground transition-colors group-hover:text-primary">
                {post.title}
              </h3>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
