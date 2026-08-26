// src/pages/down-event/ui/down-Event-page.container.tsx
import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { 
  RotateCcw, 
  Inbox,
  Loader2, 
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { FloatingPagination } from '@/shared/ui/pagination';
import { DownEventCard } from '@/widgets/down-event-card';
import { findDownEventsApi } from '@/features/down-event-card-search';
import type { DownEventCard as DownEventCardType } from '@/entities/down-event-card/model/down-event-card.entity';
import { SearchFilterPanel, type FilterState, buildCleanSearchParams } from './search-filter-panel';
import { DownEventPopup } from './down-event-popup';

export function DownEventPage() {
  // 1. 상태 관리: 검색 필터, 현재 페이지, 페이지 크기, 팝업 상태, 페이지네이션 도킹 위치
  const [filters, setFilters] = useState<FilterState>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedEvent, setSelectedEvent] = useState<DownEventCardType | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [paginationPosition, setPaginationPosition] = useState<'bottom' | 'top' | 'left' | 'right'>('bottom');

  // 2. 가상 스크롤 컨테이너 DOM 참조
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 3. React Query 기반 백엔드 API 메타데이터 호출 (`findDownEventsApi`)
  const {
    data: responseData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['down-event-cards', filters, currentPage, pageSize],
    queryFn: async () => {
      const cleanCriteria = buildCleanSearchParams(filters);
      return await findDownEventsApi({
        criteria: {
          ...cleanCriteria,
          page: currentPage,
          size: pageSize,
        },
      });
    },
    staleTime: 1000 * 30, // 30초 캐싱
  });

  // 4. 응답 데이터 추출 (OffsetElementList)
  const events = responseData?.results ?? [];
  const totalCount = responseData?.totalCount ?? 0;
  const totalPages = responseData?.totalPages ?? 1;

  // 5. 가상 스크롤 엔진 (useVirtualizer) - 화면 내 2~4개 활성 Row + 오버스캔 버퍼 2개
  const rowVirtualizer = useVirtualizer({
    count: events.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 480, // 카드 예상 높이 (px)
    overscan: 2, // 상하 2건씩 버퍼 유지 (다운/업 스크롤 시 부드러운 병렬 프리패치)
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  // 6. 검색 필터 핸들러
  const handleSearch = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
    handleScrollTop();
  };

  // 7. 새로고침 핸들러
  const handleRefresh = () => {
    refetch();
  };

  // 8. 스크롤 최상단/최하단 핸들러 (FloatingPagination 연동)
  const handleScrollTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  // 9. 팝업 열기 핸들러 (DownEventCard 위젯의 [수정 / 추가] 버튼 클릭 시 호출)
  const handleOpenPopup = (event: DownEventCardType) => {
    setSelectedEvent(event);
    setIsPopupOpen(true);
  };

  // 10. 팝업 닫기 핸들러
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] gap-4 pb-2">
      {/* 1. 상단 타이틀 & 툴바 (고정) */}
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Down Event 현황</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            공정 설비의 실시간 다운 이벤트 및 정비 조치 이력을 관리합니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetching}
            className="h-8 gap-1.5 text-xs"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
        </div>
      </div>

      {/* 2. 자식 컴포넌트 1: 검색 조건 및 필터 패널 (SearchFilterPanel - 고정) */}
      <div className="shrink-0">
        <SearchFilterPanel onSearch={handleSearch} />
      </div>

      {/* 3. 자식 컴포넌트 2: Down Event Card 가상 스크롤 목록 영역 */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* 전체 다운 이벤트 목록 상단 헤더 라인 (top 선택 시 카드 바깥 상단 중앙에 완전 분리 배치) */}
        <div className="shrink-0 flex items-center justify-between px-1 pb-2.5 pt-0.5 gap-2 min-h-[44px]">
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-2 shrink-0">
            전체 다운 이벤트 목록 (총 {totalCount.toLocaleString()}건)
            {isFetching && !isLoading && (
              <span className="text-[11px] text-primary flex items-center gap-1 font-normal">
                <Loader2 className="w-3 h-3 animate-spin" /> 갱신 중...
              </span>
            )}
          </span>

          {/* ↑ (상단 화살표) 클릭 시: 카드를 절대 가리지 않고 카드 바깥 상단 헤더 중앙에 배치 */}
          {paginationPosition === 'top' && totalCount > 0 ? (
            <div className="flex-1 flex justify-center items-center">
              <FloatingPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  handleScrollTop();
                }}
                pageSize={pageSize}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                  handleScrollTop();
                }}
                pageSizeOptions={[5, 10, 20, 50, 100]}
                position="top"
                onPositionChange={setPaginationPosition}
                className="static translate-x-0 bottom-auto top-auto"
              />
            </div>
          ) : (
            <div className="flex-1" />
          )}

          <span className="text-xs text-muted-foreground shrink-0">최신 발생순</span>
        </div>

        {/* 가상 세로 스크롤 영역 (Vertical Scrollbar Container) */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700"
        >
          {/* 로딩 상태 */}
          {isLoading ? (
            <div className="p-16 text-center bg-card rounded-xl border border-border shadow-xs flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm font-semibold text-foreground">다운 이벤트 목록을 불러오는 중입니다...</p>
            </div>
          ) : isError ? (
            /* 에러 상태 */
            <div className="p-12 text-center bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-800 shadow-xs flex flex-col items-center justify-center gap-2">
              <AlertTriangle className="w-8 h-8 text-rose-500" />
              <p className="text-sm font-bold text-rose-700 dark:text-rose-400">데이터 조회 중 오류가 발생했습니다.</p>
              <p className="text-xs text-muted-foreground">
                {(error as Error)?.message || '서버와의 통신 상태를 확인해 주세요.'}
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2 text-xs">
                다시 시도
              </Button>
            </div>
          ) : events.length > 0 ? (
            /* 실제 가상 스크롤 렌더링 (활성 2~4개 Row 윈도우) */
            <div
              className="w-full relative"
              style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
            >
              {virtualItems.map((virtualRow) => {
                const event = events[virtualRow.index];
                return (
                  <div
                    key={event.downEventId}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                    className="absolute top-0 left-0 w-full pb-4"
                    style={{
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <DownEventCard
                      data={event}
                      mode="view"
                      onEditClick={() => handleOpenPopup(event)}
                      rowNumber={virtualRow.index + 1}
                      totalRows={events.length}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            /* 데이터 없음 상태 */
            <div className="p-12 text-center bg-card rounded-xl border border-border shadow-xs flex flex-col items-center justify-center gap-2">
              <Inbox className="w-8 h-8 text-muted-foreground stroke-1" />
              <p className="text-sm font-semibold text-foreground">조건에 일치하는 Down Event가 없습니다.</p>
              <p className="text-xs text-muted-foreground">검색 조건 또는 필터를 변경하여 다시 조회해 보세요.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilters({});
                  setCurrentPage(1);
                  handleScrollTop();
                }}
                className="mt-2 text-xs"
              >
                필터 초기화
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 4. 하단/좌측/우측 Floating Pagination 컴포넌트 */}
      {totalCount > 0 && paginationPosition !== 'top' && (
        <FloatingPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            handleScrollTop();
          }}
          pageSize={pageSize}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
            handleScrollTop();
          }}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          position={paginationPosition}
          onPositionChange={setPaginationPosition}
          onScrollTop={handleScrollTop}
          onScrollBottom={handleScrollBottom}
        />
      )}

      {/* 5. 자식 컴포넌트 3: 현상 및 조치 상세 수정 모달 팝업 (단일 인스턴스) */}
      <DownEventPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        item={selectedEvent}
        onSaveSuccess={async () => {
          await refetch();
        }}
      />
    </div>
  );
}

export default DownEventPage;