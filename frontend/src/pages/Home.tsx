import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Home as HomeIcon, Trash2 } from 'lucide-react'
import { useProjects } from '@/hooks/useProjects'
import { formatDate, formatMoney } from '@/utils/format'

export default function Home() {
  const { projects, loading, createProject, deleteProject } = useProjects()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', address: '', totalBudget: '', startDate: '' })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await createProject({
      name: form.name,
      address: form.address,
      totalBudget: Number(form.totalBudget),
      startDate: form.startDate,
    })
    setForm({ name: '', address: '', totalBudget: '', startDate: '' })
    setShowForm(false)
  }

  if (loading) return <div className="p-8 text-center">加载中...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">我的装修项目</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          <Plus size={16} /> 新建项目
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl shadow p-4 mb-6 space-y-3">
          <input
            placeholder="项目名称"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            required
          />
          <input
            placeholder="项目地址"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="总预算"
              value={form.totalBudget}
              onChange={(e) => setForm({ ...form, totalBudget: e.target.value })}
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
              required
            />
            <input
              type="date"
              placeholder="开工日期"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">创建</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-500 px-4 py-2 text-sm">取消</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="bg-white rounded-xl shadow p-5 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-blue-600">
                <HomeIcon size={18} />
                <h2 className="font-semibold">{project.name}</h2>
              </div>
              <button
                onClick={(e) => { e.preventDefault(); deleteProject(project.id) }}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">{project.address}</p>
            <div className="flex justify-between mt-4 text-sm">
              <span className="text-gray-600">总预算: {formatMoney(project.totalBudget)}</span>
              <span className="text-gray-500">开工: {formatDate(project.startDate)}</span>
            </div>
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center text-gray-400 mt-12">还没有装修项目，点击上方按钮创建一个</div>
      )}
    </div>
  )
}
