// src/entities/down-event-card/down-event-card.entity.ts

import type { FabricationPlant } from "./vo/fabrication-plant.enum";
import type { ProcessModule } from "./vo/process-module.enum";
import type { EquipmentModel } from "./vo/equipment-model.enum";
import type { DownType } from "./vo/down-type.enum";
import type { WorkStatus } from "./vo/work-status.enum";

import type { AssignedTechnician } from "./vo/assigned-technician.vo";
import type { Approver } from "./vo/approver.vo";
import type { PartReplacement } from "./vo/part-replacement.vo";

export interface DownEventCard {
  // [식별자]
  downEventId: string;
  equipmentId: string;
  chamberId: string;

  // [Enums]
  fabricationPlant: FabricationPlant;
  processModule: ProcessModule;
  equipmentModel: EquipmentModel;
  downType: DownType;
  workStatus: WorkStatus;

  // [일시 및 소요시간 (Epoch Milliseconds)]
  downStartDatetime: number;
  downEndDatetime?: number;
  downDurationMinutes?: number;

  // [Critical 여부]
  isCritical: boolean;

  // [다운 코드 및 알람]
  downCode: string;
  downCodeDescription: string;
  alarmId: string;

  // [Native JSON 매핑 VO 객체 및 리스트]
  assignedTechnician: AssignedTechnician;
  approver: Approver;
  partReplacements: PartReplacement[];

  // [감사 메타]
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}