import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { useMaterials } from '@/hooks/useMaterials'
import { formatDate, formatMoney } from '@/utils/format'

export default function Materials() {
  const { id } = useParams<{ id: string }>()
  const projectId = Number(id)
  const { items, addItem, deleteItem } = useMaterials(projectId)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', category: '', quantity: '', price: '', purchaseDate: '', storeName: '', location: '', notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await addItem({
      name: form.name,
      category: form.category,
      quantity: form.quantity,
      price: Number(form.price),
      purchaseDate: form.purchaseDate,
      storeName: form.storeName,
      location: form.location,
      notes: form.notes,
    })
    setForm({ name: '', category: '', quantity: '', price: '', purchaseDate: '', storeName: '', location: '', notes: '' })
    setShowForm(false)
  }

  const categories = ['瓷砖', '地板', '涂料', '五金', '灯具', '洁具', '橱柜', '门窗', '其他']
  const totalSpent = items.reduce((s, i) => s + i.price, 0)

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => window.history.back()} className="text-gray-500 hover:text-gray-700"><ArrowLeft size={20} /></button>
        <h1 className="text-xl font-bold">材料采购清单</h1>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-4 flex justify-between items-center">
        <span className="text-sm text-gray-600">共 {items.length} 项，已花费 {formatMoney(totalSpent)}</span>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700">
          <Plus size={16} /> 添加材料
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-4 mb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="材料名称" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" required />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" required>
              <option value="">选择分类</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input placeholder="数量/规格" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
            <input type="number" placeholder="价格" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" required />
            <input type="date" value={form.purchaseDate} onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
            <input placeholder="购买店铺" value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
            <input placeholder="存放位置" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
          </div>
          <textarea placeholder="备注" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">保存</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-500 px-4 py-2 text-sm">取消</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow p-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{item.name}</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{item.category}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {item.quantity} · {formatMoney(item.price)} · {item.storeName} · {item.location}
              </div>
              {item.notes && <div className="text-xs text-gray-400 mt-1">{item.notes}</div>}
            </div>
            <button onClick={() => deleteItem(item.id)} className="text-gray-400 hover:text-red-500">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {items.length === 0 && <div className="text-center text-gray-400 mt-8">还没有材料记录</div>}
    </div>
  )
}
