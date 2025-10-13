import { Button } from '@/components/ui/button'
import getSesion from '@/lib/getSession'
import { Calendar, Users, Clock, Bell, BarChart3, MapPin, Phone, Crown, Mail } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { DashboardLogoutButton } from '../_components/dashboard-logout-button'

export default async function BasicDashboard() {
  const session = await getSesion()

  if (!session) {
    redirect("/auth/signin")
  }

  // Verificar se o usuário tem o plano correto
  const userPlan = session.user?.plan || 'BASIC'
  if (userPlan !== 'BASIC') {
    redirect(`/dashboard/${userPlan.toLowerCase()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                Odonto<span className="text-emerald-600">PRO</span>
              </h1>
              <div className="flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  Plano Básico
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                  <p className="text-xs text-gray-500">{session.user?.email}</p>
                </div>
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-emerald-600">
                    {session.user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              </div>
              <DashboardLogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo, {session.user?.name?.split(' ')[0]}! 👋
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Gerencie sua clínica com o plano básico do OdontoPRO
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-gray-600 text-sm">Consultas Hoje</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">48</p>
                <p className="text-gray-600 text-sm">Pacientes Ativos</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-gray-600 text-sm">Serviços Cadastrados</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">R$ 2.840</p>
                <p className="text-gray-600 text-sm">Receita Mensal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left Column - Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/dashboard/appointments">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendamentos
                </Button>
              </Link>
              
              <Link href="/dashboard/patients">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Pacientes
                </Button>
              </Link>
              
              <Link href="/dashboard/services">
                <Button className="w-full justify-start" variant="outline">
                  <Clock className="w-4 h-4 mr-2" />
                  Serviços
                </Button>
              </Link>
              
              <Link href="/dashboard/emails">
                <Button className="w-full justify-start" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  E-mails
                </Button>
              </Link>
              
              <Link href="/dashboard/profile">
                <Button className="w-full justify-start" variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  Perfil da Clínica
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Upgrade Prompt */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg shadow-sm p-6 border border-emerald-200">
            <div className="flex items-start space-x-3">
              <Crown className="w-8 h-8 text-emerald-600 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-emerald-900 mb-2">
                  Upgrade para Profissional
                </h3>
                <p className="text-emerald-700 text-sm mb-4">
                  Desbloqueie recursos avançados como SMS, relatórios detalhados e suporte prioritário.
                </p>
                <Link href="/dashboard/plans">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Ver Planos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividades Recentes</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Nova consulta agendada</p>
                <p className="text-xs text-gray-500">Maria Santos - Limpeza - Hoje às 14:00</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <Users className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Novo paciente cadastrado</p>
                <p className="text-xs text-gray-500">João Silva - cadastrado há 2 horas</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Lembrete enviado por email</p>
                <p className="text-xs text-gray-500">Ana Costa - consulta amanhã às 09:00</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}