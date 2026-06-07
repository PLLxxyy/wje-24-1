import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Home, LogOut, Hammer } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-blue-600">
            <Hammer size={20} />
            装修进度管理
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">{user.displayName}</span>
                <button
                  onClick={() => { logout(); navigate('/login') }}
                  className="text-gray-500 hover:text-red-500"
                  title="退出"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm text-blue-600">登录</Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
