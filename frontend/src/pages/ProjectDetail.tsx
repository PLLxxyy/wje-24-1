import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Users, Package } from 'lucide-react'
import { usePhases } from '@/hooks/usePhases'
import { useProjectMembers } from '@/hooks/useProjects'
import { formatDate, formatMoney } from '@/utils/format'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const projectId = Number(id)
  const { phases, updatePhase } = usePhases(projectId)
  const { members, inviteMember } = useProjectMembers(projectId)
  const [showInvite, setShowInvite] = useState(false)
  const [inviteUsername, setInviteUsername] = useState('')
  const [activeTab, setActiveTab] = useState<'phases' | 'members' | 'materials'>('phases')

  const totalProgress = phases.length
    ? Math.round(phases.reduce((s, p) => s + p.progress, 0) / phases.length)
    : 0
  const totalActualCost = phases.reduce((s, p) => s + p.actualCost, 0)
  const totalBudget = phases.reduce((s, p) => s + p.budget, 0)
  const isOverBudget = totalActualCost > totalBudget

  const handleProgressChange = async (phaseId: number, progress: number) => {
    let status: 'not_started' | 'in_progress' | 'completed' = 'not_started'
    if (progress >= 100) status = 'completed'
    else if (progress > 0) status = 'in_progress'
    await updatePhase(phaseId, { progress, status })
  }

  const statusColor = (status: string) => {
    if (status === 'completed') return 'bg-green-500'
    if (status === 'in_progress') return 'bg-blue-500'
    return 'bg-gray-300'
  }

  const statusText = (status: string) => {
    if (status === 'completed') return '已完成'
    if (status === 'in_progress') return '进行中'
    return '未开始'
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Link to="/" className="text-gray-500 hover:text-gray-700"><ArrowLeft size={20} /></Link>
        <h1 className="text-xl font-bold">项目详情</h1>
      </div>

      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">总体进度</span>
          <span className={`text-sm font-medium ${isOverBudget ? 'text-red-500' : 'text-green-600'}`}>
            {isOverBudget ? '已超支' : '未超支'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
          <div className="bg-blue-600 h-4 rounded-full transition-all" style={{ width: `${totalProgress}%` }} />
        </div>
        <div className="flex justify-between text-sm">
          <span>{totalProgress}% 完成</span>
          <span>实际花费 {formatMoney(totalActualCost)} / 预算 {formatMoney(totalBudget)}</span>
        </div>
      </div>

      <div className="flex gap-4 border-b mb-4">
        {[
          { key: 'phases', label: '施工阶段', icon: null },
          { key: 'members', label: '协作成员', icon: Users },
          { key: 'materials', label: '材料清单', icon: Package },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`flex items-center gap-1 pb-2 text-sm font-medium ${activeTab === t.key ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            {t.icon && <t.icon size={14} />}
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'phases' && (
        <div className="space-y-4">
          {phases.map((phase) => (
            <div key={phase.id} className="bg-white rounded-xl shadow p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${statusColor(phase.status)}`} />
                  <h3 className="font-semibold">{phase.name}</h3>
                  <span className="text-xs text-gray-500">{statusText(phase.status)}</span>
                </div>
                <Link to={`/phases/${phase.id}/diary`} className="text-sm text-blue-600 hover:underline">
                  施工日记
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                <div>计划: {formatDate(phase.plannedStart)} ~ {formatDate(phase.plannedEnd)}</div>
                <div>预算: {formatMoney(phase.budget)}</div>
              </div>
              <div className="mb-2">
                <label className="text-sm text-gray-500">进度: {phase.progress}%</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={phase.progress}
                  onChange={(e) => handleProgressChange(phase.id, Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>实际花费:</span>
                <input
                  type="number"
                  value={phase.actualCost}
                  onChange={(e) => updatePhase(phase.id, { actualCost: Number(e.target.value) })}
                  className="border rounded px-2 py-1 w-28 text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'members' && (
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">协作成员</h3>
            <button onClick={() => setShowInvite(true)} className="text-sm text-blue-600 flex items-center gap-1">
              <Plus size={14} /> 邀请
            </button>
          </div>
          {showInvite && (
            <div className="flex gap-2 mb-4">
              <input
                placeholder="输入用户名"
                value={inviteUsername}
                onChange={(e) => setInviteUsername(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm flex-1"
              />
              <button
                onClick={async () => { await inviteMember(inviteUsername); setInviteUsername(''); setShowInvite(false) }}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
              >
                发送邀请
              </button>
            </div>
          )}
          <div className="space-y-2">
            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm">{m.displayName} ({m.username})</span>
                <span className="text-xs text-gray-500">{m.role}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'materials' && (
        <div className="text-center py-8">
          <Link to={`/projects/${projectId}/materials`} className="text-blue-600 hover:underline text-sm">
            查看完整材料清单 &rarr;
          </Link>
        </div>
      )}
    </div>
  )
}
