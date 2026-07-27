import { FlowArrow, FlowDiagram, FlowNode } from "./flow"

/**
 * Step 5: the PR checks panel as the gate's input strip. Both signal sources
 * arrive on the PR — CI as check runs, cloud review as a severity-tagged bot
 * comment — before the deterministic gate consumes them in a fixed order.
 */
export function PrChecksDiagram() {
  return (
    <FlowDiagram caption="Everything the gate reads arrives on the PR: CI conclusions as check runs, review findings as one bot's severity-tagged comment. The gate consumes them in a fixed order — it never asks a model.">
      <FlowNode
        dot="green"
        label="CI"
        sub="format · lint · typecheck · tests"
      />
      <FlowArrow label="check runs" />
      <FlowNode
        dot="purple"
        label="cloud review"
        sub="claude-review · greptile · bugbot"
      />
      <FlowArrow label="(high) blocks · nits don't" />
      <FlowNode accent label="gate" sub="code, not a prompt" />
    </FlowDiagram>
  )
}
