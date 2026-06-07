import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(username, password)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.error || '登录失败')
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16 bg-white rounded-xl shadow p-6">
      <h1 className="text-xl font-bold text-center mb-6">登录</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">用户名</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">密码</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700"
        >
          登录
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-4">
        还没有账号？<Link to="/register" className="text-blue-600">注册</Link>
      </p>
    </div>
  )
}
