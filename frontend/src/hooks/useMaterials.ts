import { useState, useEffect, useCallback } from 'react'
import api from '@/utils/api'
import type { MaterialItem } from '@/types'

export function useMaterials(projectId: number) {
  const [items, setItems] = useState<MaterialItem[]>([])

  const fetchItems = useCallback(async () => {
    const res = await api.get(`/projects/${projectId}/materials`)
    setItems(res.data)
  }, [projectId])

  useEffect(() => {
    if (projectId) fetchItems()
  }, [projectId, fetchItems])

  const addItem = useCallback(async (data: Partial<MaterialItem>) => {
    const res = await api.post(`/projects/${projectId}/materials`, data)
    setItems((prev) => [...prev, res.data])
    return res.data
  }, [projectId])

  const deleteItem = useCallback(async (id: number) => {
    await api.delete(`/materials/${id}`)
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  return { items, fetchItems, addItem, deleteItem }
}
