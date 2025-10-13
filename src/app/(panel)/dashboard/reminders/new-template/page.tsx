'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Bell,
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  Mail,
  MessageSquare,
  Smartphone,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info,
  Star
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import getSesion from '@/lib/getSession'
import { 
  reminderService, 
  type ReminderTemplate, 
  type ReminderInterval,
  getReminderChannelIcon
} from '@/lib/reminders'

export default function NewTemplatePage() {
  const router = useRouter()
  const [userPlan, setUserPlan] = useState<string>('BASIC')
  const [formData, setFormData] = useState({
    name: '',
    type: 'appointment' as ReminderTemplate['type'],
    channels: [] as ReminderTemplate['channels'],
    subject: '',
    message: '',
    intervals: [] as ReminderInterval[]
  })
  const [errors, setErrors] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(false)

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

  // Se não for plano professional, redirecionar
  if (userPlan !== 'PROFESSIONAL') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <Bell className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acesso Restrito
          </h2>
          <p className="text-gray-600 mb-6">
            Esta funcionalidade está disponível apenas no plano Professional.
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

  const handleChannelToggle = (channel: ReminderTemplate['channels'][0]) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }))
  }

  const handleAddInterval = () => {
    setFormData(prev => ({
      ...prev,
      intervals: [
        ...prev.intervals,
        { value: 1, unit: 'hours', description: '1 hora antes' }
      ]
    }))
  }

  const handleRemoveInterval = (index: number) => {
    setFormData(prev => ({
      ...prev,
      intervals: prev.intervals.filter((_, i) => i !== index)
    }))
  }

  const handleIntervalChange = (index: number, field: keyof ReminderInterval, value: any) => {
    setFormData(prev => ({
      ...prev,
      intervals: prev.intervals.map((interval, i) => 
        i === index ? { ...interval, [field]: value } : interval
      )
    }))
  }

  const handleSave = () => {
    // Validar formulário
    const validationErrors = reminderService.validateTemplate({
      name: formData.name,
      type: formData.type,
      channels: formData.channels,
      content: {
        subject: formData.subject,
        message: formData.message,
        variables: getAvailableVariables(formData.type)
      },
      timing: {
        intervals: formData.intervals,
        timezone: 'America/Sao_Paulo'
      }
    })

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    // Criar template
    try {
      const template = reminderService.createTemplate({
        name: formData.name,
        type: formData.type,
        channels: formData.channels,
        timing: {
          intervals: formData.intervals,
          timezone: 'America/Sao_Paulo'
        },
        content: {
          subject: formData.subject,
          message: formData.message,
          variables: getAvailableVariables(formData.type)
        },
        isActive: true
      })

      console.log('Template criado:', template)
      router.push('/dashboard/reminders?tab=templates')
    } catch (error) {
      console.error('Erro ao criar template:', error)
      setErrors(['Erro interno. Tente novamente.'])
    }
  }

  const getAvailableVariables = (type: ReminderTemplate['type']): string[] => {
    const commonVariables = ['patientName', 'clinicName', 'clinicPhone', 'clinicAddress', 'clinicEmail']
    
    switch (type) {
      case 'appointment':
        return [...commonVariables, 'appointmentDate', 'appointmentTime', 'professionalName', 'treatmentType']
      case 'follow-up':
        return [...commonVariables, 'treatmentType', 'lastAppointmentDate']
      case 'birthday':
        return [...commonVariables, 'discountValidUntil', 'clinicWebsite']
      case 'custom':
        return commonVariables
      default:
        return commonVariables
    }
  }

  const getPreviewContent = () => {
    const variables = getAvailableVariables(formData.type)
    const mockData: Record<string, string> = {
      patientName: 'Maria Silva',
      clinicName: 'Clínica Sorriso Perfeito',
      clinicPhone: '(11) 99999-9999',
      clinicAddress: 'Rua das Flores, 123 - Centro',
      clinicEmail: 'contato@clinicasorriso.com',
      appointmentDate: '15/01/2025',
      appointmentTime: '14:00',
      professionalName: 'Dr. João Santos',
      treatmentType: 'Limpeza Dental',
      lastAppointmentDate: '15/12/2024',
      discountValidUntil: '31/01/2025',
      clinicWebsite: 'www.clinicasorriso.com'
    }

    return {
      subject: reminderService.replaceVariables(formData.subject, mockData),
      message: reminderService.replaceVariables(formData.message, mockData)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/reminders" className="text-emerald-600 hover:text-emerald-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Novo Template de Lembrete
                </h1>
                <p className="text-sm text-gray-600">
                  Crie um template personalizado para lembretes automáticos
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowPreview(!showPreview)}
                variant="outline"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Ocultar' : 'Preview'}
              </Button>
              <Button
                onClick={handleSave}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Template
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <div className="space-y-6">
            {/* Erros */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                  <h3 className="text-sm font-semibold text-red-800">
                    Corrija os seguintes erros:
                  </h3>
                </div>
                <ul className="list-disc list-inside text-sm text-red-700">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Informações Básicas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Template *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Lembrete de consulta 24h antes"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Lembrete *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="appointment">Consulta</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="birthday">Aniversário</option>
                    <option value="custom">Personalizado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Canais de Comunicação *
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'email', label: 'Email', icon: Mail },
                      { id: 'sms', label: 'SMS', icon: MessageSquare },
                      { id: 'whatsapp', label: 'WhatsApp', icon: Smartphone },
                    ].map(channel => (
                      <label key={channel.id} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.channels.includes(channel.id as any)}
                          onChange={() => handleChannelToggle(channel.id as any)}
                          className="rounded"
                        />
                        <channel.icon className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">{channel.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Intervalos de Tempo */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Intervalos de Tempo</h2>
                <Button
                  onClick={handleAddInterval}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>

              <div className="space-y-3">
                {formData.intervals.map((interval, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <input
                      type="number"
                      value={interval.value}
                      onChange={(e) => handleIntervalChange(index, 'value', parseInt(e.target.value) || 1)}
                      min={1}
                      className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                    
                    <select
                      value={interval.unit}
                      onChange={(e) => handleIntervalChange(index, 'unit', e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="minutes">Minutos</option>
                      <option value="hours">Horas</option>
                      <option value="days">Dias</option>
                      <option value="weeks">Semanas</option>
                    </select>
                    
                    <span className="text-sm text-gray-600">antes</span>
                    
                    <Button
                      onClick={() => handleRemoveInterval(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                {formData.intervals.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Nenhum intervalo configurado. Clique em "Adicionar" para criar um.
                  </p>
                )}
              </div>
            </div>

            {/* Conteúdo */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Conteúdo da Mensagem</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assunto (para email) *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Ex: Lembrete: Consulta amanhã na {clinicName}"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    rows={8}
                    placeholder="Digite a mensagem do lembrete..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variáveis Disponíveis
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {getAvailableVariables(formData.type).map(variable => (
                      <button
                        key={variable}
                        onClick={() => {
                          const textarea = document.querySelector('textarea') as HTMLTextAreaElement
                          if (textarea) {
                            const cursorPos = textarea.selectionStart
                            const textBefore = formData.message.substring(0, cursorPos)
                            const textAfter = formData.message.substring(textarea.selectionEnd)
                            const newText = textBefore + `{${variable}}` + textAfter
                            setFormData(prev => ({ ...prev, message: newText }))
                            
                            // Reposicionar cursor
                            setTimeout(() => {
                              textarea.selectionStart = textarea.selectionEnd = cursorPos + variable.length + 2
                              textarea.focus()
                            }, 0)
                          }
                        }}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                      >
                        {`{${variable}}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Eye className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Preview da Mensagem</h2>
              </div>

              <div className="space-y-6">
                {/* Preview do Assunto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assunto (Email)
                  </label>
                  <div className="bg-gray-50 p-3 rounded-lg border">
                    <p className="text-sm text-gray-900">
                      {getPreviewContent().subject || 'Assunto não definido'}
                    </p>
                  </div>
                </div>

                {/* Preview da Mensagem */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {getPreviewContent().message || 'Mensagem não definida'}
                    </p>
                  </div>
                </div>

                {/* Informações do Template */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Configuração
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tipo:</span>
                      <span className="text-gray-900 capitalize">{formData.type}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Canais:</span>
                      <div className="flex space-x-1">
                        {formData.channels.map(channel => (
                          <span key={channel} className="text-lg">
                            {getReminderChannelIcon(channel)}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-gray-600 text-sm block mb-2">Intervalos:</span>
                      <div className="space-y-1">
                        {formData.intervals.map((interval, index) => (
                          <div key={index} className="text-sm text-gray-900 bg-white p-2 rounded border">
                            {interval.value} {interval.unit} antes
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dica */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Dica:</p>
                      <p>As variáveis em chaves {} serão substituídas automaticamente pelos dados reais do paciente e da consulta quando o lembrete for enviado.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}