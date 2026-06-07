import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Home from '@/pages/Home'
import ProjectDetail from '@/pages/ProjectDetail'
import Diary from '@/pages/Diary'
import Materials from '@/pages/Materials'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
        <Route path="/projects/:id/materials" element={<ProtectedRoute><Materials /></ProtectedRoute>} />
        <Route path="/phases/:phaseId/diary" element={<ProtectedRoute><Diary /></ProtectedRoute>} />
      </Route>
    </Routes>
  )
}
