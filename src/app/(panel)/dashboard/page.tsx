'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, Users, BarChart3, Settings, Star, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import getSesion from '@/lib/getSession'

export default function UnifiedDashboardPage() {
  const [userPlan, setUserPlan] = useState<string>('BASIC')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const session = await getSesion()
        setUserPlan(session?.user?.plan || 'BASIC')
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              🦷 Dashboard OdontoPro
            </h1>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              {userPlan}
            </span>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/dashboard/appointments" className="bg-white p-6 rounded-lg shadow-sm border">
            <Calendar className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-semibold">Agendamentos</h3>
            <p className="text-sm text-gray-600">Gerencie consultas</p>
          </Link>
          
          <Link href="/dashboard/patients" className="bg-white p-6 rounded-lg shadow-sm border">
            <Users className="w-8 h-8 text-green-600 mb-2" />
            <h3 className="font-semibold">Pacientes</h3>
            <p className="text-sm text-gray-600">Cadastro e histórico</p>
          </Link>
          
          {(userPlan === 'PROFESSIONAL' || userPlan === 'PREMIUM') && (
            <Link href="/dashboard/reports" className="bg-white p-6 rounded-lg shadow-sm border">
              <BarChart3 className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-semibold">Relatórios <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">Pro</span></h3>
              <p className="text-sm text-gray-600">Analytics avançados</p>
            </Link>
          )}
          
          <Link href="/dashboard/profile" className="bg-white p-6 rounded-lg shadow-sm border">
            <Settings className="w-8 h-8 text-gray-600 mb-2" />
            <h3 className="font-semibold">Configurações</h3>
            <p className="text-sm text-gray-600">Perfil da conta</p>
          </Link>
        </div>
        
        {userPlan === 'BASIC' && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Upgrade seu plano
            </h3>
            <p className="text-red-700 mb-4">
              Desbloqueie recursos avançados como relatórios, SMS, IA e mais.
            </p>
            <Link href="/dashboard/plans">
              <Button className="bg-red-600 hover:bg-red-700">
                <TrendingUp className="w-4 h-4 mr-2" />
                Ver Planos
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
