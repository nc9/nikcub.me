import { FlowArrow, FlowDiagram, FlowNode, FlowReturn } from "./flow"

/**
 * State machine for a single issue on the Audit Loop board. Status dots match
 * the kanban board above it (audit-board.tsx). The loop only ever moves an
 * issue downward; Blocked is the escape hatch a human resolves.
 */
export function IssueStatesDiagram() {
  return (
    <FlowDiagram
      layout="column"
      caption="The states an issue moves through — the loop pushes it down; Blocked (needs-decision, dep-open, ci-red, rubric-fail) is the exit only a human can reverse."
    >
      <FlowReturn dot="red" from={2} to={4} label="Blocked" />
      <FlowReturn side="right" from={3} to={4} label="review findings" />
      <FlowNode dot="gray" label="Draft" sub="investigating · loop ignores" />
      <FlowArrow direction="down" label="criteria + priority + size set" />
      <FlowNode dot="green" label="Ready" sub="eligible — no open deps" />
      <FlowArrow direction="down" label="loop claims · owner set" />
      <FlowNode dot="blue" label="In Progress" sub="worktree + headless session" />
      <FlowArrow direction="down" label="PR opened + linked" />
      <FlowNode
        dot="purple"
        label="In Review"
        sub="CI · adversarial review · gate"
      />
      <FlowArrow direction="down" label="gate passes · merge" />
      <FlowNode dot="pink" label="Done" sub="merged + deployed + smoke-passed" />
    </FlowDiagram>
  )
}
