//
import { post } from '@/shared/api'
import { type CorrectiveActionCommand } from '../model/corrective-action.command'

export const correctiveActionApi = async (
  command: CorrectiveActionCommand
): Promise<string> => {
  return post<string, CorrectiveActionCommand>(
    '/feature/maintenance/corrective-action/command',
    command
  )
}