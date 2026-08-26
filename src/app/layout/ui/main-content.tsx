// 6. 메인 컨텐츠 영역 (스크롤 영역 + React Router <Outlet />)
// src/app/layout/ui/MainContent.tsx
import React from "react"
import { Outlet } from "react-router-dom"

// React Router <Outlet /> 호스팅 및 스크롤 영역
const MainContent: React.FC = () => {
  return (
    <main className="flex-1 overflow-y-auto bg-muted/20 p-6 relative flex flex-col">
      <div className="w-full flex-1 flex flex-col min-h-full">
        <Outlet />
      </div>
    </main>
  )
}

export default MainContent