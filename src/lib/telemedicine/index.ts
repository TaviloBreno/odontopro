interface TelemedicineAppointment {
  id: string
  patientId: string
  patientName: string
  patientEmail: string
  patientPhone: string
  doctorId: string
  doctorName: string
  scheduleDate: Date
  duration: number // minutos
  type: 'consultation' | 'follow_up' | 'emergency' | 'second_opinion'
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  roomId: string
  recordingId?: string
  notes?: string
  attachments: TelemedicineFile[]
  prescription?: string
  createdAt: Date
  updatedAt: Date
}

interface TelemedicineRoom {
  id: string
  appointmentId: string
  isActive: boolean
  participants: Participant[]
  chatMessages: ChatMessage[]
  sharedFiles: TelemedicineFile[]
  settings: RoomSettings
  startTime?: Date
  endTime?: Date
  recordingUrl?: string
}

interface Participant {
  id: string
  name: string
  email: string
  role: 'doctor' | 'patient' | 'assistant'
  isOnline: boolean
  joinTime?: Date
  leaveTime?: Date
  videoEnabled: boolean
  audioEnabled: boolean
  screenSharing: boolean
}

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderRole: 'doctor' | 'patient' | 'assistant'
  message: string
  type: 'text' | 'file' | 'system'
  timestamp: Date
  isRead: boolean
}

interface TelemedicineFile {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedBy: string
  uploadedAt: Date
  description?: string
}

interface RoomSettings {
  recordingEnabled: boolean
  chatEnabled: boolean
  screenSharingEnabled: boolean
  waitingRoom: boolean
  maxParticipants: number
  autoJoin: boolean
}

interface TelemedicineStats {
  totalAppointments: number
  completedAppointments: number
  cancelledAppointments: number
  noShowRate: number
  averageDuration: number
  patientSatisfaction: number
  doctorUtilization: number
  popularTimeSlots: string[]
  monthlyGrowth: number
}

interface TelehealthSchedule {
  doctorId: string
  date: string
  timeSlots: TimeSlot[]
}

interface TimeSlot {
  startTime: string
  endTime: string
  isAvailable: boolean
  appointmentId?: string
}

class TelemedicineService {
  private static instance: TelemedicineService
  private appointments: TelemedicineAppointment[] = []
  private rooms: TelemedicineRoom[] = []
  private schedules: TelehealthSchedule[] = []

  private constructor() {
    this.initializeData()
  }

  public static getInstance(): TelemedicineService {
    if (!TelemedicineService.instance) {
      TelemedicineService.instance = new TelemedicineService()
    }
    return TelemedicineService.instance
  }

