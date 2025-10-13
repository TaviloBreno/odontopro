import { Button } from '@/components/ui/button'
import getSesion from '@/lib/getSession'
import { Calendar, Plus, Clock, Users, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

// Dados fictícios para agendamentos
const appointments = [
  {
    id: '1',
    patientName: 'Maria Santos',
    patientEmail: 'maria.santos@email.com',
    patientPhone: '(11) 99999-0001',
    service: 'Limpeza Dental',
    date: '2025-10-13',
    time: '09:00',
    duration: 60,
    price: 120,
    status: 'confirmado'
  },
  {
    id: '2',
    patientName: 'João Silva',
    patientEmail: 'joao.silva@email.com',
    patientPhone: '(11) 99999-0002',
    service: 'Consulta Básica',
    date: '2025-10-13',
    time: '10:30',
    duration: 30,
    price: 80,
    status: 'confirmado'
  },
  {
    id: '3',
    patientName: 'Ana Costa',
    patientEmail: 'ana.costa@email.com',
    patientPhone: '(11) 99999-0003',
    service: 'Obturação',
    date: '2025-10-13',
    time: '14:00',
    duration: 90,
    price: 200,
    status: 'pendente'
  },
  {
    id: '4',
    patientName: 'Pedro Oliveira',
    patientEmail: 'pedro.oliveira@email.com',
    patientPhone: '(11) 99999-0004',
    service: 'Limpeza Dental',
    date: '2025-10-14',
    time: '08:00',
    duration: 60,
    price: 120,
    status: 'confirmado'
  },
  {
    id: '5',
    patientName: 'Carla Lima',
    patientEmail: 'carla.lima@email.com',
    patientPhone: '(11) 99999-0005',
    service: 'Consulta Básica',
    date: '2025-10-14',
    time: '09:30',
    duration: 30,
    price: 80,
    status: 'cancelado'
  }
]

export default async function AppointmentsPage() {
  const session = await getSesion()

  if (!session) {
    redirect("/auth/signin")
  }

  const todayAppointments = appointments.filter(apt => apt.date === '2025-10-13')
  const upcomingAppointments = appointments.filter(apt => apt.date > '2025-10-13')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-emerald-600 hover:text-emerald-700">
                ← Dashboard
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Agendamentos</h1>
                <p className="text-sm text-gray-600">Gerencie suas consultas</p>
              </div>
            </div>
            
            <Link href="/dashboard/appointments/new">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Agendamento
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{todayAppointments.length}</p>
                <p className="text-gray-600 text-sm">Hoje</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
                <p className="text-gray-600 text-sm">Próximos</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
                <p className="text-gray-600 text-sm">Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por paciente..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                <option>Todos os status</option>
                <option>Confirmado</option>
                <option>Pendente</option>
                <option>Cancelado</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                <option>Todas as datas</option>
                <option>Hoje</option>
                <option>Esta semana</option>
                <option>Este mês</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appointments Today */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Agendamentos de Hoje</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {todayAppointments.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum agendamento para hoje</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{appointment.patientName}</h3>
                            <p className="text-sm text-gray-600">{appointment.service}</p>
                            <p className="text-xs text-gray-500">{appointment.patientPhone}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{appointment.time}</p>
                        <p className="text-sm text-gray-600">{appointment.duration} min</p>
                        <p className="text-sm font-medium text-emerald-600">R$ {appointment.price}</p>
                      </div>
                      
                      <div className="ml-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          appointment.status === 'confirmado' 
                            ? 'bg-green-100 text-green-800'
                            : appointment.status === 'pendente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* All Appointments */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Todos os Agendamentos</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serviço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data/Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{appointment.patientName}</p>
                          <p className="text-sm text-gray-500">{appointment.patientPhone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">{appointment.service}</p>
                        <p className="text-sm text-gray-500">{appointment.duration} minutos</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">{appointment.date}</p>
                        <p className="text-sm text-gray-500">{appointment.time}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-emerald-600">R$ {appointment.price}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          appointment.status === 'confirmado' 
                            ? 'bg-green-100 text-green-800'
                            : appointment.status === 'pendente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                          <Button variant="outline" size="sm">
                            Cancelar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}