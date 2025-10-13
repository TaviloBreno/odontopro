'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  Settings, 
  RefreshCw,
  Clock,
  Link as LinkIcon,
  Unlink,
  Info,
  RotateCcw
} from 'lucide-react'
import Link from 'next/link'

// Dados fictícios para demonstrar a integração
const calendarData = {
  isConnected: false,
  lastSync: null,
  syncedAppointments: 0,
  googleEmail: null,
  calendarName: null
}

const mockAppointments = [
  {
    id: '1',
    patientName: 'Maria Silva',
    service: 'Limpeza Dental',
    date: '2024-05-20',
    time: '14:00',
    duration: 60,
    synced: false
  },
  {
    id: '2',
    patientName: 'João Santos',
    service: 'Consulta Básica',
    date: '2024-05-21',
    time: '10:30',
    duration: 30,
    synced: true
  },
  {
    id: '3',
    patientName: 'Ana Costa',
    service: 'Obturação',
    date: '2024-05-22',
    time: '15:00',
    duration: 90,
    synced: false
  }
]

export default function CalendarIntegrationPage() {
  const [isConnected, setIsConnected] = useState(calendarData.isConnected)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [appointments, setAppointments] = useState(mockAppointments)
  const [googleEmail, setGoogleEmail] = useState<string | null>(calendarData.googleEmail)

  const handleConnect = async () => {
    setIsConnecting(true)
    
    // Simular processo de autenticação OAuth
    setTimeout(() => {
      setIsConnected(true)
      setGoogleEmail('dentista@clinica.com.br')
      setIsConnecting(false)
    }, 2000)
  }

  const handleDisconnect = async () => {
    setIsConnected(false)
    setGoogleEmail(null)
    // Marcar todos os agendamentos como não sincronizados
    setAppointments(prev => prev.map(app => ({ ...app, synced: false })))
  }

  const handleSync = async () => {
    setIsSyncing(true)
    
    // Simular sincronização
    setTimeout(() => {
      setAppointments(prev => prev.map(app => ({ ...app, synced: true })))
      setIsSyncing(false)
    }, 3000)
  }

  const handleSyncSingle = async (appointmentId: string) => {
    setAppointments(prev => prev.map(app => 
      app.id === appointmentId ? { ...app, synced: true } : app
    ))
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
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Google Calendar</h1>
                <p className="text-sm text-gray-600">
                  Integração com Google Calendar
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {isConnected && (
                <Button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isSyncing ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RotateCcw className="w-4 h-4 mr-2" />
                  )}
                  Sincronizar Tudo
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                isConnected ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Calendar className={`w-6 h-6 ${
                  isConnected ? 'text-green-600' : 'text-gray-400'
                }`} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Status da Integração
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                  {isConnected ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700">
                        Conectado como {googleEmail}
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Não conectado
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
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
            </div>
          </div>
        </div>

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-blue-800">Como funciona a integração</h3>
              <div className="text-sm text-blue-700 mt-1">
                <p>• Conecte sua conta Google para sincronizar automaticamente</p>
                <p>• Agendamentos aparecem no seu Google Calendar</p>
                <p>• Atualizações são sincronizadas em tempo real</p>
                <p>• Você recebe notificações no seu dispositivo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
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