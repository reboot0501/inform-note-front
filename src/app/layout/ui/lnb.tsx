// 2. 좌측 사이드바 메뉴
// src/app/layout/ui/Lnb.tsx
import React, { useState } from "react"
import { NavLink } from "react-router-dom"
import { 
  Activity, 
  Layers, 
  BarChart3, 
  Settings, 
  Wrench, 
  AlertTriangle, 
  FileText,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard
} from "lucide-react"
import { Button } from "@/shared/ui/button"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/shared/ui/tooltip"
import { useTabs } from "../model/tab-context"

interface MenuItem {
  name: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

interface MenuGroup {
  category: string
  items: MenuItem[]
}

const menuItems: MenuGroup[] = [
  {
    category: "모니터링 & 정비",
    items: [
      { name: "대시보드", path: "/dashboard", icon: LayoutDashboard },
      { name: "Down Event 현황", path: "/down-events", icon: Activity },
      { name: "알람 실시간 현황", path: "/alarms", icon: AlertTriangle, badge: "3" },
      { name: "정비 조치 일지", path: "/maintenance-logs", icon: Wrench },
    ],
  },
  {
    category: "분석 & 통계",
    items: [
      { name: "설비 가동률 분석", path: "/utilization-analysis", icon: BarChart3 },
      { name: "공정/챔버 현황", path: "/chambers", icon: Layers },
      { name: "정기 점검 리포트", path: "/reports", icon: FileText },
    ],
  },
  {
    category: "시스템 관리",
    items: [
      { name: "환경 설정", path: "/settings", icon: Settings },
    ],
  },
]

const Lnb: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const { openTab } = useTabs()

  const handleMenuClick = (item: MenuItem) => {
    // 탭 열기 (최대 5개 제한 및 활성화)
    openTab({
      id: item.path,
      title: item.name,
      path: item.path,
      closable: item.path !== "/down-events",
    })
  }

  return (
    <TooltipProvider delayDuration={150}>
      <aside 
        aria-label="좌측 사이드바 메뉴" 
        className={`${
          collapsed ? "w-16" : "w-64"
        } transition-all duration-300 ease-in-out border-r border-border bg-card flex flex-col shrink-0 select-none relative z-20`}
      >
        {/* 로고 & 시스템 명 & 접기/펼치기 토글 버튼 */}
        <div className={`h-14 border-b border-border flex items-center ${collapsed ? "justify-center px-2" : "justify-between px-3.5"}`}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div 
              className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-sm shadow-primary/30 shrink-0 cursor-pointer"
              onClick={() => collapsed && setCollapsed(false)}
              title={collapsed ? "사이드바 펼치기" : undefined}
            >
              <Activity className="w-5 h-5" />
            </div>
            
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-bold text-sm tracking-tight text-foreground truncate">INFORM-NOTE</span>
                <span className="text-[10px] text-muted-foreground font-medium truncate">Equipment Maintenance</span>
              </div>
            )}
          </div>

          {/* LNB 접기/펼치기 버튼 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0 rounded-md"
            aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
            title={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* 네비게이션 메뉴 목록 */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-4">
          {menuItems.map((group, idx) => (
            <div key={group.category} className="space-y-1">
              {!collapsed ? (
                <h3 className="px-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
                  {group.category}
                </h3>
              ) : (
                idx > 0 && <div className="border-t border-border/60 my-2 mx-1" />
              )}

              <div className="space-y-0.5 pt-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon
                  
                  const navLinkElement = (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => handleMenuClick(item)}
                      className={({ isActive }) =>
                        `flex items-center rounded-md text-xs font-medium transition-colors relative ${
                          collapsed 
                            ? "justify-center p-2.5" 
                            : "justify-between px-2.5 py-2"
                        } ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={collapsed ? "w-5 h-5" : "w-4 h-4"} />
                        {!collapsed && <span className="truncate">{item.name}</span>}
                      </div>

                      {/* 펼쳐진 상태 뱃지 */}
                      {!collapsed && item.badge && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-destructive text-destructive-foreground">
                          {item.badge}
                        </span>
                      )}

                      {/* 접힌 상태 미니 뱃지 닷 */}
                      {collapsed && item.badge && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
                      )}
                    </NavLink>
                  )

                  if (collapsed) {
                    return (
                      <Tooltip key={item.path}>
                        <TooltipTrigger asChild>
                          {navLinkElement}
                        </TooltipTrigger>
                        <TooltipContent side="right" className="flex items-center gap-2">
                          <span>{item.name}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-destructive text-destructive-foreground">
                              {item.badge}
                            </span>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    )
                  }

                  return navLinkElement
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* 하단 시스템 정보 */}
        <div className={`p-3 border-t border-border bg-muted/30 text-[11px] text-muted-foreground flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed ? (
            <>
              <span>v0.1.0-alpha</span>
              <span className="text-emerald-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Online
              </span>
            </>
          ) : (
            <span 
              className="w-2 h-2 rounded-full bg-emerald-500" 
              title="v0.1.0-alpha (Online)" 
            />
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}

export default Lnb