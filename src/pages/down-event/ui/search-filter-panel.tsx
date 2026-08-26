// src/pages/down-event/ui/search-filter-panel.tsx
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import type { FabricationPlant } from '@/entities/down-event-card/model/vo/fabrication-plant.enum';
import type { ProcessModule } from '@/entities/down-event-card/model/vo/process-module.enum';
import type { EquipmentModel } from '@/entities/down-event-card/model/vo/equipment-model.enum';
import type { DownType } from '@/entities/down-event-card/model/vo/down-type.enum';
import type { WorkStatus } from '@/entities/down-event-card/model/vo/work-status.enum';
import type { Shift } from '@/entities/down-event-card/model/vo/shift.enum';
import type { DownEventCardSearchCriteria } from '@/entities/down-event-card/model/vo/down-event-card-search-criteria.vo';

export interface FilterState extends DownEventCardSearchCriteria {
  dateRange?: string;
}

export interface SearchFilterPanelProps {
  initialFilters?: Partial<FilterState>;
  onSearch?: (filters: FilterState) => void;
  className?: string;
}

// 1. FAB/Site 옵션
const FAB_OPTIONS: { value: FabricationPlant | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체(FAB/Site)' },
  { value: 'FAB_1', label: 'FAB 1' },
  { value: 'FAB_2', label: 'FAB 2' },
  { value: 'FAB_3', label: 'FAB 3' },
  { value: 'RND_FAB', label: 'R&D FAB' },
  { value: 'PKG', label: 'PKG' },
];

// 2. Process Module 옵션
const PROCESS_MODULE_OPTIONS: { value: ProcessModule | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체(Process Module)' },
  { value: 'PHOTO', label: 'PHOTO (노광)' },
  { value: 'ETCH', label: 'ETCH (식각)' },
  { value: 'DIFF', label: 'DIFF (확산)' },
  { value: 'CMP', label: 'CMP (연마)' },
  { value: 'CVD', label: 'CVD (증착)' },
  { value: 'IMP', label: 'IMP (이온주입)' },
  { value: 'METAL', label: 'METAL (배선)' },
];

// 3. Equipment Model 옵션
const EQUIPMENT_MODEL_OPTIONS: { value: EquipmentModel | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체(Eqp Model)' },
  { value: 'ASML_NXT_1980DI', label: 'ASML NXT:1980Di' },
  { value: 'TEL_TACTRAS', label: 'TEL TACTRAS' },
  { value: 'LAM_KIYO_CX', label: 'LAM Kiyo CX' },
  { value: 'AMAT_PRODUCER', label: 'AMAT Producer' },
  { value: 'TEL_TRIAS', label: 'TEL Trias' },
  { value: 'AMAT_REFLEXION', label: 'AMAT Reflexion' },
  { value: 'KOKUSAI_ADVANCED', label: 'Kokusai Advanced' },
  { value: 'AXCELIS_PURION_H', label: 'Axcelis Purion H' },
  { value: 'KLA_2925', label: 'KLA 2925' },
];

// 4. Eqp ID 옵션 (대표 장비 식별자)
const EQUIPMENT_ID_OPTIONS = [
  { value: 'ALL', label: '전체(Eqp ID)' },
  { value: 'CVD-TEL-01', label: 'CVD-TEL-01' },
  { value: 'CVD-TEL-02', label: 'CVD-TEL-02' },
  { value: 'ETCH-LAM-01', label: 'ETCH-LAM-01' },
  { value: 'PHOTO-ASML-01', label: 'PHOTO-ASML-01' },
  { value: 'DIFF-KOK-01', label: 'DIFF-KOK-01' },
  { value: 'CMP-AMAT-01', label: 'CMP-AMAT-01' },
];

// 5. Down Type 옵션
const DOWN_TYPE_OPTIONS: { value: DownType | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체(Down Type)' },
  { value: 'HARDWARE', label: 'HARDWARE (하드웨어)' },
  { value: 'SOFTWARE', label: 'SOFTWARE (소프트웨어)' },
  { value: 'PROCESS', label: 'PROCESS (공정불량)' },
  { value: 'UTILITY', label: 'UTILITY (유틸리티)' },
  { value: 'OPTICAL', label: 'OPTICAL (광학계)' },
  { value: 'CONSUMABLE', label: 'CONSUMABLE (소모품)' },
  { value: 'PREVENTIVE', label: 'PREVENTIVE (예방보전)' },
  { value: 'OPERATOR', label: 'OPERATOR (작업자오류)' },
];

