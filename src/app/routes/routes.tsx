// 9. React Router v6 기반 라우터 설정
// src/app/routes/routes.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/app/layout';
import { DownEventPage } from '@/pages/down-event';
import { DashboardPage } from '@/pages/dashboard';

// 임시 플레이스홀더 페이지 생성 헬퍼
const createPlaceholderPage = (title: string, desc: string) => () => (
  <div className="space-y-6 pb-20 flex-1 flex flex-col w-full">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
    </div>
    <div className="p-8 text-center bg-card rounded-lg border border-border shadow-xs w-full">
      <h2 className="text-lg font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground text-sm">{desc}</p>
    </div>
  </div>
);

const AlarmsPage = createPlaceholderPage('알람 실시간 현황', '공정 및 설비 실시간 발생 알람 모니터링 화면입니다.');
const MaintenanceLogsPage = createPlaceholderPage('정비 조치 일지', '설비 다운 조치 및 정기 점검 일지 관리 화면입니다.');
const UtilizationAnalysisPage = createPlaceholderPage('설비 가동률 분석', '설비 종합 가동률(OEE) 및 다운 타임 분석 화면입니다.');
const ChambersPage = createPlaceholderPage('공정/챔버 현황', '챔버별 파라미터 및 센서 상태 현황 화면입니다.');
const ReportsPage = createPlaceholderPage('정기 점검 리포트', '주간/월간 설비 보전 및 점검 리포트 출력 화면입니다.');
const SettingsPage = createPlaceholderPage('환경 설정', '시스템 공통 코드 및 사용자 환경 설정 화면입니다.');

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'down-events',
        element: <DownEventPage />,
      },
      {
        path: 'alarms',
        element: <AlarmsPage />,
      },
      {
        path: 'maintenance-logs',
        element: <MaintenanceLogsPage />,
      },
      {
        path: 'utilization-analysis',
        element: <UtilizationAnalysisPage />,
      },
      {
        path: 'chambers',
        element: <ChambersPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: '*',
        element: <Navigate to="/down-events" replace />,
      },
    ],
  },
]);