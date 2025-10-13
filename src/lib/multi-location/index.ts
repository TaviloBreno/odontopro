export interface Location {
  id: string
  name: string
  code: string
  address: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  contact: {
    phone: string
    email: string
    website?: string
  }
  settings: {
    timezone: string
    currency: string
    language: string
    businessHours: {
      [day: string]: {
        open: string
        close: string
        isOpen: boolean
      }
    }
  }
  capacity: {
    operatories: number
    waitingRoom: number
    maxDailyAppointments: number
  }
  services: string[]
  status: 'active' | 'inactive' | 'maintenance' | 'suspended'
  createdAt: Date
  updatedAt: Date
}

export interface LocationUser {
  id: string
  locationId: string
  userId: string
  role: 'admin' | 'manager' | 'doctor' | 'assistant' | 'receptionist'
  permissions: string[]
  startDate: Date
  endDate?: Date
  isActive: boolean
}

export interface LocationSync {
  id: string
  sourceLocationId: string
  targetLocationId: string
  dataType: 'patients' | 'appointments' | 'treatments' | 'inventory' | 'financial' | 'users'
  syncMode: 'realtime' | 'scheduled' | 'manual'
  lastSync: Date
  nextSync?: Date
  status: 'syncing' | 'completed' | 'failed' | 'pending'
  recordsSynced: number
  errors?: SyncError[]
}

export interface SyncError {
  id: string
  recordId: string
  errorType: 'validation' | 'conflict' | 'permission' | 'network'
  message: string
  timestamp: Date
  resolved: boolean
}

export interface LocationReport {
  id: string
  locationId: string
  reportType: 'performance' | 'financial' | 'operational' | 'compliance'
  period: {
    startDate: Date
    endDate: Date
  }
  metrics: {
    [key: string]: number | string | boolean
  }
  generatedAt: Date
  generatedBy: string
}

export interface ConsolidatedReport {
  id: string
  reportType: string
  locations: string[]
  period: {
    startDate: Date
    endDate: Date
  }
  consolidatedMetrics: {
    [key: string]: {
      total: number
      average: number
      locations: {
        [locationId: string]: number
      }
    }
  }
  generatedAt: Date
}

export interface LocationAnalytics {
  locationId: string
  period: {
    startDate: Date
    endDate: Date
  }
  performance: {
    totalPatients: number
    newPatients: number
    returningPatients: number
    totalAppointments: number
    completedAppointments: number
    cancelledAppointments: number
    averageWaitTime: number
    patientSatisfaction: number
    operatoryUtilization: number
  }
  financial: {
    totalRevenue: number
    totalExpenses: number
    netProfit: number
    averageTicket: number
    collectionRate: number
    outstandingPayments: number
  }
  operational: {
    staffUtilization: number
    equipmentUptime: number
    inventoryTurnover: number
    averageServiceTime: number
    emergencyTreatments: number
  }
  comparative: {
    previousPeriod: {
      [key: string]: number
    }
    benchmark: {
      [key: string]: number
    }
  }
}

export interface LocationInventory {
  locationId: string
  items: {
    [itemId: string]: {
      quantity: number
      minStock: number
      maxStock: number
      lastRestocked: Date
      autoReorder: boolean
      reorderPoint: number
      reorderQuantity: number
    }
  }
  transfers: LocationTransfer[]
  lastUpdated: Date
}

export interface LocationTransfer {
  id: string
  fromLocationId: string
  toLocationId: string
  items: {
    itemId: string
    quantity: number
    unitCost: number
  }[]
  status: 'pending' | 'in-transit' | 'completed' | 'cancelled'
  requestedBy: string
  approvedBy?: string
  requestedAt: Date
  completedAt?: Date
  trackingInfo?: {
    carrier: string
    trackingNumber: string
    estimatedDelivery: Date
  }
}

export interface MultiLocationService {
  // Gestão de localizações
  createLocation(location: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>): Promise<string>
  updateLocation(locationId: string, updates: Partial<Location>): Promise<void>
  deleteLocation(locationId: string): Promise<void>
  getLocation(locationId: string): Location | null
  getAllLocations(): Location[]
  getActiveLocations(): Location[]

