"use client";

import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";

import { mdxComponents } from "./mdx-components";

interface MDXRendererProps {
  source: MDXRemoteSerializeResult;
}

export function MDXRenderer({ source }: MDXRendererProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <MDXRemote {...source} components={mdxComponents} />
    </div>
  );
}
