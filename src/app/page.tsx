import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { PostList } from "@/components/post-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAllPosts } from "@/lib/mdx";

export default function HomePage() {
  const allPosts = getAllPosts();
  const articles = allPosts.filter((p) => p.type === "article");
  const asides = allPosts.filter((p) => p.type === "aside");

  // Show latest 5 articles and 5 asides
  const latestArticles = articles.slice(0, 5);
  const latestAsides = asides.slice(0, 5);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-12">
          {/* Introduction */}
          <div className="mb-16">
            <p className="text-lg leading-relaxed text-foreground">
              I write about AI, data engineering, and the intersection of
              technology and society. Building systems, exploring ideas, and
              examining how technology shapes our digital world.
            </p>
            <Link
              href="/about"
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-highlight"
            >
              Read more about me
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Latest Articles */}
          {latestArticles.length > 0 && (
            <section className="mb-16">
              <div className="mb-8 flex items-center gap-4">
                <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Latest Articles
                </h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              <PostList posts={latestArticles} showSections={false} />
              <Link
                href="/posts"
                className="mt-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-highlight"
              >
                View all articles
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </section>
          )}

          {/* Latest Asides */}
          {latestAsides.length > 0 && (
            <section>
              <div className="mb-8 flex items-center gap-4">
                <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Latest Asides
                </h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="space-y-6">
                <PostList posts={latestAsides} showSections={false} />
              </div>
              <Link
                href="/asides"
                className="mt-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-highlight"
              >
                View all asides
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export const revalidate = 3600;
