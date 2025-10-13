"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function DashboardRedirect() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.plan) {
      const plan = session.user.plan
      const currentPath = window.location.pathname

      // Se o usuário está no dashboard principal, redirecionar para o dashboard específico
      if (currentPath === '/dashboard') {
        switch (plan) {
          case 'BASIC':
            router.push('/dashboard/basic')
            break
          case 'PROFESSIONAL':
            router.push('/dashboard/professional')
            break
          case 'PREMIUM':
            router.push('/dashboard/premium')
            break
        }
      }
    }
  }, [session, status, router])

  return null
}