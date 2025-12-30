import type { Metadata } from "next";

import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { PostList } from "@/components/post-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAllPosts } from "@/lib/mdx";
import { generatePageMetadata } from "@/lib/metadata";

const POSTS_PER_PAGE = 10;

interface PostsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  searchParams,
}: PostsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const suffix = page > 1 ? ` - Page ${page}` : "";

  return generatePageMetadata({
    title: `Articles${suffix}`,
    description: `Long-form writing on security, privacy, and technology${suffix}`,
    path: page > 1 ? `/posts?page=${page}` : "/posts",
  });
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const rawPage = Number(params.page) || 1;
  if (params.page === "1") {
    const { redirect } = await import("next/navigation");
    redirect("/posts");
  }
  const currentPage = rawPage;

  const allPosts = getAllPosts();
  const articles = allPosts.filter((p) => p.type === "article");

  const totalPages = Math.ceil(articles.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedArticles = articles.slice(startIndex, endIndex);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-12">
          <div className="mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
            <h1 className="mt-6 text-3xl font-semibold text-foreground">
              Articles
            </h1>
            <p className="mt-2 text-muted-foreground">
              Long-form writing on security, privacy, and technology
            </p>
          </div>

          <PostList posts={paginatedArticles} showSections={false} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-between border-t border-border pt-8">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                {currentPage > 1 && (
                  <Link
                    href={`/posts?page=${currentPage - 1}`}
                    aria-label={`Previous page, page ${currentPage - 1}`}
                    className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous page
                  </Link>
                )}
                {currentPage < totalPages && (
                  <Link
                    href={`/posts?page=${currentPage + 1}`}
                    aria-label={`Next page, page ${currentPage + 1}`}
                    className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    Next page
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export const revalidate = 3600;
