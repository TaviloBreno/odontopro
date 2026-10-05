'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Mail, Send, Eye, Clock, CheckCircle, AlertCircle, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { EmailService, AppointmentEmailData, EmailData } from '@/lib/email'

export default function EmailsPage() {
  const [emailQueue, setEmailQueue] = useState<EmailData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [previewEmail, setPreviewEmail] = useState<EmailData | null>(null)

  const emailService = EmailService.getInstance()

  useEffect(() => {
    // Carregar emails da fila
    setEmailQueue(emailService.getEmailQueue())
  }, [])

  const sendTestConfirmationEmail = async () => {
    setIsLoading(true)
    
    const testData: AppointmentEmailData = {
      patientName: 'João Silva',
      patientEmail: 'joao.silva@email.com',
      clinicName: 'Clínica OdontoPro',
      dentistName: 'Dr. Maria Santos',
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
      clinicPhone: '(11) 99999-9999',
      clinicAddress: 'Rua das Flores, 123 - Centro, São Paulo/SP'
    }

    const success = await emailService.sendAppointmentConfirmation(testData)
    
    if (success) {
      setEmailQueue(emailService.getEmailQueue())
    }
    
    setIsLoading(false)
  }

  const sendTestReminderEmail = async () => {
    setIsLoading(true)
    
    const testData: AppointmentEmailData = {
      patientName: 'Maria Santos',
      patientEmail: 'maria.santos@email.com',
      clinicName: 'Clínica OdontoPro',
      dentistName: 'Dr. João Silva',
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
      clinicPhone: '(11) 99999-9999',
      clinicAddress: 'Rua das Flores, 123 - Centro, São Paulo/SP'
    }

    const success = await emailService.sendAppointmentReminder(testData)
    
    if (success) {
      setEmailQueue(emailService.getEmailQueue())
    }
    
    setIsLoading(false)
  }

  const clearAllEmails = () => {
    emailService.clearEmailQueue()
    setEmailQueue([])
    setPreviewEmail(null)
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
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Sistema de E-mails</h1>
                <p className="text-sm text-gray-600">
                  Gerenciar notificações de agendamento ({emailQueue.length} enviados)
                </p>
              </div>
            </div>
            
            <Button
              onClick={clearAllEmails}
              variant="outline"
              className="text-red-600 hover:text-red-700"
              disabled={emailQueue.length === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar Fila
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Test Email Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Testar Envio de E-mails</h2>
              <p className="text-sm text-gray-600 mb-6">
                Use os botões abaixo para simular o envio de emails de confirmação e lembrete de agendamento.
              </p>
              
              <div className="space-y-4">
                <Button
                  onClick={sendTestConfirmationEmail}
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 justify-start"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Mail className="w-4 h-4 mr-2" />
                  )}
                  Enviar E-mail de Confirmação
                </Button>
                
                <Button
                  onClick={sendTestReminderEmail}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Clock className="w-4 h-4 mr-2" />
                  )}
                  Enviar E-mail de Lembrete
                </Button>
              </div>
            </div>

            {/* Email Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-2xl font-bold text-green-900">{emailQueue.length}</p>
                      <p className="text-green-700 text-sm">E-mails Enviados</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Send className="w-8 h-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-2xl font-bold text-blue-900">100%</p>
                      <p className="text-blue-700 text-sm">Taxa de Entrega</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Queue */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Fila de E-mails</h2>
              
              {emailQueue.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhum e-mail enviado ainda</p>
                  <p className="text-sm text-gray-500">Use os botões de teste acima para simular envios</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {emailQueue.map((email, index) => (
                    <div 
                      key={index} 
                      className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setPreviewEmail(email)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {email.subject}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            Para: {email.to}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <Eye className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Email Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Prévia do E-mail</h2>
              {previewEmail && (
                <Button
                  onClick={() => setPreviewEmail(null)}
                  variant="outline"
                  size="sm"
                >
                  Fechar
                </Button>
              )}
            </div>
            
            {previewEmail ? (
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <p className="text-sm text-gray-600">Para: {previewEmail.to}</p>
                  <p className="text-sm font-medium text-gray-900">{previewEmail.subject}</p>
                </div>
                
                <div 
                  className="border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto bg-gray-50"
                  dangerouslySetInnerHTML={{ __html: previewEmail.html }}
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Selecione um e-mail da fila para visualizar</p>
                <p className="text-sm text-gray-500 mt-2">
                  Clique em qualquer e-mail da lista para ver a prévia completa
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-blue-800 mb-2">Sistema de E-mails - Plano Básico</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• E-mails de confirmação automáticos após agendamento</p>
                <p>• Lembretes enviados 24h antes da consulta</p>
                <p>• Templates responsivos e profissionais</p>
                <p>• Limite de 50 e-mails por mês no plano básico</p>
                <p className="mt-2">
                  <strong>Simulação:</strong> Os e-mails não são enviados de fato, apenas simulados para demonstração.
                  Em produção, seria integrado com um serviço como SendGrid ou Nodemailer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}