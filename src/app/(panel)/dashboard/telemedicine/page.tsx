'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  MessageCircle,
  Share,
  FileText,
  Camera,
  Clock,
  Users,
  Calendar,
  Star,
  Settings,
  Monitor,
  MonitorOff,
  Upload,
  Download,
  PlayCircle,
  PauseCircle,
  Send,
  Paperclip,
  X,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import { getSession } from 'next-auth/react'
import { 
  telemedicineService,
  type TelemedicineAppointment,
  type TelemedicineRoom,
  type ChatMessage,
  type TelemedicineFile
} from '@/lib/telemedicine'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function TelemedicinePage() {
  const [userPlan, setUserPlan] = useState<string>('BASIC')
  const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments' | 'room' | 'schedule' | 'history'>('dashboard')
  
  const [appointments, setAppointments] = useState<TelemedicineAppointment[]>([])
  const [currentRoom, setCurrentRoom] = useState<TelemedicineRoom | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)
  
  // Estados da sala de vídeo
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showChat, setShowChat] = useState(false)
  
  // Estados do chat
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sharedFiles, setSharedFiles] = useState<TelemedicineFile[]>([])
  
  // Estados de agendamento
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [availableSlots, setAvailableSlots] = useState<any[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Verificar plano do usuário
    const checkUserPlan = async () => {
      try {
        const session = await getSession()
        setUserPlan(session?.user?.plan || 'BASIC')
      } catch (error) {
        console.error('Erro ao verificar plano:', error)
      }
    }
    checkUserPlan()

    // Carregar dados
    loadTelemedicineData()
  }, [])

  // Se não for plano premium, mostrar upgrade
  if (userPlan !== 'PREMIUM') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <Video className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Plataforma de Telemedicina
          </h2>
          <p className="text-gray-600 mb-6">
            Realize consultas virtuais com seus pacientes através de videochamadas seguras, chat em tempo real e compartilhamento de arquivos.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Esta funcionalidade está disponível apenas no plano Premium.
          </p>
          <Link href="/dashboard/plans">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Star className="w-4 h-4 mr-2" />
              Fazer Upgrade para Premium
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const loadTelemedicineData = () => {
    const apts = telemedicineService.getAppointments()
    setAppointments(apts)
  }

  const joinRoom = (appointmentId: string) => {
    const appointment = appointments.find(apt => apt.id === appointmentId)
    if (!appointment) return

    const room = telemedicineService.getRoom(appointment.roomId)
    if (!room) return

    setCurrentRoom(room)
    setMessages(telemedicineService.getMessages(room.id))
    setSharedFiles(telemedicineService.getSharedFiles(room.id))
    setActiveTab('room')

    // Simular entrada na sala
    telemedicineService.joinRoom(room.id, 'current-user')
    telemedicineService.updateAppointmentStatus(appointmentId, 'in_progress')

    // Iniciar câmera (simulado)
    initializeCamera()
  }

  const leaveRoom = () => {
    if (!currentRoom) return

    telemedicineService.leaveRoom(currentRoom.id, 'current-user')
    setCurrentRoom(null)
    setActiveTab('dashboard')
    loadTelemedicineData()
  }

  const initializeCamera = async () => {
    try {
      if (videoRef.current) {
        // Simular stream de vídeo
        videoRef.current.src = "/placeholder-video.mp4"
      }
    } catch (error) {
      console.error('Erro ao inicializar câmera:', error)
    }
  }

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled)
    if (currentRoom) {
      telemedicineService.updateParticipantMedia(
        currentRoom.id,
        'current-user',
        { videoEnabled: !isVideoEnabled }
      )
    }
  }

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled)
    if (currentRoom) {
      telemedicineService.updateParticipantMedia(
        currentRoom.id,
        'current-user',
        { audioEnabled: !isAudioEnabled }
      )
    }
  }

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing)
    if (currentRoom) {
      telemedicineService.updateParticipantMedia(
        currentRoom.id,
        'current-user',
        { screenSharing: !isScreenSharing }
      )
    }
  }

  const toggleRecording = () => {
    if (!currentRoom) return

    if (isRecording) {
      const recordingUrl = telemedicineService.stopRecording(currentRoom.id)
      setIsRecording(false)
      if (recordingUrl) {
        alert(`Gravação salva: ${recordingUrl}`)
      }
    } else {
      const started = telemedicineService.startRecording(currentRoom.id)
      if (started) {
        setIsRecording(true)
      }
    }
  }

  const sendMessage = () => {
    if (!currentRoom || !newMessage.trim()) return

    const message = telemedicineService.sendMessage(currentRoom.id, 'current-user', newMessage)
    if (message) {
      setMessages([...messages, message])
      setNewMessage('')
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || !currentRoom) return

    Array.from(files).forEach(file => {
      const sharedFile = telemedicineService.shareFile(currentRoom.id, {
        name: file.name,
        type: file.type,
        size: file.size,
        url: `/uploads/${file.name}`,
        uploadedBy: 'current-user',
        description: `Arquivo compartilhado durante consulta`
      })

      if (sharedFile) {
        setSharedFiles([...sharedFiles, sharedFile])
      }
    })
  }

  const renderDashboard = () => {
    const stats = telemedicineService.getTelemedicineStats()
    const todayAppointments = appointments.filter(apt => {
      const today = new Date()
      const aptDate = new Date(apt.scheduleDate)
      return aptDate.toDateString() === today.toDateString()
    })

    const upcomingAppointments = appointments.filter(apt => 
      apt.status === 'scheduled' && apt.scheduleDate > new Date()
    ).slice(0, 3)

    return (
      <div className="space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Consultas Hoje</p>
                <p className="text-3xl font-bold text-blue-600">{todayAppointments.length}</p>
              </div>
              <Calendar className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Conclusão</p>
                <p className="text-3xl font-bold text-green-600">{(stats.completedAppointments / stats.totalAppointments * 100).toFixed(1)}%</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Duração Média</p>
                <p className="text-3xl font-bold text-purple-600">{Math.round(stats.averageDuration)}min</p>
              </div>
              <Clock className="w-10 h-10 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Satisfação</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.patientSatisfaction.toFixed(1)}⭐</p>
              </div>
              <Star className="w-10 h-10 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Consultas de Hoje */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Video className="w-5 h-5 text-blue-600 mr-2" />
                Consultas de Hoje ({todayAppointments.length})
              </h3>
              <Button
                onClick={() => setShowScheduleForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Consulta
              </Button>
            </div>
          </div>
          <div className="p-6">
            {todayAppointments.length > 0 ? (
              <div className="space-y-4">
                {todayAppointments.map(appointment => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">👤</div>
                      <div>
                        <h4 className="font-medium text-gray-900">{appointment.patientName}</h4>
                        <p className="text-sm text-gray-600">
                          {format(appointment.scheduleDate, 'HH:mm')} • {telemedicineService.getAppointmentTypeLabel(appointment.type)}
                        </p>
                        <p className="text-sm text-gray-500">{appointment.duration} minutos</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${telemedicineService.getStatusColor(appointment.status)}`}>
                        {telemedicineService.getStatusLabel(appointment.status)}
                      </span>
                      {appointment.status === 'scheduled' && appointment.scheduleDate <= new Date(Date.now() + 15 * 60 * 1000) && (
                        <Button
                          onClick={() => joinRoom(appointment.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Iniciar Consulta
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma consulta hoje</h3>
                <p className="text-gray-600">Que tal agendar uma nova consulta?</p>
              </div>
            )}
          </div>
        </div>

        {/* Próximas Consultas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="w-5 h-5 text-gray-600 mr-2" />
                Próximas Consultas
              </h3>
              <Button
                onClick={() => setActiveTab('appointments')}
                variant="outline"
                size="sm"
              >
                Ver Todas
              </Button>
            </div>
          </div>
          <div className="p-6">
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map(appointment => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">👤</div>
                      <div>
                        <h4 className="font-medium text-gray-900">{appointment.patientName}</h4>
                        <p className="text-sm text-gray-600">
                          {format(appointment.scheduleDate, 'dd/MM/yyyy HH:mm')} • {telemedicineService.getAppointmentTypeLabel(appointment.type)}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Em {formatDistanceToNow(appointment.scheduleDate, { locale: ptBR })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">Nenhuma consulta agendada</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderVideoRoom = () => {
    if (!currentRoom) return null

    const appointment = appointments.find(apt => apt.roomId === currentRoom.id)

    return (
      <div className="h-screen bg-gray-900 flex flex-col">
        {/* Header da Sala */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {appointment ? `Consulta com ${appointment.patientName}` : 'Sala de Telemedicina'}
              </h2>
              <p className="text-sm text-gray-600">
                Duração: {appointment?.duration || 30} minutos
                {isRecording && <span className="ml-2 text-red-600">🔴 Gravando</span>}
              </p>
            </div>
          </div>
          <Button
            onClick={leaveRoom}
            variant="outline"
            className="text-red-600"
          >
            <PhoneOff className="w-4 h-4 mr-2" />
            Sair da Consulta
          </Button>
        </div>

        <div className="flex-1 flex">
          {/* Área de Vídeo */}
          <div className="flex-1 relative bg-gray-800">
            {/* Vídeo Principal */}
            <div className="absolute inset-0 flex items-center justify-center">
              {isVideoEnabled ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                />
              ) : (
                <div className="bg-gray-700 rounded-lg p-8 text-center">
                  <VideoOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-white">Câmera desligada</p>
                </div>
              )}
            </div>

            {/* Vídeo do Participante (Picture-in-Picture) */}
            <div className="absolute top-4 right-4 w-64 h-48 bg-gray-700 rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-semibold mx-auto mb-2">
                    {appointment?.patientName.charAt(0) || 'P'}
                  </div>
                  <p className="text-white text-sm">{appointment?.patientName || 'Paciente'}</p>
                </div>
              </div>
            </div>

            {/* Controles de Vídeo */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-gray-800 bg-opacity-75 rounded-lg p-4">
              <Button
                onClick={toggleAudio}
                size="sm"
                className={`${isAudioEnabled ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
              >
                {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </Button>

              <Button
                onClick={toggleVideo}
                size="sm"
                className={`${isVideoEnabled ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
              >
                {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </Button>

              <Button
                onClick={toggleScreenShare}
                size="sm"
                className={`${isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
              >
                {isScreenSharing ? <Monitor className="w-4 h-4" /> : <MonitorOff className="w-4 h-4" />}
              </Button>

              <Button
                onClick={toggleRecording}
                size="sm"
                className={`${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
              >
                {isRecording ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
              </Button>

              <Button
                onClick={() => setShowChat(!showChat)}
                size="sm"
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>

              <Button
                onClick={() => fileInputRef.current?.click()}
                size="sm"
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Painel Lateral - Chat */}
          {showChat && (
            <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
              {/* Header do Chat */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Chat da Consulta</h3>
                <Button
                  onClick={() => setShowChat(false)}
                  size="sm"
                  variant="ghost"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Mensagens */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.map(message => (
                  <div key={message.id} className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-3 py-2 rounded-lg ${
                      message.senderId === 'current-user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {format(message.timestamp, 'HH:mm')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Arquivos Compartilhados */}
              {sharedFiles.length > 0 && (
                <div className="p-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Arquivos Compartilhados</h4>
                  <div className="space-y-2">
                    {sharedFiles.map(file => (
                      <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-900 truncate">{file.name}</span>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Input de Mensagem */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    onClick={sendMessage}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input de Arquivo Oculto */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileUpload}
          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {activeTab === 'room' ? (
        renderVideoRoom()
      ) : (
        <>
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 sm:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Video className="w-8 h-8 text-blue-600" />
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                      Plataforma de Telemedicina
                    </h1>
                    <p className="text-sm text-gray-600">
                      Consultas virtuais e atendimento remoto
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Premium
                  </span>
                </div>
              </div>

              {/* Navegação de Tabs */}
              <div className="flex space-x-1 mt-4 overflow-x-auto">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: Video },
                  { id: 'appointments', label: 'Consultas', icon: Calendar },
                  { id: 'schedule', label: 'Agenda', icon: Clock },
                  { id: 'history', label: 'Histórico', icon: FileText }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4 py-6">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'appointments' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestão de Consultas</h3>
                <p className="text-gray-600">Lista completa de consultas agendadas...</p>
              </div>
            )}
            {activeTab === 'schedule' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Agenda Virtual</h3>
                <p className="text-gray-600">Gerenciar horários disponíveis...</p>
              </div>
            )}
            {activeTab === 'history' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Histórico de Consultas</h3>
                <p className="text-gray-600">Gravações e relatórios de consultas anteriores...</p>
              </div>
            )}
          </main>
        </>
      )}
    </div>
  )
}