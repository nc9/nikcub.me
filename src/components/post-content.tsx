import { Fragment, useEffect, useRef } from "react"
import { DIAGRAMS } from "@/components/diagrams/registry"

const DIAGRAM_MARKER = /<div data-diagram="([\w-]+)"><\/div>/g

const COPY_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>'
const CHECK_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
const COPIED_RESET_MS = 2000

/**
 * Adds a copy-to-clipboard button to every code block. The button lives in a
 * relative wrapper OUTSIDE the <pre> — <pre> is the horizontal scroll
 * container, so an absolutely positioned child inside it would scroll away
 * with the code.
 */
function addCopyButtons(root: HTMLElement) {
  for (const pre of root.querySelectorAll("pre")) {
    if (pre.parentElement?.classList.contains("code-frame")) continue

    const frame = document.createElement("div")
    frame.className = "code-frame"
    pre.replaceWith(frame)
    frame.appendChild(pre)

    const button = document.createElement("button")
    button.type = "button"
    button.className = "code-copy"
    button.setAttribute("aria-label", "Copy code to clipboard")
    button.innerHTML = COPY_ICON
    button.addEventListener("click", () => {
      const text = pre.querySelector("code")?.innerText ?? pre.innerText
      navigator.clipboard
        .writeText(text.replace(/\n$/, ""))
        .then(() => {
          button.innerHTML = CHECK_ICON
          button.classList.add("code-copy--done")
          window.setTimeout(() => {
            button.innerHTML = COPY_ICON
            button.classList.remove("code-copy--done")
          }, COPIED_RESET_MS)
        })
        .catch(() => {
          // Clipboard denied (permissions / insecure context) — tell the user
          // via the accessible name; the icon state is our only visual surface.
          button.setAttribute("aria-label", "Copy failed — clipboard blocked")
        })
    })
    frame.appendChild(button)
  }
}

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
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (rootRef.current) addCopyButtons(rootRef.current)
  }, [html])

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
  return (
    <div ref={rootRef} className={className}>
      {chunks}
    </div>
  )
}
