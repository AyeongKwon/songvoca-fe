/**
 * UserMenu.jsx — 사용자 드롭다운 메뉴
 *
 * 위치: src/components/UserMenu.jsx
 *
 * 기능:
 *   - 유저 이름 + 이니셜 아바타 표시
 *   - 클릭하면 드롭다운 (로그아웃 버튼)
 *   - 바깥 클릭 시 자동 닫힘
 *
 * 사용법:
 *   Sidebar.jsx 하단에 <UserMenu /> 추가
 */

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function UserMenu() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const menuRef = useRef(null)

    // ── 바깥 클릭 시 닫기 ─────────────────────────────────
    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // ── 로그아웃 처리 ─────────────────────────────────────
    function handleLogout() {
        logout()
        setOpen(false)
        navigate('/login')
    }

    if (!user) return null

    // 이름 첫 글자 이니셜
    const initial = user.name?.charAt(0).toUpperCase() ?? '?'

    return (
        <div ref={menuRef} className="relative">
            {/* 트리거 버튼 */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-[--radius-md]
          text-sm text-[--color-text-secondary] font-medium
          hover:bg-[--color-border-light] transition-colors duration-[--transition-fast]"
            >
                {/* 이니셜 아바타 */}
                <span className="w-7 h-7 rounded-full bg-[--color-accent] text-[--color-accent-fg]
          flex items-center justify-center text-xs font-semibold shrink-0">
                    {initial}
                </span>
                <span className="truncate">{user.name}</span>
                {/* 화살표 */}
                <svg
                    width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className={`ml-auto transition-transform duration-[--transition-fast] ${open ? 'rotate-180' : ''}`}
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {/* 드롭다운 */}
            {open && (
                <div className="absolute bottom-full left-0 right-0 mb-1
          bg-[--color-surface] border border-[--color-border]
          rounded-[--radius-lg] shadow-[--shadow-md] overflow-hidden z-50">

                    {/* 유저 정보 */}
                    <div className="px-4 py-3 border-b border-[--color-border]">
                        <p className="text-sm font-medium text-[--color-text-primary] truncate">{user.name}</p>
                        <p className="text-xs text-[--color-text-muted] truncate">{user.email}</p>
                    </div>

                    {/* 로그아웃 */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2.5
              text-sm text-red-500 hover:bg-red-50
              transition-colors duration-[--transition-fast]"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        로그아웃
                    </button>
                </div>
            )}
        </div>
    )
}