// 입력감지 커스텀 훅
// src/shared/lib/use-debounce.ts
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number = 300): T {
  // 입력값이 일정 시간 동안 바뀌지 않았을 때 반환할 값을 저장한다.
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // 값이 바뀔 때마다 타이머를 시작하고, 지연 시간이 지나면 최신 값을 반영한다.
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // 새로운 입력이 발생하면 이전 타이머를 취소해 마지막 입력만 처리한다.
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}