  // Gestão de usuários por localização
  assignUserToLocation(userId: string, locationId: string, role: LocationUser['role'], permissions: string[]): Promise<void>
  removeUserFromLocation(userId: string, locationId: string): Promise<void>
  getUserLocations(userId: string): Location[]
  getLocationUsers(locationId: string): LocationUser[]
  updateUserLocationRole(userId: string, locationId: string, role: LocationUser['role'], permissions?: string[]): Promise<void>

  // Sincronização de dados
  configureSyncBetweenLocations(sourceId: string, targetId: string, dataTypes: LocationSync['dataType'][], syncMode: LocationSync['syncMode']): Promise<void>
  syncData(sourceId: string, targetId: string, dataType: LocationSync['dataType']): Promise<void>
  getSyncStatus(locationId?: string): LocationSync[]
  resolveSyncError(errorId: string, resolution: string): Promise<void>

  // Relatórios consolidados
  generateConsolidatedReport(reportType: string, locationIds: string[], startDate: Date, endDate: Date): Promise<string>
  getLocationReport(locationId: string, reportType: string, startDate: Date, endDate: Date): LocationReport | null
  getLocationAnalytics(locationId: string, startDate: Date, endDate: Date): LocationAnalytics
  compareLocations(locationIds: string[], metrics: string[], startDate: Date, endDate: Date): ConsolidatedReport

  // Gestão de inventário multi-localização
  getLocationInventory(locationId: string): LocationInventory
  transferInventoryBetweenLocations(fromLocationId: string, toLocationId: string, items: {itemId: string, quantity: number}[], requestedBy: string): Promise<string>
  approveInventoryTransfer(transferId: string, approvedBy: string): Promise<void>
  getInventoryTransfers(locationId?: string): LocationTransfer[]
  updateInventoryLevels(locationId: string, updates: {itemId: string, quantity: number, operation: 'add' | 'subtract' | 'set'}[]): Promise<void>

  // Analytics e insights
  getNetworkAnalytics(startDate: Date, endDate: Date): {
    totalLocations: number
    totalPatients: number
    totalRevenue: number
    averagePerformance: number
    topPerformingLocation: string
    lowPerformingLocation: string
    growthRate: number
    marketShare: number
  }
  getLocationBenchmarks(locationId: string): {
    [metric: string]: {
      value: number
      benchmark: number
      percentile: number
      trend: 'up' | 'down' | 'stable'
    }
  }
  predictLocationPerformance(locationId: string, months: number): {
    revenue: number[]
    patients: number[]
    utilization: number[]
    confidence: number
  }

  // Compliance e auditoria
  getMultiLocationComplianceReport(): {
    locationId: string
    complianceScore: number
    issues: string[]
    lastAudit: Date
  }[]
  synchronizeComplianceSettings(sourceLocationId: string, targetLocationIds: string[]): Promise<void>
}

class MultiLocationServiceImpl implements MultiLocationService {
  private locations: Map<string, Location> = new Map()
  private locationUsers: Map<string, LocationUser[]> = new Map()
  private syncConfigurations: Map<string, LocationSync[]> = new Map()
  private locationReports: Map<string, LocationReport[]> = new Map()
  private locationInventories: Map<string, LocationInventory> = new Map()
  private transfers: Map<string, LocationTransfer> = new Map()
  private analytics: Map<string, LocationAnalytics> = new Map()

  constructor() {
    this.initializeSampleData()
  }

