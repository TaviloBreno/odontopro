'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Package,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  ShoppingCart,
  Bell,
  BarChart3,
  FileText,
  Settings,
  Star,
  Users,
  DollarSign,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import getSesion from '@/lib/getSession'
import { 
  inventoryService, 
  type InventoryItem, 
  type InventoryStats,
  type LowStockAlert,
  formatCurrency,
  formatStock,
  getStockStatusColor,
  getStockStatusText,
  getCategoryIcon
} from '@/lib/inventory'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function InventoryPage() {
  const [userPlan, setUserPlan] = useState<string>('BASIC')
  const [activeTab, setActiveTab] = useState<'overview' | 'items' | 'movements' | 'alerts' | 'reports'>('overview')
  
  const [items, setItems] = useState<InventoryItem[]>([])
  const [stats, setStats] = useState<InventoryStats | null>(null)
  const [alerts, setAlerts] = useState<LowStockAlert[]>([])
  
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    supplier: '',
    status: 'all',
    lowStock: false
  })

  const [selectedItems, setSelectedItems] = useState<string[]>([])

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
    loadInventoryData()
  }, [])

  // Se não for plano professional, mostrar upgrade
  if (userPlan !== 'PROFESSIONAL') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <Package className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Controle de Estoque
          </h2>
          <p className="text-gray-600 mb-6">
            Gerencie seu inventário de materiais odontológicos com controle completo de estoque, alertas automáticos e relatórios detalhados.
          </p>
          <p className="text-sm text-gray-500 mb-6">
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

  const loadInventoryData = () => {
    setItems(inventoryService.getAllItems())
    setStats(inventoryService.getInventoryStats())
    setAlerts(inventoryService.getLowStockAlerts())
  }

  const handleSearch = () => {
    const filteredItems = inventoryService.getAllItems({
      ...filters,
      status: filters.status === 'all' ? undefined : filters.status
    })
    setItems(filteredItems)
  }

  const handleItemSelection = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId])
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId))
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Itens</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalItems || 0}</p>
            </div>
            <Package className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Valor Total</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats?.totalValue || 0)}</p>
            </div>
            <DollarSign className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Estoque Baixo</p>
              <p className="text-3xl font-bold text-yellow-600">{stats?.lowStockItems || 0}</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Itens Críticos</p>
              <p className="text-3xl font-bold text-red-600">{stats?.criticalItems || 0}</p>
            </div>
            <TrendingDown className="w-10 h-10 text-red-600" />
          </div>
        </div>
      </div>

      {/* Alertas Recentes */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Bell className="w-5 h-5 text-yellow-600 mr-2" />
                Alertas de Estoque ({alerts.length})
              </h3>
              <Button
                onClick={() => setActiveTab('alerts')}
                variant="outline"
                size="sm"
              >
                Ver Todos
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {alerts.slice(0, 5).map(alert => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className={`w-5 h-5 ${alert.severity === 'critical' ? 'text-red-600' : 'text-yellow-600'}`} />
                    <div>
                      <p className="font-medium text-gray-900">{alert.itemName}</p>
                      <p className="text-sm text-gray-600">
                        Estoque atual: {alert.currentStock} | Mínimo: {alert.minimumStock}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    alert.severity === 'critical' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {alert.severity === 'critical' ? 'Crítico' : 'Atenção'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Itens com Menor Estoque */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
            Itens com Menor Estoque
          </h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-600 border-b border-gray-200">
                  <th className="pb-3">Item</th>
                  <th className="pb-3">Categoria</th>
                  <th className="pb-3">Estoque Atual</th>
                  <th className="pb-3">Mínimo</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items
                  .sort((a, b) => a.currentStock - b.currentStock)
                  .slice(0, 10)
                  .map(item => (
                    <tr key={item.id} className="text-sm">
                      <td className="py-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getCategoryIcon(item.category.id)}</span>
                          <span className="font-medium text-gray-900">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-gray-600">{item.category.name}</td>
                      <td className="py-3 font-medium">{formatStock(item.currentStock, item.unit)}</td>
                      <td className="py-3 text-gray-600">{formatStock(item.minimumStock, item.unit)}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(item)} bg-opacity-10`}>
                          {getStockStatusText(item)}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )

  const renderItems = () => (
    <div className="space-y-6">
      {/* Filtros e Ações */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar itens..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-80"
              />
            </div>
            
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Todas as categorias</option>
              {inventoryService.getAllCategories().map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Todos os status</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="discontinued">Descontinuado</option>
            </select>

            <Button onClick={handleSearch} className="bg-emerald-600 hover:bg-emerald-700">
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>

          <div className="flex space-x-3">
            <Link href="/dashboard/inventory/new-item">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Item
              </Button>
            </Link>
            
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Importar
            </Button>
            
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Filtros Rápidos */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant={filters.lowStock ? "default" : "outline"}
            size="sm"
            onClick={() => setFilters(prev => ({ ...prev, lowStock: !prev.lowStock }))}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Estoque Baixo
          </Button>
        </div>
      </div>

      {/* Lista de Itens */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Itens do Inventário ({items.length})
            </h3>
            
            {selectedItems.length > 0 && (
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar ({selectedItems.length})
                </Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir ({selectedItems.length})
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600 border-b border-gray-200">
                <th className="p-4">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems(items.map(item => item.id))
                      } else {
                        setSelectedItems([])
                      }
                    }}
                    className="rounded"
                  />
                </th>
                <th className="p-4">Item</th>
                <th className="p-4">Categoria</th>
                <th className="p-4">Estoque</th>
                <th className="p-4">Valor Unit.</th>
                <th className="p-4">Fornecedor</th>
                <th className="p-4">Status</th>
                <th className="p-4">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(item => (
                <tr key={item.id} className="text-sm hover:bg-gray-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) => handleItemSelection(item.id, e.target.checked)}
                      className="rounded"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getCategoryIcon(item.category.id)}</span>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        {item.description && (
                          <p className="text-gray-500 text-xs">{item.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium" 
                          style={{ backgroundColor: `${item.category.color}20`, color: item.category.color }}>
                      {item.category.name}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className={`font-medium ${getStockStatusColor(item)}`}>
                        {formatStock(item.currentStock, item.unit)}
                      </span>
                      <span className="text-xs text-gray-500">
                        Min: {formatStock(item.minimumStock, item.unit)}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 font-medium">{formatCurrency(item.unitCost)}</td>
                  <td className="p-4 text-gray-600">{item.supplier.name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'inactive'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status === 'active' ? 'Ativo' : 
                       item.status === 'inactive' ? 'Inativo' : 'Descontinuado'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-emerald-600">
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {items.length === 0 && (
          <div className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Nenhum item encontrado</p>
            <Link href="/dashboard/inventory/new-item">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Item
              </Button>
            </Link>
          </div>
        )}
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
              <Package className="w-8 h-8 text-emerald-600" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Controle de Estoque
                </h1>
                <p className="text-sm text-gray-600">
                  Gerencie materiais, fornecedores e movimentações
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {stats && stats.lowStockItems > 0 && (
                <Button
                  variant="outline"
                  className="text-yellow-600 border-yellow-200"
                  onClick={() => setActiveTab('alerts')}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  {stats.lowStockItems} Alertas
                </Button>
              )}
              
              <Link href="/dashboard/inventory/new-movement">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Nova Movimentação
                </Button>
              </Link>
            </div>
          </div>

          {/* Navegação de Tabs */}
          <div className="flex space-x-1 mt-4">
            {[
              { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
              { id: 'items', label: 'Itens', icon: Package },
              { id: 'movements', label: 'Movimentações', icon: TrendingUp },
              { id: 'alerts', label: 'Alertas', icon: Bell },
              { id: 'reports', label: 'Relatórios', icon: FileText }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'items' && renderItems()}
        {activeTab === 'movements' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Movimentações de Estoque</h3>
            <p className="text-gray-600">Em desenvolvimento...</p>
          </div>
        )}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Bell className="w-5 h-5 text-yellow-600 mr-2" />
                  Alertas de Estoque Baixo ({alerts.length})
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {alerts.map(alert => (
                    <div key={alert.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center space-x-4">
                        <AlertTriangle className={`w-6 h-6 ${alert.severity === 'critical' ? 'text-red-600' : 'text-yellow-600'}`} />
                        <div>
                          <h4 className="font-medium text-gray-900">{alert.itemName}</h4>
                          <p className="text-sm text-gray-600">{alert.category}</p>
                          <p className="text-sm text-gray-600">
                            Estoque atual: {alert.currentStock} | Mínimo recomendado: {alert.minimumStock}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(alert.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          alert.severity === 'critical' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {alert.severity === 'critical' ? 'Crítico' : 'Atenção'}
                        </span>
                        <Button size="sm" variant="outline">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Comprar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => inventoryService.markAlertAsRead(alert.id)}
                        >
                          Marcar como Lido
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {alerts.length === 0 && (
                    <div className="text-center py-8">
                      <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Nenhum alerta de estoque baixo</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Relatórios de Estoque</h3>
            <p className="text-gray-600">Em desenvolvimento...</p>
          </div>
        )}
      </main>
    </div>
  )
}