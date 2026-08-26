// src/features/editor-file-upload/api/register-temp-file.api.ts
import { axiosInstance } from '@/shared/api'
import { type RegisterTempFileCommand } from '../model/register-temp-file.command'
import { type TempFileRegisteredResponse } from '../model/temp-file-registered.response'

export const registerTempFileApi = async (
  command: RegisterTempFileCommand
): Promise<TempFileRegisteredResponse> => {
  const formData = new FormData()
  formData.append('file', command.file)
  formData.append('refType', command.refType || 'DOWN_ATTACHMENT')
  formData.append('assignedTechnician', JSON.stringify(command.assignedTechnician))
  if (command.refId) {
    formData.append('refId', command.refId)
  }

  const response = await axiosInstance.post<TempFileRegisteredResponse>(
    '/feature/file-handler/register-temp-file/command',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  )
  return response.data
}