/**
 * Sidebar.jsx
 *
 * 데스크탑: 왼쪽 고정 사이드바 (Home / Search / Library / Profile)
 * 모바일:  하단 탭바로 전환 (반응형)
 *
 * 사용법:
 *   <Sidebar />   ← Layout 안에 포함됨
 */

import { NavLink } from 'react-router-dom';
import UserMenu from './UserMenu';

// ── 아이콘 (SVG 인라인, 외부 의존성 없음) ──
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
            <path d="M14 17h7" />
            <path d="M14 21h7" />
        </svg>
    ),
    profile: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
    ),
};

const navItems = [
    { label: 'Home', to: '/', icon: icons.home },
    { label: 'Search', to: '/search', icon: icons.search },
    { label: 'Library', to: '/library', icon: icons.library },
    { label: 'Profile', to: '/profile', icon: icons.profile },
];

// ── 공통 active 스타일 helper ──────────────────────────
function navClass({ isActive }) {
    const base =
        'flex items-center gap-3 px-3 py-2 rounded-[--radius-md] text-sm font-medium transition-colors duration-[--transition-fast]';
    return isActive
        ? `${base} bg-[--color-accent] text-[--color-accent-fg]`
        : `${base} text-[--color-text-secondary] hover:bg-[--color-border-light] hover:text-[--color-text-primary]`;
}

// ── 데스크탑 사이드바 ─────────────────────────────────
function DesktopSidebar() {
    return (
        <aside
            className="hidden md:flex flex-col w-[220px] min-h-screen bg-[--color-surface-alt] border-r border-[--color-border] shrink-0"
            aria-label="메인 내비게이션"
        >
            {/* 로고 */}
            <div className="px-5 py-6">
                <span className="font-[--font-display] text-xl tracking-tight text-[--color-text-primary]">
                    ♪ SongVoca
                </span>
            </div>

            {/* 내비 링크 */}
            <nav className="flex flex-col gap-1 px-3 flex-1">
                {navItems.map(({ label, to, icon }) => (
                    <NavLink key={to} to={to} end={to === '/'} className={navClass}>
                        {icon}
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* 하단 여백 */}
            <div className="p-3">
                <UserMenu />
            </div>
        </aside>
    );
}

// ── 모바일 하단 탭바 ──────────────────────────────────
function MobileTabBar() {
    return (
        <nav
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex h-14 bg-[--color-surface] border-t border-[--color-border]"
            aria-label="하단 탭 내비게이션"
        >
            {navItems.map(({ label, to, icon }) => (
                <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                        `flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors duration-[--transition-fast] ${isActive
                            ? 'text-[--color-text-primary]'
                            : 'text-[--color-text-muted]'
                        }`
                    }
                >
                    {icon}
                    {label}
                </NavLink>
            ))}
        </nav>
    );
}

// ── 내보내기 ──────────────────────────────────────────
export default function Sidebar() {
    return (
        <>
            <DesktopSidebar />
            <MobileTabBar />
        </>
    );
}