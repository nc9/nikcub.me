import type { CSSProperties } from "react"
import { FlowArrow, FlowNode } from "./flow"

/**
 * The two human-driven sessions and how they meet at the board: a planning
 * session feeds issues in, a supervisor session runs the loop that drains
 * them. The board is a rough skeleton here — the real thing gets its own
 * diagram (audit-board) later in the post.
 */

const SKELETON_COLUMNS: { color: string; cards: number }[] = [
  { color: "gray", cards: 2 },
  { color: "green", cards: 3 },
  { color: "blue", cards: 1 },
  { color: "purple", cards: 2 },
]

function BoardSkeleton() {
  return (
    <div className="dg-node">
      <span className="dg-node-label">issue board</span>
      <div aria-hidden="true" className="dg-board-skel">
        {SKELETON_COLUMNS.map(({ color, cards }) => (
          <div key={color} className="dg-board-skel-col">
            <span
              className="dg-dot"
              style={{ "--kb-color": `var(--kb-${color})` } as CSSProperties}
            />
            {Array.from({ length: cards }, (_, i) => (
              <span key={i} className="dg-board-skel-bar" />
            ))}
          </div>
        ))}
      </div>
      <span className="dg-node-sub">the control plane</span>
    </div>
  )
}

export function LoopSessionsDiagram() {
  return (
    <figure className="dg">
      <div className="dg-canvas dg-canvas--col">
        <div className="dg-duo">
          <div className="dg-duo-span">
            <FlowNode label="you" sub="engineering management" />
          </div>

          <div className="dg-duo-left">
            <FlowArrow direction="down" label="plan work" />
          </div>
          <div className="dg-duo-mid" />
          <div className="dg-duo-right">
            <FlowArrow direction="down" label="start + supervise" />
          </div>

          <div className="dg-duo-left">
            <FlowNode
              label="issues session"
              sub="interactive · the issue is the plan"
            />
          </div>
          <div className="dg-duo-mid" />
          <div className="dg-duo-right">
            <FlowNode
              label="supervisor session"
              sub="smart model · high effort"
            />
          </div>

          <div className="dg-duo-left">
            <FlowArrow direction="down" label="create + refine issues" />
          </div>
          <div className="dg-duo-mid" />
          <div className="dg-duo-right">
            <FlowArrow
              direction="down"
              label="instantiate · monitor · unblock"
            />
          </div>

          <div className="dg-duo-left">
            <BoardSkeleton />
          </div>
          <div className="dg-duo-mid">
            <FlowArrow label="claims top Ready" />
          </div>
          <div className="dg-duo-right">
            <FlowNode
              accent
              label="loop driver"
              sub="deterministic · headless"
            />
          </div>

          <div className="dg-duo-left" />
          <div className="dg-duo-mid" />
          <div className="dg-duo-right">
            <FlowArrow direction="down" label="one cold session per issue" />
          </div>

          <div className="dg-duo-left">
            <span className="dg-chip">
              ↺ PRs + status land back on the board
            </span>
          </div>
          <div className="dg-duo-mid" />
          <div className="dg-duo-right">
            <FlowNode
              label="worker sessions"
              sub="lane-0 … lane-N · worktrees"
            />
          </div>
        </div>
      </div>
      <figcaption className="dg-caption">
        Two sessions, one board: planning feeds it, the supervisor runs the
        loop that drains it. Everything below the loop driver is headless.
      </figcaption>
    </figure>
  )
}
