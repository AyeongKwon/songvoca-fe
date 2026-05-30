/**
 * Lyrics.jsx — 가사 화면
 *
 * 위치: src/pages/Lyrics.jsx
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
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/client'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useToast } from '../components/ui/Toast'

function Lyrics() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [song, setSong] = useState(null)
  const [words, setWords] = useState([])
  const [isLoadingSong, setIsLoadingSong] = useState(true)
  const [isExtracting, setIsExtracting] = useState(false)

  // ── 노래 정보 + 가사 불러오기 ─────────────────────────
  useEffect(() => {
    api.get(`/songs/${id}`)
      .then((res) => setSong(res.data))
      .catch(() => showToast('Fail to load song.', 'error'))
      .finally(() => setIsLoadingSong(false))
  }, [id])

  // ── 이미 추출된 단어 있으면 불러오기 ─────────────────
  useEffect(() => {
    api.get(`/songs/${id}/words`)
      .then((res) => setWords(res.data))
      .catch(() => { })
  }, [id])

  // ── AI 단어 추출 ──────────────────────────────────────
  async function handleExtract() {
    setIsExtracting(true)
    try {
      const res = await api.post(`/songs/${id}/extract`)
      setWords(res.data)
      showToast("Extraction complete! Let's start learning🎉")
    } catch {
      showToast('An error occurred during extraction.', 'error')
    } finally {
      setIsExtracting(false)
    }
  }

  // ── 학습 모드로 이동 ──────────────────────────────────
  function handleStartStudy() {
    navigate(`/study/${id}`)
  }

  // ── 로딩 중 ───────────────────────────────────────────
  if (isLoadingSong) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[--color-accent] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">

      {/* 뒤로가기 + 제목 */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-[--color-text-muted]
            hover:text-[--color-text-primary] transition-colors mb-3"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Library
        </button>

        <h1 className="text-2xl font-[--font-display] text-[--color-text-primary]">
          {song?.title}
        </h1>
        <p className="text-sm text-[--color-text-secondary] mt-1">{song?.artist}</p>
      </div>

      {/* 메인 레이아웃: 가사 | 단어 카드 */}
      <div className="flex flex-col md:flex-row gap-6">

        {/* ── 왼쪽: 가사 ── */}
        <div className="flex-1 min-w-0">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-[--color-text-secondary] mb-4 uppercase tracking-widest">
              Lyrics
            </h2>
            <pre className="text-sm text-[--color-text-primary] leading-relaxed whitespace-pre-wrap font-[--font-body]">
              {song?.lyrics ?? 'Fail to load lyrics.'}
            </pre>
          </Card>
        </div>

        {/* ── 오른쪽: 단어 추출 + 카드 목록 ── */}
        <div className="w-full md:w-80 shrink-0 flex flex-col gap-4">

          {words.length > 0 && (
            <p className="text-xs text-[--color-text-muted] text-right">
              Card {words.length} / {words.length}
            </p>
          )}

          {/* 추출 버튼 or 학습 시작 버튼 */}
          {words.length === 0 ? (
            <Button onClick={handleExtract} disabled={isExtracting} className="w-full">
              {isExtracting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[--color-accent-fg] border-t-transparent rounded-full animate-spin" />
                  Extracting words...
                </span>
              ) : (
                'Extract words✨'
              )}
            </Button>
          ) : (
            <Button onClick={handleStartStudy} className="w-full">
              학습 시작하기 →
            </Button>
          )}

          {/* 추출된 단어 카드 목록 */}
          {words.length > 0 && (
            <div className="flex flex-col gap-2">
              {words.map((word) => (
                <Card key={word.id} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-[--color-text-primary]">{word.word}</p>
                      <p className="text-xs text-[--color-text-muted] mt-0.5">{word.definition}</p>
                    </div>
                    {word.pos && (
                      <span className="text-[10px] font-semibold text-[--color-text-muted]
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
                <div key={n} className="h-16 bg-[--color-surface-alt] rounded-[--radius-lg] animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Lyrics