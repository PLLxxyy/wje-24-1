import { Router } from 'express'
import { db } from '../database'

const router = Router()

router.get('/projects/:projectId/materials', (req, res) => {
  const items = db.prepare('SELECT * FROM materials WHERE project_id = ? ORDER BY purchase_date DESC').all(req.params.projectId)
  res.json(items)
})

router.post('/projects/:projectId/materials', (req, res) => {
  const { name, category, quantity, price, purchaseDate, storeName, location, notes } = req.body
  const result = db.prepare(`
    INSERT INTO materials (project_id, name, category, quantity, price, purchase_date, store_name, location, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(req.params.projectId, name, category || '', quantity || '', price || 0, purchaseDate || null, storeName || '', location || '', notes || '')
  const item = db.prepare('SELECT * FROM materials WHERE id = ?').get(result.lastInsertRowid)
  res.json(item)
})

router.delete('/materials/:id', (req, res) => {
  db.prepare('DELETE FROM materials WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

export default router