  private initializeSampleData() {
    // Criar localizações de exemplo
    const mainClinic: Location = {
      id: 'loc-main',
      name: 'OdontoPRO - Matriz',
      code: 'MAIN',
      address: {
        street: 'Rua das Palmeiras',
        number: '123',
        complement: 'Edifício Comercial',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-000',
        country: 'Brasil'
      },
      contact: {
        phone: '(11) 3333-4444',
        email: 'matriz@odontopro.com.br',
        website: 'https://odontopro.com.br'
      },
      settings: {
        timezone: 'America/Sao_Paulo',
        currency: 'BRL',
        language: 'pt-BR',
        businessHours: {
          monday: { open: '08:00', close: '18:00', isOpen: true },
          tuesday: { open: '08:00', close: '18:00', isOpen: true },
          wednesday: { open: '08:00', close: '18:00', isOpen: true },
          thursday: { open: '08:00', close: '18:00', isOpen: true },
          friday: { open: '08:00', close: '17:00', isOpen: true },
          saturday: { open: '08:00', close: '12:00', isOpen: true },
          sunday: { open: '00:00', close: '00:00', isOpen: false }
        }
      },
      capacity: {
        operatories: 12,
        waitingRoom: 40,
        maxDailyAppointments: 120
      },
      services: [
        'Clínica Geral',
        'Ortodontia',
        'Implantodontia',
        'Endodontia',
        'Periodontia',
        'Cirurgia Oral',
        'Prótese',
        'Odontopediatria'
      ],
      status: 'active',
      createdAt: new Date('2020-01-15'),
      updatedAt: new Date()
    }

    const branchClinic: Location = {
      id: 'loc-branch1',
      name: 'OdontoPRO - Filial Shopping',
      code: 'SHOP',
      address: {
        street: 'Avenida Paulista',
        number: '2000',
        complement: 'Shopping Center - Piso 2',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-300',
        country: 'Brasil'
      },
      contact: {
        phone: '(11) 3333-5555',
        email: 'shopping@odontopro.com.br'
      },
      settings: {
        timezone: 'America/Sao_Paulo',
        currency: 'BRL',
        language: 'pt-BR',
        businessHours: {
          monday: { open: '10:00', close: '22:00', isOpen: true },
          tuesday: { open: '10:00', close: '22:00', isOpen: true },
          wednesday: { open: '10:00', close: '22:00', isOpen: true },
          thursday: { open: '10:00', close: '22:00', isOpen: true },
          friday: { open: '10:00', close: '22:00', isOpen: true },
          saturday: { open: '10:00', close: '22:00', isOpen: true },
          sunday: { open: '14:00', close: '20:00', isOpen: true }
        }
      },
      capacity: {
        operatories: 6,
        waitingRoom: 20,
        maxDailyAppointments: 60
      },
      services: [
        'Clínica Geral',
        'Ortodontia',
        'Implantodontia',
        'Prótese',
        'Odontopediatria'
      ],
      status: 'active',
      createdAt: new Date('2021-06-01'),
      updatedAt: new Date()
    }

    const suburbanClinic: Location = {
      id: 'loc-suburban',
      name: 'OdontoPRO - Zona Norte',
      code: 'ZN',
      address: {
        street: 'Rua das Flores',
        number: '456',
        neighborhood: 'Santana',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '02020-000',
        country: 'Brasil'
      },
      contact: {
        phone: '(11) 3333-6666',
        email: 'zonanorte@odontopro.com.br'
      },
      settings: {
        timezone: 'America/Sao_Paulo',
        currency: 'BRL',
        language: 'pt-BR',
        businessHours: {
          monday: { open: '07:00', close: '17:00', isOpen: true },
          tuesday: { open: '07:00', close: '17:00', isOpen: true },
          wednesday: { open: '07:00', close: '17:00', isOpen: true },
          thursday: { open: '07:00', close: '17:00', isOpen: true },
          friday: { open: '07:00', close: '16:00', isOpen: true },
          saturday: { open: '07:00', close: '12:00', isOpen: true },
          sunday: { open: '00:00', close: '00:00', isOpen: false }
        }
      },
      capacity: {
        operatories: 8,
        waitingRoom: 25,
        maxDailyAppointments: 80
      },
      services: [
        'Clínica Geral',
        'Orthodontia',
        'Endodontia',
        'Periodontia',
        'Odontopediatria'
      ],
      status: 'active',
      createdAt: new Date('2022-03-15'),
      updatedAt: new Date()
    }

    this.locations.set(mainClinic.id, mainClinic)
    this.locations.set(branchClinic.id, branchClinic)
    this.locations.set(suburbanClinic.id, suburbanClinic)

    // Inicializar dados de exemplo para analytics
    this.initializeAnalytics()
    this.initializeInventories()
    this.initializeSyncConfigurations()
  }

