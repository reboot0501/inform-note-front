import type { Shift } from '../../down-event-card/model/vo/shift.enum'

export interface Employees {
	employeeId: number
	empNo: string
	shift: Shift
	firstName: string
	lastName: string
	email: string
	phoneNumber: string
	hireDate: string
	jobId: string
	salary: number
	commissionPct: number
	managerId?: number
	departmentId?: number
}
