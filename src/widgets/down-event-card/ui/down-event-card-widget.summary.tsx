// src/widgets/down-event-card/ui/down-event-card.summary.tsx
import React from 'react';
import dayjs from 'dayjs';
import type { AssignedTechnician } from '@/entities/down-event-card/model/vo/assigned-technician.vo';
import type { Approver } from '@/entities/down-event-card/model/vo/approver.vo';
import type { PartReplacement } from '@/entities/down-event-card/model/vo/part-replacement.vo';

export interface DownEventCardSummaryProps {
  equipmentId: string;
  chamberId: string;
  downStartDatetime: number;
  downEndDatetime?: number;
  downDurationMinutes?: number;
  downCode: string;
  downCodeDescription?: string;
  alarmId?: string;
  assignedTechnician: AssignedTechnician;
  approver: Approver;
  partReplacements: PartReplacement[];
}

/**
 * 분 단위를 'X시간 Y분' 형식으로 변환
 */
function formatDuration(minutes?: number): string {
  if (minutes === undefined || minutes === null) return '-';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours > 0 && remainingMinutes > 0) {
    return `${hours}시간 ${remainingMinutes}분`;
  }
  if (hours > 0) {
    return `${hours}시간`;
  }
  return `${remainingMinutes}분`;
}

/**
 * Epoch ms를 'YYYY-MM-DD HH:mm:ss'로 변환
 */
function formatDateTime(epochMs?: number): string {
  if (!epochMs) return '-';
  return dayjs(epochMs).format('YYYY-MM-DD HH:mm:ss');
}

export const DownEventCardSummary: React.FC<DownEventCardSummaryProps> = ({
  equipmentId,
  chamberId,
  downStartDatetime,
  downEndDatetime,
  downDurationMinutes,
  downCode,
  downCodeDescription,
  alarmId,
  assignedTechnician,
  approver,
  partReplacements,
}) => {
  const durationText = formatDuration(
    downDurationMinutes ??
      (downEndDatetime && downStartDatetime
        ? Math.round((downEndDatetime - downStartDatetime) / (1000 * 60))
        : undefined)
  );

  return (
    <div className="overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="grid grid-cols-1 md:grid-cols-12 text-xs border-t border-slate-200 dark:border-slate-800">
        {/* Row 1: 장비 ID / Chamber & Down 발생 / 복구 일시 */}
        <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/60 p-3 font-medium text-slate-600 dark:text-slate-300 border-b md:border-r border-slate-200 dark:border-slate-800 flex items-center">
          장비 ID / Chamber
        </div>
        <div className="md:col-span-4 p-3 text-slate-800 dark:text-slate-200 font-semibold border-b md:border-r border-slate-200 dark:border-slate-800 flex items-center">
          {equipmentId} / {chamberId}
        </div>

        <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/60 p-3 font-medium text-slate-600 dark:text-slate-300 border-b md:border-r border-slate-200 dark:border-slate-800 flex items-center">
          Down 발생 / 복구 일시
        </div>
        <div className="md:col-span-4 p-3 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-mono text-[11px] flex items-center">
          {formatDateTime(downStartDatetime)} ~ {downEndDatetime ? formatDateTime(downEndDatetime) : '조치 진행 중'}
        </div>

        {/* Row 2: Down 코드 / 알람 */}
        <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/60 p-3 font-medium text-slate-600 dark:text-slate-300 border-b md:border-r border-slate-200 dark:border-slate-800 flex items-center">
          Down 코드 / 알람
        </div>
        <div className="md:col-span-10 p-3 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
          <span className="font-bold text-indigo-700 dark:text-indigo-400">
            {downCode}
          </span>
          {downCodeDescription && (
            <span className="text-slate-700 dark:text-slate-300">
              ({downCodeDescription})
            </span>
          )}
          {alarmId && (
            <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px] ml-1">
              Alarm ID: {alarmId}
            </span>
          )}
        </div>

        {/* Row 3: Down 시간 (총 소요) & 보전 작업자 / 승인자 */}
        <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/60 p-3 font-medium text-slate-600 dark:text-slate-300 border-b md:border-r border-slate-200 dark:border-slate-800 flex items-center">
          Down 시간 (총 소요)
        </div>
        <div className="md:col-span-4 p-3 text-slate-800 dark:text-slate-200 font-semibold border-b md:border-r border-slate-200 dark:border-slate-800 flex items-center">
          {durationText}
        </div>

        <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/60 p-3 font-medium text-slate-600 dark:text-slate-300 border-b md:border-r border-slate-200 dark:border-slate-800 flex items-center">
          보전 작업자 / 승인자
        </div>
        <div className="md:col-span-4 p-3 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          {assignedTechnician && (
            <span>
              <strong className="text-slate-900 dark:text-slate-100 font-semibold">[작업]</strong> {assignedTechnician.name} {assignedTechnician.jobTitle}
            </span>
          )}
          {approver && approver.name && (
            <span>
              <strong className="text-slate-900 dark:text-slate-100 font-semibold">[승인]</strong> {approver.name} {approver.jobTitle}
            </span>
          )}
        </div>

        {/* Row 4: 교체 부품 / 사용 자재 */}
        <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/60 p-3 font-medium text-slate-600 dark:text-slate-300 md:border-r border-slate-200 dark:border-slate-800 flex items-center">
          교체 부품 / 사용 자재
        </div>
        <div className="md:col-span-10 p-3 text-slate-800 dark:text-slate-200 flex flex-wrap items-center gap-2">
          {partReplacements && partReplacements.length > 0 ? (
            partReplacements.map((part, index) => (
              <span
                key={`${part.partNo}-${index}`}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
              >
                <span className="font-medium">{part.partName}</span>
                <span className="text-slate-500 font-mono text-[11px]">(P/N: {part.partNo})</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">×{part.qty}</span>
              </span>
            ))
          ) : (
            <span className="text-slate-400">교체 내역 없음</span>
          )}
        </div>
      </div>
    </div>
  );
};
