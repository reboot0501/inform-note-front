// src/features/technician-select/model/find-technicians.fetch.ts
import { type EmployeeSearchCriteria } from '@/entities/employees/model'

export interface FindTechniciansFetch {
  criteria: EmployeeSearchCriteria
}