"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Loading } from "@/components/ui/loading"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return fallback || <Loading text="Checking authentication..." className="min-h-screen" />
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}
