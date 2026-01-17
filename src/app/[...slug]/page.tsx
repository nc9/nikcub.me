import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { mdxComponents } from "@/components/mdx/mdx-components";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAllPageSlugs, getPageBySlug } from "@/lib/mdx";
import { generatePageMetadata } from "@/lib/metadata";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const slugs = getAllPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    return { title: "Page Not Found" };
  }

  const slugPath = `/${slug.join("/")}`;

  return generatePageMetadata({
    title: page.frontmatter.title,
    description:
      page.frontmatter.excerpt ||
      "Security researcher, technologist, and writer",
    path: slugPath,
    image: page.frontmatter.featureImage,
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <article className="mx-auto max-w-2xl px-6 py-12">
          {/* Header */}
          <header className="mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
            <h1 className="mt-6 text-3xl font-semibold text-foreground">
              {page.frontmatter.title}
            </h1>
            {page.frontmatter.excerpt && (
              <p className="mt-4 text-lg text-muted-foreground">
                {page.frontmatter.excerpt}
              </p>
            )}
          </header>

          {/* Featured Image */}
          {page.frontmatter.featureImage && (
            <div className="mb-8 border-b border-border pb-8">
              <Image
                src={page.frontmatter.featureImage}
                alt={page.frontmatter.featureImageAlt || page.frontmatter.title}
                width={800}
                height={600}
                className="w-full rounded-lg border-2 border-gray-200"
                priority
              />
              {page.frontmatter.featureImageAlt && (
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  {page.frontmatter.featureImageAlt}
                </p>
              )}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg prose-gray max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-a:no-underline prose-blockquote:not-italic prose-blockquote:font-normal">
            <MDXRemote
              source={page.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug],
                },
              }}
            />
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

export const revalidate = 3600;
