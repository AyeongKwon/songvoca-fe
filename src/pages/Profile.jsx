import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'

function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  //── 학습 통계 불러오기 ────────────────────────────────
  useEffect(() => {
    api.get('/api/auth/me')
      .then((res) => setStats(res.data))
      .catch((err) => console.error('Failed to load stats', err))
      .finally(() => setLoading(false))
  }, [])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const initial = user?.name?.charAt(0).toUpperCase() ?? '?'

  return (
    <div className="max-w-md">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      {/* 유저 정보 */}
      <div className="flex items-center gap-4 mb-8">
        <span className="w-12 h-12 rounded-full bg-gray-900 text-white
          flex items-center justify-center text-lg font-semibold shrink-0">
          {initial}
        </span>
        <div>
          <p className="font-medium text-gray-900">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      {/* 학습 통계 */}
      <h2 className="text-lg font-bold mb-4">My Stats</h2>
      {loading ? (
        <p className="text-gray-500 mb-8">Loading...</p>
      ) : stats ? (
        <div className="grid grid-cols-3 gap-3 mb-8">
          <Link to="/library" className="border border-gray-200 rounded p-4 text-center hover:shadow">
            <p className="text-2xl font-bold text-gray-900">{stats.songs}</p>
            <p className="text-xs text-gray-500 mt-1">My songs</p>
          </Link>
          <div className="border border-gray-200 rounded p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.knowWords}</p>
            <p className="text-xs text-gray-500 mt-1">Words I know</p>
          </div>
          <div className="border border-gray-200 rounded p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.wholeWords}</p>
            <p className="text-xs text-gray-500 mt-1">Total words</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 mb-8">Failed to load stats.</p>
      )}

      {/* 로그아웃 */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Log out
      </button>
    </div>
  )
}

export default Profile;