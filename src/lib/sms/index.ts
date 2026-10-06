// Simulação de serviço de SMS (em produção seria Twilio, Zenvia, etc.)
export interface SMSData {
  to: string
  message: string
  type: 'confirmation' | 'reminder' | 'notification'
}

export interface AppointmentSMSData {
  patientName: string
  patientPhone: string
  clinicName: string
  dentistName: string
  serviceName: string
  appointmentDate: string
  appointmentTime: string
  servicePrice: number
  serviceDuration: number
  clinicPhone?: string
}

export class SMSService {
  private static instance: SMSService
  private smsQueue: (SMSData & { timestamp: string; status: 'sent' | 'failed' })[] = []

  static getInstance(): SMSService {
    if (!SMSService.instance) {
      SMSService.instance = new SMSService()
    }
    return SMSService.instance
  }

  async sendSMS(smsData: SMSData): Promise<boolean> {
    try {
      // Simular envio de SMS
      if (process.env.NODE_ENV !== "production") {
        console.info("SMS provider is not configured.")
      }

      // Simular delay de envio
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Simular taxa de sucesso de 95%
      const success = Math.random() > 0.05
      
      // Adicionar à fila para demonstração
      this.smsQueue.push({
        ...smsData,
        timestamp: new Date().toISOString(),
        status: success ? 'sent' : 'failed'
      })

      return success
    } catch (error) {
      console.error('Erro ao enviar SMS:', error)
      return false
    }
  }

  async sendAppointmentConfirmation(data: AppointmentSMSData): Promise<boolean> {
    const message = this.generateConfirmationSMS(data)
    
    const smsData: SMSData = {
      to: data.patientPhone,
      message,
      type: 'confirmation'
    }

    return await this.sendSMS(smsData)
  }

  async sendAppointmentReminder(data: AppointmentSMSData): Promise<boolean> {
    const message = this.generateReminderSMS(data)
    
    const smsData: SMSData = {
      to: data.patientPhone,
      message,
      type: 'reminder'
    }

    return await this.sendSMS(smsData)
  }

  private generateConfirmationSMS(data: AppointmentSMSData): string {
    return `🦷 ${data.clinicName}
✅ Agendamento confirmado!

Paciente: ${data.patientName}
Serviço: ${data.serviceName}
📅 ${data.appointmentDate} às ${data.appointmentTime}
👨‍⚕️ ${data.dentistName}
💰 R$ ${data.servicePrice.toFixed(2).replace('.', ',')}

Chegue 10min antes. Dúvidas? ${data.clinicPhone || '(11) 99999-9999'}

Obrigado por escolher nossa clínica! 😊`
  }

  private generateReminderSMS(data: AppointmentSMSData): string {
    return `⏰ ${data.clinicName}
Lembrete: Sua consulta é AMANHÃ!

📅 ${data.appointmentDate} às ${data.appointmentTime}
👨‍⚕️ ${data.dentistName}
🦷 ${data.serviceName}

📍 Não esqueça de chegar 10min antes
📋 Traga documento com foto

Dúvidas: ${data.clinicPhone || '(11) 99999-9999'}
Até amanhã! 🙂`
  }

  async sendCustomSMS(phone: string, message: string): Promise<boolean> {
    const smsData: SMSData = {
      to: phone,
      message,
      type: 'notification'
    }

    return await this.sendSMS(smsData)
  }

  // Métodos para buscar SMS enviados (para demonstração)
  getSMSQueue(): (SMSData & { timestamp: string; status: 'sent' | 'failed' })[] {
    return [...this.smsQueue].reverse() // Mais recentes primeiro
  }

  getSMSStats(): { sent: number; failed: number; total: number } {
    const sent = this.smsQueue.filter(sms => sms.status === 'sent').length
    const failed = this.smsQueue.filter(sms => sms.status === 'failed').length
    return { sent, failed, total: this.smsQueue.length }
  }

  clearSMSQueue(): void {
    this.smsQueue = []
  }

  // Validar número de telefone brasileiro
  static isValidPhoneNumber(phone: string): boolean {
    // Remove todos os caracteres não numéricos
    const digits = phone.replace(/\D/g, '')
    
    // Verifica se tem 10 ou 11 dígitos (com DDD)
    return digits.length === 10 || digits.length === 11
  }

  // Formatar número de telefone
  static formatPhoneNumber(phone: string): string {
    const digits = phone.replace(/\D/g, '')
    
    if (digits.length === 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
    } else if (digits.length === 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    }
    
    return phone
  }
}