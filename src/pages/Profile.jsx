import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'

const PREVIEW_COUNT = 5  // 처음 보여줄 단어 수

function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [words, setWords] = useState([])
  const [wordsLoading, setWordsLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)  // 전체 보기 토글

  //── 학습 통계 불러오기 ────────────────────────────────
  useEffect(() => {
    api.get('/api/auth/me')
      .then((res) => setStats(res.data))
      .catch((err) => console.error('Failed to load stats', err))
      .finally(() => setLoading(false))
  }, [])

  //── 단어 목록 불러오기 ────────────────────────────────
  useEffect(() => {
    api.get('/api/words')
      .then((res) => setWords(res.data))
      .catch((err) => console.error('Failed to load words', err))
      .finally(() => setWordsLoading(false))
  }, [])

  // ── 단어 삭제 ─────────────────────────────────────────
  async function handleDeleteWord(word) {
    if (!window.confirm(`Delete "${word.word}"?`)) return
    try {
      await api.delete(`/api/words/${word.id}`)
      setWords((prev) => prev.filter((w) => w.id !== word.id))
    } catch {
      alert('Failed to delete word.')
    }
  }

  function handleLogout() {
    if (!window.confirm('Log out?')) return
    navigate('/')
    logout()
  }

  const initial = user?.name?.charAt(0).toUpperCase() ?? '?'

  // 보여줄 단어 (전체보기면 전부, 아니면 5개)
  const visibleWords = showAll ? words : words.slice(0, PREVIEW_COUNT)

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

      {/* 단어 목록 (항상 표시) */}
      <h2 className="text-lg font-bold mb-4">My Words</h2>
      {wordsLoading ? (
        <p className="text-gray-500 mb-8">Loading...</p>
      ) : words.length === 0 ? (
        <p className="text-gray-500 mb-8">No words yet.</p>
      ) : (
        <div className="mb-8">
          <div className="flex flex-col gap-2">
            {visibleWords.map((word) => (
              <div key={word.id} className="flex justify-between items-start gap-2 border border-gray-200 rounded-lg p-3">
                <div className="min-w-0">
                  {/* 단어 + 품사 */}
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{word.word}</p>
                    {word.pos && (
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                        {word.pos}
                      </span>
                    )}
                  </div>
                  {/* 뜻 */}
                  <p className="text-xs text-gray-600 mt-0.5">{word.definition}</p>
                  {/* 노래 제목 */}
                  {word.song_title && (
                    <p className="inline-flex items-center gap-1 text-[10px] text-[var(--color-text-secondary)] bg-[var(--color-surface-alt)] rounded-full px-2 py-0.5 mt-1">
                      🎵 {word.song_title}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteWord(word)}
                  className="text-xs px-2 py-1 rounded font-bold bg-red-50 text-red-600 hover:bg-red-100 shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* Show all / Show less (5개보다 많을 때만) */}
          {words.length > PREVIEW_COUNT && (
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="text-sm text-gray-600 hover:text-gray-900 hover:underline mt-3"
            >
              {showAll ? 'Show less' : `Show all (${words.length})`}
            </button>
          )}
        </div>
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
    </div >
  )
}

export default Profile;
