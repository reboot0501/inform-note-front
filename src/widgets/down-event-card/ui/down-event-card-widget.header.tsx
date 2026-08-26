// src/widgets/down-event-card/ui/down-event-card.header.tsx
import React from 'react';
import { Activity, AlertTriangle, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import type { WorkStatus } from '@/entities/down-event-card/model/vo/work-status.enum';

export interface DownEventCardHeaderProps {
  downEventId: string;
  equipmentId: string;
  chamberId: string;
  workStatus: WorkStatus;
  isCritical?: boolean;
  rowNumber?: number;
  totalRows?: number;
}

/**
 * 상태별 배지 스타일 및 텍스트/아이콘 매핑
 */
const STATUS_CONFIG: Record<
  WorkStatus,
  { label: string; bgClass: string; textClass: string; borderClass: string; icon: React.ReactNode }
> = {
  VERIFIED: {
    label: 'VERIFIED (검증완료)',
    bgClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    textClass: 'text-emerald-700 dark:text-emerald-300',
    borderClass: 'border-emerald-200 dark:border-emerald-800',
    icon: <Activity className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />,
  },
  ACTION_DONE: {
    label: 'ACTION_DONE (조치완료)',
    bgClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    textClass: 'text-blue-700 dark:text-blue-300',
    borderClass: 'border-blue-200 dark:border-blue-800',
    icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-blue-600 dark:text-blue-400" />,
  },
  IN_PROGRESS: {
    label: 'IN_PROGRESS (조치중)',
    bgClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    textClass: 'text-amber-700 dark:text-amber-300',
    borderClass: 'border-amber-200 dark:border-amber-800',
    icon: <Clock className="w-3.5 h-3.5 mr-1 text-amber-600 dark:text-amber-400" />,
  },
  DOWN_OCCURRED: {
    label: 'DOWN_OCCURRED (다운발생)',
    bgClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
    textClass: 'text-rose-700 dark:text-rose-300',
    borderClass: 'border-rose-200 dark:border-rose-800',
    icon: <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-600 dark:text-rose-400" />,
  },
  CLOSED: {
    label: 'CLOSED (종료)',
    bgClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    textClass: 'text-slate-700 dark:text-slate-300',
    borderClass: 'border-slate-200 dark:border-slate-700',
    icon: <ShieldCheck className="w-3.5 h-3.5 mr-1 text-slate-600 dark:text-slate-400" />,
  },
};

export const DownEventCardHeader: React.FC<DownEventCardHeaderProps> = ({
  downEventId,
  equipmentId,
  chamberId,
  workStatus,
  isCritical,
  rowNumber,
  totalRows,
}) => {
  const statusMeta = STATUS_CONFIG[workStatus] || {
    label: workStatus,
    bgClass: 'bg-muted text-muted-foreground',
    textClass: 'text-muted-foreground',
    borderClass: 'border-border',
    icon: null,
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 rounded-t-xl">
      <div className="flex flex-wrap items-center gap-2.5">
        {/* 다운 이벤트 식별자 ID */}
        <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-tight">
          {downEventId.startsWith('#') ? downEventId : `#${downEventId}`}
        </span>

        {/* 장비 ID / Chamber */}
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {equipmentId} / {chamberId}
        </h2>

        {/* Critical 배지 */}
        {isCritical && (
          <Badge variant="destructive" className="h-5 px-1.5 text-[10px] font-bold tracking-wider uppercase">
            CRITICAL
          </Badge>
        )}

        {/* 상태 배지 */}
        <div
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusMeta.bgClass} ${statusMeta.borderClass}`}
        >
          {statusMeta.icon}
          <span>{statusMeta.label}</span>
        </div>
      </div>

      {/* 우측 끝: 현재 페이지 기준 Row 번호 및 전체 Row 수 */}
      {rowNumber !== undefined && (
        <div className="flex items-center">
          <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs">
            [ row : {rowNumber} / {totalRows ?? '-'} ]
          </span>
        </div>
      )}
    </div>
  );
};
