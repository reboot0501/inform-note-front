import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// 조건부 className을 안전하게 조합하고 충돌하는 Tailwind class를 정리한다.
export function cn(...inputs: ClassValue[]) {
  // clsx로 className을 문자열로 만든 뒤 twMerge로 우선순위가 높은 class만 남긴다.
  return twMerge(clsx(inputs))
}
