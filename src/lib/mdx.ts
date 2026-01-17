import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";
import readingTime from "reading-time";

import type {
  Page,
  PageFrontmatter,
  Post,
  PostFrontmatter,
  PostType,
} from "@/types/post";

const POSTS_DIR = path.join(process.cwd(), "content/posts");
const PAGES_DIR = path.join(process.cwd(), "content/pages");
const WORD_COUNT_THRESHOLD = 150;

function determinePostType(
  frontmatter: PostFrontmatter,
  content: string
): PostType {
  // Explicit frontmatter takes precedence
  if (frontmatter.type) {
    return frontmatter.type;
  }

  // Fallback to word count
  const words = content.trim().split(/\s+/).length;
  return words < WORD_COUNT_THRESHOLD ? "aside" : "article";
}

function processImagePaths(content: string): string {
  // Transform ../assets/foo.jpg to /images/posts/foo.jpg
  return content.replace(/\.\.\/assets\/([^)\s]+)/g, "/images/posts/$1");
}

export function getPostBySlug(slug: string): Post | null {
  const possibleExtensions = [".mdx", ".md"];

  for (const ext of possibleExtensions) {
    const fullPath = path.join(POSTS_DIR, `${slug}${ext}`);

    if (!fs.existsSync(fullPath)) continue;

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const frontmatter = data as PostFrontmatter;

    // Skip drafts in production
    if (
      process.env.NODE_ENV === "production" &&
      frontmatter.status === "draft"
    ) {
      return null;
    }

    const processedContent = processImagePaths(content);
    const stats = readingTime(processedContent);
    const type = determinePostType(frontmatter, processedContent);

    // Process feature image path
    if (frontmatter.featureImage) {
      frontmatter.featureImage = frontmatter.featureImage.replace(
        /^\.\.\/assets\//,
        "/images/posts/"
      );
    }

    return {
      slug,
      frontmatter,
      content: processedContent,
      type,
      readingTime: Math.ceil(stats.minutes),
      wordCount: stats.words,
    };
  }

  return null;
}

export function getAllPostSlugs(): string[] {
  const files = fs.readdirSync(POSTS_DIR);

  return files
    .filter((file) => /\.(md|mdx)$/.test(file))
    .map((file) => file.replace(/\.(md|mdx)$/, ""));
}

export function getAllPosts(): Post[] {
  const slugs = getAllPostSlugs();
  const posts: Post[] = [];

  for (const slug of slugs) {
    const post = getPostBySlug(slug);
    if (post) {
      posts.push(post);
    }
  }

  // Sort by date descending
  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

export function getPostsByType(type: PostType): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.type === type);
}

// Page functions
export function getPageBySlug(slug: string[]): Page | null {
  const possibleExtensions = [".mdx", ".md"];
  const slugPath = slug.join("/");

  for (const ext of possibleExtensions) {
    const fullPath = path.join(PAGES_DIR, `${slugPath}${ext}`);

    if (!fs.existsSync(fullPath)) continue;

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const frontmatter = data as PageFrontmatter;

    const processedContent = processImagePaths(content);
    const stats = readingTime(processedContent);

    // Process feature image path
    if (frontmatter.featureImage) {
      frontmatter.featureImage = frontmatter.featureImage.replace(
        /^\.\.\/assets\//,
        "/images/posts/"
      );
    }

    return {
      slug: slugPath,
      frontmatter,
      content: processedContent,
      readingTime: Math.ceil(stats.minutes),
      wordCount: stats.words,
    };
  }

  return null;
}

export function getAllPageSlugs(): string[][] {
  const slugs: string[][] = [];

  function traverseDir(dir: string, basePath: string[] = []): void {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverseDir(fullPath, [...basePath, file]);
      } else if (/\.(md|mdx)$/.test(file)) {
        const slug = file.replace(/\.(md|mdx)$/, "");
        slugs.push([...basePath, slug]);
      }
    }
  }

  traverseDir(PAGES_DIR);
  return slugs;
}
