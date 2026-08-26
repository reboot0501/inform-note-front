export interface TabItem {
  id: string
  title: string
  path: string
  iconName?: string
  closable?: boolean
}

export interface TabContextType {
  tabs: TabItem[]
  activeTabId: string
  openTab: (tab: TabItem) => void
  closeTab: (tabId: string, e?: React.MouseEvent) => void
  closeAllOtherTabs: (tabId: string) => void
  setActiveTabId: (tabId: string) => void
}
