'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Bell,
  Plus,
  Settings,
  Clock,
  MessageSquare,
  Mail,
  Smartphone,
  Calendar,
  Users,
  TrendingUp,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Edit,
  Eye,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Timer,
  Star,
  Activity,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import getSesion from '@/lib/getSession'
import { 
  reminderService, 
  type ReminderTemplate, 
  type ScheduledReminder,
  formatReminderTime,
  getReminderStatusColor,
  getReminderChannelIcon
} from '@/lib/reminders'

export default function RemindersPage() {
  const [userPlan, setUserPlan] = useState<string>('BASIC')
  const [activeTab, setActiveTab] = useState<'overview' | 'templates' | 'scheduled' | 'settings'>('overview')
  const [templates, setTemplates] = useState<ReminderTemplate[]>([])
  const [scheduledReminders, setScheduledReminders] = useState<ScheduledReminder[]>([])
  const [stats, setStats] = useState(reminderService.getReminderStats())
  const [selectedTemplate, setSelectedTemplate] = useState<ReminderTemplate | null>(null)
  const [selectedReminder, setSelectedReminder] = useState<ScheduledReminder | null>(null)
  const [filters, setFilters] = useState({
    status: '' as ScheduledReminder['status'] | '',
    channel: '' as ScheduledReminder['channel'] | '',
    dateRange: 'week' as 'today' | 'week' | 'month' | 'all'
  })

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

    // Carregar dados iniciais
    loadData()
  }, [])

  const loadData = () => {
    setTemplates(reminderService.getAllTemplates())
    setScheduledReminders(reminderService.getScheduledReminders())
    setStats(reminderService.getReminderStats())
  }

  const handleProcessReminders = async () => {
    try {
      const result = await reminderService.processPendingReminders()
      console.log('Lembretes processados:', result)
      loadData() // Recarregar dados
    } catch (error) {
      console.error('Erro ao processar lembretes:', error)
    }
  }

  const handleToggleTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      reminderService.updateTemplate(templateId, { isActive: !template.isActive })
      loadData()
    }
  }

  const handleCancelReminder = (reminderId: string) => {
    if (reminderService.cancelReminder(reminderId)) {
      loadData()
    }
  }

  const getFilteredReminders = () => {
    let filtered = scheduledReminders

    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status)
    }
    if (filters.channel) {
      filtered = filtered.filter(r => r.channel === filters.channel)
    }

    // Aplicar filtro de data
    if (filters.dateRange !== 'all') {
      const now = new Date()
      let dateFrom: Date
      
      switch (filters.dateRange) {
        case 'today':
          dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
      }
      
      filtered = filtered.filter(r => new Date(r.scheduledFor) >= dateFrom)
    }

    return filtered
  }

  // Se não for plano professional, mostrar upgrade prompt
  if (userPlan !== 'PROFESSIONAL') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <Bell className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sistema de Lembretes Automatizados
          </h2>
          <p className="text-gray-600 mb-6">
            Configure lembretes automáticos por SMS e email para seus pacientes. 
            Reduza faltas e melhore a comunicação com templates personalizáveis.
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
                  <Bell className="w-6 h-6" />
                  Sistema de Lembretes
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                    Professional
                  </span>
                </h1>
                <p className="text-sm text-gray-600">
                  Automatize lembretes e melhore a comunicação com pacientes
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleProcessReminders}
                variant="outline"
                className="hidden sm:flex"
              >
                <Play className="w-4 h-4 mr-2" />
                Processar Pendentes
              </Button>
              <Link href="/dashboard/reminders/new-template">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Template
                </Button>
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Visão Geral', icon: Activity },
                { id: 'templates', label: 'Templates', icon: MessageSquare },
                { id: 'scheduled', label: 'Agendados', icon: Calendar },
                { id: 'settings', label: 'Configurações', icon: Settings },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Estatísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Bell className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total de Lembretes</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Enviados</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.sent}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Pendentes</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Taxa de Sucesso</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.successRate.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Breakdown por Canal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Canal</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-700">Email</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{stats.channelBreakdown.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-gray-700">SMS</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{stats.channelBreakdown.sms}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-5 h-5 text-emerald-600" />
                      <span className="font-medium text-gray-700">WhatsApp</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{stats.channelBreakdown.whatsapp}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lembretes por Período</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Hoje</span>
                    <span className="text-lg font-bold text-gray-900">{stats.timeframeBreakdown.today}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Esta Semana</span>
                    <span className="text-lg font-bold text-gray-900">{stats.timeframeBreakdown.thisWeek}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Este Mês</span>
                    <span className="text-lg font-bold text-gray-900">{stats.timeframeBreakdown.thisMonth}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Templates Ativos */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Templates Ativos</h3>
                <Link href="/dashboard/reminders/templates">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Todos
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.filter(t => t.isActive).slice(0, 6).map(template => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{template.name}</h4>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Ativo
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">
                      {template.timing.intervals.map(i => `${i.value} ${i.unit}`).join(', ')}
                    </p>
                    <div className="flex items-center space-x-2">
                      {template.channels.map(channel => (
                        <span key={channel} className="text-lg">
                          {getReminderChannelIcon(channel)}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Templates de Lembretes</h2>
              <Link href="/dashboard/reminders/new-template">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Template
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {templates.map(template => (
                <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{template.type}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => handleToggleTemplate(template.id)}
                        variant="ghost"
                        size="sm"
                        className={template.isActive ? 'text-green-600' : 'text-gray-400'}
                      >
                        {template.isActive ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                      </Button>
                      <Button
                        onClick={() => setSelectedTemplate(template)}
                        variant="ghost"
                        size="sm"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Intervalos:</p>
                      <p className="text-sm text-gray-600">
                        {template.timing.intervals.map(i => `${i.value} ${i.unit}`).join(', ')}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Canais:</p>
                      <div className="flex space-x-2">
                        {template.channels.map(channel => (
                          <span key={channel} className="text-lg">
                            {getReminderChannelIcon(channel)}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        template.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {template.isActive ? 'Ativo' : 'Inativo'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scheduled Tab */}
        {activeTab === 'scheduled' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Lembretes Agendados</h2>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={handleProcessReminders}
                  variant="outline"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Processar
                </Button>
              </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mr-2">Status:</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  >
                    <option value="">Todos</option>
                    <option value="pending">Pendente</option>
                    <option value="sent">Enviado</option>
                    <option value="failed">Falhou</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mr-2">Canal:</label>
                  <select
                    value={filters.channel}
                    onChange={(e) => setFilters(prev => ({ ...prev, channel: e.target.value as any }))}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  >
                    <option value="">Todos</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mr-2">Período:</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  >
                    <option value="today">Hoje</option>
                    <option value="week">Esta Semana</option>
                    <option value="month">Este Mês</option>
                    <option value="all">Todos</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Lista de Lembretes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lembrete
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Agendado Para
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Canal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredReminders().map(reminder => {
                      const template = templates.find(t => t.id === reminder.templateId)
                      return (
                        <tr key={reminder.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {template?.name || 'Template não encontrado'}
                              </div>
                              <div className="text-sm text-gray-500">
                                Paciente: {reminder.patientId}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatReminderTime(reminder.scheduledFor)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-lg mr-2">
                                {getReminderChannelIcon(reminder.channel)}
                              </span>
                              <span className="text-sm text-gray-900 capitalize">
                                {reminder.channel}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getReminderStatusColor(reminder.status)}`}>
                              {reminder.status === 'pending' && 'Pendente'}
                              {reminder.status === 'sent' && 'Enviado'}
                              {reminder.status === 'failed' && 'Falhou'}
                              {reminder.status === 'cancelled' && 'Cancelado'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                onClick={() => setSelectedReminder(reminder)}
                                variant="ghost"
                                size="sm"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {reminder.status === 'pending' && (
                                <Button
                                  onClick={() => handleCancelReminder(reminder.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Configurações do Sistema</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações Gerais</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fuso Horário
                    </label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                      <option value="America/Sao_Paulo">América/São_Paulo (UTC-3)</option>
                      <option value="America/Recife">América/Recife (UTC-3)</option>
                      <option value="America/Manaus">América/Manaus (UTC-4)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tentativas Máximas por Lembrete
                    </label>
                    <input
                      type="number"
                      defaultValue={3}
                      min={1}
                      max={10}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm font-medium text-gray-700">
                        Processar lembretes automaticamente
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Canal</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">SMS</span>
                      <span className="text-green-600 text-sm">Ativo</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Integrado com provedor Twilio
                    </p>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Configurar
                    </Button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Email</span>
                      <span className="text-green-600 text-sm">Ativo</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Configurado com SMTP
                    </p>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Configurar
                    </Button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">WhatsApp</span>
                      <span className="text-yellow-600 text-sm">Configurar</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Integração com WhatsApp Business API
                    </p>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Conectar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal Template Details */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedTemplate.name}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {selectedTemplate.type}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTemplate(null)}
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Assunto</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {selectedTemplate.content.subject}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Mensagem</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                    {selectedTemplate.content.message}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Intervalos</label>
                    <div className="space-y-2 mt-1">
                      {selectedTemplate.timing.intervals.map((interval, index) => (
                        <div key={index} className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                          {interval.value} {interval.unit} - {interval.description}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Canais</label>
                    <div className="flex space-x-2 mt-1">
                      {selectedTemplate.channels.map(channel => (
                        <span key={channel} className="text-2xl">
                          {getReminderChannelIcon(channel)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Variáveis Disponíveis</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedTemplate.content.variables.map(variable => (
                      <span key={variable} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {`{${variable}}`}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  onClick={() => handleToggleTemplate(selectedTemplate.id)}
                  variant="outline"
                  className="flex-1"
                >
                  {selectedTemplate.isActive ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Desativar
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Ativar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Reminder Details */}
      {selectedReminder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Detalhes do Lembrete
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedReminder(null)}
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Template</label>
                  <p className="text-gray-900">
                    {templates.find(t => t.id === selectedReminder.templateId)?.name || 'Não encontrado'}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Paciente ID</label>
                  <p className="text-gray-900">{selectedReminder.patientId}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Agendado Para</label>
                    <p className="text-gray-900">
                      {formatReminderTime(selectedReminder.scheduledFor)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Canal</label>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">
                        {getReminderChannelIcon(selectedReminder.channel)}
                      </span>
                      <span className="text-gray-900 capitalize">{selectedReminder.channel}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getReminderStatusColor(selectedReminder.status)}`}>
                    {selectedReminder.status}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Conteúdo</label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {selectedReminder.content.subject}
                    </p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedReminder.content.message}
                    </p>
                  </div>
                </div>

                {selectedReminder.errorMessage && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Erro</label>
                    <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                      {selectedReminder.errorMessage}
                    </p>
                  </div>
                )}

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tentativas: {selectedReminder.attempts}/{selectedReminder.maxAttempts}</span>
                  {selectedReminder.sentAt && (
                    <span>Enviado: {formatReminderTime(selectedReminder.sentAt)}</span>
                  )}
                </div>
              </div>

              {selectedReminder.status === 'pending' && (
                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={() => {
                      handleCancelReminder(selectedReminder.id)
                      setSelectedReminder(null)
                    }}
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}