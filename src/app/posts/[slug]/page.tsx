import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { mdxComponents } from "@/components/mdx/mdx-components";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAllPostSlugs, getPostBySlug } from "@/lib/mdx";
import { generatePageMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const baseMeta = generatePageMetadata({
    // Use seoTitle when the full title exceeds ~55 chars (avoids truncation in SERPs)
    title: post.frontmatter.seoTitle || post.frontmatter.title,
    description:
      post.frontmatter.excerpt || "Security research and technology analysis",
    path: `/posts/${slug}`,
    image: post.frontmatter.featureImage,
    type: "article",
  });

  return {
    ...baseMeta,
    authors: [{ name: "Nik Cubrilovic", url: "https://nikcub.me" }],
    openGraph: {
      ...baseMeta.openGraph,
      type: "article" as const,
      publishedTime: post.frontmatter.date,
      authors: ["Nik Cubrilovic"],
    },
  };
}

function ArticleJsonLd({
  title,
  description,
  slug,
  date,
  image,
}: {
  title: string;
  description: string;
  slug: string;
  date: string;
  image?: string;
}) {
  const articleImage = image
    ? `https://nikcub.me${image}`
    : "https://nikcub.me/og-default.png";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `https://nikcub.me/posts/${slug}`,
    datePublished: date,
    dateModified: date,
    image: articleImage,
    author: {
      "@type": "Person",
      "@id": "https://nikcub.me/#person",
      name: "Nik Cubrilovic",
      url: "https://nikcub.me",
    },
    publisher: {
      "@type": "Person",
      "@id": "https://nikcub.me/#person",
      name: "Nik Cubrilovic",
      image: "https://nikcub.me/avatar.webp",
      logo: {
        "@type": "ImageObject",
        url: "https://nikcub.me/avatar.webp",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://nikcub.me/posts/${slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      /* Safe: jsonLd is constructed from post frontmatter stored in source control */
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <ArticleJsonLd
        title={post.frontmatter.title}
        description={
          post.frontmatter.excerpt ||
          "Security research and technology analysis"
        }
        slug={slug}
        date={post.frontmatter.date}
        image={post.frontmatter.featureImage}
      />
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <article className="mx-auto max-w-2xl px-6 py-12">
          {/* Header with metadata */}
          <header className="mb-12">
            <h1 className="mb-4 text-3xl font-semibold text-foreground">
              {post.frontmatter.title}
            </h1>
            <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground/80">
                Nik Cubrilovic
              </span>
              <span className="text-border">·</span>
              <time
                dateTime={post.frontmatter.date}
                className="inline-flex items-center gap-1.5"
              >
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(post.frontmatter.date)}
              </time>
              {post.readingTime > 0 && (
                <>
                  <span className="text-border">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readingTime} min read
                  </span>
                </>
              )}
              {post.type === "aside" && (
                <>
                  <span className="text-border">·</span>
                  <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium uppercase">
                    Aside
                  </span>
                </>
              )}
            </div>
            {post.frontmatter.excerpt && post.type === "article" && (
              <p className="mb-8 text-lg text-muted-foreground">
                {post.frontmatter.excerpt}
              </p>
            )}
          </header>

          {/* Featured Image */}
          {post.frontmatter.featureImage && (
            <figure className="mb-8 border-b border-border pb-8">
              <Image
                src={post.frontmatter.featureImage}
                alt={post.frontmatter.featureImageAlt || post.frontmatter.title}
                width={800}
                height={600}
                className="w-full rounded-lg border-2 border-gray-200"
                priority
              />
              {post.frontmatter.featureImageAlt && (
                <figcaption
                  id="feature-img-caption"
                  className="mt-2 text-center text-sm text-muted-foreground"
                >
                  {post.frontmatter.featureImageAlt}
                </figcaption>
              )}
            </figure>
          )}

          {/* Content */}
          <div className="prose prose-lg prose-gray max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-a:no-underline prose-blockquote:not-italic prose-blockquote:font-normal">
            <MDXRemote
              source={post.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [
                    rehypeSlug,
                    [
                      rehypePrettyCode,
                      {
                        theme: "github-dark",
                        keepBackground: false,
                      },
                    ],
                  ],
                },
              }}
            />
          </div>

          {/* Back link */}
          <Link
            href="/posts"
            className="mt-12 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all posts
          </Link>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

export const revalidate = 3600;
