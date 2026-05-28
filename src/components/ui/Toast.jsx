/**
 * Toast.jsx — 알림 토스트 컴포넌트
 *
 * 사용법:
 *   1) main.jsx에서 ToastProvider로 감싸기
 *      <ToastProvider><App /></ToastProvider>
 *
 *   2) 어디서든 useToast로 호출
 *      const { showToast } = useToast()
 *      showToast('저장됐어요!')
 *      showToast('에러 발생', 'error')
 *      showToast('단어 삭제됨', 'warning')
 */

import { createContext, useContext, useState, useCallback } from 'react'

// ── Context ──────────────────────────────────────────────
const ToastContext = createContext(null)

export function useToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast는 ToastProvider 안에서 써야 해요!')
    return ctx
}

// ── 타입별 스타일 ─────────────────────────────────────────
const VARIANTS = {
    success: {
        bg: 'bg-[#1C1917]',
        text: 'text-[#F7F3EC]',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
            </svg>
        ),
    },
    error: {
        bg: 'bg-red-500',
        text: 'text-white',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        ),
    },
    warning: {
        bg: 'bg-amber-400',
        text: 'text-amber-900',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
        ),
    },
}

// ── 개별 Toast 아이템 ─────────────────────────────────────
function ToastItem({ message, type = 'success', onClose }) {
    const v = VARIANTS[type] ?? VARIANTS.success
    return (
        <div
            className={`
        flex items-center gap-3 px-4 py-3 rounded-[--radius-lg] shadow-[--shadow-lg]
        text-sm font-medium min-w-[200px] max-w-[320px]
        animate-[fadeInUp_0.2s_ease]
        ${v.bg} ${v.text}
      `}
        >
            <span className="shrink-0">{v.icon}</span>
            <span className="flex-1">{message}</span>
            <button
                onClick={onClose}
                className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                aria-label="닫기"
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
        </div>
    )
}

// ── Provider ─────────────────────────────────────────────
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const showToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now()
        setToasts((prev) => [...prev, { id, message, type }])
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, duration)
    }, [])

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* 토스트 렌더 영역: 오른쪽 하단 고정 */}
            <div className="fixed bottom-6 right-4 z-[9999] flex flex-col gap-2 items-end
                      md:bottom-6 md:right-6
                      pb-16 md:pb-0">  {/* 모바일 탭바 위로 올라오게 */}
                {toasts.map((t) => (
                    <ToastItem
                        key={t.id}
                        message={t.message}
                        type={t.type}
                        onClose={() => removeToast(t.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    )
}