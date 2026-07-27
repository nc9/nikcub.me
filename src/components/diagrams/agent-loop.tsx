import { FlowArrow, FlowDiagram, FlowLoop, FlowNode } from "./flow"

/** The coding-agent loop from "How I Use Coding Agent Loops and Save Tokens". */
export function AgentLoopDiagram() {
  return (
    <FlowDiagram caption="One pass of the loop — every issue gets a cold session; state lives in the issue, the board, and the PR.">
      <FlowNode label="claim issue" sub="board: Ready" />
      <FlowArrow />
      <FlowNode label="worktree" />
      <FlowArrow />
      <FlowNode label="implement" sub="headless session" />
      <FlowArrow />
      <FlowNode label="PR" />
      <FlowArrow />
      <FlowNode label="CI" />
      <FlowArrow />
      <FlowNode label="adversarial review" sub="second session" />
      <FlowArrow />
      <FlowNode accent label="deterministic gate" sub="code, not a prompt" />
      <FlowArrow />
      <FlowNode label="merge or block" />
      <FlowLoop label="next issue" />
    </FlowDiagram>
  )
}
