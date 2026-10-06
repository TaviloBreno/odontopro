// Simulação de serviço de email (em produção seria Nodemailer, SendGrid, etc.)
export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

export interface AppointmentEmailData {
  patientName: string
  patientEmail: string
  clinicName: string
  dentistName: string
  serviceName: string
  appointmentDate: string
  appointmentTime: string
  servicePrice: number
  serviceDuration: number
  clinicPhone?: string
  clinicAddress?: string
}

export class EmailService {
  private static instance: EmailService
  private emailQueue: EmailData[] = []

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      // Simular envio de email
      if (process.env.NODE_ENV !== "production") {
        console.info("Email provider is not configured; confirmation remains in-app.")
      }

      // Simular delay de envio
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Adicionar à fila para demonstração
      this.emailQueue.push({
        ...emailData,
        text: emailData.text || this.htmlToText(emailData.html)
      })

      return true
    } catch (error) {
      console.error('Erro ao enviar email:', error)
      return false
    }
  }

  async sendAppointmentConfirmation(data: AppointmentEmailData): Promise<boolean> {
    const emailData: EmailData = {
      to: data.patientEmail,
      subject: `Confirmação de Agendamento - ${data.clinicName}`,
      html: this.generateConfirmationEmailHTML(data)
    }

    return await this.sendEmail(emailData)
  }

  async sendAppointmentReminder(data: AppointmentEmailData): Promise<boolean> {
    const emailData: EmailData = {
      to: data.patientEmail,
      subject: `Lembrete: Consulta amanhã - ${data.clinicName}`,
      html: this.generateReminderEmailHTML(data)
    }

    return await this.sendEmail(emailData)
  }

  private generateConfirmationEmailHTML(data: AppointmentEmailData): string {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmação de Agendamento</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
          .appointment-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .highlight { color: #059669; font-weight: bold; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Agendamento Confirmado!</h1>
            <p>${data.clinicName}</p>
          </div>
          
          <div class="content">
            <p>Olá <strong>${data.patientName}</strong>,</p>
            
            <p>Seu agendamento foi confirmado com sucesso! Estamos ansiosos para recebê-lo em nossa clínica.</p>
            
            <div class="appointment-box">
              <h3 style="margin-top: 0; color: #059669;">📅 Detalhes do seu agendamento:</h3>
              <p><strong>Serviço:</strong> ${data.serviceName}</p>
              <p><strong>Data:</strong> <span class="highlight">${data.appointmentDate}</span></p>
              <p><strong>Horário:</strong> <span class="highlight">${data.appointmentTime}</span></p>
              <p><strong>Duração:</strong> ${data.serviceDuration} minutos</p>
              <p><strong>Profissional:</strong> ${data.dentistName}</p>
              <p><strong>Valor:</strong> R$ ${data.servicePrice.toFixed(2).replace('.', ',')}</p>
            </div>
            
            <h3>📍 Informações da Clínica:</h3>
            <p><strong>${data.clinicName}</strong></p>
            ${data.clinicAddress ? `<p><strong>Endereço:</strong> ${data.clinicAddress}</p>` : ''}
            ${data.clinicPhone ? `<p><strong>Telefone:</strong> ${data.clinicPhone}</p>` : ''}
            
            <h3>⚠️ Importante:</h3>
            <ul>
              <li>Chegue com 10 minutos de antecedência</li>
              <li>Traga um documento de identidade com foto</li>
              <li>Se precisar cancelar ou reagendar, entre em contato conosco com pelo menos 24h de antecedência</li>
              <li>Você receberá um lembrete 24 horas antes da consulta</li>
            </ul>
          </div>
          
          <div class="footer">
            <p><strong>${data.clinicName}</strong></p>
            ${data.clinicPhone ? `<p>📞 ${data.clinicPhone}</p>` : ''}
            <p style="font-size: 12px; color: #6b7280;">
              Este é um e-mail automático, por favor não responda. 
              Entre em contato conosco através dos canais oficiais.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  private generateReminderEmailHTML(data: AppointmentEmailData): string {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lembrete de Consulta</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
          .reminder-box { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .highlight { color: #d97706; font-weight: bold; }
          .urgent { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 15px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Lembrete: Sua consulta é amanhã!</h1>
            <p>${data.clinicName}</p>
          </div>
          
          <div class="content">
            <p>Olá <strong>${data.patientName}</strong>,</p>
            
            <p>Este é um lembrete de que você tem uma consulta marcada para <strong>amanhã</strong> em nossa clínica.</p>
            
            <div class="reminder-box">
              <h3 style="margin-top: 0; color: #d97706;">📅 Sua consulta:</h3>
              <p><strong>Serviço:</strong> ${data.serviceName}</p>
              <p><strong>Data:</strong> <span class="highlight">${data.appointmentDate}</span></p>
              <p><strong>Horário:</strong> <span class="highlight">${data.appointmentTime}</span></p>
              <p><strong>Profissional:</strong> ${data.dentistName}</p>
            </div>
            
            <div class="urgent">
              <h3 style="margin-top: 0; color: #dc2626;">🚨 Não esqueça:</h3>
              <ul style="margin-bottom: 0;">
                <li><strong>Chegue 10 minutos antes</strong> do horário marcado</li>
                <li>Traga um <strong>documento com foto</strong></li>
                <li>Se não puder comparecer, <strong>avise com antecedência</strong></li>
              </ul>
            </div>
            
            <h3>📍 Local da consulta:</h3>
            <p><strong>${data.clinicName}</strong></p>
            ${data.clinicAddress ? `<p>${data.clinicAddress}</p>` : ''}
            ${data.clinicPhone ? `<p><strong>Telefone:</strong> ${data.clinicPhone}</p>` : ''}
          </div>
          
          <div class="footer">
            <p><strong>Até amanhã!</strong></p>
            <p><strong>${data.clinicName}</strong></p>
            ${data.clinicPhone ? `<p>📞 ${data.clinicPhone}</p>` : ''}
            <p style="font-size: 12px; color: #6b7280;">
              Este é um e-mail automático, por favor não responda.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  // Método para buscar emails enviados (para demonstração)
  getEmailQueue(): EmailData[] {
    return [...this.emailQueue]
  }

  clearEmailQueue(): void {
    this.emailQueue = []
  }
}