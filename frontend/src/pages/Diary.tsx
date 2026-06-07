import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus } from 'lucide-react'
import { useDiary } from '@/hooks/useDiary'
import { formatDate } from '@/utils/format'

export default function Diary() {
  const { phaseId } = useParams<{ phaseId: string }>()
  const id = Number(phaseId)
  const { entries, addEntry } = useDiary(id)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ date: '', content: '', photos: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await addEntry({
      date: form.date,
      content: form.content,
      photos: form.photos ? form.photos.split(',').map(s => s.trim()) : [],
    })
    setForm({ date: '', content: '', photos: '' })
    setShowForm(false)
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => window.history.back()} className="text-gray-500 hover:text-gray-700"><ArrowLeft size={20} /></button>
        <h1 className="text-xl font-bold">施工日记</h1>
      </div>

      <button
        onClick={() => setShowForm(true)}
        className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm mb-4 hover:bg-blue-700"
      >
        <Plus size={16} /> 写日记
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-4 mb-6 space-y-3">
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            required
          />
          <textarea
            placeholder="今天做了什么..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm h-24"
            required
          />
          <input
            placeholder="照片URL，多个用逗号分隔"
            value={form.photos}
            onChange={(e) => setForm({ ...form, photos: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">保存</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-500 px-4 py-2 text-sm">取消</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-xl shadow p-5">
            <div className="text-sm text-gray-500 mb-2">{formatDate(entry.date)}</div>
            <p className="text-sm whitespace-pre-wrap">{entry.content}</p>
            {entry.photos.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {entry.photos.map((photo, idx) => (
                  <img key={idx} src={photo} alt="" className="w-24 h-24 object-cover rounded-lg" />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {entries.length === 0 && <div className="text-center text-gray-400 mt-8">还没有日记</div>}
    </div>
  )
}
