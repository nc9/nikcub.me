import type { ComponentType } from "react"
import { AgentLoopDiagram } from "./agent-loop"
import { AuditBoardDiagram } from "./audit-board"

/**
 * Diagrams embeddable from markdown via `<div data-diagram="name"></div>`.
 * Every diagram ships in the post bundle, so keep entries lightweight;
 * switch to React.lazy if this grows heavy.
 */
export const DIAGRAMS: Record<string, ComponentType> = {
  "agent-loop": AgentLoopDiagram,
  "audit-board": AuditBoardDiagram,
}
