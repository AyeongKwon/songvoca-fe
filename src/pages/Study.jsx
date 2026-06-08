/**
 * Study.jsx — 플래시카드 학습 화면
 *
 * 위치: src/pages/Study.jsx
 *
 * 학습 흐름:
 *   1) 진입 → study-logs 조회해서 학습 상태 파악
 *      - 학습 전 (기록 없음) → 전체 단어로 바로 시작
 *      - 일부만 체크 (한 바퀴 안 돔) → "이어서" / "처음부터"
 *      - 한 바퀴 완료 (전체 체크함) → "전체" / "모르는 것만"
 *   2) 한 바퀴 완료 → 전체 / 모르는 것 선택
 *
 * 라우팅: /study/:id
 */

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/client'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import ProgressBar from '../components/ui/ProgressBar'

function Study() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [allWords, setAllWords] = useState([])
  const [studyQueue, setStudyQueue] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sessionAnswers, setSessionAnswers] = useState({})
  const [roundComplete, setRoundComplete] = useState(false)

  // 시작 모드: 'start'(시작전 선택) | 'studying'(학습중)
  const [mode, setMode] = useState('start')
  const [unknownWordIds, setUnknownWordIds] = useState([])  // 모르는 단어 id
  const [studiedWordIds, setStudiedWordIds] = useState([])  // 이미 체크한 단어 id

  // ── 단어 목록 + 학습 기록 불러오기 ───────────────────
  useEffect(() => {
    Promise.all([
      api.get(`/api/songs/${id}/words`),
      api.get(`/api/study-logs?song_id=${id}`),
    ])
      .then(([wordsRes, logsRes]) => {
        const words = wordsRes.data
        const logs = logsRes.data
        setAllWords(words)

        // 단어별 최신 학습 기록만 추출
        const latestByWord = {}
        logs.forEach((log) => {
          if (
            !latestByWord[log.word_id] ||
            new Date(log.studied_at) > new Date(latestByWord[log.word_id].studied_at)
          ) {
            latestByWord[log.word_id] = log
          }
        })

        // 체크한 단어 id
        const studied = Object.keys(latestByWord).map(Number)
        setStudiedWordIds(studied)

        // 모르는 단어 = 최신 기록이 is_correct: false
        const unknown = Object.values(latestByWord)
          .filter((log) => !log.is_correct)
          .map((log) => log.word_id)
        setUnknownWordIds(unknown)

        // 학습 기록 전혀 없으면 → 바로 전체 학습 시작
        if (logs.length === 0) {
          setStudyQueue(words)
          setMode('studying')
        }
        // 기록 있으면 mode='start' 유지 → 선택 화면
      })
      .catch(() => alert('Failed to load words.'))
      .finally(() => setIsLoading(false))
  }, [id])

  useEffect(() => {
    setFlipped(false)
  }, [currentIndex])

  // ── 학습 결과 저장 + 다음 카드 ───────────────────────
  async function handleAnswer(isCorrect) {
    const currentWord = studyQueue[currentIndex]
    setIsSubmitting(true)
    setSessionAnswers((prev) => ({ ...prev, [currentWord.id]: isCorrect }))

    try {
      await api.post('/api/study-logs', {
        word_id: currentWord.id,
        is_correct: isCorrect,
      })
    } catch {
      alert('An error occurred while saving.')
    } finally {
      setIsSubmitting(false)
    }

    if (currentIndex + 1 < studyQueue.length) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setRoundComplete(true)
    }
  }

  // ── 학습 시작 (전체) ──────────────────────────────────
  function startAll() {
    setStudyQueue(allWords)
    setCurrentIndex(0)
    setSessionAnswers({})
    setRoundComplete(false)
    setMode('studying')
  }

  // ── 이어서 학습 (아직 체크 안 한 단어부터) ───────────
  function startResume() {
    const remaining = allWords.filter((w) => !studiedWordIds.includes(w.id))
    if (remaining.length === 0) {
      startAll()
      return
    }
    setStudyQueue(remaining)
    setCurrentIndex(0)
    setSessionAnswers({})
    setRoundComplete(false)
    setMode('studying')
  }

  // ── 모르는 것만 학습 ──────────────────────────────────
  function startUnknown() {
    const unknown = allWords.filter((w) => unknownWordIds.includes(w.id))
    if (unknown.length === 0) {
      navigate('/library')
      return
    }
    setStudyQueue(unknown)
    setCurrentIndex(0)
    setSessionAnswers({})
    setRoundComplete(false)
    setMode('studying')
  }

  // ── 뒤로가기 ──────────────────────────────────────────
  function handleBack() {
    const hasAnswered = Object.keys(sessionAnswers).length > 0
    const remaining = studyQueue.length - currentIndex
    if (hasAnswered && !window.confirm(`${remaining} words are still waiting to be studied.\nLeave anyway?`)) {
      return
    }
    navigate(-1)
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
  if (allWords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-[var(--color-text-secondary)]">There are no words to learn.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>Go back</Button>
      </div>
    )
  }

  // ── 시작 전 선택 화면 (학습 기록 있을 때) ────────────
  if (mode === 'start') {
    const isRoundComplete = studiedWordIds.length >= allWords.length  // 한 바퀴 돌았는지
    const isAllKnown = unknownWordIds.length === 0 && isRoundComplete

    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 max-w-lg mx-auto">
        {isAllKnown ? (
          // 모두 안다 → 완료
          <>
            <h1 className="text-2xl font-bold">All done! 🎉</h1>
            <p className="text-[var(--color-text-secondary)]">
              You know all {allWords.length} words.
            </p>
            <Button onClick={startAll}>Study again</Button>
            <Button variant="ghost" onClick={() => navigate('/library')}>
              Back to Library
            </Button>
          </>
        ) : isRoundComplete ? (
          // 한 바퀴 완료 → 전체 / 모르는 것
          <>
            <h1 className="text-2xl font-bold">Continue learning</h1>
            <p className="text-[var(--color-text-secondary)]">
              {unknownWordIds.length} word{unknownWordIds.length > 1 ? 's' : ''} left to review
            </p>
            <div className="flex gap-3 w-full">
              <Button variant="outline" className="flex-1" onClick={startAll}>
                Study all ({allWords.length})
              </Button>
              <Button className="flex-1" onClick={startUnknown}>
                Study unknown ({unknownWordIds.length})
              </Button>
            </div>
          </>
        ) : (
          // 일부만 체크 (한 바퀴 못 돔) → 이어서 / 처음부터
          <>
            <h1 className="text-2xl font-bold">Resume?</h1>
            <p className="text-[var(--color-text-secondary)]">
              You studied {studiedWordIds.length} of {allWords.length} words.
            </p>
            <div className="flex gap-3 w-full">
              <Button variant="outline" className="flex-1" onClick={startAll}>
                Start over
              </Button>
              <Button className="flex-1" onClick={startResume}>
                Resume
              </Button>
            </div>
          </>
        )}
      </div>
    )
  }

  // ── 한 바퀴 완료 → 선택 화면 ─────────────────────────
  if (roundComplete) {
    const unknownCount = studyQueue.filter((w) => sessionAnswers[w.id] === false).length
    const isAllKnown = unknownCount === 0

    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 max-w-lg mx-auto">
        {isAllKnown ? (
          <>
            <h1 className="text-3xl font-bold">Great job! 🎉</h1>
            <p className="text-[var(--color-text-secondary)]">
              You know all the words!
            </p>
            <Button onClick={() => navigate('/library')}>Back to Library</Button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Round complete!</h1>
            <p className="text-[var(--color-text-secondary)]">
              {unknownCount} word{unknownCount > 1 ? 's' : ''} to review
            </p>
            <div className="flex gap-3 w-full">
              <Button variant="outline" className="flex-1" onClick={startAll}>
                Study all ({allWords.length})
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  const unknown = studyQueue.filter((w) => sessionAnswers[w.id] === false)
                  setStudyQueue(unknown)
                  setCurrentIndex(0)
                  setSessionAnswers({})
                  setRoundComplete(false)
                }}
              >
                Study unknown ({unknownCount})
              </Button>
            </div>
            <Button variant="ghost" onClick={() => navigate('/library')}>
              Back to Library
            </Button>
          </>
        )}
      </div>
    )
  }

  const currentWord = studyQueue[currentIndex]

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">

      <div>
        <button
          onClick={handleBack}
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

      <ProgressBar
        value={currentIndex + 1}
        max={studyQueue.length}
        showLabel
        labelFormat="card"
      />

      <Card.Word
        word={currentWord.word}
        pos={currentWord.pos}
        definition={currentWord.definition}
        flipped={flipped}
        onClick={() => setFlipped((prev) => !prev)}
      />

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
