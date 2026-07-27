import type { ReactNode } from "react"

/**
 * Flow-diagram primitives. HTML/flex based so diagrams reflow on small
 * screens instead of scaling text down like SVG would. Themed entirely via
 * the --viz-* tokens in global.css (see .claude/skills/post-diagrams).
 */

export function FlowDiagram({
  caption,
  children,
}: {
  caption?: string
  children: ReactNode
}) {
  return (
    <figure className="dg">
      <div className="dg-canvas">{children}</div>
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

export function FlowArrow({ label }: { label?: string }) {
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
