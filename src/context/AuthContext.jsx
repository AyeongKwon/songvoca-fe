/**
 * AuthContext.jsx — 전역 로그인 상태 관리
 *
 * 제공하는 값:
 *   user       : 현재 로그인한 유저 정보 { id, name, email } / null
 *   isLoading  : 로그인 상태 확인 중 여부
 *   login(data): 로그인 처리 (토큰 저장 + user 세팅)
 *   logout()   : 로그아웃 처리 (토큰 삭제 + user 초기화)
 *
 * 사용법:
 *   const { user, login, logout } = useAuth()
 */

import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/client'

const AuthContext = createContext(null)

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth는 AuthProvider 안에서 써야 해요!')
    return ctx
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    // ── 앱 시작 시 토큰 있으면 유저 정보 가져오기 ──────────
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            setIsLoading(false)
            return
        }

        api.get('/auth/me')
            .then((res) => setUser(res.data))
            .catch(() => {
                // 토큰 만료 or 유효하지 않으면 삭제
                localStorage.removeItem('token')
            })
            .finally(() => setIsLoading(false))
    }, [])

    // ── 로그인 ─────────────────────────────────────────────
    // 백엔드 응답: { token, id, email, name }
    // user 객체로 묶어서 저장
    function login({ token, id, email, name }) {
        localStorage.setItem('token', token)
        setUser({ id, email, name })
    }

    // ── 로그아웃 ───────────────────────────────────────────
    function logout() {
        localStorage.removeItem('token')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}