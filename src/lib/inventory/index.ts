import { format, subDays, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface InventoryItem {
  id: string
  name: string
  category: InventoryCategory
  description?: string
  
  // Estoque
  currentStock: number
  minimumStock: number
  maximumStock?: number
  unit: string // unidade (unid, ml, g, kg, etc.)
  
  // Fornecedor
  supplier: Supplier
  
  // Preços e custos
  unitCost: number
  salePrice?: number
  
  // Localização
  location?: string
  batch?: string
  expirationDate?: Date
  
  // Status
  status: 'active' | 'inactive' | 'discontinued'
  isLowStock: boolean
  
  // Metadados
  createdAt: Date
  updatedAt: Date
}

export interface InventoryCategory {
  id: string
  name: string
  description?: string
  color: string
}

export interface Supplier {
  id: string
  name: string
  contact: string
  email?: string
  phone?: string
  address?: string
  status: 'active' | 'inactive'
}

export interface StockMovement {
  id: string
  itemId: string
  type: 'in' | 'out' | 'adjustment'
  quantity: number
  reason: string
  description?: string
  
  // Valores
  unitCost?: number
  totalValue?: number
  
  // Referências
  supplierId?: string
  patientId?: string
  appointmentId?: string
  
  // Metadados
  createdAt: Date
  createdBy: string
}

export interface LowStockAlert {
  id: string
  itemId: string
  itemName: string
  currentStock: number
  minimumStock: number
  category: string
  severity: 'warning' | 'critical'
  createdAt: Date
  isRead: boolean
}

export interface UsageReport {
  itemId: string
  itemName: string
  category: string
  totalUsed: number
  averageDaily: number
  projectedDays: number
  lastMovement: Date
}

export interface InventoryStats {
  totalItems: number
  totalValue: number
  lowStockItems: number
  criticalItems: number
  categoriesCount: number
  suppliersCount: number
  movementsToday: number
  averageRotation: number
}

// Service principal
export class InventoryService {
  private items: Map<string, InventoryItem> = new Map()
  private categories: Map<string, InventoryCategory> = new Map()
  private suppliers: Map<string, Supplier> = new Map()
  private movements: StockMovement[] = []
  private alerts: LowStockAlert[] = []

  constructor() {
    this.initializeDefaultData()
  }

  // Inicializar dados padrão
  private initializeDefaultData() {
    // Categorias padrão
    const defaultCategories = [
      {
        id: 'anesthetics',
        name: 'Anestésicos',
        description: 'Anestésicos locais e complementos',
        color: '#EF4444'
      },
      {
        id: 'restorative',
        name: 'Materiais Restauradores',
        description: 'Resinas, amálgama, cimentos',
        color: '#3B82F6'
      },
      {
        id: 'prophylaxis',
        name: 'Profilaxia',
        description: 'Materiais de limpeza e prevenção',
        color: '#10B981'
      },
      {
        id: 'endodontics',
        name: 'Endodontia',
        description: 'Materiais para tratamento de canal',
        color: '#8B5CF6'
      },
      {
        id: 'periodontics',
        name: 'Periodontia',
        description: 'Materiais para tratamento periodontal',
        color: '#F59E0B'
      },
      {
        id: 'surgery',
        name: 'Cirurgia',
        description: 'Materiais cirúrgicos',
        color: '#DC2626'
      },
      {
        id: 'prosthetics',
        name: 'Prótese',
        description: 'Materiais protéticos',
        color: '#059669'
      },
      {
        id: 'orthodontics',
        name: 'Ortodontia',
        description: 'Materiais ortodônticos',
        color: '#7C3AED'
      },
      {
        id: 'consumables',
        name: 'Descartáveis',
        description: 'Materiais de uso único',
        color: '#6B7280'
      },
      {
        id: 'equipment',
        name: 'Equipamentos',
        description: 'Instrumentos e equipamentos',
        color: '#1F2937'
      }
    ]

    defaultCategories.forEach(cat => {
      this.categories.set(cat.id, cat)
    })

    // Fornecedores padrão
    const defaultSuppliers = [
      {
        id: 'supplier-1',
        name: 'DentMed Suprimentos',
        contact: 'João Silva',
        email: 'contato@dentmed.com',
        phone: '(11) 3333-4444',
        address: 'Rua Dental, 123 - São Paulo/SP',
        status: 'active' as const
      },
      {
        id: 'supplier-2',
        name: 'OdontoMax Distribuidora',
        contact: 'Maria Santos',
        email: 'vendas@odontomax.com',
        phone: '(11) 5555-6666',
        address: 'Av. Odontológica, 456 - São Paulo/SP',
        status: 'active' as const
      },
      {
        id: 'supplier-3',
        name: 'Dental Express',
        contact: 'Pedro Lima',
        email: 'pedidos@dentalexpress.com',
        phone: '(11) 7777-8888',
        address: 'Rua dos Dentistas, 789 - São Paulo/SP',
        status: 'active' as const
      }
    ]

    defaultSuppliers.forEach(sup => {
      this.suppliers.set(sup.id, sup)
    })

    // Itens de exemplo
    this.createSampleItems()
  }

  private createSampleItems() {
    const sampleItems = [
      {
        name: 'Lidocaína 2% com Epinefrina',
        category: 'anesthetics',
        description: 'Anestésico local para procedimentos odontológicos',
        currentStock: 15,
        minimumStock: 10,
        maximumStock: 50,
        unit: 'tubete',
        supplier: 'supplier-1',
        unitCost: 3.50,
        salePrice: 8.00,
        location: 'Geladeira A - Prateleira 2'
      },
      {
        name: 'Resina Composta A2',
        category: 'restorative',
        description: 'Resina fotopolimerizável cor A2',
        currentStock: 3,
        minimumStock: 5,
        maximumStock: 20,
        unit: 'seringa',
        supplier: 'supplier-2',
        unitCost: 45.00,
        salePrice: 90.00,
        location: 'Armário B - Gaveta 3'
      },
      {
        name: 'Luvas Descartáveis M',
        category: 'consumables',
        description: 'Luvas de procedimento não cirúrgico tamanho M',
        currentStock: 2,
        minimumStock: 10,
        maximumStock: 100,
        unit: 'caixa',
        supplier: 'supplier-3',
        unitCost: 25.00,
        location: 'Estoque Geral - Prateleira A'
      },
      {
        name: 'Pasta Profilática',
        category: 'prophylaxis',
        description: 'Pasta para limpeza e polimento',
        currentStock: 8,
        minimumStock: 5,
        maximumStock: 25,
        unit: 'pote',
        supplier: 'supplier-1',
        unitCost: 15.00,
        salePrice: 35.00,
        location: 'Consultório 1 - Bancada'
      },
      {
        name: 'Lima Endodôntica #25',
        category: 'endodontics',
        description: 'Lima manual para preparo de canal',
        currentStock: 12,
        minimumStock: 8,
        maximumStock: 50,
        unit: 'unid',
        supplier: 'supplier-2',
        unitCost: 12.00,
        salePrice: 25.00,
        location: 'Endo Box - Compartimento 3'
      }
    ]

    sampleItems.forEach((item, index) => {
      const id = `item-${index + 1}`
      const category = this.categories.get(item.category)!
      const supplier = this.suppliers.get(item.supplier)!
      
      const inventoryItem: InventoryItem = {
        id,
        name: item.name,
        category,
        description: item.description,
        currentStock: item.currentStock,
        minimumStock: item.minimumStock,
        maximumStock: item.maximumStock,
        unit: item.unit,
        supplier,
        unitCost: item.unitCost,
        salePrice: item.salePrice,
        location: item.location,
        status: 'active',
        isLowStock: item.currentStock <= item.minimumStock,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      this.items.set(id, inventoryItem)

      // Criar alerta se estoque baixo
      if (inventoryItem.isLowStock) {
        this.createLowStockAlert(inventoryItem)
      }
    })

    // Criar alguns movimentos de exemplo
    this.createSampleMovements()
  }

  private createSampleMovements() {
    const movements = [
      {
        itemId: 'item-1',
        type: 'out' as const,
        quantity: 2,
        reason: 'Uso em procedimento',
        description: 'Consulta de emergência - extração',
        patientId: 'patient-123'
      },
      {
        itemId: 'item-2',
        type: 'in' as const,
        quantity: 5,
        reason: 'Compra',
        description: 'Reposição mensal',
        supplierId: 'supplier-2',
        unitCost: 45.00,
        totalValue: 225.00
      },
      {
        itemId: 'item-3',
        type: 'out' as const,
        quantity: 8,
        reason: 'Uso diário',
        description: 'Atendimentos do dia'
      }
    ]

    movements.forEach((mov, index) => {
      const movement: StockMovement = {
        id: `mov-${index + 1}`,
        itemId: mov.itemId,
        type: mov.type,
        quantity: mov.quantity,
        reason: mov.reason,
        description: mov.description,
        supplierId: mov.supplierId,
        patientId: mov.patientId,
        unitCost: mov.unitCost,
        totalValue: mov.totalValue,
        createdAt: subDays(new Date(), Math.floor(Math.random() * 7)),
        createdBy: 'user-1'
      }

      this.movements.push(movement)
    })
  }

  // CRUD de Itens
  createItem(data: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt' | 'isLowStock'>): InventoryItem {
    const id = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const item: InventoryItem = {
      ...data,
      id,
      isLowStock: data.currentStock <= data.minimumStock,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.items.set(id, item)

    if (item.isLowStock) {
      this.createLowStockAlert(item)
    }

    return item
  }

  updateItem(id: string, updates: Partial<InventoryItem>): InventoryItem | null {
    const item = this.items.get(id)
    if (!item) return null

    const updatedItem = {
      ...item,
      ...updates,
      id, // Manter ID original
      updatedAt: new Date()
    }

    // Recalcular status de estoque baixo
    updatedItem.isLowStock = updatedItem.currentStock <= updatedItem.minimumStock

    this.items.set(id, updatedItem)

    // Gerenciar alertas
    if (updatedItem.isLowStock && !item.isLowStock) {
      this.createLowStockAlert(updatedItem)
    } else if (!updatedItem.isLowStock && item.isLowStock) {
      this.removeLowStockAlert(id)
    }

    return updatedItem
  }

  deleteItem(id: string): boolean {
    const deleted = this.items.delete(id)
    if (deleted) {
      this.removeLowStockAlert(id)
    }
    return deleted
  }

  getItem(id: string): InventoryItem | null {
    return this.items.get(id) || null
  }

  getAllItems(filters?: {
    category?: string
    supplier?: string
    status?: string
    lowStock?: boolean
    search?: string
  }): InventoryItem[] {
    let items = Array.from(this.items.values())

    if (filters) {
      if (filters.category) {
        items = items.filter(item => item.category.id === filters.category)
      }

      if (filters.supplier) {
        items = items.filter(item => item.supplier.id === filters.supplier)
      }

      if (filters.status) {
        items = items.filter(item => item.status === filters.status)
      }

      if (filters.lowStock) {
        items = items.filter(item => item.isLowStock)
      }

      if (filters.search) {
        const search = filters.search.toLowerCase()
        items = items.filter(item => 
          item.name.toLowerCase().includes(search) ||
          item.description?.toLowerCase().includes(search) ||
          item.category.name.toLowerCase().includes(search)
        )
      }
    }

    return items.sort((a, b) => a.name.localeCompare(b.name))
  }

  // Movimentação de Estoque
  addStockMovement(data: Omit<StockMovement, 'id' | 'createdAt'>): StockMovement | null {
    const item = this.items.get(data.itemId)
    if (!item) return null

    const movement: StockMovement = {
      ...data,
      id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    }

    // Atualizar estoque do item
    let newStock = item.currentStock
    if (movement.type === 'in') {
      newStock += movement.quantity
    } else if (movement.type === 'out') {
      newStock -= movement.quantity
    } else if (movement.type === 'adjustment') {
      newStock = movement.quantity
    }

    // Não permitir estoque negativo
    if (newStock < 0) {
      throw new Error('Estoque insuficiente para esta movimentação')
    }

    this.updateItem(data.itemId, { currentStock: newStock })
    this.movements.push(movement)

    return movement
  }

  getStockMovements(itemId?: string, limit = 50): StockMovement[] {
    let movements = [...this.movements]

    if (itemId) {
      movements = movements.filter(mov => mov.itemId === itemId)
    }

    return movements
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit)
  }

  // Alertas de Estoque Baixo
  private createLowStockAlert(item: InventoryItem): void {
    // Verificar se já existe alerta para este item
    const existingAlert = this.alerts.find(alert => alert.itemId === item.id && !alert.isRead)
    if (existingAlert) return

    const severity: 'warning' | 'critical' = item.currentStock === 0 ? 'critical' : 'warning'

    const alert: LowStockAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      itemId: item.id,
      itemName: item.name,
      currentStock: item.currentStock,
      minimumStock: item.minimumStock,
      category: item.category.name,
      severity,
      createdAt: new Date(),
      isRead: false
    }

    this.alerts.push(alert)
  }

  private removeLowStockAlert(itemId: string): void {
    this.alerts = this.alerts.filter(alert => alert.itemId !== itemId || alert.isRead)
  }

  getLowStockAlerts(includeRead = false): LowStockAlert[] {
    let alerts = [...this.alerts]
    
    if (!includeRead) {
      alerts = alerts.filter(alert => !alert.isRead)
    }

    return alerts.sort((a, b) => {
      // Ordenar por severidade (crítico primeiro) e depois por data
      if (a.severity !== b.severity) {
        return a.severity === 'critical' ? -1 : 1
      }
      return b.createdAt.getTime() - a.createdAt.getTime()
    })
  }

  markAlertAsRead(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId)
    if (!alert) return false

    alert.isRead = true
    return true
  }

  // Relatórios e Estatísticas
  getInventoryStats(): InventoryStats {
    const items = this.getAllItems()
    const movements = this.getStockMovements()
    
    const totalValue = items.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0)
    const lowStockItems = items.filter(item => item.isLowStock).length
    const criticalItems = items.filter(item => item.currentStock === 0).length
    
    const today = new Date()
    const todayMovements = movements.filter(mov => 
      format(mov.createdAt, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
    ).length

    return {
      totalItems: items.length,
      totalValue,
      lowStockItems,
      criticalItems,
      categoriesCount: this.categories.size,
      suppliersCount: this.suppliers.size,
      movementsToday: todayMovements,
      averageRotation: this.calculateAverageRotation()
    }
  }

  private calculateAverageRotation(): number {
    // Cálculo simplificado da rotação média
    const items = this.getAllItems()
    const last30DaysMovements = this.movements.filter(mov => 
      mov.createdAt >= subDays(new Date(), 30)
    )

    if (items.length === 0) return 0

    const totalMovements = last30DaysMovements.reduce((sum, mov) => sum + mov.quantity, 0)
    return totalMovements / items.length / 30 // Média diária por item
  }

  getUsageReport(days = 30): UsageReport[] {
    const cutoffDate = subDays(new Date(), days)
    const recentMovements = this.movements.filter(mov => 
      mov.createdAt >= cutoffDate && mov.type === 'out'
    )

    const usageByItem = new Map<string, number>()
    const lastMovementByItem = new Map<string, Date>()

    recentMovements.forEach(mov => {
      const currentUsage = usageByItem.get(mov.itemId) || 0
      usageByItem.set(mov.itemId, currentUsage + mov.quantity)

      const lastMovement = lastMovementByItem.get(mov.itemId)
      if (!lastMovement || mov.createdAt > lastMovement) {
        lastMovementByItem.set(mov.itemId, mov.createdAt)
      }
    })

    const reports: UsageReport[] = []

    this.getAllItems().forEach(item => {
      const totalUsed = usageByItem.get(item.id) || 0
      const averageDaily = totalUsed / days
      const projectedDays = averageDaily > 0 ? item.currentStock / averageDaily : 9999
      const lastMovement = lastMovementByItem.get(item.id) || new Date(0)

      reports.push({
        itemId: item.id,
        itemName: item.name,
        category: item.category.name,
        totalUsed,
        averageDaily,
        projectedDays: Math.round(projectedDays),
        lastMovement
      })
    })

    return reports.sort((a, b) => a.projectedDays - b.projectedDays)
  }

  // Categorias
  getAllCategories(): InventoryCategory[] {
    return Array.from(this.categories.values()).sort((a, b) => a.name.localeCompare(b.name))
  }

  createCategory(data: Omit<InventoryCategory, 'id'>): InventoryCategory {
    const id = `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const category: InventoryCategory = { ...data, id }
    
    this.categories.set(id, category)
    return category
  }

  // Fornecedores
  getAllSuppliers(): Supplier[] {
    return Array.from(this.suppliers.values()).sort((a, b) => a.name.localeCompare(b.name))
  }

  createSupplier(data: Omit<Supplier, 'id'>): Supplier {
    const id = `sup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const supplier: Supplier = { ...data, id }
    
    this.suppliers.set(id, supplier)
    return supplier
  }

  updateSupplier(id: string, updates: Partial<Supplier>): Supplier | null {
    const supplier = this.suppliers.get(id)
    if (!supplier) return null

    const updatedSupplier = { ...supplier, ...updates, id }
    this.suppliers.set(id, updatedSupplier)
    
    return updatedSupplier
  }

  // Utilitários
  exportData(): {
    items: InventoryItem[]
    movements: StockMovement[]
    categories: InventoryCategory[]
    suppliers: Supplier[]
    alerts: LowStockAlert[]
  } {
    return {
      items: this.getAllItems(),
      movements: this.getStockMovements(),
      categories: this.getAllCategories(),
      suppliers: this.getAllSuppliers(),
      alerts: this.getLowStockAlerts(true)
    }
  }

  // Validações
  validateStockMovement(movement: Omit<StockMovement, 'id' | 'createdAt'>): string[] {
    const errors: string[] = []

    if (!movement.itemId) {
      errors.push('Item é obrigatório')
    } else {
      const item = this.items.get(movement.itemId)
      if (!item) {
        errors.push('Item não encontrado')
      } else if (movement.type === 'out' && movement.quantity > item.currentStock) {
        errors.push('Quantidade maior que estoque disponível')
      }
    }

    if (!movement.type) {
      errors.push('Tipo de movimentação é obrigatório')
    }

    if (!movement.quantity || movement.quantity <= 0) {
      errors.push('Quantidade deve ser maior que zero')
    }

    if (!movement.reason) {
      errors.push('Motivo da movimentação é obrigatório')
    }

    return errors
  }
}

// Instância singleton do serviço
export const inventoryService = new InventoryService()

// Helpers para formatação
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export const formatStock = (quantity: number, unit: string): string => {
  return `${quantity} ${unit}`
}

export const getStockStatusColor = (item: InventoryItem): string => {
  if (item.currentStock === 0) return 'text-red-600'
  if (item.isLowStock) return 'text-yellow-600'
  return 'text-green-600'
}

export const getStockStatusText = (item: InventoryItem): string => {
  if (item.currentStock === 0) return 'Esgotado'
  if (item.isLowStock) return 'Estoque Baixo'
  return 'Normal'
}

export const getCategoryIcon = (categoryId: string): string => {
  const icons: Record<string, string> = {
    anesthetics: '💉',
    restorative: '🦷',
    prophylaxis: '✨',
    endodontics: '🔧',
    periodontics: '🌱',
    surgery: '⚕️',
    prosthetics: '🔨',
    orthodontics: '📐',
    consumables: '🧤',
    equipment: '🔬'
  }
  return icons[categoryId] || '📦'
}