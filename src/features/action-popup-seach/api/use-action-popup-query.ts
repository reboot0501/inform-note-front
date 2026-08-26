// src/features/action-popup-seach/api/use-action-popup-query.ts
import { useQuery } from '@tanstack/react-query';
import { findActionPopupApi } from './find-action-popup.api';
import type { ActionPopupResponse } from '../model/action-popup.response';

export const actionPopupQueryKeys = {
  all: ['action-popup-detail'] as const,
  detail: (downEventId?: string) => ['action-popup-detail', downEventId] as const,
};

/**
 * downEventId 기준으로 현상 및 조치 상세 HTML 본문 병렬 비동기 조회 및 L2 캐싱
 */
export function useActionPopupQuery(
  downEventId?: string,
  enabled: boolean = true,
  rowNumber?: number,
  totalRows?: number
) {
  return useQuery<ActionPopupResponse>({
    queryKey: actionPopupQueryKeys.detail(downEventId),
    queryFn: async () => {
      if (!downEventId) {
        throw new Error('downEventId가 필요합니다.');
      }
      if (typeof window !== 'undefined') {
        const rowText = rowNumber
          ? totalRows
            ? `(Row: #${rowNumber} / ${totalRows})`
            : `(Row: #${rowNumber})`
          : '';
        window.alert(`신규 데이터 api 요청 : ${downEventId} ${rowText}`.trim());
      }
      return await findActionPopupApi({ downEventId });
    },
    enabled: enabled && !!downEventId,
    staleTime: 1000 * 60 * 10, // 10분간 신선 상태 유지
    gcTime: 1000 * 60 * 30,    // 30분간 캐시 보관 (가비지 컬렉션 지연)
  });
}
