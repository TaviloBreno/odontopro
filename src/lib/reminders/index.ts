import { addDays, addHours, format, isBefore, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Tipos do sistema de lembretes
export interface ReminderTemplate {
  id: string
  name: string
  type: 'appointment' | 'follow-up' | 'birthday' | 'custom'
  channels: ('email' | 'sms' | 'whatsapp')[]
  timing: ReminderTiming
  content: {
    subject: string
    message: string
    variables: string[] // Variáveis disponíveis como {patientName}, {appointmentDate}, etc.
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ReminderTiming {
  intervals: ReminderInterval[]
  timezone: string
}

export interface ReminderInterval {
  value: number
  unit: 'minutes' | 'hours' | 'days' | 'weeks'
  description: string
}

export interface ScheduledReminder {
  id: string
  templateId: string
  appointmentId?: string
  patientId: string
  scheduledFor: string
  channel: 'email' | 'sms' | 'whatsapp'
  status: 'pending' | 'sent' | 'failed' | 'cancelled'
  content: {
    subject: string
    message: string
  }
  sentAt?: string
  errorMessage?: string
  attempts: number
  maxAttempts: number
}

export interface ReminderStats {
  total: number
  sent: number
  pending: number
  failed: number
  cancelledByPatient: number
  successRate: number
  channelBreakdown: {
    email: number
    sms: number
    whatsapp: number
  }
  timeframeBreakdown: {
    today: number
    thisWeek: number
    thisMonth: number
  }
}

// Classe principal do sistema de lembretes
export class ReminderService {
  private templates: ReminderTemplate[] = []
  private scheduledReminders: ScheduledReminder[] = []

  constructor() {
    // Carregar templates padrão
    this.loadDefaultTemplates()
    this.loadMockScheduledReminders()
  }

  // Templates padrão do sistema
  private loadDefaultTemplates() {
    this.templates = [
      {
        id: 'appointment-24h',
        name: 'Lembrete de Consulta (24h antes)',
        type: 'appointment',
        channels: ['sms', 'email'],
        timing: {
          intervals: [
            { value: 24, unit: 'hours', description: '24 horas antes' }
          ],
          timezone: 'America/Sao_Paulo'
        },
        content: {
          subject: 'Lembrete: Consulta amanhã na {clinicName}',
          message: `Olá {patientName}! 👋

Este é um lembrete de que você tem uma consulta marcada para amanhã:

📅 Data: {appointmentDate}
🕐 Horário: {appointmentTime}
👨‍⚕️ Profissional: {professionalName}
📍 Local: {clinicAddress}

Se precisar remarcar, entre em contato conosco pelo telefone {clinicPhone}.

Aguardamos você!
{clinicName}`,
          variables: ['patientName', 'appointmentDate', 'appointmentTime', 'professionalName', 'clinicName', 'clinicAddress', 'clinicPhone']
        },
        isActive: true,
        createdAt: '2024-12-20T10:00:00Z',
        updatedAt: '2024-12-20T10:00:00Z'
      },
      {
        id: 'appointment-2h',
        name: 'Lembrete de Consulta (2h antes)',
        type: 'appointment',
        channels: ['sms'],
        timing: {
          intervals: [
            { value: 2, unit: 'hours', description: '2 horas antes' }
          ],
          timezone: 'America/Sao_Paulo'
        },
        content: {
          subject: 'Consulta em 2 horas - {clinicName}',
          message: `🚨 LEMBRETE: Sua consulta é em 2 horas!

👤 Paciente: {patientName}
🕐 Horário: {appointmentTime}
👨‍⚕️ Dr(a): {professionalName}

📍 {clinicAddress}
📞 {clinicPhone}

Nos vemos em breve! 😊`,
          variables: ['patientName', 'appointmentTime', 'professionalName', 'clinicAddress', 'clinicPhone']
        },
        isActive: true,
        createdAt: '2024-12-20T10:00:00Z',
        updatedAt: '2024-12-20T10:00:00Z'
      },
      {
        id: 'follow-up-7d',
        name: 'Follow-up pós consulta (7 dias)',
        type: 'follow-up',
        channels: ['email', 'sms'],
        timing: {
          intervals: [
            { value: 7, unit: 'days', description: '7 dias após a consulta' }
          ],
          timezone: 'America/Sao_Paulo'
        },
        content: {
          subject: 'Como você está se sentindo? - {clinicName}',
          message: `Olá {patientName}! 😊

Esperamos que esteja se sentindo bem após sua consulta de {treatmentType} realizada há uma semana.

Como parte do nosso cuidado contínuo, gostaríamos de saber:
• Como você está se sentindo?
• Tem alguma dúvida sobre o tratamento?
• Precisa agendar uma consulta de retorno?

Estamos sempre disponíveis para ajudar!

📞 {clinicPhone}
📧 {clinicEmail}

Cuidamos de você! ❤️
{clinicName}`,
          variables: ['patientName', 'treatmentType', 'clinicPhone', 'clinicEmail', 'clinicName']
        },
        isActive: true,
        createdAt: '2024-12-20T10:00:00Z',
        updatedAt: '2024-12-20T10:00:00Z'
      },
      {
        id: 'birthday-reminder',
        name: 'Parabéns de Aniversário',
        type: 'birthday',
        channels: ['email', 'sms'],
        timing: {
          intervals: [
            { value: 0, unit: 'days', description: 'No dia do aniversário' }
          ],
          timezone: 'America/Sao_Paulo'
        },
        content: {
          subject: '🎉 Parabéns, {patientName}! - {clinicName}',
          message: `🎉 PARABÉNS, {patientName}! 🎂

A equipe da {clinicName} deseja um aniversário repleto de alegria, saúde e sorrisos radiantes! ✨

Como presente especial, você tem 20% de desconto em qualquer tratamento até {discountValidUntil}.

Agende sua consulta e continue cuidando do seu sorriso conosco! 😊

📞 {clinicPhone}
📍 {clinicAddress}

Com carinho,
Equipe {clinicName} ❤️`,
          variables: ['patientName', 'clinicName', 'discountValidUntil', 'clinicPhone', 'clinicAddress']
        },
        isActive: true,
        createdAt: '2024-12-20T10:00:00Z',
        updatedAt: '2024-12-20T10:00:00Z'
      },
      {
        id: 'preventive-care',
        name: 'Cuidado Preventivo (6 meses)',
        type: 'follow-up',
        channels: ['email', 'sms'],
        timing: {
          intervals: [
            { value: 6, unit: 'days', description: '6 meses após última consulta' }
          ],
          timezone: 'America/Sao_Paulo'
        },
        content: {
          subject: 'Hora do check-up! - {clinicName}',
          message: `Olá {patientName}! 😊

Faz 6 meses desde sua última consulta. É hora do seu check-up preventivo! 🦷✨

A prevenção é a melhor forma de manter seu sorriso saudável e evitar problemas maiores.

Agende sua consulta de:
• Limpeza dental
• Exame preventivo  
• Orientações de cuidado

📞 {clinicPhone} (WhatsApp disponível)
🌐 {clinicWebsite}

Cuidar do seu sorriso é nosso compromisso! 💙
{clinicName}`,
          variables: ['patientName', 'clinicPhone', 'clinicWebsite', 'clinicName']
        },
        isActive: true,
        createdAt: '2024-12-20T10:00:00Z',
        updatedAt: '2024-12-20T10:00:00Z'
      }
    ]
  }

  // Carregar lembretes agendados fictícios
  private loadMockScheduledReminders() {
    this.scheduledReminders = [
      {
        id: 'rem-1',
        templateId: 'appointment-24h',
        appointmentId: 'apt-001',
        patientId: 'pat-001',
        scheduledFor: '2024-12-21T09:00:00Z',
        channel: 'sms',
        status: 'pending',
        content: {
          subject: 'Lembrete: Consulta amanhã na Clínica Sorriso',
          message: 'Olá Maria! Você tem consulta amanhã às 10:00 com Dr. João Silva.'
        },
        attempts: 0,
        maxAttempts: 3
      },
      {
        id: 'rem-2',
        templateId: 'appointment-2h',
        appointmentId: 'apt-002',
        patientId: 'pat-002',
        scheduledFor: '2024-12-20T14:00:00Z',
        channel: 'sms',
        status: 'sent',
        content: {
          subject: 'Consulta em 2 horas',
          message: 'Lembrete: Sua consulta é em 2 horas com Dra. Maria Santos.'
        },
        sentAt: '2024-12-20T14:00:15Z',
        attempts: 1,
        maxAttempts: 3
      },
      {
        id: 'rem-3',
        templateId: 'follow-up-7d',
        appointmentId: 'apt-003',
        patientId: 'pat-003',
        scheduledFor: '2024-12-20T16:00:00Z',
        channel: 'email',
        status: 'failed',
        content: {
          subject: 'Como você está se sentindo?',
          message: 'Follow-up após tratamento de canal...'
        },
        errorMessage: 'Email inválido',
        attempts: 2,
        maxAttempts: 3
      }
    ]
  }

  // Métodos públicos
  getAllTemplates(): ReminderTemplate[] {
    return this.templates
  }

  getActiveTemplates(): ReminderTemplate[] {
    return this.templates.filter(t => t.isActive)
  }

  getTemplateById(id: string): ReminderTemplate | undefined {
    return this.templates.find(t => t.id === id)
  }

  createTemplate(template: Omit<ReminderTemplate, 'id' | 'createdAt' | 'updatedAt'>): ReminderTemplate {
    const newTemplate: ReminderTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.templates.push(newTemplate)
    return newTemplate
  }

  updateTemplate(id: string, updates: Partial<ReminderTemplate>): ReminderTemplate | null {
    const index = this.templates.findIndex(t => t.id === id)
    if (index === -1) return null

    this.templates[index] = {
      ...this.templates[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    return this.templates[index]
  }

  deleteTemplate(id: string): boolean {
    const index = this.templates.findIndex(t => t.id === id)
    if (index === -1) return false

    this.templates.splice(index, 1)
    return true
  }

  // Agendar lembrete
  scheduleReminder(
    templateId: string,
    appointmentId: string,
    patientId: string,
    appointmentDate: Date,
    channel: 'email' | 'sms' | 'whatsapp'
  ): ScheduledReminder | null {
    const template = this.getTemplateById(templateId)
    if (!template || !template.isActive) return null

    const scheduledReminders: ScheduledReminder[] = []

    template.timing.intervals.forEach(interval => {
      let scheduledFor = new Date(appointmentDate)
      
      switch (interval.unit) {
        case 'minutes':
          scheduledFor = addHours(scheduledFor, -interval.value / 60)
          break
        case 'hours':
          scheduledFor = addHours(scheduledFor, -interval.value)
          break
        case 'days':
          scheduledFor = addDays(scheduledFor, -interval.value)
          break
        case 'weeks':
          scheduledFor = addDays(scheduledFor, -interval.value * 7)
          break
      }

      const reminder: ScheduledReminder = {
        id: `rem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        templateId,
        appointmentId,
        patientId,
        scheduledFor: scheduledFor.toISOString(),
        channel,
        status: 'pending',
        content: {
          subject: template.content.subject,
          message: template.content.message
        },
        attempts: 0,
        maxAttempts: 3
      }

      this.scheduledReminders.push(reminder)
      scheduledReminders.push(reminder)
    })

    return scheduledReminders[0] // Retorna o primeiro para compatibilidade
  }

  // Obter lembretes agendados
  getScheduledReminders(filters?: {
    status?: ScheduledReminder['status']
    channel?: ScheduledReminder['channel']
    patientId?: string
    appointmentId?: string
    dateFrom?: Date
    dateTo?: Date
  }): ScheduledReminder[] {
    let reminders = [...this.scheduledReminders]

    if (filters) {
      if (filters.status) {
        reminders = reminders.filter(r => r.status === filters.status)
      }
      if (filters.channel) {
        reminders = reminders.filter(r => r.channel === filters.channel)
      }
      if (filters.patientId) {
        reminders = reminders.filter(r => r.patientId === filters.patientId)
      }
      if (filters.appointmentId) {
        reminders = reminders.filter(r => r.appointmentId === filters.appointmentId)
      }
      if (filters.dateFrom) {
        reminders = reminders.filter(r => new Date(r.scheduledFor) >= filters.dateFrom!)
      }
      if (filters.dateTo) {
        reminders = reminders.filter(r => new Date(r.scheduledFor) <= filters.dateTo!)
      }
    }

    return reminders.sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())
  }

  // Processar lembretes pendentes
  async processPendingReminders(): Promise<{ processed: number, sent: number, failed: number }> {
    const now = new Date()
    const pendingReminders = this.scheduledReminders.filter(r => 
      r.status === 'pending' && 
      isBefore(parseISO(r.scheduledFor), now)
    )

    let sent = 0
    let failed = 0

    for (const reminder of pendingReminders) {
      try {
        await this.sendReminder(reminder)
        reminder.status = 'sent'
        reminder.sentAt = now.toISOString()
        reminder.attempts += 1
        sent++
      } catch (error) {
        reminder.status = 'failed'
        reminder.errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
        reminder.attempts += 1
        
        if (reminder.attempts < reminder.maxAttempts) {
          // Reagendar para tentar novamente em 1 hora
          reminder.scheduledFor = addHours(now, 1).toISOString()
          reminder.status = 'pending'
        }
        
        failed++
      }
    }

    return { processed: pendingReminders.length, sent, failed }
  }

  // Simular envio de lembrete
  private async sendReminder(reminder: ScheduledReminder): Promise<void> {
    // Simulação de envio com chance de falha
    await new Promise(resolve => setTimeout(resolve, 100))
    
    if (Math.random() < 0.1) { // 10% chance de falha
      throw new Error(`Falha no envio via ${reminder.channel}`)
    }
    
    console.log(`✅ Lembrete enviado via ${reminder.channel} para paciente ${reminder.patientId}`)
  }

  // Cancelar lembrete
  cancelReminder(reminderId: string): boolean {
    const reminder = this.scheduledReminders.find(r => r.id === reminderId)
    if (!reminder || reminder.status !== 'pending') return false

    reminder.status = 'cancelled'
    return true
  }

  // Estatísticas
  getReminderStats(dateFrom?: Date, dateTo?: Date): ReminderStats {
    let reminders = this.scheduledReminders

    if (dateFrom || dateTo) {
      reminders = reminders.filter(r => {
        const reminderDate = parseISO(r.scheduledFor)
        if (dateFrom && reminderDate < dateFrom) return false
        if (dateTo && reminderDate > dateTo) return false
        return true
      })
    }

    const total = reminders.length
    const sent = reminders.filter(r => r.status === 'sent').length
    const pending = reminders.filter(r => r.status === 'pending').length
    const failed = reminders.filter(r => r.status === 'failed').length
    const cancelled = reminders.filter(r => r.status === 'cancelled').length

    const channelBreakdown = {
      email: reminders.filter(r => r.channel === 'email').length,
      sms: reminders.filter(r => r.channel === 'sms').length,
      whatsapp: reminders.filter(r => r.channel === 'whatsapp').length
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thisWeek = addDays(today, -7)
    const thisMonth = addDays(today, -30)

    const timeframeBreakdown = {
      today: reminders.filter(r => parseISO(r.scheduledFor) >= today).length,
      thisWeek: reminders.filter(r => parseISO(r.scheduledFor) >= thisWeek).length,
      thisMonth: reminders.filter(r => parseISO(r.scheduledFor) >= thisMonth).length
    }

    return {
      total,
      sent,
      pending,
      failed,
      cancelledByPatient: cancelled,
      successRate: total > 0 ? (sent / total) * 100 : 0,
      channelBreakdown,
      timeframeBreakdown
    }
  }

  // Substituir variáveis no conteúdo
  replaceVariables(content: string, variables: Record<string, string>): string {
    let result = content
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{${key}}`, 'g')
      result = result.replace(regex, value)
    })

    return result
  }

  // Validar template
  validateTemplate(template: Partial<ReminderTemplate>): string[] {
    const errors: string[] = []

    if (!template.name?.trim()) {
      errors.push('Nome do template é obrigatório')
    }

    if (!template.type) {
      errors.push('Tipo do template é obrigatório')
    }

    if (!template.channels?.length) {
      errors.push('Pelo menos um canal deve ser selecionado')
    }

    if (!template.timing?.intervals?.length) {
      errors.push('Pelo menos um intervalo deve ser configurado')
    }

    if (!template.content?.message?.trim()) {
      errors.push('Mensagem é obrigatória')
    }

    return errors
  }
}

// Instância única do serviço
export const reminderService = new ReminderService()

// Funções de utilidade
export const formatReminderTime = (scheduledFor: string): string => {
  const date = parseISO(scheduledFor)
  return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
}

export const getReminderStatusColor = (status: ScheduledReminder['status']): string => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'sent': return 'bg-green-100 text-green-800 border-green-200'
    case 'failed': return 'bg-red-100 text-red-800 border-red-200'
    case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export const getReminderChannelIcon = (channel: ScheduledReminder['channel']): string => {
  switch (channel) {
    case 'email': return '📧'
    case 'sms': return '💬'
    case 'whatsapp': return '📱'
    default: return '📞'
  }
}