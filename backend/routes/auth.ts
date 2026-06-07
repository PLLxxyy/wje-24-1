import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../database'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'pdd170-secret'

router.post('/register', (req, res) => {
  const { username, password, displayName } = req.body
  if (!username || !password || !displayName) {
    return res.status(400).json({ error: '缺少必填字段' })
  }
  const hash = bcrypt.hashSync(password, 10)
  try {
    const stmt = db.prepare('INSERT INTO users (username, password, display_name) VALUES (?, ?, ?)')
    const result = stmt.run(username, hash, displayName)
    const token = jwt.sign({ userId: result.lastInsertRowid }, JWT_SECRET)
    res.json({ id: result.lastInsertRowid, username, displayName, token })
  } catch (e: any) {
    res.status(400).json({ error: '用户名已存在' })
  }
})

router.post('/login', (req, res) => {
  const { username, password } = req.body
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: '用户名或密码错误' })
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET)
  res.json({ id: user.id, username: user.username, displayName: user.display_name, token })
})

router.get('/me', (req, res) => {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: '未登录' })
  try {
    const decoded = jwt.verify(auth.slice(7), JWT_SECRET) as any
    const user = db.prepare('SELECT id, username, display_name FROM users WHERE id = ?').get(decoded.userId) as any
    if (!user) return res.status(401).json({ error: '用户不存在' })
    res.json({ id: user.id, username: user.username, displayName: user.display_name, token: auth.slice(7) })
  } catch {
    res.status(401).json({ error: 'token 无效' })
  }
})

export default router