  private initializeAnalytics() {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Analytics para matriz
    this.analytics.set('loc-main', {
      locationId: 'loc-main',
      period: {
        startDate: startOfMonth,
        endDate: now
      },
      performance: {
        totalPatients: 1250,
        newPatients: 180,
        returningPatients: 1070,
        totalAppointments: 1420,
        completedAppointments: 1350,
        cancelledAppointments: 70,
        averageWaitTime: 12,
        patientSatisfaction: 4.8,
        operatoryUtilization: 85
      },
      financial: {
        totalRevenue: 485000,
        totalExpenses: 220000,
        netProfit: 265000,
        averageTicket: 380,
        collectionRate: 92,
        outstandingPayments: 38000
      },
      operational: {
        staffUtilization: 88,
        equipmentUptime: 96,
        inventoryTurnover: 3.2,
        averageServiceTime: 45,
        emergencyTreatments: 23
      },
      comparative: {
        previousPeriod: {
          totalPatients: 1180,
          totalRevenue: 452000,
          netProfit: 248000
        },
        benchmark: {
          patientSatisfaction: 4.6,
          operatoryUtilization: 80,
          collectionRate: 89
        }
      }
    })

    // Analytics para filial shopping
    this.analytics.set('loc-branch1', {
      locationId: 'loc-branch1',
      period: {
        startDate: startOfMonth,
        endDate: now
      },
      performance: {
        totalPatients: 680,
        newPatients: 120,
        returningPatients: 560,
        totalAppointments: 720,
        completedAppointments: 690,
        cancelledAppointments: 30,
        averageWaitTime: 8,
        patientSatisfaction: 4.7,
        operatoryUtilization: 78
      },
      financial: {
        totalRevenue: 295000,
        totalExpenses: 145000,
        netProfit: 150000,
        averageTicket: 420,
        collectionRate: 94,
        outstandingPayments: 18000
      },
      operational: {
        staffUtilization: 82,
        equipmentUptime: 98,
        inventoryTurnover: 2.8,
        averageServiceTime: 42,
        emergencyTreatments: 8
      },
      comparative: {
        previousPeriod: {
          totalPatients: 640,
          totalRevenue: 278000,
          netProfit: 138000
        },
        benchmark: {
          patientSatisfaction: 4.6,
          operatoryUtilization: 80,
          collectionRate: 89
        }
      }
    })

    // Analytics para zona norte
    this.analytics.set('loc-suburban', {
      locationId: 'loc-suburban',
      period: {
        startDate: startOfMonth,
        endDate: now
      },
      performance: {
        totalPatients: 890,
        newPatients: 95,
        returningPatients: 795,
        totalAppointments: 950,
        completedAppointments: 920,
        cancelledAppointments: 30,
        averageWaitTime: 15,
        patientSatisfaction: 4.6,
        operatoryUtilization: 82
      },
      financial: {
        totalRevenue: 320000,
        totalExpenses: 165000,
        netProfit: 155000,
        averageTicket: 340,
        collectionRate: 88,
        outstandingPayments: 28000
      },
      operational: {
        staffUtilization: 85,
        equipmentUptime: 94,
        inventoryTurnover: 3.0,
        averageServiceTime: 48,
        emergencyTreatments: 15
      },
      comparative: {
        previousPeriod: {
          totalPatients: 820,
          totalRevenue: 295000,
          netProfit: 142000
        },
        benchmark: {
          patientSatisfaction: 4.6,
          operatoryUtilization: 80,
          collectionRate: 89
        }
      }
    })
  }