  private initializeData() {
    // Dados de exemplo
    this.appointments = [
      {
        id: 'apt-1',
        patientId: 'patient-1',
        patientName: 'Maria Silva',
        patientEmail: 'maria@email.com',
        patientPhone: '(11) 99999-9999',
        doctorId: 'doctor-1',
        doctorName: 'Dr. João Santos',
        scheduleDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 horas a partir de agora
        duration: 30,
        type: 'consultation',
        status: 'scheduled',
        roomId: 'room-1',
        attachments: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'apt-2',
        patientId: 'patient-2',
        patientName: 'João Oliveira',
        patientEmail: 'joao@email.com',
        patientPhone: '(11) 88888-8888',
        doctorId: 'doctor-1',
        doctorName: 'Dr. João Santos',
        scheduleDate: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hora atrás
        duration: 45,
        type: 'follow_up',
        status: 'completed',
        roomId: 'room-2',
        attachments: [],
        notes: 'Paciente apresentou melhora significativa. Agendar retorno em 2 semanas.',
        prescription: 'Ibuprofeno 600mg - 1 comprimido de 8/8h por 3 dias',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        id: 'apt-3',
        patientId: 'patient-3',
        patientName: 'Ana Costa',
        patientEmail: 'ana@email.com',
        patientPhone: '(11) 77777-7777',
        doctorId: 'doctor-2',
        doctorName: 'Dra. Maria Fernandes',
        scheduleDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // amanhã
        duration: 60,
        type: 'second_opinion',
        status: 'scheduled',
        roomId: 'room-3',
        attachments: [
          {
            id: 'file-1',
            name: 'raio_x_dental.jpg',
            type: 'image/jpeg',
            size: 2048000,
            url: '/uploads/raio_x_dental.jpg',
            uploadedBy: 'patient-3',
            uploadedAt: new Date(),
            description: 'Raio-X para segunda opinião'
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    this.rooms = [
      {
        id: 'room-1',
        appointmentId: 'apt-1',
        isActive: false,
        participants: [
          {
            id: 'doctor-1',
            name: 'Dr. João Santos',
            email: 'joao@clinica.com',
            role: 'doctor',
            isOnline: true,
            videoEnabled: true,
            audioEnabled: true,
            screenSharing: false
          },
          {
            id: 'patient-1',
            name: 'Maria Silva',
            email: 'maria@email.com',
            role: 'patient',
            isOnline: false,
            videoEnabled: true,
            audioEnabled: true,
            screenSharing: false
          }
        ],
        chatMessages: [],
        sharedFiles: [],
        settings: {
          recordingEnabled: true,
          chatEnabled: true,
          screenSharingEnabled: true,
          waitingRoom: true,
          maxParticipants: 3,
          autoJoin: false
        }
      },
      {
        id: 'room-2',
        appointmentId: 'apt-2',
        isActive: false,
        participants: [
          {
            id: 'doctor-1',
            name: 'Dr. João Santos',
            email: 'joao@clinica.com',
            role: 'doctor',
            isOnline: false,
            videoEnabled: true,
            audioEnabled: true,
            screenSharing: false,
            joinTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
            leaveTime: new Date(Date.now() - 1 * 60 * 60 * 1000)
          },
          {
            id: 'patient-2',
            name: 'João Oliveira',
            email: 'joao@email.com',
            role: 'patient',
            isOnline: false,
            videoEnabled: true,
            audioEnabled: true,
            screenSharing: false,
            joinTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
            leaveTime: new Date(Date.now() - 1 * 60 * 60 * 1000)
          }
        ],
        chatMessages: [
          {
            id: 'msg-1',
            senderId: 'doctor-1',
            senderName: 'Dr. João Santos',
            senderRole: 'doctor',
            message: 'Bom dia, João! Como está se sentindo hoje?',
            type: 'text',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            isRead: true
          },
          {
            id: 'msg-2',
            senderId: 'patient-2',
            senderName: 'João Oliveira',
            senderRole: 'patient',
            message: 'Bom dia, doutor! Muito melhor, a dor praticamente passou.',
            type: 'text',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30000),
            isRead: true
          }
        ],
        sharedFiles: [],
        settings: {
          recordingEnabled: true,
          chatEnabled: true,
          screenSharingEnabled: true,
          waitingRoom: true,
          maxParticipants: 3,
          autoJoin: false
        },
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
        recordingUrl: '/recordings/apt-2-recording.mp4'
      }
    ]

    this.schedules = [
      {
        doctorId: 'doctor-1',
        date: new Date().toISOString().split('T')[0],
        timeSlots: [
          { startTime: '08:00', endTime: '08:30', isAvailable: true },
          { startTime: '08:30', endTime: '09:00', isAvailable: true },
          { startTime: '09:00', endTime: '09:30', isAvailable: false, appointmentId: 'apt-1' },
          { startTime: '09:30', endTime: '10:00', isAvailable: true },
          { startTime: '10:00', endTime: '10:30', isAvailable: true },
          { startTime: '10:30', endTime: '11:00', isAvailable: true },
          { startTime: '14:00', endTime: '14:30', isAvailable: true },
          { startTime: '14:30', endTime: '15:00', isAvailable: true },
          { startTime: '15:00', endTime: '15:30', isAvailable: true },
          { startTime: '15:30', endTime: '16:00', isAvailable: true }
        ]
      }
    ]
  }

  // Gerenciamento de Consultas
  public getAppointments(filters?: {
    doctorId?: string
    patientId?: string
    status?: string
    type?: string
    dateFrom?: Date
    dateTo?: Date
  }): TelemedicineAppointment[] {
    let filteredAppointments = [...this.appointments]

    if (filters) {
      if (filters.doctorId) {
        filteredAppointments = filteredAppointments.filter(apt => apt.doctorId === filters.doctorId)
      }
      if (filters.patientId) {
        filteredAppointments = filteredAppointments.filter(apt => apt.patientId === filters.patientId)
      }
      if (filters.status) {
        filteredAppointments = filteredAppointments.filter(apt => apt.status === filters.status)
      }
      if (filters.type) {
        filteredAppointments = filteredAppointments.filter(apt => apt.type === filters.type)
      }
      if (filters.dateFrom) {
        filteredAppointments = filteredAppointments.filter(apt => apt.scheduleDate >= filters.dateFrom!)
      }
      if (filters.dateTo) {
        filteredAppointments = filteredAppointments.filter(apt => apt.scheduleDate <= filters.dateTo!)
      }
    }

    return filteredAppointments.sort((a, b) => a.scheduleDate.getTime() - b.scheduleDate.getTime())
  }

  public getAppointment(id: string): TelemedicineAppointment | undefined {
    return this.appointments.find(apt => apt.id === id)
  }

  public scheduleAppointment(appointmentData: Omit<TelemedicineAppointment, 'id' | 'createdAt' | 'updatedAt'>): TelemedicineAppointment {
    const newAppointment: TelemedicineAppointment = {
      id: `apt-${Date.now()}`,
      ...appointmentData,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.appointments.push(newAppointment)

    // Criar sala para a consulta
    this.createRoom(newAppointment)

    return newAppointment
  }

  public updateAppointmentStatus(
    id: string, 
    status: TelemedicineAppointment['status'], 
    notes?: string,
    prescription?: string
  ): boolean {
    const appointment = this.appointments.find(apt => apt.id === id)
    if (!appointment) return false

    appointment.status = status
    appointment.updatedAt = new Date()
    
    if (notes) appointment.notes = notes
    if (prescription) appointment.prescription = prescription

    return true
  }

  public cancelAppointment(id: string, reason: string): boolean {
    const appointment = this.appointments.find(apt => apt.id === id)
    if (!appointment) return false

    appointment.status = 'cancelled'
    appointment.notes = `Cancelado: ${reason}`
    appointment.updatedAt = new Date()

    return true
  }

  // Gerenciamento de Salas Virtuais
  private createRoom(appointment: TelemedicineAppointment): TelemedicineRoom {
    const room: TelemedicineRoom = {
      id: appointment.roomId,
      appointmentId: appointment.id,
      isActive: false,
      participants: [
        {
          id: appointment.doctorId,
          name: appointment.doctorName,
          email: `${appointment.doctorId}@clinica.com`,
          role: 'doctor',
          isOnline: false,
          videoEnabled: true,
          audioEnabled: true,
          screenSharing: false
        },
        {
          id: appointment.patientId,
          name: appointment.patientName,
          email: appointment.patientEmail,
          role: 'patient',
          isOnline: false,
          videoEnabled: true,
          audioEnabled: true,
          screenSharing: false
        }
      ],
      chatMessages: [],
      sharedFiles: [...appointment.attachments],
      settings: {
        recordingEnabled: true,
        chatEnabled: true,
        screenSharingEnabled: true,
        waitingRoom: true,
        maxParticipants: 3,
        autoJoin: false
      }
    }

    this.rooms.push(room)
    return room
  }

  public getRoom(roomId: string): TelemedicineRoom | undefined {
    return this.rooms.find(room => room.id === roomId)
  }

  public joinRoom(roomId: string, userId: string): boolean {
    const room = this.rooms.find(room => room.id === roomId)
    if (!room) return false

    const participant = room.participants.find(p => p.id === userId)
    if (!participant) return false

    participant.isOnline = true
    participant.joinTime = new Date()

    if (!room.isActive) {
      room.isActive = true
      room.startTime = new Date()
    }

    return true
  }

  public leaveRoom(roomId: string, userId: string): boolean {
    const room = this.rooms.find(room => room.id === roomId)
    if (!room) return false

    const participant = room.participants.find(p => p.id === userId)
    if (!participant) return false

    participant.isOnline = false
    participant.leaveTime = new Date()

    // Se todos saíram, desativar sala
    const activeParticipants = room.participants.filter(p => p.isOnline)
    if (activeParticipants.length === 0) {
      room.isActive = false
      room.endTime = new Date()
      
      // Finalizar consulta se ainda estava em progresso
      const appointment = this.appointments.find(apt => apt.roomId === roomId)
      if (appointment && appointment.status === 'in_progress') {
        appointment.status = 'completed'
        appointment.updatedAt = new Date()
      }
    }

    return true
  }

  public updateParticipantMedia(
    roomId: string, 
    userId: string, 
    settings: { videoEnabled?: boolean; audioEnabled?: boolean; screenSharing?: boolean }
  ): boolean {
    const room = this.rooms.find(room => room.id === roomId)
    if (!room) return false

    const participant = room.participants.find(p => p.id === userId)
    if (!participant) return false

    if (settings.videoEnabled !== undefined) participant.videoEnabled = settings.videoEnabled
    if (settings.audioEnabled !== undefined) participant.audioEnabled = settings.audioEnabled
    if (settings.screenSharing !== undefined) participant.screenSharing = settings.screenSharing

    return true
  }

  // Sistema de Chat
  public sendMessage(roomId: string, senderId: string, message: string): ChatMessage | null {
    const room = this.rooms.find(room => room.id === roomId)
    if (!room) return null

    const sender = room.participants.find(p => p.id === senderId)
    if (!sender) return null

    const chatMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId,
      senderName: sender.name,
      senderRole: sender.role,
      message,
      type: 'text',
      timestamp: new Date(),
      isRead: false
    }

    room.chatMessages.push(chatMessage)
    return chatMessage
  }

  public getMessages(roomId: string): ChatMessage[] {
    const room = this.rooms.find(room => room.id === roomId)
    return room?.chatMessages || []
  }

  public markMessagesAsRead(roomId: string, userId: string): boolean {
    const room = this.rooms.find(room => room.id === roomId)
    if (!room) return false

    room.chatMessages.forEach(msg => {
      if (msg.senderId !== userId) {
        msg.isRead = true
      }
    })

    return true
  }

  // Compartilhamento de Arquivos
  public shareFile(roomId: string, file: Omit<TelemedicineFile, 'id' | 'uploadedAt'>): TelemedicineFile | null {
    const room = this.rooms.find(room => room.id === roomId)
    if (!room) return null

    const sharedFile: TelemedicineFile = {
      id: `file-${Date.now()}`,
      ...file,
      uploadedAt: new Date()
    }

    room.sharedFiles.push(sharedFile)
    return sharedFile
  }

  public getSharedFiles(roomId: string): TelemedicineFile[] {
    const room = this.rooms.find(room => room.id === roomId)
    return room?.sharedFiles || []
  }

  public removeFile(roomId: string, fileId: string): boolean {
    const room = this.rooms.find(room => room.id === roomId)
    if (!room) return false

    const fileIndex = room.sharedFiles.findIndex(file => file.id === fileId)
    if (fileIndex === -1) return false

    room.sharedFiles.splice(fileIndex, 1)
    return true
  }

  // Gravação de Sessões
  public startRecording(roomId: string): boolean {
    const room = this.rooms.find(room => room.id === roomId)
    if (!room || !room.settings.recordingEnabled) return false

    // Simular início de gravação
    console.log(`Gravação iniciada para sala ${roomId}`)
    return true
  }

  public stopRecording(roomId: string): string | null {
    const room = this.rooms.find(room => room.id === roomId)
    if (!room) return null

    const recordingUrl = `/recordings/${roomId}-${Date.now()}.mp4`
    room.recordingUrl = recordingUrl

    console.log(`Gravação finalizada: ${recordingUrl}`)
    return recordingUrl
  }

  // Agendamento
  public getAvailableSlots(doctorId: string, date: string): TimeSlot[] {
    const schedule = this.schedules.find(s => s.doctorId === doctorId && s.date === date)
    return schedule?.timeSlots.filter(slot => slot.isAvailable) || []
  }

  public bookTimeSlot(doctorId: string, date: string, startTime: string, appointmentId: string): boolean {
    const schedule = this.schedules.find(s => s.doctorId === doctorId && s.date === date)
    if (!schedule) return false

    const slot = schedule.timeSlots.find(s => s.startTime === startTime)
    if (!slot || !slot.isAvailable) return false

    slot.isAvailable = false
    slot.appointmentId = appointmentId
    return true
  }

  public releaseTimeSlot(doctorId: string, date: string, startTime: string): boolean {
    const schedule = this.schedules.find(s => s.doctorId === doctorId && s.date === date)
    if (!schedule) return false

    const slot = schedule.timeSlots.find(s => s.startTime === startTime)
    if (!slot) return false

    slot.isAvailable = true
    delete slot.appointmentId
    return true
  }

  // Estatísticas e Relatórios
  public getTelemedicineStats(): TelemedicineStats {
    const totalAppointments = this.appointments.length
    const completedAppointments = this.appointments.filter(apt => apt.status === 'completed').length
    const cancelledAppointments = this.appointments.filter(apt => apt.status === 'cancelled').length
    const noShowAppointments = this.appointments.filter(apt => apt.status === 'no_show').length

    const completedRooms = this.rooms.filter(room => room.startTime && room.endTime)
    const totalDuration = completedRooms.reduce((sum, room) => {
      if (room.startTime && room.endTime) {
        return sum + (room.endTime.getTime() - room.startTime.getTime())
      }
      return sum
    }, 0)

    return {
      totalAppointments,
      completedAppointments,
      cancelledAppointments,
      noShowRate: totalAppointments > 0 ? (noShowAppointments / totalAppointments) * 100 : 0,
      averageDuration: completedRooms.length > 0 ? totalDuration / completedRooms.length / 1000 / 60 : 0, // minutos
      patientSatisfaction: 4.7, // Simulado
      doctorUtilization: 85, // Simulado
      popularTimeSlots: ['09:00', '14:00', '15:30'], // Simulado
      monthlyGrowth: 23 // Simulado
    }
  }

  public getAppointmentsByPeriod(startDate: Date, endDate: Date): TelemedicineAppointment[] {
    return this.appointments.filter(apt => 
      apt.scheduleDate >= startDate && apt.scheduleDate <= endDate
    )
  }

  public getDoctorStats(doctorId: string): any {
    const doctorAppointments = this.appointments.filter(apt => apt.doctorId === doctorId)
    const completed = doctorAppointments.filter(apt => apt.status === 'completed')
    
    return {
      totalAppointments: doctorAppointments.length,
      completedAppointments: completed.length,
      completionRate: doctorAppointments.length > 0 ? (completed.length / doctorAppointments.length) * 100 : 0,
      averageRating: 4.8, // Simulado
      totalPatients: new Set(doctorAppointments.map(apt => apt.patientId)).size
    }
  }

  // Utilitários
  public getAppointmentTypeLabel(type: TelemedicineAppointment['type']): string {
    const labels = {
      consultation: 'Consulta',
      follow_up: 'Retorno',
      emergency: 'Emergência',
      second_opinion: 'Segunda Opinião'
    }
    return labels[type] || type
  }

  public getStatusLabel(status: TelemedicineAppointment['status']): string {
    const labels = {
      scheduled: 'Agendado',
      in_progress: 'Em Andamento',
      completed: 'Concluído',
      cancelled: 'Cancelado',
      no_show: 'Não Compareceu'
    }
    return labels[status] || status
  }

  public getStatusColor(status: TelemedicineAppointment['status']): string {
    const colors = {
      scheduled: 'text-blue-600 bg-blue-100',
      in_progress: 'text-green-600 bg-green-100',
      completed: 'text-gray-600 bg-gray-100',
      cancelled: 'text-red-600 bg-red-100',
      no_show: 'text-orange-600 bg-orange-100'
    }
    return colors[status] || 'text-gray-600 bg-gray-100'
  }

  // Notificações
  public sendNotification(type: 'appointment_reminder' | 'appointment_start' | 'message_received', data: any): void {
    console.log(`Enviando notificação ${type}:`, data)
    // Implementar integração com sistema de notificações
  }
}

export const telemedicineService = TelemedicineService.getInstance()

export type {
  TelemedicineAppointment,
  TelemedicineRoom,
  Participant,
  ChatMessage,
  TelemedicineFile,
  RoomSettings,
  TelemedicineStats,
  TelehealthSchedule,
  TimeSlot
}