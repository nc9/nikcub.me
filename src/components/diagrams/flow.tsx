import {
  Children,
  cloneElement,
  type CSSProperties,
  isValidElement,
  type ReactNode,
} from "react"

/**
 * Flow-diagram primitives. HTML/flex based so diagrams reflow on small
 * screens instead of scaling text down like SVG would. Themed entirely via
 * the --viz-* tokens in global.css (see .claude/skills/post-diagrams).
 *
 * Column layout renders a 3-column grid: [left gutter | nodes | right gutter].
 * FlowReturn edges live in the gutters and span node ranges by grid row, so
 * any number of nested loop-back edges stay attached to their nodes.
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
  /** Column layout sugar: full-height loop-back edge up the left side. */
  returnLabel?: string
  children: ReactNode
}) {
  if (layout !== "column") {
    return (
      <figure className="dg">
        <div className="dg-canvas">{children}</div>
        {caption && <figcaption className="dg-caption">{caption}</figcaption>}
      </figure>
    )
  }

  const items = Children.toArray(children)
  // Flow items (nodes/arrows) each take one grid row, in order. FlowReturn
  // children are lifted into the gutters and span rows computed from the
  // 1-based node numbers in their from/to props.
  const flowItems = items.filter(
    (it) => !(isValidElement(it) && it.type === FlowReturn),
  )
  const nodeRows: number[] = []
  flowItems.forEach((it, idx) => {
    if (isValidElement(it) && it.type === FlowNode) nodeRows.push(idx + 1)
  })
  const rowSpan = (from: number, to: number): CSSProperties => ({
    gridRow: `${nodeRows[from - 1] ?? 1} / ${(nodeRows[to - 1] ?? flowItems.length) + 1}`,
  })

  let flowRow = 0
  const rendered = items.map((it, i) => {
    if (isValidElement<FlowReturnProps>(it) && it.type === FlowReturn) {
      const { from, to } = it.props
      return cloneElement(it, { key: i, style: rowSpan(from, to) })
    }
    flowRow += 1
    return (
      <div key={i} className="dg-cell" style={{ gridRow: flowRow }}>
        {it}
      </div>
    )
  })

  return (
    <figure className="dg">
      <div className="dg-canvas dg-canvas--col">
        <div className="dg-spine">
          {returnLabel && nodeRows.length > 0 && (
            <FlowReturn
              from={1}
              to={nodeRows.length}
              label={returnLabel}
              style={rowSpan(1, nodeRows.length)}
            />
          )}
          {rendered}
        </div>
      </div>
      {caption && <figcaption className="dg-caption">{caption}</figcaption>}
    </figure>
  )
}

interface FlowReturnProps {
  /** 1-based node number the edge re-enters (the arrowhead end). */
  from: number
  /** 1-based node number the edge leaves from (must be below `from`). */
  to: number
  side?: "left" | "right"
  label: string
  /** Grid placement — injected by FlowDiagram, don't pass manually. */
  style?: CSSProperties
}

/** Dashed loop-back edge in a column-layout gutter, spanning nodes from→to. */
export function FlowReturn({
  side = "left",
  label,
  style,
}: FlowReturnProps) {
  return (
    <div
      aria-hidden="true"
      className={`dg-return dg-return--${side}`}
      style={style}
    >
      <span className="dg-return-head">{side === "left" ? "▸" : "◂"}</span>
      <span className="dg-return-label">↺ {label}</span>
    </div>
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
        {label && <span className="dg-arrow-label">{label}</span>}
        <span>↓</span>
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

/** Dashed return edge rendered as a full-width footer row (row layout). */
export function FlowLoop({ label }: { label: string }) {
  return (
    <div className="dg-loop">
      <span className="dg-loop-line" />
      <span>↺ {label}</span>
      <span className="dg-loop-line" />
    </div>
  )
}
