import { Children, type ReactNode } from "react"

/**
 * Kanban-board primitives (GitHub Projects style). Column colors are the
 * board's status colors (--kb-* tokens in global.css), separate from the
 * categorical chart series. Board scrolls horizontally on narrow screens.
 */

export type KanbanColor =
  | "gray"
  | "green"
  | "blue"
  | "purple"
  | "red"
  | "pink"

export function KanbanBoard({
  caption,
  children,
}: {
  caption?: string
  children: ReactNode
}) {
  return (
    <figure className="dg dg--wide">
      <div className="kb-scroll">
        <div className="kb-board">{children}</div>
      </div>
      {caption && <figcaption className="dg-caption">{caption}</figcaption>}
    </figure>
  )
}

export function KanbanColumn({
  name,
  color,
  sub,
  children,
}: {
  name: string
  color: KanbanColor
  /** One-line meaning of the column ("eligible", "human to resolve"). */
  sub?: string
  children?: ReactNode
}) {
  const count = Children.count(children)
  return (
    <div className="kb-col">
      <div
        className="kb-col-head"
        style={{ "--kb-color": `var(--kb-${color})` } as React.CSSProperties}
      >
        <span aria-hidden="true" className="kb-col-dot" />
        <span className="kb-col-name">{name}</span>
        <span className="kb-col-count">{count}</span>
      </div>
      {sub && <span className="kb-col-sub">{sub}</span>}
      {children}
    </div>
  )
}

export function KanbanCard({
  number,
  title,
  labels,
}: {
  number?: number
  title: string
  /** GitHub-style label pills: [name, hex-without-#] */
  labels?: [string, string][]
}) {
  return (
    <div className="kb-card">
      {number !== undefined && <span className="kb-card-num">#{number}</span>}
      <span className="kb-card-title">{title}</span>
      {labels && labels.length > 0 && (
        <span className="kb-card-labels">
          {labels.map(([name, hex]) => (
            <span
              key={name}
              className="kb-label"
              style={{ "--kb-label": `#${hex}` } as React.CSSProperties}
            >
              {name}
            </span>
          ))}
        </span>
      )}
    </div>
  )
}
