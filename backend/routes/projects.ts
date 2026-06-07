import { Router } from 'express'
import { db } from '../database'

const router = Router()

function getUserId(req: any) {
  return req.userId
}

router.get('/', (req: any, res) => {
  const userId = getUserId(req)
  const projects = db.prepare(`
    SELECT p.* FROM projects p
    LEFT JOIN project_members pm ON p.id = pm.project_id
    WHERE p.owner_id = ? OR pm.user_id = ?
    GROUP BY p.id
  `).all(userId, userId) as any[]
  
  const projectsWithPhases = projects.map((project: any) => {
    const phases = db.prepare('SELECT * FROM phases WHERE project_id = ? ORDER BY order_index').all(project.id)
    return { ...project, phases }
  })
  
  res.json(projectsWithPhases)
})

router.post('/', (req: any, res) => {
  const userId = getUserId(req)
  const { name, address, total_budget, start_date } = req.body
  const result = db.prepare('INSERT INTO projects (name, address, total_budget, start_date, owner_id) VALUES (?, ?, ?, ?, ?)')
    .run(name, address || '', total_budget || 0, start_date || null, userId)
  const projectId = result.lastInsertRowid as number

  const phases = ['拆除', '水电', '泥瓦', '木工', '油漆']
  const phaseStmt = db.prepare('INSERT INTO phases (project_id, name, order_index, planned_start, planned_end, budget, progress, actual_cost, status) VALUES (?, ?, ?, ?, ?, 0, 0, 0, ?)')
  const baseDate = start_date ? new Date(start_date) : new Date()
  phases.forEach((name, i) => {
    const plannedStart = new Date(baseDate)
    plannedStart.setDate(baseDate.getDate() + i * 7)
    const plannedEnd = new Date(plannedStart)
    plannedEnd.setDate(plannedStart.getDate() + 6)
    phaseStmt.run(projectId, name, i, plannedStart.toISOString().split('T')[0], plannedEnd.toISOString().split('T')[0], 'not_started')
  })

  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId)
  res.json(project)
})

router.get('/:id', (req: any, res) => {
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id)
  if (!project) return res.status(404).json({ error: '项目不存在' })
  res.json(project)
})

router.delete('/:id', (req: any, res) => {
  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

router.get('/:id/members', (req, res) => {
  const members = db.prepare(`
    SELECT pm.id, pm.project_id, pm.user_id, pm.role, u.username, u.display_name as displayName
    FROM project_members pm
    JOIN users u ON pm.user_id = u.id
    WHERE pm.project_id = ?
  `).all(req.params.id)
  res.json(members)
})

router.post('/:id/members', (req, res) => {
  const { username } = req.body
  const user = db.prepare('SELECT id FROM users WHERE username = ?').get(username) as any
  if (!user) return res.status(404).json({ error: '用户不存在' })
  try {
    db.prepare('INSERT INTO project_members (project_id, user_id) VALUES (?, ?)').run(req.params.id, user.id)
    res.json({ ok: true })
  } catch (e: any) {
    res.status(400).json({ error: '该用户已是成员' })
  }
})

export default router
