import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import type { TabItem, TabContextType } from "./tab.types"

const MAX_TABS = 5

// 기본 초기 탭 목록
const INITIAL_TABS: TabItem[] = [
  {
    id: "/down-events",
    title: "Down Event 현황",
    path: "/down-events",
    closable: false, // 기본 홈 탭은 닫기 방지 (원할 경우 true 가능)
  },
]

// 메뉴 경로별 기본 탭 메타데이터 매핑
export const MENU_META_MAP: Record<string, { title: string }> = {
  "/dashboard": { title: "대시보드" },
  "/down-events": { title: "Down Event 현황" },
  "/alarms": { title: "알람 실시간 현황" },
  "/maintenance-logs": { title: "정비 조치 일지" },
  "/utilization-analysis": { title: "설비 가동률 분석" },
  "/chambers": { title: "공정/챔버 현황" },
  "/reports": { title: "정기 점검 리포트" },
  "/settings": { title: "환경 설정" },
}

const TabContext = createContext<TabContextType | null>(null)

export const TabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = useState<TabItem[]>(INITIAL_TABS)
  const [activeTabId, setActiveTabId] = useState<string>("/down-events")
  const navigate = useNavigate()
  const location = useLocation()

  // 탭 열기 (최대 5개 제한 로직)
  const openTab = useCallback((newTab: TabItem) => {
    setTabs((prevTabs) => {
      const existingTabIndex = prevTabs.findIndex((t) => t.id === newTab.id || t.path === newTab.path)
      
      // 1. 이미 열려있는 탭이면 해당 탭 활성화만 수행
      if (existingTabIndex !== -1) {
        return prevTabs
      }

      // 2. 최대 5개 제한 처리: 이미 5개 탭이 열려있는 경우
      if (prevTabs.length >= MAX_TABS) {
        // 가장 오래된 닫을 수 있는(closable !== false) 탭 찾기
        const closableIndex = prevTabs.findIndex((t) => t.closable !== false)
        const removeIndex = closableIndex !== -1 ? closableIndex : 0
        
        const nextTabs = prevTabs.filter((_, idx) => idx !== removeIndex)
        return [...nextTabs, newTab]
      }

      // 3. 5개 미만인 경우 신규 탭 추가
      return [...prevTabs, newTab]
    })

    setActiveTabId(newTab.id)
    navigate(newTab.path)
  }, [navigate])

  // 탭 닫기
  const closeTab = useCallback((tabId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }

    setTabs((prevTabs) => {
      const targetIndex = prevTabs.findIndex((t) => t.id === tabId)
      if (targetIndex === -1) return prevTabs

      const nextTabs = prevTabs.filter((t) => t.id !== tabId)

      // 닫은 탭이 현재 활성화된 탭이었던 경우, 인접 탭으로 포커스 이동
      if (activeTabId === tabId && nextTabs.length > 0) {
        const nextActiveIndex = targetIndex > 0 ? targetIndex - 1 : 0
        const nextActiveTab = nextTabs[nextActiveIndex]
        if (nextActiveTab) {
          setActiveTabId(nextActiveTab.id)
          navigate(nextActiveTab.path)
        }
      }

      return nextTabs
    })
  }, [activeTabId, navigate])

  // 다른 모든 탭 닫기
  const closeAllOtherTabs = useCallback((tabId: string) => {
    setTabs((prevTabs) => {
      const targetTab = prevTabs.find((t) => t.id === tabId)
      if (!targetTab) return prevTabs
      return [targetTab]
    })
    setActiveTabId(tabId)
  }, [])

  // URL 변경 시 탭 상태 자동 동기화
  useEffect(() => {
    const currentPath = location.pathname
    if (currentPath === "/" || !MENU_META_MAP[currentPath]) return

    setTabs((prevTabs) => {
      const existingTab = prevTabs.find((t) => t.path === currentPath)
      if (existingTab) {
        setActiveTabId(existingTab.id)
        return prevTabs
      }

      const meta = MENU_META_MAP[currentPath]
      const newTab: TabItem = {
        id: currentPath,
        title: meta.title,
        path: currentPath,
        closable: currentPath !== "/down-events",
      }

      if (prevTabs.length >= MAX_TABS) {
        const closableIndex = prevTabs.findIndex((t) => t.closable !== false)
        const removeIndex = closableIndex !== -1 ? closableIndex : 0
        const nextTabs = prevTabs.filter((_, idx) => idx !== removeIndex)
        return [...nextTabs, newTab]
      }

      return [...prevTabs, newTab]
    })
    setActiveTabId(currentPath)
  }, [location.pathname])

  return (
    <TabContext.Provider
      value={{
        tabs,
        activeTabId,
        openTab,
        closeTab,
        closeAllOtherTabs,
        setActiveTabId,
      }}
    >
      {children}
    </TabContext.Provider>
  )
}

export const useTabs = (): TabContextType => {
  const context = useContext(TabContext)
  if (!context) {
    throw new Error("useTabs must be used within a TabProvider")
  }
  return context
}
