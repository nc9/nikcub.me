import type { ReactNode } from "react"

/**
 * Flow-diagram primitives. HTML/flex based so diagrams reflow on small
 * screens instead of scaling text down like SVG would. Themed entirely via
 * the --viz-* tokens in global.css (see .claude/skills/post-diagrams).
 */

export function FlowDiagram({
  caption,
  layout = "row",
  returnLabel,
  children,
}: {
  caption?: string
  /** "row" wraps nodes horizontally; "column" stacks them down a spine. */
  layout?: "row" | "column"
  /** Column layout only: dashed loop-back edge up the left side. */
  returnLabel?: string
  children: ReactNode
}) {
  const canvasClass =
    layout === "column" ? "dg-canvas dg-canvas--col" : "dg-canvas"
  return (
    <figure className="dg">
      <div className={canvasClass}>
        {layout === "column" ? (
          <div className="dg-spine">
            {returnLabel && (
              <div aria-hidden="true" className="dg-return">
                <span className="dg-return-head">▸</span>
                <span className="dg-return-label">↺ {returnLabel}</span>
              </div>
            )}
            {children}
          </div>
        ) : (
          children
        )}
      </div>
      {caption && <figcaption className="dg-caption">{caption}</figcaption>}
    </figure>
  )
}

export function FlowNode({
  label,
  sub,
  accent = false,
}: {
  label: string
  sub?: string
  accent?: boolean
}) {
  return (
    <div className={accent ? "dg-node dg-node--accent" : "dg-node"}>
      <span className="dg-node-label">{label}</span>
      {sub && <span className="dg-node-sub">{sub}</span>}
    </div>
  )
}

export function FlowArrow({
  label,
  direction = "right",
}: {
  label?: string
  direction?: "right" | "down"
}) {
  if (direction === "down") {
    return (
      <div aria-hidden="true" className="dg-arrow dg-arrow--down">
        <span>↓</span>
        {label && <span className="dg-arrow-label">{label}</span>}
      </div>
    )
  }
  return (
    <div aria-hidden="true" className="dg-arrow">
      {label && <span className="dg-arrow-label">{label}</span>}
      <span>→</span>
    </div>
  )
}

/** Dashed return edge rendered as a full-width footer row. */
export function FlowLoop({ label }: { label: string }) {
  return (
    <div className="dg-loop">
      <span className="dg-loop-line" />
      <span>↺ {label}</span>
      <span className="dg-loop-line" />
    </div>
  )
}
