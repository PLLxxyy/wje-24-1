import { useState, useEffect, useCallback } from 'react'
import api from '@/utils/api'
import type { DiaryEntry } from '@/types'

export function useDiary(phaseId: number) {
  const [entries, setEntries] = useState<DiaryEntry[]>([])

  const fetchEntries = useCallback(async () => {
    const res = await api.get(`/phases/${phaseId}/diary`)
    setEntries(res.data)
  }, [phaseId])

  useEffect(() => {
    if (phaseId) fetchEntries()
  }, [phaseId, fetchEntries])

  const addEntry = useCallback(async (data: { date: string; content: string; photos?: string[] }) => {
    const res = await api.post(`/phases/${phaseId}/diary`, data)
    setEntries((prev) => [res.data, ...prev])
    return res.data
  }, [phaseId])

  return { entries, fetchEntries, addEntry }
}
