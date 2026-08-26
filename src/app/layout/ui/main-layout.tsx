// 3. Header + MainContent 감싸는 메인 컨테이너
// src/app/layout/ui/MainLayout.tsx
import React from "react"
import Header from "./header"
import MainContent from "./main-content"

// Header (Tab 내장) + MainContent 감싸는 메인 컨테이너
const MainLayout: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-background">
      <Header />
      <MainContent />
    </div>
  )
}

export default MainLayout