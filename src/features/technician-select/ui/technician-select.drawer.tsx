// src/features/technician-select/ui/technician-select-drawer.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, UserCheck, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { cn } from '@/shared/lib/css-utils';
import { findTechniciansApi } from '../api/find-technicians.api';
import type { ExtractEmployee } from '@/entities/employees/model';

export interface TechnicianSelectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmpNo?: string;
  currentName?: string;
  onSelectTechnician: (technician: ExtractEmployee) => void;
}

export function TechnicianSelectDrawer({
  isOpen,
  onClose,
  currentEmpNo,
  currentName,
  onSelectTechnician,
}: TechnicianSelectDrawerProps) {
  const [techSearchInput, setTechSearchInput] = useState('');
  const [submittedSearchName, setSubmittedSearchName] = useState('');
  const [techPage, setTechPage] = useState(1);
  const [techPageSize, setTechPageSize] = useState(50);

  // 작업자 목록 조회 API 쿼리 (findTechniciansApi)
  const {
    data: techResponse,
    isLoading: isLoadingTech,
    isFetching: isFetchingTech,
    isError: isTechError,
    error: techError,
    refetch: refetchTech,
  } = useQuery({
    queryKey: ['technicians-list', submittedSearchName, techPage, techPageSize],
    queryFn: async () => {
      return await findTechniciansApi({
        criteria: {
          namePattern: submittedSearchName.trim() || undefined,
          page: techPage,
          size: techPageSize,
        },
      });
    },
    enabled: isOpen,
    staleTime: 1000 * 30, // 30초 캐싱
  });

  const technicians: ExtractEmployee[] = techResponse?.results ?? [];
  const techTotalPages = techResponse?.totalPages ?? 1;

  const handleSearch = () => {
    setSubmittedSearchName(techSearchInput.trim());
    setTechPage(1);
  };

  return (
    <div
      className={cn(
        'absolute inset-y-0 right-0 w-full sm:w-1/2 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-40 flex flex-col transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
      )}
    >
      {/* 1. Drawer 헤더 */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          보전 작업자 할당
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Drawer 본문 */}
      <div className="p-5 flex-1 flex flex-col min-h-0 gap-3">
        {/* 검색창: name input + [조회] 버튼 */}
        <div className="flex items-center gap-2">
          <Input
            value={techSearchInput}
            onChange={(e) => setTechSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            placeholder="이름 검색"
            className="h-8 text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 placeholder:text-slate-400"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSearch}
            className="h-8 px-4 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 shrink-0"
          >
            조회
          </Button>
        </div>

        {/* 작업자 목록 Table */}
        <div className="flex-1 min-h-0 border border-slate-200 dark:border-slate-800 rounded-lg overflow-y-auto scrollbar-thin">
          {isLoadingTech || isFetchingTech ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-xs text-slate-500">
              <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
              <span>작업자 목록을 불러오는 중...</span>
            </div>
          ) : isTechError ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-xs text-rose-500">
              <AlertTriangle className="w-6 h-6 text-rose-500" />
              <span>{(techError as Error)?.message || '작업자 조회 실패'}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => refetchTech()}
                className="h-7 text-xs mt-1"
              >
                다시 시도
              </Button>
            </div>
          ) : (
            <table className="w-full text-xs text-left border-collapse bg-white dark:bg-slate-900">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 sticky top-0 font-semibold z-10 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3 w-1/5 border-r border-slate-200 dark:border-slate-700">Emp No</th>
                  <th className="py-2.5 px-3 w-1/4 border-r border-slate-200 dark:border-slate-700">Name</th>
                  <th className="py-2.5 px-3 w-1/3 border-r border-slate-200 dark:border-slate-700">Dept</th>
                  <th className="py-2.5 px-3">Job</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {technicians.map((tech) => {
                  const isSelected = currentEmpNo === tech.empNo || currentName === tech.name;
                  return (
                    <tr
                      key={tech.empNo}
                      onClick={() => onSelectTechnician(tech)}
                      className={cn(
                        'cursor-pointer transition-colors select-none',
                        isSelected
                          ? 'bg-purple-50 dark:bg-purple-950/40 font-semibold text-purple-900 dark:text-purple-200'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      )}
                    >
                      <td className="py-2 px-3 border-r border-slate-200 font-mono text-[11px]">{tech.empNo}</td>
                      <td className="py-2 px-3 border-r border-slate-200 font-medium">{tech.name}</td>
                      <td className="py-2 px-3 border-r border-slate-200">{tech.departmentName || '-'}</td>
                      <td className="py-2 px-3">{tech.jobTitle || '-'}</td>
                    </tr>
                  );
                })}
                {technicians.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400">
                      검색 결과가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* 3. 하단 페이지네이션 바 */}
        <div className="shrink-0 flex items-center justify-center gap-2 pt-1">
          <select
            value={techPageSize}
            onChange={(e) => {
              setTechPageSize(Number(e.target.value));
              setTechPage(1);
            }}
            className="h-6 px-1.5 min-w-[52px] text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold"
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              disabled={techPage === 1}
              onClick={() => setTechPage(1)}
              className="px-1.5 py-0.5 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
              title="첫 페이지"
            >
              «
            </button>
            <button
              type="button"
              disabled={techPage === 1}
              onClick={() => setTechPage((p) => Math.max(1, p - 1))}
              className="px-1.5 py-0.5 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
              title="이전 페이지"
            >
              ‹
            </button>

            {Array.from({ length: techTotalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setTechPage(p)}
                className={cn(
                  'w-5 h-5 rounded-full text-xs font-semibold transition-colors flex items-center justify-center',
                  techPage === p
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              disabled={techPage === techTotalPages}
              onClick={() => setTechPage((p) => Math.min(techTotalPages, p + 1))}
              className="px-1.5 py-0.5 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
              title="다음 페이지"
            >
              ›
            </button>
            <button
              type="button"
              disabled={techPage === techTotalPages}
              onClick={() => setTechPage(techTotalPages)}
              className="px-1.5 py-0.5 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
              title="마지막 페이지"
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
