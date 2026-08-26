// 4. 상단 TabBar 영역 (탭 페이지 전환 + 닫기 버튼)
// src/app/layout/ui/TabBar.tsx
import React from "react"
import { useNavigate } from "react-router-dom"
import { 
  X, 
  Activity, 
  AlertTriangle, 
  Wrench, 
  BarChart3, 
  Layers, 
  FileText, 
  Settings,
  LayoutGrid
} from "lucide-react"
import { useTabs } from "../model/tab-context"

// 경로별 아이콘 매핑
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "/down-events": Activity,
  "/alarms": AlertTriangle,
  "/maintenance-logs": Wrench,
  "/dashboard": BarChart3,
  "/chambers": Layers,
  "/reports": FileText,
  "/settings": Settings,
}

export const TabBar: React.FC = () => {
  const { tabs, activeTabId, closeTab, setActiveTabId } = useTabs()
  const navigate = useNavigate()

  const handleTabClick = (tabId: string, path: string) => {
    setActiveTabId(tabId)
    navigate(path)
  }

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1 min-w-0 py-1">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId
        const Icon = ICON_MAP[tab.path] || LayoutGrid

        return (
          <div
            key={tab.id}
            onClick={() => handleTabClick(tab.id, tab.path)}
            className={`group flex items-center gap-2 h-8 px-3 rounded-lg text-xs font-medium cursor-pointer transition-all duration-150 border shrink-0 ${
              isActive
                ? "bg-background text-foreground border-border shadow-xs font-semibold"
                : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground border-transparent"
            }`}
            title={tab.title}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
            <span className="truncate max-w-[150px]">{tab.title}</span>

            {/* 닫기 버튼 (closable !== false 일 때) */}
            {tab.closable !== false && (
              <button
                type="button"
                onClick={(e) => closeTab(tab.id, e)}
                aria-label={`${tab.title} 탭 닫기`}
                className="p-0.5 ml-0.5 rounded-sm hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default TabBar
