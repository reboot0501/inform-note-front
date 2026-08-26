// 11. Jotai 상태 관리를 위한 Provider 컴포넌트
import type { ReactNode } from 'react'
import { Provider } from 'jotai'

interface Props {
  children: ReactNode
}

export const JotaiProvider = ({ children }: Props) => {
  return <Provider>{children}</Provider>
}