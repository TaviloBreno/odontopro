import { Button } from '@/components/ui/button'
import getSesion from '@/lib/getSession'
import { Calendar, Users, Clock, Bell, BarChart3, MapPin, Phone, Crown, MessageSquare, TrendingUp, Shield, Star, Package } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { DashboardLogoutButton } from '../_components/dashboard-logout-button'

export default async function ProfessionalDashboard() {
  const session = await getSesion()

  if (!session) {
    redirect("/auth/signin")
  }

  // Verificar se o usuário tem o plano correto
  const userPlan = session.user?.plan || 'PROFESSIONAL'
  if (userPlan !== 'PROFESSIONAL') {
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
                <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  Profissional
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
            Bem-vindo, {session.user?.name?.split(' ')[0]}! ⭐
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Dashboard avançado - Plano Profissional com recursos premium
          </p>
        </div>

        {/* Stats Cards - Mais detalhadas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">28</p>
                  <p className="text-gray-600 text-sm">Consultas Hoje</p>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">+12%</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">156</p>
                  <p className="text-gray-600 text-sm">Pacientes Ativos</p>
                </div>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">+8%</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">50</p>
                  <p className="text-gray-600 text-sm">Serviços Ativos</p>
                </div>
              </div>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Ilimitado</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">R$ 18.750</p>
                  <p className="text-gray-600 text-sm">Receita Mensal</p>
                </div>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">+24%</span>
            </div>
          </div>
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-emerald-600" />
              Ações Avançadas
            </h3>
            <div className="space-y-3">
              <Link href="/dashboard/calendar">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Calendário Multi-Profissional
                </Button>
              </Link>
              
              <Link href="/dashboard/reports">
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Relatórios Avançados
                </Button>
              </Link>
              
              <Link href="/dashboard/sms">
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Notificações SMS
                </Button>
              </Link>
              
              <Link href="/dashboard/reminders">
                <Button className="w-full justify-start" variant="outline">
                  <Bell className="w-4 h-4 mr-2" />
                  Sistema de Lembretes
                </Button>
              </Link>
              
              <Link href="/dashboard/inventory">
                <Button className="w-full justify-start" variant="outline">
                  <Package className="w-4 h-4 mr-2" />
                  Controle de Estoque
                </Button>
              </Link>
              
              <Link href="/dashboard/theme">
                <Button className="w-full justify-start" variant="outline">
                  <Palette className="w-4 h-4 mr-2" />
                  Personalizar Tema
                </Button>
              </Link>
              
              <Link href="/dashboard/backup">
                <Button className="w-full justify-start" variant="outline">
                  <Shield className="w-4 h-4 mr-2" />
                  Backup Automático
                </Button>
              </Link>
            </div>
          </div>

          {/* Analytics Chart Placeholder */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise Semanal</h3>
            <div className="h-48 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <p className="text-emerald-800 font-medium">Gráfico de Performance</p>
                <p className="text-emerald-600 text-sm">Crescimento de 24% este mês</p>
              </div>
            </div>
          </div>

          {/* Professional Features */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg shadow-sm p-6 border border-purple-200">
            <div className="flex items-start space-x-3">
              <Crown className="w-8 h-8 text-purple-600 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  Recursos Profissionais
                </h3>
                <ul className="space-y-2 text-sm text-purple-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    Suporte Prioritário 24/7
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    Múltiplos Profissionais
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    Controle de Estoque
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    Badge Verificado
                  </li>
                </ul>
                <Link href="/dashboard/plans">
                  <Button className="mt-4 bg-purple-600 hover:bg-purple-700" size="sm">
                    Upgrade para Premium IA
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enhanced Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividades Recentes</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <MessageSquare className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">SMS enviado automaticamente</p>
                  <p className="text-xs text-gray-500">Lembrete para Maria Santos - Consulta amanhã</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Novo profissional adicionado</p>
                  <p className="text-xs text-gray-500">Dr. Pedro Oliveira - Ortodontista</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Relatório mensal gerado</p>
                  <p className="text-xs text-gray-500">Performance de Outubro - Crescimento de 24%</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <Shield className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Backup automático realizado</p>
                  <p className="text-xs text-gray-500">Dados salvos com segurança - Hoje às 03:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Stats */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas Avançadas</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Taxa de Comparecimento</span>
                <span className="text-sm font-bold text-green-600">94.2%</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Satisfação do Cliente</span>
                <span className="text-sm font-bold text-blue-600">4.8/5.0</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Tempo Médio de Atendimento</span>
                <span className="text-sm font-bold text-purple-600">42 min</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Reagendamentos</span>
                <span className="text-sm font-bold text-orange-600">3.1%</span>
              </div>

              <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-sm font-medium text-emerald-800">🏆 Meta do mês atingida!</p>
                <p className="text-xs text-emerald-600">120% da meta de consultas realizadas</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}