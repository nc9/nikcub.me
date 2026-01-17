"use client";

import { useState } from "react";

interface FootnoteProps {
  id: string;
  children: React.ReactNode;
}

export function FootnoteRef({ id, children }: FootnoteProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState<string>("");

  const handleMouseEnter = () => {
    // Find the footnote content
    const footnoteElement = document.querySelector(`#${id}`);
    if (footnoteElement) {
      setTooltipContent(footnoteElement.textContent || "");
      setShowTooltip(true);
    }
  };

  return (
    <span className="relative">
      <a
        href={`#${id}`}
        className="inline-block align-super text-xs text-purple-600 no-underline hover:text-purple-700"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children}
      </a>
      {showTooltip && tooltipContent && (
        <span className="absolute bottom-full left-0 z-50 mb-2 w-64 rounded-lg border border-purple-200 bg-white p-3 text-sm font-normal text-gray-700 shadow-lg">
          {tooltipContent}
          <span className="absolute left-4 top-full h-0 w-0 border-8 border-transparent border-t-white" />
        </span>
      )}
    </span>
  );
}

export function FootnoteContent({ id, children }: FootnoteProps) {
  const refId = id.replace("fn-", "fnref-");

  return (
    <div id={id} className="my-2 text-sm">
      <span className="mr-2 text-purple-600">{children}</span>
      <a
        href={`#${refId}`}
        className="ml-2 text-xs text-gray-500 no-underline hover:text-purple-600"
        aria-label="Back to reference"
      >
        ↩
      </a>
    </div>
  );
}
