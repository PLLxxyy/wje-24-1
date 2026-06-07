import { useState, useEffect, useCallback } from 'react'
import api from '@/utils/api'
import type { Phase } from '@/types'

export function usePhases(projectId: number) {
  const [phases, setPhases] = useState<Phase[]>([])
  const [loading, setLoading] = useState(false)

  const fetchPhases = useCallback(async () => {
    setLoading(true)
    const res = await api.get(`/projects/${projectId}/phases`)
    setPhases(res.data)
    setLoading(false)
  }, [projectId])

  useEffect(() => {
    if (projectId) fetchPhases()
  }, [projectId, fetchPhases])

  const updatePhase = useCallback(async (id: number, data: Partial<Phase>) => {
    const res = await api.patch(`/phases/${id}`, data)
    setPhases((prev) => prev.map((p) => (p.id === id ? res.data : p)))
    return res.data
  }, [])

  return { phases, loading, fetchPhases, updatePhase }
}
