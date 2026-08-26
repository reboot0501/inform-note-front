// src/entities/employees/model/vo/extract-employee.vo.ts
import type { Shift } from '../../../down-event-card/model/vo/shift.enum'

export interface ExtractEmployee {
	empNo: string
	name: string
	departmentId: string
	departmentName: string
	jobId: string
	jobTitle: string
	shift: Shift
}
