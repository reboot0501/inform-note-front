// src/features/technician-select/api/find-technicians.api.ts
import { post, type OffsetElementList } from '@/shared/api'
import { type ExtractEmployee } from '@/entities/employees/model'
import { type FindTechniciansFetch } from '../model/find-technicians.fetch'

export const findTechniciansApi = async (
  request: FindTechniciansFetch
): Promise<OffsetElementList<ExtractEmployee>> => {
  return post<OffsetElementList<ExtractEmployee>, FindTechniciansFetch>(
    '/feature/maintenance/find-technicians/fetch',
    request
  )
}