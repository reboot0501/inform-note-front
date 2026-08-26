// HTTP 메서드 래퍼 함수
// src/shared/api/http-client.ts
import { axiosInstance } from './axios-instance'

export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const res = await axiosInstance.get<T>(url, { params })
  return res.data
}

export async function post<T, B>(url: string, data: B): Promise<T> {
  const res = await axiosInstance.post<T>(url, data)
  return res.data
}

export async function put<T, B>(url: string, data: B): Promise<T> {
  const res = await axiosInstance.put<T>(url, data)
  return res.data
}

export async function del<T>(url: string): Promise<T> {
  const res = await axiosInstance.delete<T>(url)
  return res.data
}

export async function patch<T, B>(url: string, data: B): Promise<T> {
  const res = await axiosInstance.patch<T>(url, data)
  return res.data
}