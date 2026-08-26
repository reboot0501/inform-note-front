// src/entities/employees/model/vo/employee-search-criteria.vo.ts
export interface EmployeeSearchCriteria {
	namePattern?: string
	page?: number
	size?: number
	offset?: number
	limit?: number
}
