'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Shield,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Download,
  Filter,
  Search,
  Users,
  Activity,
  Lock,
  Star,
  TrendingUp,
  Database,
  Settings,
  Bell,
  Flag,
  Archive,
  UserCheck,
  FileX,
  Zap,
  BarChart3,
  Calendar,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react'
import Link from 'next/link'
import getSesion from '@/lib/getSession'
import { 
  auditService,
  type AuditEvent,
  type AuditFilter,
  type ComplianceReport,
  type SecurityAlert,
  type DataRetentionPolicy,
  type PrivacyRequest
} from '@/lib/audit'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function AuditPage() {
  const [userPlan, setUserPlan] = useState<string>('BASIC')
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'compliance' | 'security' | 'privacy' | 'retention'>('overview')
  
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([])
  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([])
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([])
  const [retentionPolicies, setRetentionPolicies] = useState<DataRetentionPolicy[]>([])
  const [privacyRequests, setPrivacyRequests] = useState<PrivacyRequest[]>([])
  
  const [eventFilter, setEventFilter] = useState<AuditFilter>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

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

    // Carregar dados
    loadAuditData()
  }, [])

  // Se não for plano premium, mostrar upgrade
  if (userPlan !== 'PREMIUM') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <Shield className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sistema de Auditoria Completo
          </h2>
          <p className="text-gray-600 mb-6">
            Trilha de auditoria completa, conformidade LGPD/HIPAA, relatórios de segurança e monitoramento em tempo real de todas as atividades do sistema.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Esta funcionalidade está disponível apenas no plano Premium.
          </p>
          <Link href="/dashboard/plans">
            <Button className="bg-red-600 hover:bg-red-700">
              <Star className="w-4 h-4 mr-2" />
              Fazer Upgrade para Premium
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const loadAuditData = () => {
    setAuditEvents(auditService.getAuditEvents(eventFilter, 50))
    setComplianceReports(auditService.getComplianceReports())
    setSecurityAlerts(auditService.getSecurityAlerts())
    setRetentionPolicies(auditService.getRetentionPolicies())
    setPrivacyRequests(auditService.getPrivacyRequests())
  }

  const applyFilters = () => {
    const filter: AuditFilter = { ...eventFilter }
    if (searchTerm) {
      filter.searchTerm = searchTerm
    }
    setAuditEvents(auditService.getAuditEvents(filter, 50))
  }

  const generateComplianceReport = async (type: ComplianceReport['type']) => {
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // últimos 30 dias
    const endDate = new Date()
    
    try {
      const reportId = await auditService.generateComplianceReport(type, startDate, endDate)
      alert(`Relatório ${type.toUpperCase()} gerado com sucesso! ID: ${reportId}`)
      loadAuditData()
    } catch (error) {
      alert('Erro ao gerar relatório')
    }
  }

  const resolveAlert = (alertId: string) => {
    const resolution = prompt('Descreva a resolução do alerta:')
    if (resolution) {
      auditService.resolveSecurityAlert(alertId, resolution, 'current-user')
      loadAuditData()
    }
  }

  const processPrivacyRequest = (requestId: string, action: 'approve' | 'reject') => {
    const notes = action === 'reject' ? prompt('Motivo da rejeição:') : undefined
    auditService.processPrivacyRequest(requestId, action, notes || undefined)
    loadAuditData()
  }

  const renderOverview = () => {
    const stats = auditService.getAuditStatistics()
    const openAlerts = securityAlerts.filter(a => a.status === 'open').length
    const pendingRequests = privacyRequests.filter(r => r.status === 'pending').length

    return (
      <div className="space-y-6">
        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Score de Conformidade</p>
                <p className="text-3xl font-bold text-green-600">{stats.complianceScore.toFixed(1)}%</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Excelente
                </p>
              </div>
              <Shield className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Eventos de Auditoria</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalEvents}</p>
                <p className="text-sm text-gray-500 mt-1">Último mês</p>
              </div>
              <Activity className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alertas Ativos</p>
                <p className="text-3xl font-bold text-orange-600">{openAlerts}</p>
                <p className="text-sm text-orange-600 flex items-center mt-1">
                  {openAlerts > 0 ? <AlertTriangle className="w-3 h-3 mr-1" /> : <CheckCircle className="w-3 h-3 mr-1" />}
                  {openAlerts > 0 ? 'Requer atenção' : 'Tudo OK'}
                </p>
              </div>
              <Bell className="w-10 h-10 text-orange-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Solicitações LGPD</p>
                <p className="text-3xl font-bold text-purple-600">{pendingRequests}</p>
                <p className="text-sm text-purple-600 mt-1">Pendentes</p>
              </div>
              <UserCheck className="w-10 h-10 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Distribuição por Nível de Risco */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 text-gray-600 mr-2" />
              Distribuição de Eventos por Nível de Risco
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.eventsByRisk).map(([risk, count]) => (
                <div key={risk} className={`p-4 rounded-lg text-center ${
                  risk === 'low' ? 'bg-green-50 border border-green-200' :
                  risk === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                  risk === 'high' ? 'bg-orange-50 border border-orange-200' :
                  'bg-red-50 border border-red-200'
                }`}>
                  <div className={`text-2xl font-bold ${
                    risk === 'low' ? 'text-green-600' :
                    risk === 'medium' ? 'text-yellow-600' :
                    risk === 'high' ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {count}
                  </div>
                  <div className="text-sm text-gray-600 capitalize">{risk}</div>
                  <div className="text-xs text-gray-500">
                    {((count / stats.totalEvents) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alertas de Segurança Recentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
                  Alertas de Segurança ({openAlerts})
                </h3>
                <Button
                  onClick={() => setActiveTab('security')}
                  variant="outline"
                  size="sm"
                >
                  Ver Todos
                </Button>
              </div>
            </div>
            <div className="p-6">
              {securityAlerts.filter(a => a.status === 'open').slice(0, 3).map(alert => (
                <div key={alert.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg mb-4 last:mb-0">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        alert.severity === 'critical' ? 'bg-red-500' :
                        alert.severity === 'high' ? 'bg-orange-500' :
                        alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></span>
                      <h4 className="font-medium text-gray-900">{alert.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(alert.detectedAt, { locale: ptBR })} atrás
                    </p>
                  </div>
                  <Button
                    onClick={() => resolveAlert(alert.id)}
                    size="sm"
                    variant="outline"
                  >
                    Resolver
                  </Button>
                </div>
              ))}
              {openAlerts === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Nenhum alerta ativo</h4>
                  <p className="text-gray-600">Todos os alertas foram resolvidos</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Users className="w-5 h-5 text-blue-600 mr-2" />
                  Usuários Mais Ativos
                </h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.topUsers.map((user, index) => (
                  <div key={user.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{user.events} eventos</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Eventos Recentes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="w-5 h-5 text-gray-600 mr-2" />
                Eventos Recentes
              </h3>
              <Button
                onClick={() => setActiveTab('events')}
                variant="outline"
                size="sm"
              >
                Ver Todos
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {auditEvents.slice(0, 5).map(event => (
                <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${auditService.getOutcomeColor(event.outcome)}`}>
                      {event.outcome === 'success' ? <CheckCircle className="w-5 h-5" /> :
                       event.outcome === 'failure' ? <AlertTriangle className="w-5 h-5" /> :
                       <Eye className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {auditService.formatEventDescription(event)}
                      </h4>
                      <p className="text-sm text-gray-600">{event.userName}</p>
                      <p className="text-xs text-gray-500">
                        {format(event.timestamp, 'dd/MM/yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${auditService.getRiskLevelColor(event.riskLevel)}`}>
                      {event.riskLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderEvents = () => (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                size="sm"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              <Button onClick={applyFilters} size="sm">
                Aplicar
              </Button>
            </div>

            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>

          {showFilters && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <select
                  value={eventFilter.userRole || ''}
                  onChange={(e) => setEventFilter({...eventFilter, userRole: e.target.value || undefined})}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Todos os papéis</option>
                  <option value="admin">Admin</option>
                  <option value="doctor">Médico</option>
                  <option value="assistant">Assistente</option>
                  <option value="patient">Paciente</option>
                </select>

                <select
                  value={eventFilter.action || ''}
                  onChange={(e) => setEventFilter({...eventFilter, action: e.target.value || undefined})}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Todas as ações</option>
                  <option value="create">Criar</option>
                  <option value="read">Ler</option>
                  <option value="update">Atualizar</option>
                  <option value="delete">Excluir</option>
                  <option value="login">Login</option>
                  <option value="export">Exportar</option>
                </select>

                <select
                  value={eventFilter.outcome || ''}
                  onChange={(e) => setEventFilter({...eventFilter, outcome: e.target.value || undefined})}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Todos os resultados</option>
                  <option value="success">Sucesso</option>
                  <option value="failure">Falha</option>
                  <option value="warning">Aviso</option>
                </select>

                <select
                  value={eventFilter.riskLevel || ''}
                  onChange={(e) => setEventFilter({...eventFilter, riskLevel: e.target.value || undefined})}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Todos os riscos</option>
                  <option value="low">Baixo</option>
                  <option value="medium">Médio</option>
                  <option value="high">Alto</option>
                  <option value="critical">Crítico</option>
                </select>

                <input
                  type="date"
                  value={eventFilter.startDate ? eventFilter.startDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setEventFilter({...eventFilter, startDate: e.target.value ? new Date(e.target.value) : undefined})}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lista de Eventos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="space-y-4">
            {auditEvents.map(event => (
              <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${auditService.getOutcomeColor(event.outcome)}`}>
                      {event.action.type === 'create' ? <Zap className="w-5 h-5" /> :
                       event.action.type === 'read' ? <Eye className="w-5 h-5" /> :
                       event.action.type === 'update' ? <Settings className="w-5 h-5" /> :
                       event.action.type === 'delete' ? <FileX className="w-5 h-5" /> :
                       event.action.type === 'login' ? <Users className="w-5 h-5" /> :
                       event.action.type === 'export' ? <Download className="w-5 h-5" /> :
                       <Activity className="w-5 h-5" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900 truncate">
                          {auditService.formatEventDescription(event)}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${auditService.getRiskLevelColor(event.riskLevel)}`}>
                          {event.riskLevel}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {event.userName} ({event.userRole})
                        </div>
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-1" />
                          {event.ipAddress}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {format(event.timestamp, 'dd/MM/yyyy HH:mm')}
                        </div>
                      </div>

                      {event.details.changes && event.details.changes.length > 0 && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm font-medium text-gray-700 mb-2">Alterações:</p>
                          <div className="space-y-1">
                            {event.details.changes.slice(0, 3).map((change, index) => (
                              <div key={index} className="text-sm text-gray-600">
                                <span className="font-medium">{change.field}:</span>
                                <span className="mx-2">
                                  {change.sensitive 
                                    ? auditService.maskSensitiveData(change.oldValue, change.fieldType)
                                    : String(change.oldValue)
                                  }
                                </span>
                                →
                                <span className="ml-2">
                                  {change.sensitive 
                                    ? auditService.maskSensitiveData(change.newValue, change.fieldType)
                                    : String(change.newValue)
                                  }
                                </span>
                              </div>
                            ))}
                            {event.details.changes.length > 3 && (
                              <p className="text-xs text-gray-500">
                                +{event.details.changes.length - 3} alterações adicionais
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${auditService.getOutcomeColor(event.outcome)}`}>
                      {event.outcome === 'success' ? 'Sucesso' :
                       event.outcome === 'failure' ? 'Falha' : 'Aviso'}
                    </span>
                    
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      {event.compliance.lgpd && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">LGPD</span>}
                      {event.compliance.hipaa && <span className="bg-green-100 text-green-800 px-2 py-1 rounded">HIPAA</span>}
                      {event.compliance.iso27001 && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">ISO</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {auditEvents.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum evento encontrado</h3>
              <p className="text-gray-600">Ajuste os filtros para ver mais eventos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-red-600" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Sistema de Auditoria Completo
                </h1>
                <p className="text-sm text-gray-600">
                  Conformidade, segurança e trilha de auditoria
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => generateComplianceReport('lgpd')}
                variant="outline"
                size="sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                Gerar Relatório
              </Button>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                <Star className="w-3 h-3 mr-1" />
                Premium
              </span>
            </div>
          </div>

          {/* Navegação de Tabs */}
          <div className="flex space-x-1 mt-4 overflow-x-auto">
            {[
              { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
              { id: 'events', label: 'Eventos', icon: Activity },
              { id: 'compliance', label: 'Conformidade', icon: Flag },
              { id: 'security', label: 'Segurança', icon: AlertTriangle },
              { id: 'privacy', label: 'Privacidade', icon: UserCheck },
              { id: 'retention', label: 'Retenção', icon: Archive }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white'
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
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'events' && renderEvents()}
        {activeTab === 'compliance' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Flag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Relatórios de Conformidade</h3>
            <p className="text-gray-600">LGPD, HIPAA, ISO 27001 e outras regulamentações...</p>
          </div>
        )}
        {activeTab === 'security' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Alertas de Segurança</h3>
            <p className="text-gray-600">Monitoramento e resposta a incidentes...</p>
          </div>
        )}
        {activeTab === 'privacy' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Solicitações de Privacidade</h3>
            <p className="text-gray-600">Gestão de direitos LGPD dos titulares...</p>
          </div>
        )}
        {activeTab === 'retention' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Políticas de Retenção</h3>
            <p className="text-gray-600">Gestão do ciclo de vida dos dados...</p>
          </div>
        )}
      </main>
    </div>
  )
}