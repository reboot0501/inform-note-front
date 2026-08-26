// 5. 상단 헤더 영역 (TabBar + 시스템 상태 + 사용자 프로필)
// src/app/layout/ui/Header.tsx
import React from "react"
import { Bell, User } from "lucide-react"
import TabBar from "./tab-bar"

const Header: React.FC = () => {
  return (
    <header className="h-14 border-b border-border bg-card/70 backdrop-blur px-4 flex items-center justify-between gap-4 shrink-0">
      {/* 좌측 Tab 페이지 영역 (최대 5개 Tab Bar) */}
      <div className="flex items-center flex-1 min-w-0 overflow-hidden">
        <TabBar />
      </div>

      {/* 우측 시스템 상태 및 사용자 프로필 */}
      <div className="flex items-center gap-4 shrink-0">
        <button 
          type="button" 
          aria-label="알림"
          className="relative p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-xs border border-primary/30">
            <User className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-foreground leading-tight">김정비 사원</span>
            <span className="text-[10px] text-muted-foreground leading-tight">TECH-1002 (Shift A)</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header