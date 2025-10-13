import { format, subDays, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface BackupFile {
  id: string
  name: string
  type: 'full' | 'incremental' | 'selective'
  size: number // bytes
  
  // Conteúdo do backup
  data: {
    patients: any[]
    appointments: any[]
    treatments: any[]
    financial: any[]
    inventory?: any[]
    settings: any
    branding?: any
    customPages?: any[]
  }
  
  // Metadata
  createdAt: Date
  createdBy: string
  
  // Status
  status: 'completed' | 'failed' | 'in-progress'
  compression: number // percentual de compressão
  
  // Integridade
  checksum: string
  isCorrupted: boolean
  
  // Configurações
  isAutomatic: boolean
  retentionDays?: number
}

export interface BackupSchedule {
  id: string
  name: string
  frequency: 'daily' | 'weekly' | 'monthly'
  time: string // HH:mm format
  dayOfWeek?: number // 0-6, only for weekly
  dayOfMonth?: number // 1-31, only for monthly
  
  // Configurações do backup
  type: BackupFile['type']
  includeFiles: boolean
  compression: boolean
  encryption: boolean
  
  // Retenção
  retentionDays: number
  maxBackups: number
  
  // Status
  isActive: boolean
  lastRun?: Date
  nextRun?: Date
  
  // Notificações
  emailNotifications: boolean
  notifyOnError: boolean
  notificationEmail?: string
  
  createdAt: Date
  updatedAt: Date
}

export interface BackupRestore {
  id: string
  backupId: string
  backupName: string
  
  // Configurações da restauração
  restoreType: 'full' | 'selective'
  selectedTables?: string[]
  overwriteExisting: boolean
  createBackupBeforeRestore: boolean
  
  // Status
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
  progress: number // 0-100
  
  // Logs
  startedAt: Date
  completedAt?: Date
  error?: string
  logs: string[]
  
  // Metadata
  createdBy: string
  createdAt: Date
}

export interface BackupStats {
  totalBackups: number
  totalSize: number
  lastBackup?: Date
  nextScheduledBackup?: Date
  
  // Por período
  backupsThisMonth: number
  backupsThisYear: number
  
  // Status
  successRate: number
  averageSize: number
  averageCompressionRatio: number
  
  // Alertas
  failedBackups: number
  corruptedBackups: number
  oldestBackup?: Date
}

// Service principal para backup
export class BackupService {
  private backups: Map<string, BackupFile> = new Map()
  private schedules: Map<string, BackupSchedule> = new Map()
  private restores: BackupRestore[] = []

  constructor() {
    this.initializeSampleData()
  }

  // Inicializar dados de exemplo
  private initializeSampleData() {
    // Criar alguns backups de exemplo
    this.createSampleBackups()
    
    // Criar schedule padrão
    this.createSchedule({
      name: 'Backup Diário Automático',
      frequency: 'daily',
      time: '02:00',
      type: 'incremental',
      includeFiles: true,
      compression: true,
      encryption: true,
      retentionDays: 30,
      maxBackups: 30,
      isActive: true,
      emailNotifications: true,
      notifyOnError: true
    })
  }

  private createSampleBackups() {
    const sampleData = {
      patients: Array.from({length: 50}, (_, i) => ({ id: i + 1, name: `Paciente ${i + 1}` })),
      appointments: Array.from({length: 200}, (_, i) => ({ id: i + 1, patientId: Math.floor(Math.random() * 50) + 1 })),
      treatments: Array.from({length: 100}, (_, i) => ({ id: i + 1, name: `Tratamento ${i + 1}` })),
      financial: Array.from({length: 150}, (_, i) => ({ id: i + 1, amount: Math.random() * 1000 })),
      settings: { clinicName: 'Clínica Exemplo', theme: 'modern' }
    }

    const backups = [
      {
        name: 'backup-completo-2024-01-15',
        type: 'full' as const,
        size: 15680000, // ~15MB
        createdAt: subDays(new Date(), 1),
        compression: 65
      },
      {
        name: 'backup-incremental-2024-01-14',
        type: 'incremental' as const,
        size: 2340000, // ~2.3MB
        createdAt: subDays(new Date(), 2),
        compression: 72
      },
      {
        name: 'backup-semanal-2024-01-08',
        type: 'full' as const,
        size: 14890000, // ~14.8MB
        createdAt: subDays(new Date(), 8),
        compression: 68
      }
    ]

    backups.forEach((backup, index) => {
      const id = `backup-${index + 1}`
      const backupFile: BackupFile = {
        id,
        name: backup.name,
        type: backup.type,
        size: backup.size,
        data: sampleData,
        createdAt: backup.createdAt,
        createdBy: 'system',
        status: 'completed',
        compression: backup.compression,
        checksum: this.generateChecksum(backup.name),
        isCorrupted: false,
        isAutomatic: true,
        retentionDays: 30
      }

      this.backups.set(id, backupFile)
    })
  }

  // CRUD para Backups
  createBackup(data: {
    name?: string
    type: BackupFile['type']
    includeInventory?: boolean
    includeBranding?: boolean
    createdBy: string
  }): BackupFile {
    const id = `backup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const name = data.name || `backup-${format(new Date(), 'yyyy-MM-dd-HHmm')}`

    // Simular coleta de dados
    const backupData = this.collectBackupData(data.type, {
      includeInventory: data.includeInventory,
      includeBranding: data.includeBranding
    })

    const backup: BackupFile = {
      id,
      name,
      type: data.type,
      size: this.calculateBackupSize(backupData),
      data: backupData,
      createdAt: new Date(),
      createdBy: data.createdBy,
      status: 'completed',
      compression: Math.floor(Math.random() * 30) + 60, // 60-90%
      checksum: this.generateChecksum(name),
      isCorrupted: false,
      isAutomatic: false,
      retentionDays: 30
    }

    this.backups.set(id, backup)
    return backup
  }

  private collectBackupData(type: BackupFile['type'], options: {
    includeInventory?: boolean
    includeBranding?: boolean
  }): BackupFile['data'] {
    // Simular coleta de dados do sistema
    const baseData: BackupFile['data'] = {
      patients: Array.from({length: 50}, (_, i) => ({ id: i + 1, name: `Paciente ${i + 1}` })),
      appointments: Array.from({length: 200}, (_, i) => ({ id: i + 1, patientId: Math.floor(Math.random() * 50) + 1 })),
      treatments: Array.from({length: 100}, (_, i) => ({ id: i + 1, name: `Tratamento ${i + 1}` })),
      financial: Array.from({length: 150}, (_, i) => ({ id: i + 1, amount: Math.random() * 1000 })),
      settings: { clinicName: 'Clínica Exemplo', theme: 'modern' }
    }

    if (options.includeInventory) {
      baseData.inventory = Array.from({length: 30}, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }))
    }

    if (options.includeBranding) {
      baseData.branding = { colors: { primary: '#059669' }, layout: 'modern' }
      baseData.customPages = [{ id: 1, title: 'Sobre', content: 'Sobre a clínica' }]
    }

    return baseData
  }

  private calculateBackupSize(data: BackupFile['data']): number {
    // Simular cálculo de tamanho baseado no conteúdo
    const baseSize = JSON.stringify(data).length
    return baseSize + Math.floor(Math.random() * 5000000) // Adicionar variação
  }

  private generateChecksum(input: string): string {
    // Simular geração de checksum
    return btoa(input).substring(0, 16)
  }

  getAllBackups(sortBy: 'date' | 'size' | 'name' = 'date'): BackupFile[] {
    let backups = Array.from(this.backups.values())

    switch (sortBy) {
      case 'date':
        backups.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case 'size':
        backups.sort((a, b) => b.size - a.size)
        break
      case 'name':
        backups.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return backups
  }

  getBackup(id: string): BackupFile | null {
    return this.backups.get(id) || null
  }

  deleteBackup(id: string): boolean {
    return this.backups.delete(id)
  }

  // Validação de integridade
  validateBackup(id: string): { isValid: boolean; issues: string[] } {
    const backup = this.backups.get(id)
    if (!backup) {
      return { isValid: false, issues: ['Backup não encontrado'] }
    }

    const issues: string[] = []

    // Simular validações
    const currentChecksum = this.generateChecksum(backup.name)
    if (currentChecksum !== backup.checksum) {
      issues.push('Checksum não confere - arquivo pode estar corrompido')
    }

    // Validar estrutura dos dados
    if (!backup.data.patients || !Array.isArray(backup.data.patients)) {
      issues.push('Dados de pacientes inválidos')
    }

    if (!backup.data.appointments || !Array.isArray(backup.data.appointments)) {
      issues.push('Dados de consultas inválidos')
    }

    // Marcar como corrompido se houver problemas
    if (issues.length > 0) {
      backup.isCorrupted = true
      this.backups.set(id, backup)
    }

    return {
      isValid: issues.length === 0,
      issues
    }
  }

  // Agendamento de Backups
  createSchedule(data: Omit<BackupSchedule, 'id' | 'createdAt' | 'updatedAt' | 'nextRun'>): BackupSchedule {
    const id = `schedule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const schedule: BackupSchedule = {
      ...data,
      id,
      nextRun: this.calculateNextRun(data),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.schedules.set(id, schedule)
    return schedule
  }

  private calculateNextRun(schedule: Pick<BackupSchedule, 'frequency' | 'time' | 'dayOfWeek' | 'dayOfMonth'>): Date {
    const now = new Date()
    const [hours, minutes] = schedule.time.split(':').map(Number)
    
    let nextRun = new Date()
    nextRun.setHours(hours, minutes, 0, 0)

    switch (schedule.frequency) {
      case 'daily':
        if (nextRun <= now) {
          nextRun = addDays(nextRun, 1)
        }
        break
        
      case 'weekly':
        const targetDay = schedule.dayOfWeek || 0
        const currentDay = nextRun.getDay()
        let daysUntilTarget = targetDay - currentDay
        
        if (daysUntilTarget < 0 || (daysUntilTarget === 0 && nextRun <= now)) {
          daysUntilTarget += 7
        }
        
        nextRun = addDays(nextRun, daysUntilTarget)
        break
        
      case 'monthly':
        const targetDate = schedule.dayOfMonth || 1
        nextRun.setDate(targetDate)
        
        if (nextRun <= now) {
          nextRun.setMonth(nextRun.getMonth() + 1)
        }
        break
    }

    return nextRun
  }

  getAllSchedules(): BackupSchedule[] {
    return Array.from(this.schedules.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    )
  }

  getSchedule(id: string): BackupSchedule | null {
    return this.schedules.get(id) || null
  }

  updateSchedule(id: string, updates: Partial<BackupSchedule>): BackupSchedule | null {
    const schedule = this.schedules.get(id)
    if (!schedule) return null

    const updated: BackupSchedule = {
      ...schedule,
      ...updates,
      id,
      nextRun: updates.frequency || updates.time || updates.dayOfWeek !== undefined || updates.dayOfMonth !== undefined
        ? this.calculateNextRun({ ...schedule, ...updates })
        : schedule.nextRun,
      updatedAt: new Date()
    }

    this.schedules.set(id, updated)
    return updated
  }

  deleteSchedule(id: string): boolean {
    return this.schedules.delete(id)
  }

  // Restauração
  createRestore(data: {
    backupId: string
    restoreType: BackupRestore['restoreType']
    selectedTables?: string[]
    overwriteExisting: boolean
    createBackupBeforeRestore: boolean
    createdBy: string
  }): BackupRestore | null {
    const backup = this.backups.get(data.backupId)
    if (!backup) return null

    const id = `restore-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const restore: BackupRestore = {
      id,
      backupId: data.backupId,
      backupName: backup.name,
      restoreType: data.restoreType,
      selectedTables: data.selectedTables,
      overwriteExisting: data.overwriteExisting,
      createBackupBeforeRestore: data.createBackupBeforeRestore,
      status: 'pending',
      progress: 0,
      startedAt: new Date(),
      logs: [],
      createdBy: data.createdBy,
      createdAt: new Date()
    }

    this.restores.push(restore)

    // Simular processo de restauração
    this.simulateRestore(id)

    return restore
  }

  private async simulateRestore(restoreId: string) {
    const restore = this.restores.find(r => r.id === restoreId)
    if (!restore) return

    // Simular progresso
    restore.status = 'in-progress'
    restore.logs.push('Iniciando processo de restauração...')

    if (restore.createBackupBeforeRestore) {
      restore.logs.push('Criando backup de segurança antes da restauração...')
      restore.progress = 10
    }

    // Simular etapas de restauração
    const steps = [
      { message: 'Validando integridade do backup...', progress: 20 },
      { message: 'Preparando dados para restauração...', progress: 40 },
      { message: 'Restaurando dados de pacientes...', progress: 60 },
      { message: 'Restaurando dados de consultas...', progress: 80 },
      { message: 'Finalizando restauração...', progress: 95 },
      { message: 'Restauração concluída com sucesso!', progress: 100 }
    ]

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      restore.logs.push(step.message)
      restore.progress = step.progress
    }

    restore.status = 'completed'
    restore.completedAt = new Date()
  }

  getRestores(): BackupRestore[] {
    return this.restores.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  getRestore(id: string): BackupRestore | null {
    return this.restores.find(r => r.id === id) || null
  }

  // Estatísticas
  getBackupStats(): BackupStats {
    const backups = this.getAllBackups()
    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisYear = new Date(now.getFullYear(), 0, 1)

    const backupsThisMonth = backups.filter(b => b.createdAt >= thisMonth).length
    const backupsThisYear = backups.filter(b => b.createdAt >= thisYear).length

    const totalSize = backups.reduce((sum, b) => sum + b.size, 0)
    const successfulBackups = backups.filter(b => b.status === 'completed').length
    const failedBackups = backups.filter(b => b.status === 'failed').length
    const corruptedBackups = backups.filter(b => b.isCorrupted).length

    const totalCompressionRatio = backups.reduce((sum, b) => sum + b.compression, 0)

    // Próximo backup agendado
    const activeSchedules = Array.from(this.schedules.values()).filter(s => s.isActive)
    const nextScheduledBackup = activeSchedules.reduce((earliest, schedule) => {
      if (!schedule.nextRun) return earliest
      if (!earliest || schedule.nextRun < earliest) return schedule.nextRun
      return earliest
    }, null as Date | null)

    return {
      totalBackups: backups.length,
      totalSize,
      lastBackup: backups[0]?.createdAt,
      nextScheduledBackup: nextScheduledBackup || undefined,
      backupsThisMonth,
      backupsThisYear,
      successRate: backups.length > 0 ? (successfulBackups / backups.length) * 100 : 100,
      averageSize: backups.length > 0 ? totalSize / backups.length : 0,
      averageCompressionRatio: backups.length > 0 ? totalCompressionRatio / backups.length : 0,
      failedBackups,
      corruptedBackups,
      oldestBackup: backups[backups.length - 1]?.createdAt
    }
  }

  // Limpeza automática
  cleanupOldBackups(): { removed: number; freedSpace: number } {
    const backups = this.getAllBackups()
    let removed = 0
    let freedSpace = 0

    backups.forEach(backup => {
      if (backup.retentionDays) {
        const expiryDate = addDays(backup.createdAt, backup.retentionDays)
        if (new Date() > expiryDate) {
          freedSpace += backup.size
          this.backups.delete(backup.id)
          removed++
        }
      }
    })

    return { removed, freedSpace }
  }

  // Export/Import
  exportBackup(id: string): { success: boolean; data?: any; error?: string } {
    const backup = this.backups.get(id)
    if (!backup) {
      return { success: false, error: 'Backup não encontrado' }
    }

    return {
      success: true,
      data: {
        backup,
        exportedAt: new Date(),
        version: '1.0'
      }
    }
  }

  // Utilitários
  formatSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    const size = (bytes / Math.pow(1024, i)).toFixed(2)
    
    return `${size} ${sizes[i]}`
  }

  getBackupTypeLabel(type: BackupFile['type']): string {
    const labels = {
      full: 'Completo',
      incremental: 'Incremental',
      selective: 'Seletivo'
    }
    return labels[type]
  }

  getStatusLabel(status: BackupFile['status']): string {
    const labels = {
      completed: 'Concluído',
      failed: 'Falhou',
      'in-progress': 'Em Andamento'
    }
    return labels[status]
  }

  getFrequencyLabel(frequency: BackupSchedule['frequency']): string {
    const labels = {
      daily: 'Diário',
      weekly: 'Semanal',
      monthly: 'Mensal'
    }
    return labels[frequency]
  }
}

// Instância singleton do serviço
export const backupService = new BackupService()