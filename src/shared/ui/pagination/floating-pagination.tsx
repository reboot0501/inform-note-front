import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/css-utils';
import { usePagination, DOTS } from './use-pagination';

export type PaginationDockPosition = 'bottom' | 'top' | 'left' | 'right';

export interface FloatingPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  position?: PaginationDockPosition;
  defaultPosition?: PaginationDockPosition;
  onPositionChange?: (position: PaginationDockPosition) => void;
  onScrollTop?: () => void;
  onScrollBottom?: () => void;
  onPrevItem?: () => void;
  onNextItem?: () => void;
  siblingCount?: number;
  className?: string;
}

export function FloatingPagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50, 100],
  position: controlledPosition,
  defaultPosition = 'bottom',
  onPositionChange,
  onScrollTop,
  onScrollBottom,
  siblingCount = 1,
  className,
}: FloatingPaginationProps) {
  // 내부 도킹 위치 상태 ('bottom' | 'top' | 'left' | 'right')
  const [internalPosition, setInternalPosition] = useState<PaginationDockPosition>(defaultPosition);
  const currentPosition = controlledPosition ?? internalPosition;

  const isVertical = currentPosition === 'left' || currentPosition === 'right';

  const paginationRange = usePagination({
    currentPage,
    totalPages,
    siblingCount: isVertical ? 0 : siblingCount, // 세로형일 때는 컴팩트하게 표시
  });

  const handlePositionChange = (pos: PaginationDockPosition) => {
    if (onPositionChange) {
      onPositionChange(pos);
    } else {
      setInternalPosition(pos);
    }

    if (pos === 'top') {
      onScrollTop?.();
    } else if (pos === 'bottom') {
      onScrollBottom?.();
    }
  };

  // 위치에 따른 고정 스타일 클래스 매핑
  const positionClasses: Record<PaginationDockPosition, string> = {
    bottom: 'fixed bottom-6 left-1/2 -translate-x-1/2',
    top: 'fixed top-20 lg:top-24 left-1/2 -translate-x-1/2',
    left: 'fixed left-4 lg:left-6 top-1/2 -translate-y-1/2',
    right: 'fixed right-4 lg:right-6 top-1/2 -translate-y-1/2',
  };

  return (
    <div
      className={cn(
        'z-50 select-none pointer-events-auto transition-all duration-300 ease-in-out',
        positionClasses[currentPosition],
        className
      )}
    >
      <div
        className={cn(
          'flex bg-card/95 backdrop-blur-md border border-border/80 shadow-2xl text-xs transition-all hover:shadow-primary/10 border-border',
          isVertical
            ? 'flex-col items-center gap-2 px-2 py-3.5 rounded-3xl min-w-[58px]'
            : 'flex-row items-center gap-2 px-3.5 py-1.5 rounded-full'
        )}
      >
        {/* 1. 4방향 위치 이동 컨트롤러 (↑, ↓, ←, →) */}
        <div
          className={cn(
            'bg-muted/60 rounded-2xl p-0.5',
            isVertical ? 'grid grid-cols-2 gap-0.5' : 'flex items-center gap-0.5 rounded-full'
          )}
        >
          <Button
            variant={currentPosition === 'top' ? 'secondary' : 'ghost'}
            size="icon"
            className={cn(
              'h-6 w-6 rounded-full transition-colors',
              currentPosition === 'top'
                ? 'bg-primary text-primary-foreground shadow-2xs hover:bg-primary/90'
                : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => handlePositionChange('top')}
            title="상단으로 이동 (↑)"
            aria-label="상단으로 이동"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant={currentPosition === 'bottom' ? 'secondary' : 'ghost'}
            size="icon"
            className={cn(
              'h-6 w-6 rounded-full transition-colors',
              currentPosition === 'bottom'
                ? 'bg-primary text-primary-foreground shadow-2xs hover:bg-primary/90'
                : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => handlePositionChange('bottom')}
            title="하단으로 이동 (↓)"
            aria-label="하단으로 이동"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant={currentPosition === 'left' ? 'secondary' : 'ghost'}
            size="icon"
            className={cn(
              'h-6 w-6 rounded-full transition-colors',
              currentPosition === 'left'
                ? 'bg-primary text-primary-foreground shadow-2xs hover:bg-primary/90'
                : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => handlePositionChange('left')}
            title="좌측으로 이동 (←)"
            aria-label="좌측으로 이동"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant={currentPosition === 'right' ? 'secondary' : 'ghost'}
            size="icon"
            className={cn(
              'h-6 w-6 rounded-full transition-colors',
              currentPosition === 'right'
                ? 'bg-primary text-primary-foreground shadow-2xs hover:bg-primary/90'
                : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => handlePositionChange('right')}
            title="우측으로 이동 (→)"
            aria-label="우측으로 이동"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* 구분선 */}
        <div className={cn('bg-border/80', isVertical ? 'w-8 h-px my-0.5' : 'h-4 w-px mx-0.5')} />

        {/* 2. 페이지당 표시 row 수 Select Box (3자리 숫자 지원) */}
        <div className="flex items-center justify-center">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            aria-label="페이지당 행 개수 선택"
            className={cn(
              'rounded-md border border-border bg-background text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer hover:bg-muted/50 transition-colors',
              isVertical ? 'h-7 px-1 text-center w-[50px] text-[11px] font-mono' : 'h-7 px-2 pr-6 text-xs'
            )}
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* 구분선 */}
        <div className={cn('bg-border/80', isVertical ? 'w-8 h-px my-0.5' : 'h-4 w-px mx-0.5')} />

        {/* 3. 첫 페이지 («) & 이전 페이지 (‹) */}
        <div className={cn('flex items-center gap-0.5', isVertical ? 'flex-col' : 'flex-row')}>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full text-muted-foreground hover:text-foreground"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            title="첫 페이지"
            aria-label="첫 페이지"
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full text-muted-foreground hover:text-foreground"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            title="이전 페이지"
            aria-label="이전 페이지"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* 4. 페이지 번호 목록 */}
        <div className={cn('flex items-center gap-1', isVertical ? 'flex-col py-0.5' : 'flex-row px-0.5')}>
          {paginationRange.map((pageNumber, index) => {
            if (pageNumber === DOTS) {
              return (
                <div
                  key={`dots-${index}`}
                  className="flex h-6 w-6 items-center justify-center text-muted-foreground"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </div>
              );
            }

            const isCurrent = pageNumber === currentPage;

            return (
              <Button
                key={pageNumber}
                variant={isCurrent ? 'default' : 'ghost'}
                size="icon"
                className={cn(
                  'h-6.5 w-6.5 rounded-full text-xs font-semibold transition-all',
                  isCurrent
                    ? 'bg-purple-600 dark:bg-purple-600 text-white shadow-sm hover:bg-purple-700 font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
                onClick={() => onPageChange(Number(pageNumber))}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>

        {/* 5. 다음 페이지 (›) & 마지막 페이지 (») */}
        <div className={cn('flex items-center gap-0.5', isVertical ? 'flex-col' : 'flex-row')}>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full text-muted-foreground hover:text-foreground"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            title="다음 페이지"
            aria-label="다음 페이지"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full text-muted-foreground hover:text-foreground"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            title="마지막 페이지"
            aria-label="마지막 페이지"
          >
            <ChevronsRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FloatingPagination;
