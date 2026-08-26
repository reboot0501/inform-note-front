// src/widgets/down-event-card/ui/down-event-card.container.tsx
import React, { useState } from 'react';
import type { DownEventCard as DownEventCardEntity } from '@/entities/down-event-card/model/down-event-card.entity';
import { useActionPopupQuery } from '@/features/action-popup-seach';
import { DownEventCardHeader } from './down-event-card-widget.header';
import { DownEventCardSummary } from './down-event-card-widget.summary';
import { DownEventCardDetail, type DownEventDetailData } from './down-event-card-widget.detail';

export interface DownEventCardProps {
  data: DownEventCardEntity;
  detailData?: DownEventDetailData;
  mode?: 'view' | 'edit';
  onEditClick?: () => void;
  onSave?: (updatedDetail: DownEventDetailData) => void;
  onCancel?: () => void;
  className?: string;
  rowNumber?: number;
  totalRows?: number;
  enableDetailFetch?: boolean;
}

export const DownEventCard: React.FC<DownEventCardProps> = ({
  data,
  detailData: customDetailData,
  mode: controlledMode,
  onEditClick,
  onSave,
  onCancel,
  className = '',
  rowNumber,
  totalRows,
  enableDetailFetch = true,
}) => {
  // 내부 모드 상태 (외부에서 제어되지 않을 경우 지원)
  const [internalMode, setInternalMode] = useState<'view' | 'edit'>('view');
  const currentMode = controlledMode ?? internalMode;

  // 가상 스크롤에 의해 DOM에 마운트된 각 카드 단위로 findActionPopupApi 병렬 비동기 호출 & L2 캐싱
  const { data: actionDetail, isLoading: isLoadingDetail } = useActionPopupQuery(
    data.downEventId,
    enableDetailFetch
  );

  // 메타데이터와 단건 API 조회 결과 merge
  const displayData: DownEventCardEntity = {
    ...data,
    ...(actionDetail ? actionDetail : {}),
  };

  // 상세 데이터 구성 (contentHtml 포함 merge)
  const mergedDetailData: DownEventDetailData = {
    ...customDetailData,
    ...(actionDetail?.contentHtml ? { detailHtml: actionDetail.contentHtml } : {}),
  };

  const handleEditClick = () => {
    if (onEditClick) {
      onEditClick();
    } else {
      setInternalMode('edit');
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      setInternalMode('view');
    }
  };

  const handleSave = (updatedDetail: DownEventDetailData) => {
    if (onSave) {
      onSave(updatedDetail);
    }
    if (!controlledMode) {
      setInternalMode('view');
    }
  };

  return (
    <div
      className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md ${className}`}
    >
      {/* 1. Header 영역 (장비명, 알람코드, 상태 배지, Row 번호) */}
      <DownEventCardHeader
        downEventId={displayData.downEventId}
        equipmentId={displayData.equipmentId}
        chamberId={displayData.chamberId}
        workStatus={displayData.workStatus}
        isCritical={displayData.isCritical ?? (displayData as any).critical}
        rowNumber={rowNumber}
        totalRows={totalRows}
      />

      {/* 2. Summary Table 영역 (장비, 일시, 원인, 담당자 등) */}
      <DownEventCardSummary
        equipmentId={displayData.equipmentId}
        chamberId={displayData.chamberId}
        downStartDatetime={displayData.downStartDatetime}
        downEndDatetime={displayData.downEndDatetime}
        downDurationMinutes={displayData.downDurationMinutes}
        downCode={displayData.downCode}
        downCodeDescription={displayData.downCodeDescription}
        alarmId={displayData.alarmId}
        assignedTechnician={displayData.assignedTechnician}
        approver={displayData.approver}
        partReplacements={displayData.partReplacements}
      />

      {/* 3. Detail 영역 (현상 및 조치 상세 / contentHtml 및 이미지 병렬 렌더링) */}
      <DownEventCardDetail
        detailData={mergedDetailData}
        isLoading={isLoadingDetail}
        mode={currentMode}
        onEditClick={handleEditClick}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};
