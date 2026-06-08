/**
 * Layout.jsx
 *
 * 앱 전체 레이아웃: Sidebar + 메인 콘텐츠 영역
 *
 * 데스크탑: [Sidebar 220px] | [main 나머지]
 * 모바일:  [main 전체] + [하단 탭바]
 *
 * 사용법 (App.jsx 예시):
 *
 *   <Routes>
 *     <Route element={<Layout />}>
 *       <Route path="/"        element={<HomePage />} />
 *       <Route path="/search"  element={<SearchPage />} />
 *       <Route path="/library" element={<LibraryPage />} />
 *       <Route path="/profile" element={<ProfilePage />} />
 *     </Route>
 *     <Route path="/login"    element={<LoginPage />} />
 *   </Routes>
 */

import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
    return (
        <div className="flex min-h-screen bg-[var(--color-bg)]">
            {/* 사이드바 (데스크탑에서만 표시, 모바일은 하단 탭바) */}
            <Sidebar />

            {/* 메인 콘텐츠 */}
            <main
                className={[
                    'flex-1',
                    'min-w-0',                      // flex child 오버플로 방지
                    'px-4 py-6',                    // 모바일 패딩
                    'md:px-8 md:py-8',             // 데스크탑 패딩
                    'pt-20 md:pt-8',                // 모바일: 상단 헤더 높이만큼 띄우기 -> 잘림 문제 해결
                    'pb-20 md:pb-8',               // 모바일: 하단 탭바 높이만큼 패딩
                    'max-w-[var(--content-max-width)]', // 콘텐츠 최대 너비
                ].join(' ')}
            >
                {/* 
          React Router의 <Outlet />:
          이 자리에 자식 Route 컴포넌트가 렌더링됨
        */}
                <Outlet />
            </main>
        </div>
    );
}