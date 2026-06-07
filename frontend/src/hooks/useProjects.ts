import { useState, useEffect, useCallback } from 'react'
import api from '@/utils/api'
import type { Project, ProjectMember } from '@/types'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    const res = await api.get('/projects')
    setProjects(res.data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const createProject = useCallback(async (data: Partial<Project>) => {
    const res = await api.post('/projects', data)
    setProjects((prev) => [...prev, res.data])
    return res.data
  }, [])

  const deleteProject = useCallback(async (id: number) => {
    await api.delete(`/projects/${id}`)
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return { projects, loading, fetchProjects, createProject, deleteProject }
}

export function useProjectMembers(projectId: number) {
  const [members, setMembers] = useState<ProjectMember[]>([])

  const fetchMembers = useCallback(async () => {
    const res = await api.get(`/projects/${projectId}/members`)
    setMembers(res.data)
  }, [projectId])

  useEffect(() => {
    if (projectId) fetchMembers()
  }, [projectId, fetchMembers])

  const inviteMember = useCallback(async (username: string) => {
    await api.post(`/projects/${projectId}/members`, { username })
    await fetchMembers()
  }, [projectId, fetchMembers])

  return { members, fetchMembers, inviteMember }
}
