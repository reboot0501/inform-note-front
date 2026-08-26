//  src/features/editor-file-upload/model/register-temp-file.command.ts
import { type AssignedTechnician } from '@/entities/down-event-card'
import { type FileRefType } from '@/entities/file/model'

export interface RegisterTempFileCommand {
  file: File
  refType: FileRefType
  assignedTechnician: AssignedTechnician
  refId?: string
}