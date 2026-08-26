import React, { useState } from 'react';
import {
  AlertTriangle,
  Check,
  FileImage,
  LineChart,
  Loader2,
  Pencil,
  Save,
  X,
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Input } from '@/shared/ui/input';
import { openImageViewerWindow } from '@/shared/lib/image-viewer-popup';

import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

export interface DownEventDetailData {
  // 현상 서술 (Symptom)
  symptomName?: string;
  targetValue?: string;
  actualValue?: string;
  alarmId?: string;
  causeAnalysis?: string[];
  symptomAttachmentName?: string;

  // 조치 내용 (Action)
  actionName?: string;
  additionalAction?: string;
  verificationResults?: string[];
  approvalNote?: string;
  actionAttachmentName?: string;

  // Rich Text HTML (선택적)
  detailHtml?: string;
}

export interface DownEventCardDetailProps {
  detailData?: DownEventDetailData;
  isLoading?: boolean;
  mode?: 'view' | 'edit';
  onEditClick?: () => void;
  onSave?: (updatedDetail: DownEventDetailData) => void;
  onCancel?: () => void;
}

/** 기본 더미 데이터 (이미지 기준) */
const DEFAULT_DETAIL_DATA: DownEventDetailData = {
  symptomName: 'Heater 온도 편차',
  targetValue: '450℃',
  actualValue: '435℃',
  alarmId: 'ALARM-3044',
  causeAnalysis: [
    'Heater Block 2번 Zone 열선 단선(Open Circuit)',
    '저항 측정 결과 무한대(∞)',
  ],
  symptomAttachmentName: '단선된 Heater 열선 사진',
  actionName: 'Heater Block 교체 (P/N: HT-200X)',
  additionalAction: 'Auto-tuning PID 파라미터 최적화',
  verificationResults: [
    'Target 450℃ 기준 ±0.5℃ 이내 안정 제어',
    'Ellipsometer 두께 측정 Spec In',
  ],
  approvalNote: 'Heater 교체 후 정상 동작 확인 → 양산 투입 승인',
  actionAttachmentName: 'Heater Temp Tracking Graph',
};