// 6. Work Status 옵션
const WORK_STATUS_OPTIONS: { value: WorkStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체(Work Status)' },
  { value: 'DOWN_OCCURRED', label: 'DOWN_OCCURRED (발생)' },
  { value: 'IN_PROGRESS', label: 'IN_PROGRESS (조치중)' },
  { value: 'ACTION_DONE', label: 'ACTION_DONE (조치완료)' },
  { value: 'VERIFIED', label: 'VERIFIED (검증완료)' },
  { value: 'CLOSED', label: 'CLOSED (종료)' },
];

// 7. Shift 옵션
const SHIFT_OPTIONS: { value: Shift | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체(Shift)' },
  { value: 'A', label: 'A조 (Day)' },
  { value: 'B', label: 'B조 (Swing)' },
  { value: 'C', label: 'C조 (Night)' },
];

// 8. Technician 담당자 옵션
const TECHNICIAN_OPTIONS = [
  { value: 'ALL', label: '전체(Technician)' },
  { value: '최수리', label: '최수리 과장' },
  { value: '김정비', label: '김정비 대리' },
  { value: '박보전', label: '박보전 책임' },
  { value: '이엔지', label: '이엔지 선임' },
];

// 9. Date Range 옵션
const DATE_RANGE_OPTIONS = [
  { value: 'ALL', label: '전체(Date Range)' },
  { value: 'TODAY', label: '오늘' },
  { value: '24H', label: '최근 24시간' },
  { value: '3DAYS', label: '최근 3일' },
  { value: 'THIS_WEEK', label: '금주' },
  { value: 'THIS_MONTH', label: '금월' },
];

// 10. Sort By 옵션
const SORT_BY_OPTIONS = [
  { value: 'LATEST', label: '전체(Sort By)' },
  { value: 'LATEST', label: '발생일시 최신순' },
  { value: 'DURATION', label: 'Down Time 긴 순' },
  { value: 'EQP_ID', label: '장비 ID 순' },
  { value: 'UNRESOLVED', label: '미조치 우선' },
];

/**
 * 백엔드 API 요청 시 '전체(ALL)', 빈 문자열(''), undefined, null, false(isCritical) 등
 * 불필요한 파라미터 키 자체를 객체에서 완전히 제거하여 반환하는 정제 유틸리티
 */
export function buildCleanSearchParams(rawFilters: FilterState): Partial<FilterState> {
  const cleanParams: Partial<FilterState> = {};

  (Object.keys(rawFilters) as (keyof FilterState)[]).forEach((key) => {
    const value = rawFilters[key];

    // 'ALL', 빈 문자열, undefined, null은 키 자체를 생성하지 않음
    if (value === 'ALL' || value === '' || value === undefined || value === null) {
      return;
    }

    // isCritical의 경우 false일 때 제외 (체크박스가 true일 때만 파라미터 포함)
    if (key === 'isCritical' && !value) {
      return;
    }

    // 유효한 파라미터만 할당
    cleanParams[key] = value as any;
  });

  return cleanParams;
}

