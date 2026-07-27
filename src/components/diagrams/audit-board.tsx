import { KanbanBoard, KanbanCard, KanbanColumn } from "./kanban"

/**
 * The squirrelscan "Audit Loop" GitHub Projects board. Columns, colors, and
 * column meanings mirror the real board; cards are real issues (titles
 * shortened). Draft — labels come next.
 */
export function AuditBoardDiagram() {
  return (
    <KanbanBoard caption="The board is the state machine — the loop only ever touches Ready, In Progress, and In Review.">
      <KanbanColumn color="gray" name="Draft" sub="loop ignores">
        <KanbanCard number={103} title="Google Search Console integration" />
        <KanbanCard number={99} title="content gap analysis rules" />
      </KanbanColumn>
      <KanbanColumn color="green" name="Ready" sub="criteria + size set">
        <KanbanCard number={1055} title="oauth: refresh-token grace window" />
        <KanbanCard number={1060} title="Sentry alert on cli_stall" />
        <KanbanCard number={1056} title="README rules table stale" />
      </KanbanColumn>
      <KanbanColumn color="blue" name="In Progress" sub="claimed by the loop">
        <KanbanCard number={992} title="render pipeline throughput" />
      </KanbanColumn>
      <KanbanColumn color="purple" name="In Review" sub="PR open + linked">
        <KanbanCard
          number={990}
          title="conditional-render reuse never bootstraps"
        />
      </KanbanColumn>
      <KanbanColumn color="red" name="Blocked" sub="human to resolve">
        <KanbanCard number={263} title="parallelize rule execution" />
        <KanbanCard number={78} title="reconcile prod schema drift" />
      </KanbanColumn>
      <KanbanColumn color="pink" name="Done" sub="merged + deployed">
        <KanbanCard number={1011} title="blog RSS feed" />
        <KanbanCard number={1051} title="unguarded cloud-audits route" />
        <KanbanCard number={991} title="hydration-timestamp fingerprints" />
      </KanbanColumn>
    </KanbanBoard>
  )
}
