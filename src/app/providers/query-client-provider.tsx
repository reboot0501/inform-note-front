// 11. TanStack Query 기반 전역 QueryProvider 설정
// src/app/providers/QueryProvider.tsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * ============================================================================
 * [QueryProvider.tsx 컴포넌트를 화면 Layout 및 페이지 Routing 관련 컴포넌트 제작시 작성하는 이유]
 * ============================================================================
 * 
 * 1. 기술 스택 기반의 기본 뼈대(Scaffolding) 선제 구성:
 *    - 프로젝트 표준 기술 스택(React + TanStack Query + React Router DOM) 확정에 따라
 *      애플리케이션 최상위 진입점(App.tsx)의 전역 래퍼(Global Wrapper) 구조를 미리 수립.
 * 
 * 2. 화면 컴포넌트 확장 시 런타임 크래시(White Screen) 선제 방지:
 *    - Layout 및 Page 개발 과정에서 하위 컴포넌트(Widgets, Features, Entities)에
 *      useQuery/useMutation 등 서버 상태 훅이 사용되는 순간, 상위에 QueryClientProvider가
 *      없으면 "No QueryClient set, use QueryClientProvider to set one" 에러와 함께
 *      전체 화면이 중단되는 런타임 오류를 사전에 차단.
 * 
 * 3. FSD (Feature-Sliced Design) 아키텍처 관점:
 *    - app 레이어(최상위)에서 전역 인프라 및 프로바이더를 캡슐화하여,
 *      하위 레이어(pages, widgets, features, entities) 전체에 일관된 상태 공급 보장.
 * 
 * 4. 전역 캐싱 및 통일된 옵션 제어 (Default Options):
 *    - staleTime: 5분 (1000 * 60 * 5) 동안 데이터를 최신으로 유지하여 중복 API 호출 방지.
 *    - refetchOnWindowFocus: false (브라우저 탭/창 전환 시 불필요한 재조회 방지).
 *    - retry: 1 (일시적 네트워크 에러 발생 시 1회 자동 재시도).
 * 
 * 5. 향후 Down Event 목록 & 대용량 본문(CLOB/이미지) 비동기 처리 인프라:
 *    - 1단계(20건 텍스트 메타데이터 조회) + 2단계(뷰포트 2~4건 contentHtml 병렬 로딩)
 *      연동 시 LRU 캐시 및 가비지 컬렉션(gcTime)을 안정적으로 관리.
 * ============================================================================
 */

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5분 동안 데이터를 최신으로 유지
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
