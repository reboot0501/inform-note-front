// src/entities/down-event-card/model/vo/part-replacement.vo.ts
import { type ReplacementType } from './replacement-type.enum'

export interface PartReplacement {
    replacementType: ReplacementType
    partNo: string
    partName: string
    qty: number
}