import { Router } from 'express'
import { db } from '../database'

const router = Router()

router.get('/projects/:projectId/phases', (req, res) => {
  const phases = db.prepare('SELECT * FROM phases WHERE project_id = ? ORDER BY order_index').all(req.params.projectId)
  res.json(phases)
})

router.patch('/phases/:id', (req, res) => {
  const { progress, actualCost, status } = req.body
  const fields: string[] = []
  const values: any[] = []
  if (progress !== undefined) { fields.push('progress = ?'); values.push(progress) }
  if (actualCost !== undefined) { fields.push('actual_cost = ?'); values.push(actualCost) }
  if (status !== undefined) { fields.push('status = ?'); values.push(status) }
  if (fields.length === 0) return res.status(400).json({ error: '无更新字段' })
  values.push(req.params.id)
  db.prepare(`UPDATE phases SET ${fields.join(', ')} WHERE id = ?`).run(...values)
  const phase = db.prepare('SELECT * FROM phases WHERE id = ?').get(req.params.id)
  res.json(phase)
})

router.get('/phases/:id/diary', (req, res) => {
  const entries = db.prepare('SELECT * FROM diary_entries WHERE phase_id = ? ORDER BY date DESC').all(req.params.id)
  res.json(entries.map((e: any) => ({ ...e, photos: JSON.parse(e.photos || '[]') })))
})

router.post('/phases/:id/diary', (req, res) => {
  const { date, content, photos } = req.body
  const result = db.prepare('INSERT INTO diary_entries (phase_id, date, content, photos) VALUES (?, ?, ?, ?)')
    .run(req.params.id, date, content, JSON.stringify(photos || []))
  const entry = db.prepare('SELECT * FROM diary_entries WHERE id = ?').get(result.lastInsertRowid)
  res.json({ ...(entry as any), photos: JSON.parse((entry as any).photos || '[]') })
})

export default router
