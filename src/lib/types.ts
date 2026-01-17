export type PostType = "article" | "aside";

export type Category = "security" | "privacy" | "crypto" | "web" | "opinion";

export interface Post {
  slug: string;
  title: string;
  description?: string;
  date: string;
  type: PostType;
  content?: string;
  readingTime?: string;
  tags?: string[];
  category?: Category;
}
