/**
 * Songs.jsx — 가사 화면
 *
 * 위치: src/pages/Songs.jsx
 *
 * 기능:
 *   - GET /api/songs/:id 로 노래 정보 + 가사 불러오기
 *   - "Extract words with AI" 버튼 → POST /api/songs/:id/extract
 *   - 추출된 단어 카드 목록 표시
 *   - 추출 완료 후 학습 모드로 이동
 *
 * 라우팅: /songs/:id
 */

import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

function Songs() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const [song, setSong] = useState(null)
  const [words, setWords] = useState([])
  const [isLoadingSong, setIsLoadingSong] = useState(true)
  const [isExtracting, setIsExtracting] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // ── 노래 정보 + 가사 불러오기 ─────────────────────────
  useEffect(() => {
    api.get(`/api/songs/${id}`)
      .then((res) => setSong(res.data))
      .catch(() => setError('Failed to load song.'))
      .finally(() => setIsLoadingSong(false))
  }, [id])

  // ── 이미 추출된 단어 있으면 불러오기 ─────────────────
  useEffect(() => {
    if (!user) return
    api.get(`/api/songs/${id}/words`)
      .then((res) => setWords(res.data))
      .catch(() => { })
  }, [id, user])

  // ── AI 단어 추출 ──────────────────────────────────────
  async function handleExtract() {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    setIsExtracting(true)
    setError('')
    setSuccessMsg('')
    try {
      const res = await api.post(`/api/songs/${id}/extract`)
      setWords(res.data)
      setSuccessMsg("Extraction complete! Let's start learning 🎉")
    } catch {
      setError('An error occurred during extraction.')
    } finally {
      setIsExtracting(false)
    }
  }

  // ── 학습 모드로 이동 ──────────────────────────────────
  function handleStartStudy() {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    navigate(`/study/${id}`)
  }

  // ── 로딩 중 ───────────────────────────────────────────
  if (isLoadingSong) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">

      {/* 뒤로가기 + 제목 */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]
            hover:text-[var(--color-text-primary)] transition-colors mb-3"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Library
        </button>

        <h1 className="text-2xl font-[var(--font-display)] text-[var(--color-text-primary)]">
          {song?.title}
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">{song?.artist}</p>
      </div>

      {/* 메인 레이아웃: 가사 | 단어 카드 */}
      <div className="flex flex-col md:flex-row gap-6">

        {/* ── 왼쪽: 가사 ── */}
        <div className="flex-1 min-w-0">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-4 uppercase tracking-widest">
              Lyrics
            </h2>
            <pre className="text-sm text-[var(--color-text-primary)] leading-relaxed whitespace-pre-wrap font-[var(--font-body)]">
              {song?.lyrics ?? 'Failed to load lyrics.'}
            </pre>
          </Card>
        </div>

        {/* ── 오른쪽: 단어 추출 + 카드 목록 ── */}
        <div className="w-full md:w-80 shrink-0 flex flex-col gap-4">

          {/* 에러 / 성공 메시지 */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

          {/* 추출 버튼 or 학습 시작 버튼 */}
          {words.length === 0 ? (
            <Button onClick={handleExtract} disabled={isExtracting} className="w-full">
              {isExtracting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[var(--color-accent-fg)] border-t-transparent rounded-full animate-spin" />
                  Extracting words...
                </span>
              ) : (
                'Extract words✨'
              )}
            </Button>
          ) : (
            <Button onClick={handleStartStudy} className="w-full">
              Start Learning →
            </Button>
          )}

          {words.length > 0 && (
            <p className="text-xs text-[var(--color-text-muted)] text-right">
              Card {words.length}
            </p>
          )}

          {/* 추출된 단어 카드 목록 */}
          {words.length > 0 && (
            <div className="flex flex-col gap-2">
              {words.map((word) => (
                <Card key={word.id} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-[var(--color-text-primary)]">{word.word}</p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{word.definition}</p>
                    </div>
                    {word.pos && (
                      <span className="text-[10px] font-semibold text-[var(--color-text-muted)]
                        uppercase tracking-widest shrink-0 mt-0.5">
                        {word.pos}
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* 추출 중 로딩 스켈레톤 */}
          {isExtracting && (
            <div className="flex flex-col gap-2">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-16 bg-[var(--color-surface-alt)] rounded-[var(--radius-lg)] animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Songs