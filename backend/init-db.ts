import { db } from './database'

const initSQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  display_name TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT,
  total_budget REAL DEFAULT 0,
  start_date TEXT,
  end_date TEXT,
  owner_id INTEGER NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  role TEXT DEFAULT 'member',
  UNIQUE(project_id, user_id)
);

CREATE TABLE IF NOT EXISTS phases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  planned_start TEXT,
  planned_end TEXT,
  budget REAL DEFAULT 0,
  progress INTEGER DEFAULT 0,
  actual_cost REAL DEFAULT 0,
  status TEXT DEFAULT 'not_started'
);

CREATE TABLE IF NOT EXISTS diary_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phase_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  content TEXT NOT NULL,
  photos TEXT DEFAULT '[]',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS materials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  quantity TEXT,
  price REAL DEFAULT 0,
  purchase_date TEXT,
  store_name TEXT,
  location TEXT,
  notes TEXT
);
`

export function initDb() {
  db.exec(initSQL)
  console.log('Database initialized')
}
