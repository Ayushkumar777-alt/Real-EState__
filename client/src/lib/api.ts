export const API_URL = import.meta.env.VITE_API_URL || '/api'

export function getToken(): string | null {
  return localStorage.getItem('vex_token')
}

export function setSession(token: string, user: unknown) {
  localStorage.setItem('vex_token', token)
  localStorage.setItem('vex_user', JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem('vex_token')
  localStorage.removeItem('vex_user')
}

export function getSessionUser<T = { name?: string; email: string }>(): T | null {
  const raw = localStorage.getItem('vex_user')
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

interface ApiError extends Error {
  status?: number
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken()
  const isFormData = options.body instanceof FormData

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...((options.headers as Record<string, string>) || {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const error: ApiError = new Error(data?.message || 'Something went wrong.')
    error.status = res.status
    throw error
  }

  return data
}
