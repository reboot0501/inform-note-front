//
import { type AssignedTechnician, type PartReplacement, type WorkStatus } from '@/entities/down-event-card'

export interface CorrectiveActionCommand {
  downEventId: string
  assignedTechnician: AssignedTechnician
  partReplacements?: PartReplacement[]
  contentHtml?: string
  workStatus: WorkStatus
}