export const SearchFilterPanel: React.FC<SearchFilterPanelProps> = ({
  initialFilters = {},
  onSearch,
  className = '',
}) => {
  const [filters, setFilters] = useState<FilterState>({
    fabricationPlant: undefined,
    processModule: undefined,
    equipmentModel: undefined,
    equipmentId: undefined,
    keyword: '',
    isCritical: false,
    downType: undefined,
    workStatus: undefined,
    shift: undefined,
    technician: undefined,
    dateRange: 'ALL',
    sortBy: 'LATEST',
    ...initialFilters,
  });

  const handleChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === 'ALL' ? undefined : value,
    }));
  };

  const handleSearch = () => {
    // '전체(ALL)' 및 빈 값 키가 완전히 제거된 순수 파라미터 객체 생성 후 전달
    const cleanParams = buildCleanSearchParams(filters);
    onSearch?.(cleanParams as FilterState);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-2.5 ${className}`}
    >
      {/* 1행: FAB, Process Module, Eqp Model, Eqp ID, Keyword 검색창, Critical Only (하단과 동일한 7열 그리드로 너비 일치) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2.5 items-center">
        {/* 1-1. FAB/Site */}
        <Select
          value={filters.fabricationPlant || 'ALL'}
          onValueChange={(val) => handleChange('fabricationPlant', val)}
        >
          <SelectTrigger className="w-full h-9 text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700">
            <SelectValue placeholder="전체(FAB/Site)" />
          </SelectTrigger>
          <SelectContent>
            {FAB_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 1-2. Process Module */}
        <Select
          value={filters.processModule || 'ALL'}
          onValueChange={(val) => handleChange('processModule', val)}
        >
          <SelectTrigger className="w-full h-9 text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700">
            <SelectValue placeholder="전체(Process Module)" />
          </SelectTrigger>
          <SelectContent>
            {PROCESS_MODULE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 1-3. Eqp Model */}
        <Select
          value={filters.equipmentModel || 'ALL'}
          onValueChange={(val) => handleChange('equipmentModel', val)}
        >
          <SelectTrigger className="w-full h-9 text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700">
            <SelectValue placeholder="전체(Eqp Model)" />
          </SelectTrigger>
          <SelectContent>
            {EQUIPMENT_MODEL_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 1-4. Eqp ID */}
        <Select
          value={filters.equipmentId || 'ALL'}
          onValueChange={(val) => handleChange('equipmentId', val)}
        >
          <SelectTrigger className="w-full h-9 text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700">
            <SelectValue placeholder="전체(Eqp ID)" />
          </SelectTrigger>
          <SelectContent>
            {EQUIPMENT_ID_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 1-5. Keyword Input */}
        <div>
          <Input
            value={filters.keyword || ''}
            onChange={(e) => handleChange('keyword', e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="VACUUM, ALARM-5021 등"
            className="w-full h-9 text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* 1-6. Critical Only 체크박스 */}
        <div className="flex items-center gap-2 pl-1 h-9">
          <input
            type="checkbox"
            id="criticalOnlyCheckbox"
            checked={!!filters.isCritical}
            onChange={(e) => handleChange('isCritical', e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer accent-rose-600"
          />
          <label
            htmlFor="criticalOnlyCheckbox"
            className="text-xs font-semibold text-rose-600 cursor-pointer select-none"
          >
            Critical Only
          </label>
        </div>

        {/* 1-7. 하단 7열(조회 버튼 열)과 너비를 1:1로 맞추기 위한 빈 컬럼 */}
        <div className="hidden lg:block" />
      </div>

      {/* 2행: Down Type, Work Status, Shift, Technician, Date Range, Sort By, 조회 버튼 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2.5 items-center">
        {/* 2-1. Down Type */}
        <Select
          value={filters.downType || 'ALL'}
          onValueChange={(val) => handleChange('downType', val)}
        >
          <SelectTrigger className="w-full h-9 text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700">
            <SelectValue placeholder="전체(Down Type)" />
          </SelectTrigger>
          <SelectContent>
            {DOWN_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 2-2. Work Status */}
        <Select
          value={filters.workStatus || 'ALL'}
          onValueChange={(val) => handleChange('workStatus', val)}
        >
          <SelectTrigger className="w-full h-9 text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700">
            <SelectValue placeholder="전체(Work Status)" />
          </SelectTrigger>
          <SelectContent>
            {WORK_STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 2-3. Shift */}
        <Select
          value={filters.shift || 'ALL'}
          onValueChange={(val) => handleChange('shift', val)}
        >
          <SelectTrigger className="w-full h-9 text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700">
            <SelectValue placeholder="전체(Shift)" />
          </SelectTrigger>
          <SelectContent>
            {SHIFT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 2-4. Technician */}
        <Select
          value={filters.technician || 'ALL'}
          onValueChange={(val) => handleChange('technician', val)}
        >
          <SelectTrigger className="w-full h-9 text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700">
            <SelectValue placeholder="전체(Technician)" />
          </SelectTrigger>
          <SelectContent>
            {TECHNICIAN_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 2-5. Date Range */}
        <Select
          value={filters.dateRange || 'ALL'}
          onValueChange={(val) => handleChange('dateRange', val)}
        >
          <SelectTrigger className="w-full h-9 text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700">
            <SelectValue placeholder="전체(Date Range)" />
          </SelectTrigger>
          <SelectContent>
            {DATE_RANGE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 2-6. Sort By */}
        <Select
          value={filters.sortBy || 'LATEST'}
          onValueChange={(val) => handleChange('sortBy', val)}
        >
          <SelectTrigger className="w-full h-9 text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700">
            <SelectValue placeholder="전체(Sort By)" />
          </SelectTrigger>
          <SelectContent>
            {SORT_BY_OPTIONS.map((opt, idx) => (
              <SelectItem key={`${opt.value}-${idx}`} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 2-7. 조회 버튼 */}
        <Button
          onClick={handleSearch}
          className="w-full h-9 text-xs font-semibold gap-1.5 bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
        >
          <Search className="w-3.5 h-3.5 stroke-[2.5]" />
          조회
        </Button>
      </div>
    </div>
  );
};
