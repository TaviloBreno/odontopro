'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Building2,
  Plus,
  MapPin,
  Users,
  BarChart3,
  Settings,
  Clock,
  Package,
  ArrowRightLeft,
  TrendingUp,
  Star,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  Search,
  Calendar,
  DollarSign,
  Activity,
  Shield,
  Globe,
  Phone,
  Mail,
  Timer,
  Target,
  Zap,
  Database,
  RefreshCw,
  Network,
  PieChart,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import getSesion from '@/lib/getSession'
import { 
  multiLocationService,
  type Location,
  type LocationUser,
  type LocationSync,
  type LocationAnalytics,
  type LocationInventory,
  type LocationTransfer
} from '@/lib/multi-location'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function MultiLocationPage() {
  const [userPlan, setUserPlan] = useState<string>('BASIC')
  const [activeTab, setActiveTab] = useState<'overview' | 'locations' | 'analytics' | 'inventory' | 'sync' | 'reports'>('overview')
  
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([])
  const [networkAnalytics, setNetworkAnalytics] = useState<any>(null)
  const [syncStatus, setSyncStatus] = useState<LocationSync[]>([])
  const [inventoryTransfers, setInventoryTransfers] = useState<LocationTransfer[]>([])
  
  const [showLocationForm, setShowLocationForm] = useState(false)
  const [showTransferForm, setShowTransferForm] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)

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
    loadData()
  }, [])

  // Se não for plano premium, mostrar upgrade
  if (userPlan !== 'PREMIUM') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <Building2 className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Gestão Multi-localização
          </h2>
          <p className="text-gray-600 mb-6">
            Gerencie múltiplas clínicas com sincronização de dados, relatórios consolidados e controle centralizado de toda sua rede odontológica.
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

  const loadData = () => {
    setLocations(multiLocationService.getAllLocations())
    
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    setNetworkAnalytics(multiLocationService.getNetworkAnalytics(startOfMonth, now))
    
    setSyncStatus(multiLocationService.getSyncStatus())
    setInventoryTransfers(multiLocationService.getInventoryTransfers())
  }

  const handleCreateLocation = async (locationData: any) => {
    try {
      await multiLocationService.createLocation(locationData)
      loadData()
      setShowLocationForm(false)
      alert('Localização criada com sucesso!')
    } catch (error) {
      alert('Erro ao criar localização')
    }
  }

  const handleUpdateLocation = async (locationId: string, updates: any) => {
    try {
      await multiLocationService.updateLocation(locationId, updates)
      loadData()
      setEditingLocation(null)
      alert('Localização atualizada com sucesso!')
    } catch (error) {
      alert('Erro ao atualizar localização')
    }
  }

  const handleDeleteLocation = async (locationId: string) => {
    if (confirm('Tem certeza que deseja excluir esta localização?')) {
      try {
        await multiLocationService.deleteLocation(locationId)
        loadData()
        alert('Localização excluída com sucesso!')
      } catch (error) {
        alert('Erro ao excluir localização')
      }
    }
  }

  const handleSyncData = async (sourceId: string, targetId: string) => {
    try {
      await multiLocationService.syncData(sourceId, targetId, 'patients')
      loadData()
      alert('Sincronização iniciada!')
    } catch (error) {
      alert('Erro na sincronização')
    }
  }

  const generateConsolidatedReport = async () => {
    if (selectedLocationIds.length === 0) {
      alert('Selecione pelo menos uma localização')
      return
    }
    
    try {
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      const endDate = new Date()
      
      const reportId = await multiLocationService.generateConsolidatedReport(
        'performance',
        selectedLocationIds,
        startDate,
        endDate
      )
      
      alert(`Relatório consolidado gerado! ID: ${reportId}`)
    } catch (error) {
      alert('Erro ao gerar relatório')
    }
  }

  const renderOverview = () => {
    if (!networkAnalytics) return null

    const activeLocations = locations.filter(l => l.status === 'active').length
    const pendingTransfers = inventoryTransfers.filter(t => t.status === 'pending').length
    const syncIssues = syncStatus.filter(s => s.status === 'failed').length

    return (
      <div className="space-y-6">
        {/* KPIs da Rede */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Localizações Ativas</p>
                <p className="text-3xl font-bold text-blue-600">{activeLocations}</p>
                <p className="text-sm text-blue-600 flex items-center mt-1">
                  <Building2 className="w-3 h-3 mr-1" />
                  {networkAnalytics.totalLocations} total
                </p>
              </div>
              <Building2 className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita Total</p>
                <p className="text-3xl font-bold text-green-600">
                  {new Intl.NumberFormat('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(networkAnalytics.totalRevenue)}
                </p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{networkAnalytics.growthRate}% este mês
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pacientes Atendidos</p>
                <p className="text-3xl font-bold text-purple-600">{networkAnalytics.totalPatients.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">Todas as unidades</p>
              </div>
              <Users className="w-10 h-10 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Performance Média</p>
                <p className="text-3xl font-bold text-orange-600">{networkAnalytics.averagePerformance.toFixed(1)}</p>
                <p className="text-sm text-orange-600 flex items-center mt-1">
                  {networkAnalytics.averagePerformance >= 4.5 ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                  Satisfação geral
                </p>
              </div>
              <BarChart3 className="w-10 h-10 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Status da Rede */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Network className="w-5 h-5 text-blue-600 mr-2" />
                  Status de Sincronização
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  syncIssues === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {syncIssues === 0 ? 'Tudo OK' : `${syncIssues} problemas`}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {locations.slice(0, 3).map(location => {
                  const locationSyncs = syncStatus.filter(s => s.sourceLocationId === location.id)
                  const failedSyncs = locationSyncs.filter(s => s.status === 'failed').length
                  
                  return (
                    <div key={location.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          failedSyncs === 0 ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className="font-medium text-gray-900">{location.name}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {locationSyncs.length} conexões
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <Button
                onClick={() => setActiveTab('sync')}
                variant="outline"
                size="sm"
                className="w-full mt-4"
              >
                Ver Detalhes
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Package className="w-5 h-5 text-orange-600 mr-2" />
                  Transferências Pendentes
                </h3>
                <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                  {pendingTransfers}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {inventoryTransfers.filter(t => t.status === 'pending').slice(0, 3).map(transfer => {
                  const fromLocation = locations.find(l => l.id === transfer.fromLocationId)
                  const toLocation = locations.find(l => l.id === transfer.toLocationId)
                  
                  return (
                    <div key={transfer.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {fromLocation?.code} → {toLocation?.code}
                        </p>
                        <p className="text-sm text-gray-500">
                          {transfer.items.length} itens
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDistanceToNow(transfer.requestedAt, { locale: ptBR })}
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {pendingTransfers === 0 && (
                <div className="text-center py-4">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Nenhuma transferência pendente</p>
                </div>
              )}
              
              <Button
                onClick={() => setActiveTab('inventory')}
                variant="outline"
                size="sm"
                className="w-full mt-4"
              >
                Gerenciar Inventário
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <PieChart className="w-5 h-5 text-purple-600 mr-2" />
                Performance por Localização
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {locations.map((location, index) => {
                  const analytics = multiLocationService.getLocationAnalytics(
                    location.id,
                    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    new Date()
                  )
                  
                  return (
                    <div key={location.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          index === 0 ? 'bg-green-100 text-green-800' :
                          index === 1 ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{location.code}</p>
                          <p className="text-xs text-gray-500">{location.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{analytics.performance.patientSatisfaction.toFixed(1)}</p>
                        <p className="text-xs text-gray-500">satisfação</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Mapa da Rede */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Globe className="w-5 h-5 text-gray-600 mr-2" />
                Mapa da Rede de Clínicas
              </h3>
              <Button
                onClick={() => setActiveTab('locations')}
                variant="outline"
                size="sm"
              >
                Gerenciar Localizações
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map(location => (
                <div key={location.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{location.name}</h4>
                      <p className="text-sm text-gray-600">{location.code}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      location.status === 'active' ? 'bg-green-100 text-green-800' :
                      location.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                      location.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {location.status === 'active' ? 'Ativa' :
                       location.status === 'inactive' ? 'Inativa' :
                       location.status === 'maintenance' ? 'Manutenção' : 'Suspensa'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="truncate">
                        {location.address.neighborhood}, {location.address.city}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{location.contact.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{location.capacity.operatories} consultórios</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-xs text-gray-500">
                      {location.services.length} serviços
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => setEditingLocation(location)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteLocation(location.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                onClick={() => setShowLocationForm(true)}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors flex items-center justify-center min-h-[200px]"
              >
                <div className="text-center">
                  <Plus className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">Adicionar Nova Localização</p>
                  <p className="text-sm text-gray-500">Expandir sua rede</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Relatórios Rápidos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 text-gray-600 mr-2" />
              Relatórios Consolidados
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={generateConsolidatedReport}
                variant="outline"
                className="h-20 flex-col"
              >
                <Download className="w-6 h-6 mb-2" />
                Relatório de Performance
              </Button>
              <Button
                onClick={() => setActiveTab('analytics')}
                variant="outline"
                className="h-20 flex-col"
              >
                <TrendingUp className="w-6 h-6 mb-2" />
                Analytics Comparativo
              </Button>
              <Button
                onClick={() => setActiveTab('reports')}
                variant="outline"
                className="h-20 flex-col"
              >
                <FileText className="w-6 h-6 mb-2" />
                Relatórios Customizados
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderLocations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciar Localizações</h2>
          <p className="text-gray-600">Configure e monitore suas unidades</p>
        </div>
        <Button
          onClick={() => setShowLocationForm(true)}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Localização
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {locations.map(location => (
          <div key={location.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{location.name}</h3>
                <p className="text-gray-600">{location.code}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  location.status === 'active' ? 'bg-green-100 text-green-800' :
                  location.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                  location.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {location.status === 'active' ? 'Ativa' :
                   location.status === 'inactive' ? 'Inativa' :
                   location.status === 'maintenance' ? 'Manutenção' : 'Suspensa'}
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">
                    {location.address.street}, {location.address.number}
                  </p>
                  <p className="text-sm text-gray-600">
                    {location.address.neighborhood} - {location.address.city}, {location.address.state}
                  </p>
                  <p className="text-sm text-gray-600">CEP: {location.address.zipCode}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{location.contact.phone}</span>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{location.contact.email}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{location.capacity.operatories}</p>
                <p className="text-sm text-gray-600">Consultórios</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{location.capacity.maxDailyAppointments}</p>
                <p className="text-sm text-gray-600">Consultas/dia</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="font-medium text-gray-900 mb-2">Serviços ({location.services.length})</p>
              <div className="flex flex-wrap gap-2">
                {location.services.slice(0, 3).map(service => (
                  <span key={service} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {service}
                  </span>
                ))}
                {location.services.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{location.services.length - 3} mais
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Criada em {format(location.createdAt, 'dd/MM/yyyy', { locale: ptBR })}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setEditingLocation(location)}
                  variant="outline"
                  size="sm"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  onClick={() => handleDeleteLocation(location.id)}
                  variant="outline"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
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
              <Building2 className="w-8 h-8 text-red-600" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Gestão Multi-localização
                </h1>
                <p className="text-sm text-gray-600">
                  Controle centralizado de toda sua rede
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={generateConsolidatedReport}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Relatório Consolidado
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
              { id: 'locations', label: 'Localizações', icon: Building2 },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'inventory', label: 'Inventário', icon: Package },
              { id: 'sync', label: 'Sincronização', icon: RefreshCw },
              { id: 'reports', label: 'Relatórios', icon: FileText }
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
        {activeTab === 'locations' && renderLocations()}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Comparativo</h3>
            <p className="text-gray-600">Análise comparativa de performance entre localizações...</p>
          </div>
        )}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestão de Inventário</h3>
            <p className="text-gray-600">Controle de estoque e transferências entre unidades...</p>
          </div>
        )}
        {activeTab === 'sync' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sincronização de Dados</h3>
            <p className="text-gray-600">Configuração e monitoramento da sincronização...</p>
          </div>
        )}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Relatórios Customizados</h3>
            <p className="text-gray-600">Relatórios personalizados e exportação de dados...</p>
          </div>
        )}
      </main>
    </div>
  )
}