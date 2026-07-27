import { Fragment } from "react"
import { DIAGRAMS } from "@/components/diagrams/registry"

const DIAGRAM_MARKER = /<div data-diagram="([\w-]+)"><\/div>/g

/**
 * Renders compiled post HTML, replacing `<div data-diagram="name"></div>`
 * markers (written verbatim in the markdown source) with the matching React
 * component from the diagram registry. Unknown names render nothing in prod
 * but throw in dev so a typo can't silently drop a figure.
 */
export function PostContent({
  html,
  className,
}: {
  html: string
  className?: string
}) {
  const parts = html.split(DIAGRAM_MARKER)
  // split() with one capture group yields [html, name, html, name, ..., html]
  const chunks: React.ReactNode[] = []
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      if (parts[i]) {
        chunks.push(
          <div
            key={i}
            className="contents"
            // Trusted build-time HTML compiled from our own markdown.
            dangerouslySetInnerHTML={{ __html: parts[i] }}
          />,
        )
      }
    } else {
      const name = parts[i]
      const Diagram = DIAGRAMS[name]
      if (!Diagram) {
        if (import.meta.env.DEV) {
          throw new Error(`Unknown diagram "${name}" — add it to DIAGRAMS`)
        }
        continue
      }
      chunks.push(
        <Fragment key={i}>
          <Diagram />
        </Fragment>,
      )
    }
  }
  return <div className={className}>{chunks}</div>
}
