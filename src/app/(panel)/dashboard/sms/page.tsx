'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Smartphone, 
  Send, 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Plus,
  Users,
  TrendingUp,
  Settings,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { SMSService, AppointmentSMSData, SMSData } from '@/lib/sms'

export default function SMSPage() {
  const [smsQueue, setSMSQueue] = useState<(SMSData & { timestamp: string; status: 'sent' | 'failed' })[]>([])
  const [smsStats, setSMSStats] = useState({ sent: 0, failed: 0, total: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [showCustomSMS, setShowCustomSMS] = useState(false)
  const [customSMS, setCustomSMS] = useState({ phone: '', message: '' })

  const smsService = SMSService.getInstance()

  useEffect(() => {
    // Carregar SMS da fila e estatísticas
    setSMSQueue(smsService.getSMSQueue())
    setSMSStats(smsService.getSMSStats())
  }, [])

  const sendTestConfirmationSMS = async () => {
    setIsLoading(true)
    
    const testData: AppointmentSMSData = {
      patientName: 'Maria Santos',
      patientPhone: '(11) 98765-4321',
      clinicName: 'Clínica OdontoPro',
      dentistName: 'Dr. João Silva',
      serviceName: 'Limpeza Dental',
      appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        day: '2-digit', 
        month: 'long',
        year: 'numeric'
      }),
      appointmentTime: '14:30',
      servicePrice: 120,
      serviceDuration: 60,
      clinicPhone: '(11) 99999-9999'
    }

    const success = await smsService.sendAppointmentConfirmation(testData)
    
    if (success) {
      setSMSQueue(smsService.getSMSQueue())
      setSMSStats(smsService.getSMSStats())
    }
    
    setIsLoading(false)
  }

  const sendTestReminderSMS = async () => {
    setIsLoading(true)
    
    const testData: AppointmentSMSData = {
      patientName: 'João Silva',
      patientPhone: '(11) 91234-5678',
      clinicName: 'Clínica OdontoPro',
      dentistName: 'Dr. Maria Santos',
      serviceName: 'Consulta de Avaliação',
      appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        day: '2-digit', 
        month: 'long',
        year: 'numeric'
      }),
      appointmentTime: '10:00',
      servicePrice: 80,
      serviceDuration: 30,
      clinicPhone: '(11) 99999-9999'
    }

    const success = await smsService.sendAppointmentReminder(testData)
    
    if (success) {
      setSMSQueue(smsService.getSMSQueue())
      setSMSStats(smsService.getSMSStats())
    }
    
    setIsLoading(false)
  }

  const sendCustomSMSMessage = async () => {
    if (!customSMS.phone || !customSMS.message) return

    setIsLoading(true)
    const success = await smsService.sendCustomSMS(customSMS.phone, customSMS.message)
    
    if (success) {
      setSMSQueue(smsService.getSMSQueue())
      setSMSStats(smsService.getSMSStats())
      setCustomSMS({ phone: '', message: '' })
      setShowCustomSMS(false)
    }
    
    setIsLoading(false)
  }

  const clearAllSMS = () => {
    smsService.clearSMSQueue()
    setSMSQueue([])
    setSMSStats({ sent: 0, failed: 0, total: 0 })
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'confirmation': return 'Confirmação'
      case 'reminder': return 'Lembrete'
      case 'notification': return 'Notificação'
      default: return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'confirmation': return 'bg-green-100 text-green-800'
      case 'reminder': return 'bg-blue-100 text-blue-800'
      case 'notification': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Sistema de SMS</h1>
                <p className="text-sm text-gray-600">
                  Notificações por SMS - Plano Profissional ({smsStats.total} enviados)
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowCustomSMS(!showCustomSMS)}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo SMS
              </Button>
              
              <Button
                onClick={clearAllSMS}
                variant="outline"
                className="text-red-600 hover:text-red-700"
                disabled={smsStats.total === 0}
              >
                Limpar Fila
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Professional Plan Badge */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Plano Profissional Ativo</h3>
              <p className="text-emerald-50 text-sm">
                SMS ilimitados • Lembretes automáticos • Templates personalizados
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Custom SMS Form */}
            {showCustomSMS && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Enviar SMS Personalizado</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Número do Telefone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={customSMS.phone}
                      onChange={(e) => setCustomSMS(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Mensagem
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={customSMS.message}
                      onChange={(e) => setCustomSMS(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Digite sua mensagem..."
                      maxLength={160}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {customSMS.message.length}/160 caracteres
                    </p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => setShowCustomSMS(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={sendCustomSMSMessage}
                      disabled={isLoading || !customSMS.phone || !customSMS.message}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Enviar SMS
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Test SMS Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Testar Envio de SMS</h2>
              <p className="text-sm text-gray-600 mb-6">
                Use os botões abaixo para simular o envio de SMS de confirmação e lembrete de agendamento.
              </p>
              
              <div className="space-y-4">
                <Button
                  onClick={sendTestConfirmationSMS}
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 justify-start"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <MessageCircle className="w-4 h-4 mr-2" />
                  )}
                  Enviar SMS de Confirmação
                </Button>
                
                <Button
                  onClick={sendTestReminderSMS}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Clock className="w-4 h-4 mr-2" />
                  )}
                  Enviar SMS de Lembrete
                </Button>
              </div>
            </div>

            {/* SMS Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h2>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-2xl font-bold text-green-900">{smsStats.sent}</p>
                      <p className="text-green-700 text-sm">SMS Enviados</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <XCircle className="w-8 h-8 text-red-600" />
                    <div className="ml-3">
                      <p className="text-2xl font-bold text-red-900">{smsStats.failed}</p>
                      <p className="text-red-700 text-sm">Falhas de Envio</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-2xl font-bold text-blue-900">
                        {smsStats.total > 0 ? ((smsStats.sent / smsStats.total) * 100).toFixed(1) : '0'}%
                      </p>
                      <p className="text-blue-700 text-sm">Taxa de Sucesso</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - SMS History */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Histórico de SMS</h2>
            
            {smsQueue.length === 0 ? (
              <div className="text-center py-12">
                <Smartphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum SMS enviado ainda</p>
                <p className="text-sm text-gray-500 mt-2">
                  Use os botões de teste para simular envios
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {smsQueue.map((sms, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(sms.type)}`}>
                          {getTypeLabel(sms.type)}
                        </span>
                        <span className={`text-xs font-medium ${
                          sms.status === 'sent' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {sms.status === 'sent' ? (
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 inline mr-1" />
                          )}
                          {sms.status === 'sent' ? 'Enviado' : 'Falha'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(sms.timestamp)}
                      </span>
                    </div>
                    
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-900">Para: {sms.to}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-md p-3">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {sms.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-blue-800 mb-2">Sistema de SMS - Plano Profissional</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• SMS de confirmação automáticos após agendamento</p>
                <p>• Lembretes enviados em múltiplos intervalos (24h, 2h antes)</p>
                <p>• Envio de SMS personalizados para pacientes</p>
                <p>• Templates otimizados para dispositivos móveis</p>
                <p>• Até 500 SMS por mês no plano profissional</p>
                <p className="mt-2">
                  <strong>Simulação:</strong> Os SMS não são enviados de fato, apenas simulados para demonstração.
                  Em produção, seria integrado com um provedor como Twilio, Zenvia ou TotalVoice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}