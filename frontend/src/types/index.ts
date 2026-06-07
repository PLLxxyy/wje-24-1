export interface User {
  id: number
  username: string
  displayName: string
  token: string
}

export interface Project {
  id: number
  name: string
  address: string
  totalBudget: number
  startDate: string
  endDate: string | null
  ownerId: number
  createdAt: string
}

export interface Phase {
  id: number
  projectId: number
  name: string
  orderIndex: number
  plannedStart: string
  plannedEnd: string
  budget: number
  progress: number
  actualCost: number
  status: 'not_started' | 'in_progress' | 'completed'
}

export interface DiaryEntry {
  id: number
  phaseId: number
  date: string
  content: string
  photos: string[]
  createdAt: string
}

export interface MaterialItem {
  id: number
  projectId: number
  name: string
  category: string
  quantity: string
  price: number
  purchaseDate: string
  storeName: string
  location: string
  notes: string
}

export interface ProjectMember {
  id: number
  projectId: number
  userId: number
  username: string
  displayName: string
  role: string
}
