import { Button } from '@/components/ui/button'
import getSesion from '@/lib/getSession'
import { Calendar, Users, Clock, Settings, LogOut, Bell, BarChart3, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default async function Dashboard() {
  const session = await getSesion()

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Odonto<span className="text-emerald-600">PRO</span>
              </h1>
              <div className="hidden sm:block">
                <span className="text-gray-500">Dashboard</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
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
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo de volta, {session.user?.name?.split(' ')[0]}! 👋
          </h2>
          <p className="text-gray-600">
            Gerencie sua clínica de forma eficiente com nossa plataforma
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Agendamentos Hoje</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pacientes Total</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Mensal</p>
                <p className="text-2xl font-bold text-gray-900">R$ 12.5k</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Próximo Paciente</p>
                <p className="text-2xl font-bold text-gray-900">14:30</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Agendamentos */}
          <div className="lg:col-span-2 space-y-6">
            {/* Próximos Agendamentos */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Próximos Agendamentos</h3>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  Novo Agendamento
                </Button>
              </div>
              
              <div className="space-y-4">
                {[
                  { time: "09:00", patient: "Maria Silva", service: "Limpeza", status: "confirmado" },
                  { time: "10:30", patient: "João Santos", service: "Consulta", status: "pendente" },
                  { time: "14:00", patient: "Ana Costa", service: "Ortodontia", status: "confirmado" },
                  { time: "15:30", patient: "Carlos Lima", service: "Implante", status: "confirmado" },
                ].map((appointment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">{appointment.patient}</p>
                        <p className="text-sm text-gray-500">{appointment.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{appointment.time}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
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
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                  <Calendar className="w-6 h-6 text-emerald-600" />
                  <span className="text-sm">Agendar</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  <span className="text-sm">Pacientes</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                  <span className="text-sm">Relatórios</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                  <Settings className="w-6 h-6 text-gray-600" />
                  <span className="text-sm">Configurações</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Perfil da Clínica */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Perfil da Clínica</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Rua das Flores, 123</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">(11) 99999-9999</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Seg-Sex: 8h-18h</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                Editar Perfil
              </Button>
            </div>

            {/* Lembretes */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lembretes</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <Bell className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Consulta de retorno</p>
                    <p className="text-xs text-gray-500">Maria Silva - Amanhã às 10h</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Bell className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Pedido de material</p>
                    <p className="text-xs text-gray-500">Verificar estoque de anestésico</p>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline" size="sm">
                Ver Todos
              </Button>
            </div>

            {/* Link Público */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-xl text-white">
              <h3 className="font-semibold mb-2">Sua Página Pública</h3>
              <p className="text-sm opacity-90 mb-4">
                Compartilhe o link da sua clínica com os pacientes
              </p>
              <Button 
                className="w-full bg-white text-emerald-600 hover:bg-gray-100"
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

// Componente separado para o botão de logout (client component)
function DashboardLogoutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => window.location.href = '/api/auth/signout'}
      className="text-gray-500 hover:text-gray-700"
    >
      <LogOut className="w-4 h-4" />
    </Button>
  )
}