  private initializeInventories() {
    // Inventário matriz
    this.locationInventories.set('loc-main', {
      locationId: 'loc-main',
      items: {
        'item-anesthesia': {
          quantity: 500,
          minStock: 100,
          maxStock: 800,
          lastRestocked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          autoReorder: true,
          reorderPoint: 150,
          reorderQuantity: 300
        },
        'item-gloves': {
          quantity: 2000,
          minStock: 500,
          maxStock: 3000,
          lastRestocked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          autoReorder: true,
          reorderPoint: 600,
          reorderQuantity: 1000
        },
        'item-composite': {
          quantity: 45,
          minStock: 10,
          maxStock: 80,
          lastRestocked: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          autoReorder: true,
          reorderPoint: 15,
          reorderQuantity: 30
        }
      },
      transfers: [],
      lastUpdated: new Date()
    })

    // Inventário filial shopping
    this.locationInventories.set('loc-branch1', {
      locationId: 'loc-branch1',
      items: {
        'item-anesthesia': {
          quantity: 80,
          minStock: 50,
          maxStock: 200,
          lastRestocked: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
          autoReorder: true,
          reorderPoint: 70,
          reorderQuantity: 120
        },
        'item-gloves': {
          quantity: 800,
          minStock: 200,
          maxStock: 1200,
          lastRestocked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          autoReorder: true,
          reorderPoint: 250,
          reorderQuantity: 400
        }
      },
      transfers: [],
      lastUpdated: new Date()
    })

    // Inventário zona norte
    this.locationInventories.set('loc-suburban', {
      locationId: 'loc-suburban',
      items: {
        'item-anesthesia': {
          quantity: 35,
          minStock: 40,
          maxStock: 150,
          lastRestocked: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
          autoReorder: true,
          reorderPoint: 50,
          reorderQuantity: 100
        },
        'item-gloves': {
          quantity: 600,
          minStock: 150,
          maxStock: 1000,
          lastRestocked: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          autoReorder: true,
          reorderPoint: 200,
          reorderQuantity: 350
        },
        'item-composite': {
          quantity: 8,
          minStock: 10,
          maxStock: 40,
          lastRestocked: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          autoReorder: false,
          reorderPoint: 12,
          reorderQuantity: 20
        }
      },
      transfers: [],
      lastUpdated: new Date()
    })
  }

  private initializeSyncConfigurations() {
    const locations = Array.from(this.locations.keys())
    
    locations.forEach(locationId => {
      const syncs: LocationSync[] = []
      
      // Configurar sincronização bidirecional entre todas as localizações
      locations.forEach(targetId => {
        if (targetId !== locationId) {
          syncs.push({
            id: `sync-${locationId}-${targetId}-patients`,
            sourceLocationId: locationId,
            targetLocationId: targetId,
            dataType: 'patients',
            syncMode: 'realtime',
            lastSync: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
            status: 'completed',
            recordsSynced: Math.floor(Math.random() * 100 + 50)
          })
        }
      })
      
      this.syncConfigurations.set(locationId, syncs)
    })
  }

