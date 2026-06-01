/**
 * Study.jsx — 플래시카드 학습 화면
 *
 * 위치: src/pages/Study.jsx
 *
 * 기능:
 *   - 카드 앞면: 한국어 단어
 *   - 카드 뒷면: 영어 뜻 + 품사
 *   - 탭으로 앞/뒤 전환
 *   - "I know / I don't know" 버튼
 *   - POST /api/study-logs 로 학습 결과 저장
 *   - 다음 카드로 이동
 *
 * 라우팅: /study/:id
 */

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/client'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import ProgressBar from '../components/ui/ProgressBar'
import { useToast } from '../components/ui/Toast'

function Study() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [words, setWords] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  // ── 단어 목록 불러오기 ────────────────────────────────
  useEffect(() => {
    api.get(`/songs/${id}/words`)
      .then((res) => setWords(res.data))
      .catch(() => showToast('Fail to load words.', 'error'))
      .finally(() => setIsLoading(false))
  }, [id])

  // 카드 넘어갈 때 뒤집기 초기화
  useEffect(() => {
    setFlipped(false)
  }, [currentIndex])

  // ── 학습 결과 저장 + 다음 카드 ───────────────────────
  async function handleAnswer(isCorrect) {
    const currentWord = words[currentIndex]
    setIsSubmitting(true)

    try {
      // PPT 슬라이드 API 기준: POST /api/study-logs
      await api.post('/api/study-logs', {
        word_id: currentWord.id,
        is_correct: isCorrect,
      })
    } catch {
      showToast('An error occurred while saving.', 'error')
    } finally {
      setIsSubmitting(false)
    }

    // 다음 카드로 이동
    if (currentIndex + 1 < words.length) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setIsFinished(true)   // 완료 화면 표시
    }
  }

  // ── 로딩 중 ───────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // ── 단어 없음 ─────────────────────────────────────────
  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-[var(--color-text-secondary)]">There are no words to learn.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>Go back</Button>
      </div>
    )
  }

  // ── 학습 완료 ─────────────────────────────────────────
  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <h1 className="text-3xl font-bold">Great job! 🎉</h1>
        <p className="text-[var(--color-text-secondary)]">
          You studied {words.length} words
        </p>
        <Button onClick={() => navigate('/library')}>
          Back to Library
        </Button>
      </div>
    )
  }

  const currentWord = words[currentIndex]

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">

      {/* 뒤로가기 + 노래 제목 */}
      <div>
        <button
          onClick={() => navigate(-1)} // Need to discuss later: songs or previous page
          className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]
            hover:text-[var(--color-text-primary)] transition-colors mb-3"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Lyrics
        </button>
      </div>

      {/* 진도 바 + 카드 번호 */}
      <ProgressBar
        value={currentIndex + 1}
        max={words.length}
        showLabel
        labelFormat="card"
      />

      {/* 플래시카드 */}
      <Card.Word
        word={currentWord.word}
        pos={currentWord.pos}
        definition={currentWord.definition}
        flipped={flipped}
        onClick={() => setFlipped((prev) => !prev)}
      />

      {/* I know / I don't know 버튼 */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          disabled={isSubmitting}
          onClick={() => handleAnswer(false)}
        >
          ✕ I don't know
        </Button>
        <Button
          className="flex-1"
          disabled={isSubmitting}
          onClick={() => handleAnswer(true)}
        >
          ✓ I know
        </Button>
      </div>

    </div>
  )
}

export default Study;