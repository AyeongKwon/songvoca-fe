/**
 * Sidebar.jsx
 *
 * 데스크탑: 왼쪽 고정 사이드바
 * 모바일:  햄버거 메뉴 (상단 바 + 슬라이드 드로어)
 *
 * 6단계 반응형: 사이드바 → 햄버거 메뉴 변환
 */

import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import UserMenu from './UserMenu'

const icons = {
    home: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
            <path d="M9 21V12h6v9" />
        </svg>
    ),
    search: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
        </svg>
    ),
    library: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="18" rx="1" />
            <rect x="14" y="3" width="7" height="10" rx="1" />
            <path d="M14 17h7" /><path d="M14 21h7" />
        </svg>
    ),
    profile: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
    ),
    menu: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
    ),
    close: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    ),
}

const navItems = [
    { label: 'Home', to: '/', icon: icons.home },
    { label: 'Search', to: '/search', icon: icons.search },
    { label: 'Library', to: '/library', icon: icons.library },
    { label: 'Profile', to: '/profile', icon: icons.profile },
]

function navClass({ isActive }) {
    const base = 'flex items-center gap-3 px-3 py-2 rounded-[--radius-md] text-sm font-medium transition-colors duration-[--transition-fast]'
    return isActive
        ? `${base} bg-[--color-accent] text-[--color-accent-fg]`
        : `${base} text-[--color-text-secondary] hover:bg-[--color-border-light] hover:text-[--color-text-primary]`
}

function DesktopSidebar() {
    return (
        <aside className="hidden md:flex flex-col w-[220px] min-h-screen bg-[--color-surface-alt] border-r border-[--color-border] shrink-0">
            <div className="px-5 py-6">
                <span className="font-[--font-display] text-xl tracking-tight text-[--color-text-primary]">
                    ♪ SongVoca
                </span>
            </div>
            <nav className="flex flex-col gap-1 px-3 flex-1">
                {navItems.map(({ label, to, icon }) => (
                    <NavLink key={to} to={to} end={to === '/'} className={navClass}>
                        {icon}{label}
                    </NavLink>
                ))}
            </nav>
            <div className="p-3">
                <UserMenu />
            </div>
        </aside>
    )
}

function MobileHeader() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <header className="md:hidden fixed top-0 left-0 right-0 z-50
        h-14 bg-[--color-surface] border-b border-[--color-border]
        flex items-center justify-between px-4">
                <span className="font-[--font-display] text-lg text-[--color-text-primary]">
                    ♪ SongVoca
                </span>
                <button
                    onClick={() => setOpen(true)}
                    className="text-[--color-text-primary] p-1"
                    aria-label="메뉴 열기"
                >
                    {icons.menu}
                </button>
            </header>

            <div className="md:hidden h-14" />

            {open && (
                <div
                    className="md:hidden fixed inset-0 z-50 bg-black/40"
                    onClick={() => setOpen(false)}
                />
            )}

            <div className={`
        md:hidden fixed top-0 left-0 z-50 h-full w-64
        bg-[--color-surface-alt] border-r border-[--color-border]
        flex flex-col
        transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="flex items-center justify-between px-5 py-5">
                    <span className="font-[--font-display] text-xl text-[--color-text-primary]">
                        ♪ SongVoca
                    </span>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-[--color-text-muted]"
                        aria-label="메뉴 닫기"
                    >
                        {icons.close}
                    </button>
                </div>

                <nav className="flex flex-col gap-1 px-3 flex-1">
                    {navItems.map(({ label, to, icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            className={navClass}
                            onClick={() => setOpen(false)}
                        >
                            {icon}{label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-3">
                    <UserMenu />
                </div>
            </div>
        </>
    )
}

export default function Sidebar() {
    return (
        <>
            <DesktopSidebar />
            <MobileHeader />
        </>
    )
}