  // Implementação dos métodos da interface
  async createLocation(location: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = `loc-${Date.now()}`
    const newLocation: Location = {
      ...location,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    this.locations.set(id, newLocation)
    this.locationUsers.set(id, [])
    this.syncConfigurations.set(id, [])
    
    return id
  }

  async updateLocation(locationId: string, updates: Partial<Location>): Promise<void> {
    const location = this.locations.get(locationId)
    if (!location) {
      throw new Error('Location not found')
    }

    const updatedLocation = {
      ...location,
      ...updates,
      updatedAt: new Date()
    }
    
    this.locations.set(locationId, updatedLocation)
  }

  async deleteLocation(locationId: string): Promise<void> {
    this.locations.delete(locationId)
    this.locationUsers.delete(locationId)
    this.syncConfigurations.delete(locationId)
    this.locationInventories.delete(locationId)
    this.analytics.delete(locationId)
  }

  getLocation(locationId: string): Location | null {
    return this.locations.get(locationId) || null
  }

  getAllLocations(): Location[] {
    return Array.from(this.locations.values())
  }

  getActiveLocations(): Location[] {
    return Array.from(this.locations.values()).filter(loc => loc.status === 'active')
  }

  async assignUserToLocation(userId: string, locationId: string, role: LocationUser['role'], permissions: string[]): Promise<void> {
    const users = this.locationUsers.get(locationId) || []
    
    const existingUser = users.find(u => u.userId === userId)
    if (existingUser) {
      existingUser.role = role
      existingUser.permissions = permissions
      existingUser.isActive = true
    } else {
      users.push({
        id: `lu-${Date.now()}`,
        locationId,
        userId,
        role,
        permissions,
        startDate: new Date(),
        isActive: true
      })
    }
    
    this.locationUsers.set(locationId, users)
  }

  async removeUserFromLocation(userId: string, locationId: string): Promise<void> {
    const users = this.locationUsers.get(locationId) || []
    const filteredUsers = users.filter(u => u.userId !== userId)
    this.locationUsers.set(locationId, filteredUsers)
  }

  getUserLocations(userId: string): Location[] {
    const userLocations: Location[] = []
    
    for (const [locationId, users] of this.locationUsers.entries()) {
      if (users.some(u => u.userId === userId && u.isActive)) {
        const location = this.locations.get(locationId)
        if (location) {
          userLocations.push(location)
        }
      }
    }
    
    return userLocations
  }

  getLocationUsers(locationId: string): LocationUser[] {
    return this.locationUsers.get(locationId) || []
  }

  async updateUserLocationRole(userId: string, locationId: string, role: LocationUser['role'], permissions?: string[]): Promise<void> {
    const users = this.locationUsers.get(locationId) || []
    const user = users.find(u => u.userId === userId)
    
    if (user) {
      user.role = role
      if (permissions) {
        user.permissions = permissions
      }
    }
  }

  async configureSyncBetweenLocations(sourceId: string, targetId: string, dataTypes: LocationSync['dataType'][], syncMode: LocationSync['syncMode']): Promise<void> {
    const syncs = this.syncConfigurations.get(sourceId) || []
    
    dataTypes.forEach(dataType => {
      const existingSync = syncs.find(s => s.targetLocationId === targetId && s.dataType === dataType)
      
      if (existingSync) {
        existingSync.syncMode = syncMode
      } else {
        syncs.push({
          id: `sync-${sourceId}-${targetId}-${dataType}`,
          sourceLocationId: sourceId,
          targetLocationId: targetId,
          dataType,
          syncMode,
          lastSync: new Date(),
          status: 'pending',
          recordsSynced: 0
        })
      }
    })
    
    this.syncConfigurations.set(sourceId, syncs)
  }

  async syncData(sourceId: string, targetId: string, dataType: LocationSync['dataType']): Promise<void> {
    const syncs = this.syncConfigurations.get(sourceId) || []
    const sync = syncs.find(s => s.targetLocationId === targetId && s.dataType === dataType)
    
    if (sync) {
      sync.status = 'syncing'
      
      // Simular sincronização
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      sync.status = 'completed'
      sync.lastSync = new Date()
      sync.recordsSynced += Math.floor(Math.random() * 50 + 10)
    }
  }

  getSyncStatus(locationId?: string): LocationSync[] {
    if (locationId) {
      return this.syncConfigurations.get(locationId) || []
    }
    
    const allSyncs: LocationSync[] = []
    for (const syncs of this.syncConfigurations.values()) {
      allSyncs.push(...syncs)
    }
    return allSyncs
  }

  async resolveSyncError(errorId: string, resolution: string): Promise<void> {
    // Implementação para resolver erros de sincronização
    console.log(`Resolving sync error ${errorId} with resolution: ${resolution}`)
  }

  async generateConsolidatedReport(reportType: string, locationIds: string[], startDate: Date, endDate: Date): Promise<string> {
    const reportId = `report-${Date.now()}`
    
    const consolidatedMetrics: ConsolidatedReport['consolidatedMetrics'] = {}
    
    locationIds.forEach(locationId => {
      const analytics = this.analytics.get(locationId)
      if (analytics) {
        Object.entries(analytics.performance).forEach(([key, value]) => {
          if (typeof value === 'number') {
            if (!consolidatedMetrics[key]) {
              consolidatedMetrics[key] = {
                total: 0,
                average: 0,
                locations: {}
              }
            }
            consolidatedMetrics[key].total += value
            consolidatedMetrics[key].locations[locationId] = value
          }
        })
      }
    })
    
    // Calcular médias
    Object.keys(consolidatedMetrics).forEach(key => {
      consolidatedMetrics[key].average = consolidatedMetrics[key].total / locationIds.length
    })
    
    return reportId
  }

  getLocationReport(locationId: string, reportType: string, startDate: Date, endDate: Date): LocationReport | null {
    const analytics = this.analytics.get(locationId)
    if (!analytics) return null
    
    return {
      id: `report-${locationId}-${Date.now()}`,
      locationId,
      reportType: reportType as LocationReport['reportType'],
      period: { startDate, endDate },
      metrics: {
        ...analytics.performance,
        ...analytics.financial,
        ...analytics.operational
      },
      generatedAt: new Date(),
      generatedBy: 'system'
    }
  }

  getLocationAnalytics(locationId: string, startDate: Date, endDate: Date): LocationAnalytics {
    const analytics = this.analytics.get(locationId)
    if (!analytics) {
      throw new Error('Analytics not found for location')
    }
    
    return {
      ...analytics,
      period: { startDate, endDate }
    }
  }

  compareLocations(locationIds: string[], metrics: string[], startDate: Date, endDate: Date): ConsolidatedReport {
    const consolidatedMetrics: ConsolidatedReport['consolidatedMetrics'] = {}
    
    locationIds.forEach(locationId => {
      const analytics = this.analytics.get(locationId)
      if (analytics) {
        metrics.forEach(metric => {
          const value = (analytics.performance as any)[metric] || 
                       (analytics.financial as any)[metric] || 
                       (analytics.operational as any)[metric] || 0
          
          if (!consolidatedMetrics[metric]) {
            consolidatedMetrics[metric] = {
              total: 0,
              average: 0,
              locations: {}
            }
          }
          
          consolidatedMetrics[metric].total += value
          consolidatedMetrics[metric].locations[locationId] = value
        })
      }
    })
    
    // Calcular médias
    Object.keys(consolidatedMetrics).forEach(key => {
      consolidatedMetrics[key].average = consolidatedMetrics[key].total / locationIds.length
    })
    
    return {
      id: `comparison-${Date.now()}`,
      reportType: 'comparison',
      locations: locationIds,
      period: { startDate, endDate },
      consolidatedMetrics,
      generatedAt: new Date()
    }
  }

  getLocationInventory(locationId: string): LocationInventory {
    const inventory = this.locationInventories.get(locationId)
    if (!inventory) {
      throw new Error('Inventory not found for location')
    }
    return inventory
  }

  async transferInventoryBetweenLocations(fromLocationId: string, toLocationId: string, items: {itemId: string, quantity: number}[], requestedBy: string): Promise<string> {
    const transferId = `transfer-${Date.now()}`
    
    const transfer: LocationTransfer = {
      id: transferId,
      fromLocationId,
      toLocationId,
      items: items.map(item => ({
        itemId: item.itemId,
        quantity: item.quantity,
        unitCost: 25 // Valor exemplo
      })),
      status: 'pending',
      requestedBy,
      requestedAt: new Date()
    }
    
    this.transfers.set(transferId, transfer)
    return transferId
  }

  async approveInventoryTransfer(transferId: string, approvedBy: string): Promise<void> {
    const transfer = this.transfers.get(transferId)
    if (!transfer) {
      throw new Error('Transfer not found')
    }
    
    transfer.status = 'in-transit'
    transfer.approvedBy = approvedBy
    
    // Atualizar inventários
    const fromInventory = this.locationInventories.get(transfer.fromLocationId)
    const toInventory = this.locationInventories.get(transfer.toLocationId)
    
    if (fromInventory && toInventory) {
      transfer.items.forEach(item => {
        if (fromInventory.items[item.itemId]) {
          fromInventory.items[item.itemId].quantity -= item.quantity
        }
        
        if (!toInventory.items[item.itemId]) {
          toInventory.items[item.itemId] = {
            quantity: 0,
            minStock: 10,
            maxStock: 100,
            lastRestocked: new Date(),
            autoReorder: false,
            reorderPoint: 15,
            reorderQuantity: 50
          }
        }
        toInventory.items[item.itemId].quantity += item.quantity
      })
    }
    
    // Simular tempo de entrega
    setTimeout(() => {
      transfer.status = 'completed'
      transfer.completedAt = new Date()
    }, 5000)
  }

  getInventoryTransfers(locationId?: string): LocationTransfer[] {
    const allTransfers = Array.from(this.transfers.values())
    
    if (locationId) {
      return allTransfers.filter(t => 
        t.fromLocationId === locationId || t.toLocationId === locationId
      )
    }
    
    return allTransfers
  }

  async updateInventoryLevels(locationId: string, updates: {itemId: string, quantity: number, operation: 'add' | 'subtract' | 'set'}[]): Promise<void> {
    const inventory = this.locationInventories.get(locationId)
    if (!inventory) {
      throw new Error('Inventory not found for location')
    }
    
    updates.forEach(update => {
      if (!inventory.items[update.itemId]) {
        inventory.items[update.itemId] = {
          quantity: 0,
          minStock: 10,
          maxStock: 100,
          lastRestocked: new Date(),
          autoReorder: false,
          reorderPoint: 15,
          reorderQuantity: 50
        }
      }
      
      const item = inventory.items[update.itemId]
      
      switch (update.operation) {
        case 'add':
          item.quantity += update.quantity
          break
        case 'subtract':
          item.quantity = Math.max(0, item.quantity - update.quantity)
          break
        case 'set':
          item.quantity = update.quantity
          break
      }
    })
    
    inventory.lastUpdated = new Date()
  }

  getNetworkAnalytics(startDate: Date, endDate: Date) {
    const allAnalytics = Array.from(this.analytics.values())
    
    const totalRevenue = allAnalytics.reduce((sum, a) => sum + a.financial.totalRevenue, 0)
    const totalPatients = allAnalytics.reduce((sum, a) => sum + a.performance.totalPatients, 0)
    const averagePerformance = allAnalytics.reduce((sum, a) => sum + a.performance.patientSatisfaction, 0) / allAnalytics.length
    
    // Encontrar localização com melhor e pior desempenho
    const sortedByRevenue = allAnalytics.sort((a, b) => b.financial.totalRevenue - a.financial.totalRevenue)
    
    return {
      totalLocations: this.locations.size,
      totalPatients,
      totalRevenue,
      averagePerformance,
      topPerformingLocation: sortedByRevenue[0]?.locationId || '',
      lowPerformingLocation: sortedByRevenue[sortedByRevenue.length - 1]?.locationId || '',
      growthRate: 15.2, // Valor exemplo
      marketShare: 8.5 // Valor exemplo
    }
  }

  getLocationBenchmarks(locationId: string) {
    const analytics = this.analytics.get(locationId)
    if (!analytics) {
      throw new Error('Analytics not found for location')
    }
    
    return {
      patientSatisfaction: {
        value: analytics.performance.patientSatisfaction,
        benchmark: analytics.comparative.benchmark.patientSatisfaction,
        percentile: 85,
        trend: 'up' as const
      },
      operatoryUtilization: {
        value: analytics.performance.operatoryUtilization,
        benchmark: analytics.comparative.benchmark.operatoryUtilization,
        percentile: 78,
        trend: 'stable' as const
      },
      collectionRate: {
        value: analytics.financial.collectionRate,
        benchmark: analytics.comparative.benchmark.collectionRate,
        percentile: 92,
        trend: 'up' as const
      }
    }
  }

  predictLocationPerformance(locationId: string, months: number) {
    const analytics = this.analytics.get(locationId)
    if (!analytics) {
      throw new Error('Analytics not found for location')
    }
    
    // Gerar previsões baseadas em tendências históricas
    const baseRevenue = analytics.financial.totalRevenue
    const basePatients = analytics.performance.totalPatients
    const baseUtilization = analytics.performance.operatoryUtilization
    
    const revenue: number[] = []
    const patients: number[] = []
    const utilization: number[] = []
    
    for (let i = 1; i <= months; i++) {
      const growthFactor = 1 + (0.05 * i) // 5% de crescimento por mês
      revenue.push(baseRevenue * growthFactor)
      patients.push(basePatients * growthFactor)
      utilization.push(Math.min(100, baseUtilization * growthFactor))
    }
    
    return {
      revenue,
      patients,
      utilization,
      confidence: 0.78
    }
  }

  getMultiLocationComplianceReport() {
    return Array.from(this.locations.values()).map(location => ({
      locationId: location.id,
      complianceScore: Math.random() * 20 + 80, // 80-100%
      issues: Math.random() > 0.7 ? ['Documentação pendente', 'Treinamento em atraso'] : [],
      lastAudit: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
    }))
  }

  async synchronizeComplianceSettings(sourceLocationId: string, targetLocationIds: string[]): Promise<void> {
    const sourceLocation = this.locations.get(sourceLocationId)
    if (!sourceLocation) {
      throw new Error('Source location not found')
    }
    
    for (const targetId of targetLocationIds) {
      const targetLocation = this.locations.get(targetId)
      if (targetLocation) {
        // Sincronizar configurações de compliance
        targetLocation.settings = { ...sourceLocation.settings }
        targetLocation.updatedAt = new Date()
        this.locations.set(targetId, targetLocation)
      }
    }
  }
}

// Singleton instance
export const multiLocationService = new MultiLocationServiceImpl()