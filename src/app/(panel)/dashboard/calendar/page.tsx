'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Settings,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Star,
  CheckCircle,
  AlertCircle,
  XCircle,
  MapPin
} from 'lucide-react'
import Link from 'next/link'
import getSesion from '@/lib/getSession'
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, parseISO, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Tipos para o sistema de calendário
interface Professional {
  id: string
  name: string
  specialty: string
  color: string
  isActive: boolean
  workingHours: {
    start: string
    end: string
    days: number[] // 0 = domingo, 1 = segunda, etc.
  }
  avatar?: string
}

interface Appointment {
  id: string
  title: string
  patientName: string
  patientPhone: string
  professionalId: string
  date: string
  startTime: string
  endTime: string
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'
  type: string
  notes?: string
  duration: number // em minutos
}

interface CalendarView {
  type: 'day' | 'week' | 'month'
  date: Date
}

export default function CalendarPage() {
  const [userPlan, setUserPlan] = useState<string>('BASIC')
  const [view, setView] = useState<CalendarView>({ type: 'week', date: new Date() })
  const [selectedProfessional, setSelectedProfessional] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  // Dados mock dos profissionais
  const professionals: Professional[] = [
    {
      id: 'prof-1',
      name: 'Dr. João Silva',
      specialty: 'Ortodontia',
      color: '#3b82f6',
      isActive: true,
      workingHours: {
        start: '08:00',
        end: '18:00',
        days: [1, 2, 3, 4, 5] // Segunda a sexta
      }
    },
    {
      id: 'prof-2', 
      name: 'Dra. Maria Santos',
      specialty: 'Endodontia',
      color: '#10b981',
      isActive: true,
      workingHours: {
        start: '09:00',
        end: '17:00',
        days: [1, 2, 3, 4, 6] // Segunda a sábado (não quinta)
      }
    },
    {
      id: 'prof-3',
      name: 'Dr. Pedro Costa',
      specialty: 'Implantodontia', 
      color: '#f59e0b',
      isActive: true,
      workingHours: {
        start: '07:00',
        end: '15:00',
        days: [1, 2, 3, 4, 5]
      }
    }
  ]

  // Dados mock dos agendamentos
  const appointments: Appointment[] = [
    {
      id: 'apt-1',
      title: 'Consulta Inicial',
      patientName: 'Ana Silva',
      patientPhone: '(11) 99999-1111',
      professionalId: 'prof-1',
      date: '2024-12-20',
      startTime: '09:00',
      endTime: '10:00',
      status: 'scheduled',
      type: 'Consulta',
      duration: 60
    },
    {
      id: 'apt-2',
      title: 'Tratamento Canal',
      patientName: 'Carlos Oliveira',
      patientPhone: '(11) 99999-2222',
      professionalId: 'prof-2',
      date: '2024-12-20',
      startTime: '10:30',
      endTime: '12:00',
      status: 'confirmed',
      type: 'Tratamento',
      duration: 90
    },
    {
      id: 'apt-3',
      title: 'Implante Dentário',
      patientName: 'Lucia Santos',
      patientPhone: '(11) 99999-3333',
      professionalId: 'prof-3',
      date: '2024-12-20',
      startTime: '08:00',
      endTime: '10:00',
      status: 'completed',
      type: 'Cirurgia',
      duration: 120
    }
  ]

  useEffect(() => {
    // Verificar plano do usuário
    const checkUserPlan = async () => {
      try {
        const session = await getSesion()
        setUserPlan(session?.user?.plan || 'BASIC')
      } catch (error) {
        console.error('Erro ao verificar plano:', error)
      }
    }
    checkUserPlan()
  }, [])

  // Navegação do calendário
  const navigateCalendar = (direction: 'prev' | 'next') => {
    if (view.type === 'week') {
      setView(prev => ({
        ...prev,
        date: direction === 'next' ? addWeeks(prev.date, 1) : subWeeks(prev.date, 1)
      }))
    } else if (view.type === 'day') {
      setView(prev => ({
        ...prev,
        date: direction === 'next' ? addDays(prev.date, 1) : addDays(prev.date, -1)
      }))
    }
  }

  // Função para gerar os dias da semana
  const getWeekDays = () => {
    const startDate = startOfWeek(view.date, { weekStartsOn: 1 }) // Começa na segunda
    return Array.from({ length: 7 }, (_, i) => addDays(startDate, i))
  }

  // Função para obter agendamentos de um dia específico
  const getAppointmentsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return appointments.filter(apt => 
      apt.date === dateStr && 
      (selectedProfessional === 'all' || apt.professionalId === selectedProfessional)
    )
  }

  // Função para obter profissional por ID
  const getProfessional = (id: string) => {
    return professionals.find(prof => prof.id === id)
  }

  // Função para obter cor do status
  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200'
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      case 'no-show': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Função para obter ícone do status
  const getStatusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled': return <Clock className="w-3 h-3" />
      case 'confirmed': return <CheckCircle className="w-3 h-3" />
      case 'completed': return <CheckCircle className="w-3 h-3" />
      case 'cancelled': return <XCircle className="w-3 h-3" />
      case 'no-show': return <AlertCircle className="w-3 h-3" />
      default: return <Clock className="w-3 h-3" />
    }
  }

  // Função para formatar horário
  const formatTime = (time: string) => {
    return time
  }

  // Se não for plano professional, mostrar upgrade prompt
  if (userPlan !== 'PROFESSIONAL') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <CalendarIcon className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Calendário Multi-Profissional
          </h2>
          <p className="text-gray-600 mb-6">
            Gerencie agendamentos de múltiplos profissionais em uma única visualização. 
            Disponível apenas no plano Professional.
          </p>
          <Link href="/dashboard/plans">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Star className="w-4 h-4 mr-2" />
              Fazer Upgrade
            </Button>
          </Link>
        </div>
      </div>
    )
  }

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
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <CalendarIcon className="w-6 h-6" />
                  Calendário Multi-Profissional
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                    Professional
                  </span>
                </h1>
                <p className="text-sm text-gray-600">
                  Gerencie agendamentos de todos os profissionais
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="hidden sm:flex"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              <Link href="/dashboard/calendar/professionals">
                <Button variant="outline">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Profissionais
                </Button>
              </Link>
              <Link href="/dashboard/calendar/new-appointment">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Agendamento
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Filtros e Controles de Visualização */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            {/* Controles de Navegação */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateCalendar('prev')}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setView({ type: view.type, date: new Date() })}
                >
                  Hoje
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateCalendar('next')}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              <h2 className="text-lg font-semibold text-gray-900">
                {format(view.date, 'MMMM yyyy', { locale: ptBR })}
              </h2>
            </div>

            {/* Seletor de Visualização */}
            <div className="flex items-center space-x-2">
              <Button
                variant={view.type === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView(prev => ({ ...prev, type: 'day' }))}
              >
                Dia
              </Button>
              <Button
                variant={view.type === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView(prev => ({ ...prev, type: 'week' }))}
              >
                Semana
              </Button>
            </div>

            {/* Filtro por Profissional */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Profissional:</span>
              <select
                value={selectedProfessional}
                onChange={(e) => setSelectedProfessional(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Todos</option>
                {professionals.map(prof => (
                  <option key={prof.id} value={prof.id}>
                    {prof.name} - {prof.specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Calendário Semanal */}
        {view.type === 'week' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Cabeçalho dos dias */}
            <div className="grid grid-cols-8 border-b border-gray-200">
              <div className="p-3 text-sm font-medium text-gray-500">
                Horário
              </div>
              {getWeekDays().map(day => (
                <div
                  key={day.toISOString()}
                  className={`p-3 text-center border-l border-gray-200 ${
                    isToday(day) ? 'bg-emerald-50' : ''
                  }`}
                >
                  <div className="text-xs text-gray-500 uppercase">
                    {format(day, 'EEE', { locale: ptBR })}
                  </div>
                  <div className={`text-lg font-semibold ${
                    isToday(day) ? 'text-emerald-600' : 'text-gray-900'
                  }`}>
                    {format(day, 'd')}
                  </div>
                </div>
              ))}
            </div>

            {/* Grid de horários */}
            <div className="max-h-[600px] overflow-y-auto">
              {Array.from({ length: 20 }, (_, hour) => {
                const hourNum = hour + 6 // Começa às 6h
                const timeStr = `${hourNum.toString().padStart(2, '0')}:00`
                
                return (
                  <div key={hour} className="grid grid-cols-8 border-b border-gray-100 min-h-[60px]">
                    <div className="p-2 text-sm text-gray-500 border-r border-gray-200 flex items-start">
                      {timeStr}
                    </div>
                    {getWeekDays().map(day => {
                      const dayAppointments = getAppointmentsForDay(day)
                      const hourAppointments = dayAppointments.filter(apt => {
                        const aptHour = parseInt(apt.startTime.split(':')[0])
                        return aptHour === hourNum
                      })

                      return (
                        <div
                          key={`${day.toISOString()}-${hour}`}
                          className="border-l border-gray-200 p-1 relative"
                        >
                          {hourAppointments.map(apt => {
                            const professional = getProfessional(apt.professionalId)
                            return (
                              <div
                                key={apt.id}
                                className={`text-xs rounded p-2 mb-1 cursor-pointer border ${getStatusColor(apt.status)}`}
                                style={{ borderLeftColor: professional?.color, borderLeftWidth: '3px' }}
                                onClick={() => setSelectedAppointment(apt)}
                              >
                                <div className="flex items-center gap-1 mb-1">
                                  {getStatusIcon(apt.status)}
                                  <span className="font-medium truncate">
                                    {apt.patientName}
                                  </span>
                                </div>
                                <div className="text-xs opacity-75">
                                  {formatTime(apt.startTime)} - {apt.type}
                                </div>
                                <div className="text-xs opacity-60">
                                  {professional?.name}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Legenda dos Profissionais */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profissionais Ativos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {professionals.filter(prof => prof.isActive).map(prof => (
              <div key={prof.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: prof.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {prof.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {prof.specialty}
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  {prof.workingHours.start} - {prof.workingHours.end}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumo do Dia */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {isConnected ? (
                <Button
                  onClick={handleDisconnect}
                  variant="outline"
                  className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                >
                  <Unlink className="w-4 h-4 mr-2" />
                  Desconectar
                </Button>
              ) : (
                <Button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isConnecting ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <LinkIcon className="w-4 h-4 mr-2" />
                  )}
                  Conectar Google Calendar
                </Button>
              )}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoje</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total de Consultas</span>
                <span className="text-lg font-semibold text-gray-900">
                  {getAppointmentsForDay(new Date()).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Confirmadas</span>
                <span className="text-lg font-semibold text-green-600">
                  {getAppointmentsForDay(new Date()).filter(apt => apt.status === 'confirmed').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pendentes</span>
                <span className="text-lg font-semibold text-blue-600">
                  {getAppointmentsForDay(new Date()).filter(apt => apt.status === 'scheduled').length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Esta Semana</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total de Consultas</span>
                <span className="text-lg font-semibold text-gray-900">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Taxa de Ocupação</span>
                <span className="text-lg font-semibold text-emerald-600">78%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="space-y-2">
              <Link href="/dashboard/calendar/new-appointment">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Agendamento
                </Button>
              </Link>
              <Link href="/dashboard/calendar/professionals">
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Gerenciar Profissionais
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Detalhes do Agendamento */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Detalhes do Agendamento
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAppointment(null)}
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Paciente</label>
                  <p className="text-gray-900">{selectedAppointment.patientName}</p>
                  <p className="text-sm text-gray-500">{selectedAppointment.patientPhone}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Profissional</label>
                  <p className="text-gray-900">
                    {getProfessional(selectedAppointment.professionalId)?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {getProfessional(selectedAppointment.professionalId)?.specialty}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Data</label>
                    <p className="text-gray-900">
                      {format(parseISO(selectedAppointment.date), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Horário</label>
                    <p className="text-gray-900">
                      {selectedAppointment.startTime} - {selectedAppointment.endTime}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Tipo</label>
                  <p className="text-gray-900">{selectedAppointment.type}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAppointment.status)}`}>
                    {getStatusIcon(selectedAppointment.status)}
                    {selectedAppointment.status}
                  </div>
                </div>

                {selectedAppointment.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Observações</label>
                    <p className="text-gray-900">{selectedAppointment.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline" className="flex-1">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

        {isConnected && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {appointments.filter(a => a.synced).length}
                  </p>
                  <p className="text-gray-600 text-sm">Sincronizados</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {appointments.filter(a => !a.synced).length}
                  </p>
                  <p className="text-gray-600 text-sm">Pendentes</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
                  <p className="text-gray-600 text-sm">Total de Eventos</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Agendamentos</h2>
            {isConnected && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Sincronizado</span>
                <div className="w-2 h-2 bg-orange-500 rounded-full ml-4"></div>
                <span>Pendente</span>
              </div>
            )}
          </div>

          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum agendamento encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        appointment.synced ? 'bg-green-500' : 'bg-orange-500'
                      }`} />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {appointment.patientName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {appointment.service} • {appointment.duration} min
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(appointment.date).toLocaleDateString('pt-BR', {
                            weekday: 'short',
                            day: '2-digit',
                            month: 'short'
                          })}
                        </p>
                        <p className="text-sm text-gray-600">{appointment.time}</p>
                      </div>
                      
                      {isConnected && !appointment.synced && (
                        <Button
                          onClick={() => handleSyncSingle(appointment.id)}
                          size="sm"
                          variant="outline"
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Sincronizar
                        </Button>
                      )}
                      
                      {appointment.synced && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled
                          className="text-green-600"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Sincronizado
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Setup Instructions */}
        {!isConnected && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Como configurar</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-emerald-800">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Clique em "Conectar Google Calendar"</p>
                  <p className="text-sm text-gray-600">Você será redirecionado para fazer login na sua conta Google</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-emerald-800">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Autorize o acesso ao calendário</p>
                  <p className="text-sm text-gray-600">Permita que o OdontoPro acesse seu Google Calendar</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-emerald-800">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Sincronização automática</p>
                  <p className="text-sm text-gray-600">Seus agendamentos aparecerão automaticamente no Google Calendar</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Note */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Settings className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Segurança e Privacidade</h3>
              <p className="text-sm text-gray-600 mt-1">
                Utilizamos OAuth 2.0 para conectar com segurança ao Google Calendar. 
                Seus dados ficam criptografados e você pode revogar o acesso a qualquer momento.
                Esta é uma simulação para demonstração - em produção seria integrado com as APIs oficiais do Google.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}