// Axios 인스턴스 생성
// src/shared/api/axios-instance.ts

import axios from 'axios'
import { setupAuthInterceptor } from './auth-interceptor'

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '', // vite proxy 사용 — 경로 그대로 사용
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10_000,
})

// 인증 인터셉터 등록 — localStorage의 accessToken을 Authorization 헤더로 자동 주입
setupAuthInterceptor(axiosInstance)

// 응답 인터셉터 — 공통 에러 처리
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // 401 처리, 공통 에러 로깅 등 향후 추가
        return Promise.reject(error)
    },
)
