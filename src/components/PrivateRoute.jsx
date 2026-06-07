import { Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ children }) {
  const { user, isLoading } = useAuth()
  
  useEffect(() => {
    if (!isLoading && !user) {
      alert('Please log in to continue')
    }
  }, [user, isLoading])
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-6 h-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}