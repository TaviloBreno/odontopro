import { Button } from '@/components/ui/button'
import getSesion from '@/lib/getSession'
import { Calendar, Users, Clock, Settings, Bell, BarChart3, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { DashboardLogoutButton } from './_components/dashboard-logout-button'

export default async function Dashboard() {
  const session = await getSesion()

  if (!session) {
    redirect("/auth/signin")
  }

  // Redirecionar para dashboard específico baseado no plano
  const userPlan = session.user?.plan
  if (userPlan) {
    switch (userPlan) {
      case 'BASIC':
        redirect('/dashboard/basic')
      case 'PROFESSIONAL':
        redirect('/dashboard/professional')
      case 'PREMIUM':
        redirect('/dashboard/premium')
    }
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
              <div className="hidden sm:block">
                <span className="text-gray-500 text-sm">Dashboard</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Avatar */}
              <div className="sm:hidden w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-emerald-600">
                  {session.user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              
              {/* Desktop User Info */}
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
      <main className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo de volta, {session.user?.name?.split(' ')[0]}! 👋
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Gerencie sua clínica de forma eficiente com nossa plataforma
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Agendamentos Hoje</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">8</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Pacientes Total</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">156</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Receita Mensal</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">R$ 12.5k</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Próximo Paciente</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">14:30</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Agendamentos */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Próximos Agendamentos */}
            <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Próximos Agendamentos</h3>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Novo Agendamento</span>
                  <span className="sm:hidden">Novo</span>
                </Button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {[
                  { time: "09:00", patient: "Maria Silva", service: "Limpeza", status: "confirmado" },
                  { time: "10:30", patient: "João Santos", service: "Consulta", status: "pendente" },
                  { time: "14:00", patient: "Ana Costa", service: "Ortodontia", status: "confirmado" },
                  { time: "15:30", patient: "Carlos Lima", service: "Implante", status: "confirmado" },
                ].map((appointment, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-2 h-6 sm:h-8 bg-emerald-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm sm:text-base">{appointment.patient}</p>
                        <p className="text-xs sm:text-sm text-gray-500">{appointment.service}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:text-right ml-5 sm:ml-0">
                      <p className="font-medium text-gray-900 text-sm sm:text-base">{appointment.time}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-0 sm:mt-1 ${
                        appointment.status === 'confirmado' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Ações Rápidas</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Button variant="outline" className="h-auto p-3 sm:p-4 flex-col space-y-1 sm:space-y-2 touch-manipulation">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                  <span className="text-xs sm:text-sm">Agendar</span>
                </Button>
                <Button variant="outline" className="h-auto p-3 sm:p-4 flex-col space-y-1 sm:space-y-2 touch-manipulation">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  <span className="text-xs sm:text-sm">Pacientes</span>
                </Button>
                <Button variant="outline" className="h-auto p-3 sm:p-4 flex-col space-y-1 sm:space-y-2 touch-manipulation">
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  <span className="text-xs sm:text-sm">Relatórios</span>
                </Button>
                <Button variant="outline" className="h-auto p-3 sm:p-4 flex-col space-y-1 sm:space-y-2 touch-manipulation">
                  <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  <span className="text-xs sm:text-sm">Config.</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Perfil da Clínica */}
            <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Perfil da Clínica</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-600">Rua das Flores, 123</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-600">(11) 99999-9999</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-600">Seg-Sex: 8h-18h</span>
                </div>
              </div>
              <Button className="w-full mt-3 sm:mt-4" variant="outline" size="sm">
                Editar Perfil
              </Button>
            </div>

            {/* Lembretes */}
            <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Lembretes</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <Bell className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">Consulta de retorno</p>
                    <p className="text-xs text-gray-500">Maria Silva - Amanhã às 10h</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Bell className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">Pedido de material</p>
                    <p className="text-xs text-gray-500">Verificar estoque de anestésico</p>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-3 sm:mt-4" variant="outline" size="sm">
                Ver Todos
              </Button>
            </div>

            {/* Link Público */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 sm:p-6 rounded-lg sm:rounded-xl text-white">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Sua Página Pública</h3>
              <p className="text-xs sm:text-sm opacity-90 mb-3 sm:mb-4">
                Compartilhe o link da sua clínica com os pacientes
              </p>
              <Button 
                className="w-full bg-white text-emerald-600 hover:bg-gray-100 text-xs sm:text-sm"
                asChild
              >
                <Link href={`/clinica/${session.user?.id}`} target="_blank">
                  Ver Página Pública
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

