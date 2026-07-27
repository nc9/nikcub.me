import { FlowArrow, FlowNode } from "./flow"

/**
 * The worktree lane pool from Step 0: one shared repo, your checkout left
 * alone, and a fixed pool of persistent lanes the loop hands to sessions.
 * Lane status dots reuse the board colors: blue = in progress, purple = in
 * review, green = free (back on main).
 */
export function WorktreeLanesDiagram() {
  return (
    <figure className="dg">
      <div className="dg-canvas dg-canvas--col">
        <FlowNode label="one repo" sub="shared .git object store" />
        <FlowArrow direction="down" label="worktrees: parallel working copies" />
        <div className="dg-lanes">
          <FlowNode
            label="your checkout"
            sub="main · the loop never touches it"
          />
          <FlowNode dot="blue" label="lane-0" sub="#1055 · implementing" />
          <FlowNode dot="purple" label="lane-1" sub="#990 · PR in review" />
          <FlowNode dot="green" label="lane-2" sub="on main · free" />
        </div>
        <span className="dg-chip">
          ↺ per issue: salvage → reset → branch off fresh base → implement → PR
          → back on main
        </span>
      </div>
      <figcaption className="dg-caption">
        A fixed pool of persistent lanes: caches stay warm, one issue per lane,
        and a lane back on main is free for the next claim.
      </figcaption>
    </figure>
  )
}
