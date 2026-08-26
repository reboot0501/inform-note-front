import type { FabricationPlant } from './fabrication-plant.enum'
import type { ProcessModule } from './process-module.enum'
import type { EquipmentModel } from './equipment-model.enum'
import type { DownType } from './down-type.enum'
import type { WorkStatus } from './work-status.enum'
import type { Shift } from './shift.enum'

export interface DownEventCardSearchCriteria {
    // 1행 검색 조건
    fabricationPlant?: FabricationPlant
    processModule?: ProcessModule
    equipmentModel?: EquipmentModel
    equipmentId?: string
    keyword?: string
    isCritical?: boolean

    // 2행 검색 조건
    downType?: DownType
    workStatus?: WorkStatus
    shift?: Shift
    technician?: string
    downStartDatetimeFrom?: number
    downStartDatetimeTo?: number

    // 정렬 조건
    sortBy?: string
    sortDirection?: 'ASC' | 'DESC'

    // page/size 또는 offset/limit 방식의 페이징 조건
    page?: number
    size?: number
    offset?: number
    limit?: number
}