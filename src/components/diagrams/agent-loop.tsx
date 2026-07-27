import { FlowArrow, FlowDiagram, FlowNode, FlowReturn } from "./flow"

/** The coding-agent loop from "How I Use Coding Agent Loops and Save Tokens". */
export function AgentLoopDiagram() {
  return (
    <FlowDiagram
      layout="column"
      returnLabel="next issue"
      caption="One pass of the loop: every issue gets a cold session; state lives in the issue, the board, and the PR."
    >
      {/* inner loop: review findings go back to code (implement=3 … review=6) */}
      <FlowReturn side="right" from={3} to={6} label="fix findings" />
      <FlowNode label="claim an issue" sub="board status: Ready" />
      <FlowArrow direction="down" />
      <FlowNode label="worktree" sub="isolated checkout" />
      <FlowArrow direction="down" />
      <FlowNode label="implement" sub="headless session · cold start" />
      <FlowArrow direction="down" />
      <FlowNode label="open PR" sub="the work, on record" />
      <FlowArrow direction="down" />
      <FlowNode label="CI" />
      <FlowArrow direction="down" label="green" />
      <FlowNode label="adversarial review" sub="second cold session" />
      <FlowArrow direction="down" label="rubric = acceptance criteria" />
      <FlowNode accent label="deterministic gate" sub="code, not a prompt" />
      <FlowArrow direction="down" />
      <FlowNode label="merge or block" />
    </FlowDiagram>
  )
}
