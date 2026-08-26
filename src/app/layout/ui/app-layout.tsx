// 1. 전체 화면 최상위 쉘 (LNB + MainLayout + TabProvider)
// src/app/layout/ui/AppLayout.tsx
import React from "react"
import Lnb from "./lnb"
import MainLayout from "./main-layout"
import { TabProvider } from "../model/tab-context"

// 전체 화면 최상위 쉘 (LNB + MainLayout + TabProvider)
const AppLayout: React.FC = () => {
  return (
    <TabProvider>
      <div className="flex h-full w-full overflow-hidden bg-background text-foreground">
        <Lnb />
        <MainLayout />
      </div>
    </TabProvider>
  )
}

export default AppLayout