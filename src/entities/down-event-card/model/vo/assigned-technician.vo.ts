// src/entities/down-event-card/model/vo/assigned-technician.vo.ts
import { type Shift } from './shift.enum'

export interface AssignedTechnician {
    empNo: string
    name: string
    jobTitle: string
    shift: Shift
}