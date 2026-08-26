// src/pages/dashboard/ui/dashboard.page.tsx
import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Activity, 
  RotateCcw, 
  Cpu, 
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';

export function DashboardPage() {
  return (
    <div className="space-y-6 pb-20 flex-1 flex flex-col">
      {/* 1. 상단 타이틀 & 툴바 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            모니터링 & 정비 대시보드
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            반도체 제조 설비의 실시간 가동 상태 및 다운 이벤트 핵심 지표를 통합 모니터링합니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="h-7 text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
            시스템 정상 가동 중
          </Badge>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            <RotateCcw className="w-3.5 h-3.5" />
            새로고침
          </Button>
        </div>
      </div>

      {/* 2. 요약 통계 KPI (요청하신 컴포넌트) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card className="bg-card/80 border-border shadow-xs hover:border-primary/40 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">오늘 발생 다운</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                12 <span className="text-xs font-normal text-muted-foreground">건</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <AlertCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 border-border shadow-xs hover:border-amber-500/40 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">조치 진행 중 (IN_PROGRESS)</p>
              <h3 className="text-2xl font-bold text-amber-500 mt-1">
                4 <span className="text-xs font-normal text-muted-foreground">건</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 border-border shadow-xs hover:border-emerald-500/40 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">조치 완료 (ACTION_DONE)</p>
              <h3 className="text-2xl font-bold text-emerald-500 mt-1">
                8 <span className="text-xs font-normal text-muted-foreground">건</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 border-border shadow-xs hover:border-blue-500/40 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">평균 다운 소요시간</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                42 <span className="text-xs font-normal text-muted-foreground">분</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. 대시보드 메인 모니터링 그리드 (Mockup) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 공정별 실시간 설비 가동 현황 */}
        <Card className="lg:col-span-2 bg-card border-border shadow-xs">
          <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              공정 모듈별 실시간 설비 가동 현황
            </CardTitle>
            <span className="text-xs text-muted-foreground">전체 48대 설비 기준</span>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {[
              { module: 'PHOTO (노광)', running: 8, down: 1, maintenance: 1, rate: 80, color: 'bg-indigo-500' },
              { module: 'ETCH (식각)', running: 10, down: 2, maintenance: 0, rate: 83.3, color: 'bg-blue-500' },
              { module: 'CVD (증착)', running: 12, down: 1, maintenance: 1, rate: 85.7, color: 'bg-purple-500' },
              { module: 'DIFF (확산)', running: 6, down: 0, maintenance: 0, rate: 100, color: 'bg-emerald-500' },
              { module: 'CMP (연마)', running: 4, down: 0, maintenance: 1, rate: 80, color: 'bg-amber-500' },
            ].map((item) => (
              <div key={item.module} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.module}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">
                      가동 <strong className="text-emerald-600 dark:text-emerald-400">{item.running}</strong> / 
                      다운 <strong className="text-rose-600 dark:text-rose-400">{item.down}</strong>
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 min-w-[40px] text-right">
                      {item.rate}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden flex">
                  <div 
                    className={`${item.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${item.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 실시간 긴급 알람 & 다운 이슈 타임라인 */}
        <Card className="bg-card border-border shadow-xs">
          <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              실시간 긴급 이슈 타임라인
            </CardTitle>
            <Badge variant="destructive" className="h-5 text-[10px] font-bold">
              3건 대응중
            </Badge>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {[
              {
                eqpId: 'ETCH-LAM-01 / Ch-A',
                code: 'HW-PRESS-202',
                msg: 'Chamber Pressure High Alarm',
                time: '10분 전',
                status: 'IN_PROGRESS',
                statusColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200',
              },
              {
                eqpId: 'CVD-TEL-02 / Ch-B',
                code: 'HW-HEAT-401',
                msg: 'Heater Temp Out of Range',
                time: '35분 전',
                status: 'VERIFIED',
                statusColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200',
              },
              {
                eqpId: 'PHOTO-ASML-01 / Main',
                code: 'OPT-ALIGN-01',
                msg: 'Laser Beam Drift Detected',
                time: '1시간 전',
                status: 'ACTION_DONE',
                statusColor: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200',
              },
            ].map((issue, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-foreground">{issue.eqpId}</span>
                  <span className="text-[10px] text-muted-foreground">{issue.time}</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium truncate">
                  <span className="font-bold text-slate-800 dark:text-slate-200 mr-1">[{issue.code}]</span>
                  {issue.msg}
                </p>
                <div className="flex justify-between items-center pt-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${issue.statusColor}`}>
                    {issue.status}
                  </span>
                  <Button variant="ghost" size="sm" className="h-6 px-1.5 text-[11px] gap-1 text-purple-600 hover:text-purple-700">
                    상세보기 <ArrowUpRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;
