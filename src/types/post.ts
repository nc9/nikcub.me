export type PostType = "article" | "aside";

export interface PostFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  status?: "draft" | "published";
  type?: PostType;
  featureImage?: string;
  featureImageAlt?: string;
  tags?: string[];
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  type: PostType;
  readingTime: number;
  wordCount: number;
}

export interface PageFrontmatter {
  title: string;
  date?: string;
  excerpt?: string;
  featureImage?: string;
  featureImageAlt?: string;
}

export interface Page {
  slug: string;
  frontmatter: PageFrontmatter;
  content: string;
  readingTime: number;
  wordCount: number;
}