export const DownEventCardDetail: React.FC<DownEventCardDetailProps> = ({
  detailData = DEFAULT_DETAIL_DATA,
  isLoading = false,
  mode = 'view',
  onEditClick,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<DownEventDetailData>(detailData);

  const handleSave = () => {
    onSave?.(formData);
  };

  // HTML 본문 내부 이미지 클릭 시 이미지 확대 팝업 오픈 (이벤트 위임)
  const handleHtmlContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target && target.tagName.toLowerCase() === 'img') {
      const img = target as HTMLImageElement;
      if (img.src) {
        openImageViewerWindow(img.src, img.alt || '현상 및 조치 상세 이미지 확대 보기');
      }
    }
  };

  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-b-xl">
      {/* 1. 상단 섹션 타이틀 & 액션 버튼 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-purple-600 dark:bg-purple-400 rounded-full" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            현상 및 조치 상세
          </h3>
          {isLoading && (
            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1 ml-2 animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" /> HTML 본문 로딩 중...
            </span>
          )}
        </div>

        {mode === 'view' ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onEditClick}
            disabled={isLoading}
            className="h-8 px-3 text-xs gap-1.5 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Pencil className="w-3.5 h-3.5 text-slate-500" />
            수정 / 추가
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="h-8 px-3 text-xs gap-1"
            >
              <X className="w-3.5 h-3.5" />
              취소
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="h-8 px-3 text-xs gap-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Save className="w-3.5 h-3.5" />
              저장
            </Button>
          </div>
        )}
      </div>

      {/* 2. 로딩 상태 스켈레톤 표출 */}
      {isLoading ? (
        <div className="p-8 flex flex-col items-center justify-center gap-2.5 bg-slate-50/70 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 min-h-[140px] animate-pulse">
          <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            현상 및 조치 상세 HTML 본문과 이미지를 병렬 로딩 중입니다...
          </span>
        </div>
      ) : mode === 'view' && detailData.detailHtml ? (
        /* 3. HTML Raw 렌더링 (Froala fr-view 클래스 적용 및 이미지 클릭 이벤트 바인딩) */
        <div
          className="fr-view p-4 rounded-lg bg-slate-50/60 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs overflow-hidden"
          onClick={handleHtmlContainerClick}
          dangerouslySetInnerHTML={{ __html: detailData.detailHtml }}
        />
      ) : mode === 'view' ? (
        /* 4. View Mode: 2열 구조화 카드 레이아웃 (이미지 1:1 매칭) */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* [Left] 현상 서술 (SYMPTOM) */}
          <div className="flex flex-col rounded-lg border border-slate-200 dark:border-slate-800 border-t-4 border-t-amber-500 bg-white dark:bg-slate-900 shadow-2xs overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-amber-50/40 dark:bg-amber-950/20 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  현상 서술
                </span>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] font-bold text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/40"
              >
                SYMPTOM
              </Badge>
            </div>

            {/* Content Body */}
            <div className="p-4 flex-1 flex flex-col justify-between gap-4 text-xs">
              {/* 항목 테이블 */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden">
                <div className="grid grid-cols-12 border-b border-slate-100 dark:border-slate-800">
                  <div className="col-span-4 bg-slate-50 dark:bg-slate-800/60 p-2 font-medium text-slate-500 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800">
                    발생 현상
                  </div>
                  <div className="col-span-8 p-2 font-semibold text-slate-800 dark:text-slate-200">
                    {detailData.symptomName || '-'}
                  </div>
                </div>

                <div className="grid grid-cols-12 border-b border-slate-100 dark:border-slate-800">
                  <div className="col-span-4 bg-slate-50 dark:bg-slate-800/60 p-2 font-medium text-slate-500 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800">
                    목표 온도
                  </div>
                  <div className="col-span-8 p-2 text-slate-700 dark:text-slate-300 font-mono">
                    {detailData.targetValue || '-'}
                  </div>
                </div>

                <div className="grid grid-cols-12 border-b border-slate-100 dark:border-slate-800">
                  <div className="col-span-4 bg-slate-50 dark:bg-slate-800/60 p-2 font-medium text-slate-500 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800">
                    실제 온도
                  </div>
                  <div className="col-span-8 p-2 text-rose-600 dark:text-rose-400 font-bold font-mono">
                    {detailData.actualValue || '-'}
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-4 bg-slate-50 dark:bg-slate-800/60 p-2 font-medium text-slate-500 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800">
                    관련 알람
                  </div>
                  <div className="col-span-8 p-2 text-slate-700 dark:text-slate-300 font-mono">
                    {detailData.alarmId || '-'}
                  </div>
                </div>
              </div>

              {/* 원인 분석 */}
              {detailData.causeAnalysis && detailData.causeAnalysis.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                    <span className="text-[10px]">▶</span>
                    <span>원인 분석</span>
                  </div>
                  <ul className="space-y-1 pl-1 text-slate-700 dark:text-slate-300">
                    {detailData.causeAnalysis.map((cause, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-slate-400 font-bold">•</span>
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 사진 / 첨부 영역 */}
              <div className="mt-2 p-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 transition-colors">
                <FileImage className="w-4 h-4 text-slate-400" />
                <span>{detailData.symptomAttachmentName || '첨부 사진 없음'}</span>
              </div>
            </div>
          </div>

          {/* [Right] 조치 내용 (ACTION) */}
          <div className="flex flex-col rounded-lg border border-slate-200 dark:border-slate-800 border-t-4 border-t-blue-500 bg-white dark:bg-slate-900 shadow-2xs overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-blue-50/40 dark:bg-blue-950/20 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 stroke-[3]" />
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  조치 내용
                </span>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] font-bold text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700/60 bg-blue-50 dark:bg-blue-950/40"
              >
                ACTION
              </Badge>
            </div>

            {/* Content Body */}
            <div className="p-4 flex-1 flex flex-col justify-between gap-4 text-xs">
              {/* 항목 테이블 */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden">
                <div className="grid grid-cols-12 border-b border-slate-100 dark:border-slate-800">
                  <div className="col-span-4 bg-slate-50 dark:bg-slate-800/60 p-2 font-medium text-slate-500 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800">
                    수행 조치
                  </div>
                  <div className="col-span-8 p-2 font-semibold text-slate-800 dark:text-slate-200">
                    {detailData.actionName || '-'}
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-4 bg-slate-50 dark:bg-slate-800/60 p-2 font-medium text-slate-500 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800">
                    추가 조치
                  </div>
                  <div className="col-span-8 p-2 text-slate-700 dark:text-slate-300">
                    {detailData.additionalAction || '-'}
                  </div>
                </div>
              </div>

              {/* 검증 결과 */}
              {detailData.verificationResults && detailData.verificationResults.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                    <span className="text-[10px]">▶</span>
                    <span>검증 결과</span>
                  </div>
                  <ul className="space-y-1 pl-1 text-slate-700 dark:text-slate-300">
                    {detailData.verificationResults.map((result, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 승인 코멘트 박스 */}
              {detailData.approvalNote && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-slate-700 dark:text-slate-300 font-medium">
                  {detailData.approvalNote}
                </div>
              )}

              {/* 그래프 / 첨부 영역 */}
              <div className="mt-2 p-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 transition-colors">
                <LineChart className="w-4 h-4 text-slate-400" />
                <span>{detailData.actionAttachmentName || '첨부 데이터 없음'}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 4. Edit Mode: 입력 폼 */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 현상 서술 폼 */}
          <div className="p-4 rounded-lg border border-amber-300 bg-amber-50/20 dark:bg-amber-950/10 space-y-3">
            <h4 className="font-bold text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> 현상 서술 수정
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">발생 현상</label>
                <Input
                  value={formData.symptomName || ''}
                  onChange={(e) => setFormData({ ...formData, symptomName: e.target.value })}
                  placeholder="발생 현상을 입력하세요"
                  className="h-8 text-xs bg-white dark:bg-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">목표 온도/수치</label>
                  <Input
                    value={formData.targetValue || ''}
                    onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                    placeholder="예: 450℃"
                    className="h-8 text-xs bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">실제 온도/수치</label>
                  <Input
                    value={formData.actualValue || ''}
                    onChange={(e) => setFormData({ ...formData, actualValue: e.target.value })}
                    placeholder="예: 435℃"
                    className="h-8 text-xs bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">원인 분석 (줄바꿈으로 구분)</label>
                <textarea
                  value={formData.causeAnalysis?.join('\n') || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      causeAnalysis: e.target.value.split('\n').filter(Boolean),
                    })
                  }
                  rows={3}
                  className="w-full rounded-md border border-slate-200 dark:border-slate-700 p-2 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder="원인 분석 항목을 입력하세요"
                />
              </div>
            </div>
          </div>

          {/* 조치 내용 폼 */}
          <div className="p-4 rounded-lg border border-blue-300 bg-blue-50/20 dark:bg-blue-950/10 space-y-3">
            <h4 className="font-bold text-xs text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
              <Check className="w-4 h-4 stroke-[3]" /> 조치 내용 수정
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">수행 조치</label>
                <Input
                  value={formData.actionName || ''}
                  onChange={(e) => setFormData({ ...formData, actionName: e.target.value })}
                  placeholder="수행 조치 내용을 입력하세요"
                  className="h-8 text-xs bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">추가 조치</label>
                <Input
                  value={formData.additionalAction || ''}
                  onChange={(e) => setFormData({ ...formData, additionalAction: e.target.value })}
                  placeholder="추가 조치 내용을 입력하세요"
                  className="h-8 text-xs bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">검증 결과 (줄바꿈으로 구분)</label>
                <textarea
                  value={formData.verificationResults?.join('\n') || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      verificationResults: e.target.value.split('\n').filter(Boolean),
                    })
                  }
                  rows={2}
                  className="w-full rounded-md border border-slate-200 dark:border-slate-700 p-2 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="검증 결과를 입력하세요"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">승인 코멘트</label>
                <Input
                  value={formData.approvalNote || ''}
                  onChange={(e) => setFormData({ ...formData, approvalNote: e.target.value })}
                  placeholder="승인 코멘트를 입력하세요"
                  className="h-8 text-xs bg-white dark:bg-slate-900"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
