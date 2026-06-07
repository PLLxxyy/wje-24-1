import { useState, useEffect, useCallback } from 'react'
import api from '@/utils/api'
import type { User } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }
    api
      .get('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    const res = await api.post('/auth/login', { username, password })
    localStorage.setItem('token', res.data.token)
    setUser(res.data)
    return res.data
  }, [])

  const register = useCallback(async (username: string, password: string, displayName: string) => {
    const res = await api.post('/auth/register', { username, password, displayName })
    localStorage.setItem('token', res.data.token)
    setUser(res.data)
    return res.data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setUser(null)
  }, [])

  return { user, loading, login, register, logout, isAuth: !!user }
}
