import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ children }) {
  const { user, isLoading } = useAuth()
  
  // 로그인 상태 확인 중
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-6 h-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  
  // 로그인 안 됐으면 /login으로
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}