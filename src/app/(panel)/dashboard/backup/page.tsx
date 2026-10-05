'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Shield,
  Plus,
  Download,
  Upload,
  Calendar,
  Clock,
  HardDrive,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Settings,
  Play,
  Pause,
  Trash2,
  Eye,
  Star,
  Database,
  RotateCcw,
  Zap,
  Activity
} from 'lucide-react'
import Link from 'next/link'
import { getSession } from 'next-auth/react'
import { 
  backupService,
  type BackupFile,
  type BackupSchedule,
  type BackupRestore,
  type BackupStats
} from '@/lib/backup'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function BackupPage() {
  const [userPlan, setUserPlan] = useState<string>('BASIC')
  const [activeTab, setActiveTab] = useState<'overview' | 'backups' | 'schedules' | 'restore' | 'settings'>('overview')
  
  const [backups, setBackups] = useState<BackupFile[]>([])
  const [schedules, setSchedules] = useState<BackupSchedule[]>([])
  const [restores, setRestores] = useState<BackupRestore[]>([])
  const [stats, setStats] = useState<BackupStats | null>(null)
  
  const [selectedBackups, setSelectedBackups] = useState<string[]>([])
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)

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
    loadBackupData()
  }, [])

  // Se não for plano professional, mostrar upgrade
  if (userPlan !== 'PROFESSIONAL') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <Shield className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sistema de Backup Automático
          </h2>
          <p className="text-gray-600 mb-6">
            Proteja seus dados com backups automáticos, restauração completa e histórico detalhado de todas as operações.
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

  const loadBackupData = () => {
    setBackups(backupService.getAllBackups())
    setSchedules(backupService.getAllSchedules())
    setRestores(backupService.getRestores())
    setStats(backupService.getBackupStats())
  }

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true)
    
    try {
      const backup = backupService.createBackup({
        type: 'full',
        includeInventory: true,
        includeBranding: true,
        createdBy: 'user'
      })
      
      console.log('Backup criado:', backup)
      loadBackupData()
    } catch (error) {
      console.error('Erro ao criar backup:', error)
    } finally {
      setIsCreatingBackup(false)
    }
  }

  const handleDeleteBackups = () => {
    selectedBackups.forEach(id => {
      backupService.deleteBackup(id)
    })
    
    setSelectedBackups([])
    loadBackupData()
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Backups</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalBackups || 0}</p>
            </div>
            <Database className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Espaço Utilizado</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats ? backupService.formatSize(stats.totalSize) : '0 MB'}
              </p>
            </div>
            <HardDrive className="w-10 h-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taxa de Sucesso</p>
              <p className="text-3xl font-bold text-emerald-600">{stats?.successRate.toFixed(1) || 0}%</p>
            </div>
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Próximo Backup</p>
              <p className="text-lg font-bold text-gray-900">
                {stats?.nextScheduledBackup ? formatDistanceToNow(stats.nextScheduledBackup, { 
                  addSuffix: true, 
                  locale: ptBR 
                }) : 'Não agendado'}
              </p>
            </div>
            <Clock className="w-10 h-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Status dos Schedules */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              Agendamentos Ativos ({schedules.filter(s => s.isActive).length})
            </h3>
            <Button
              onClick={() => setActiveTab('schedules')}
              variant="outline"
              size="sm"
            >
              Gerenciar
            </Button>
          </div>
        </div>
        <div className="p-6">
          {schedules.filter(s => s.isActive).length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Nenhum agendamento ativo</p>
              <Button
                onClick={() => setActiveTab('schedules')}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Criar Agendamento
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {schedules.filter(s => s.isActive).slice(0, 3).map(schedule => (
                <div key={schedule.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      schedule.isActive ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{schedule.name}</p>
                      <p className="text-sm text-gray-600">
                        {backupService.getFrequencyLabel(schedule.frequency)} às {schedule.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Próximo: {schedule.nextRun ? format(schedule.nextRun, 'dd/MM HH:mm') : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Backups Recentes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 text-green-600 mr-2" />
              Backups Recentes
            </h3>
            <Button
              onClick={() => setActiveTab('backups')}
              variant="outline"
              size="sm"
            >
              Ver Todos
            </Button>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-600 border-b border-gray-200">
                  <th className="pb-3">Nome</th>
                  <th className="pb-3">Tipo</th>
                  <th className="pb-3">Tamanho</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {backups.slice(0, 5).map(backup => (
                  <tr key={backup.id} className="text-sm">
                    <td className="py-3 font-medium text-gray-900">{backup.name}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        backup.type === 'full' ? 'bg-blue-100 text-blue-800' :
                        backup.type === 'incremental' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {backupService.getBackupTypeLabel(backup.type)}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">{backupService.formatSize(backup.size)}</td>
                    <td className="py-3">
                      <div className="flex items-center">
                        {backup.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                        ) : backup.status === 'failed' ? (
                          <XCircle className="w-4 h-4 text-red-600 mr-1" />
                        ) : (
                          <Clock className="w-4 h-4 text-orange-600 mr-1" />
                        )}
                        <span className={`text-xs ${
                          backup.status === 'completed' ? 'text-green-600' :
                          backup.status === 'failed' ? 'text-red-600' :
                          'text-orange-600'
                        }`}>
                          {backupService.getStatusLabel(backup.status)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-gray-600">
                      {format(backup.createdAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Alertas */}
      {stats && (stats.failedBackups > 0 || stats.corruptedBackups > 0) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-red-900">Atenção Necessária</h3>
          </div>
          <div className="space-y-2">
            {stats.failedBackups > 0 && (
              <p className="text-red-700">
                {stats.failedBackups} backup(s) falharam recentemente
              </p>
            )}
            {stats.corruptedBackups > 0 && (
              <p className="text-red-700">
                {stats.corruptedBackups} backup(s) estão corrompidos
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )

  const renderBackups = () => (
    <div className="space-y-6">
      {/* Controles */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex space-x-3">
            <Button
              onClick={handleCreateBackup}
              disabled={isCreatingBackup}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isCreatingBackup ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Criando Backup...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Backup
                </>
              )}
            </Button>
            
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Importar
            </Button>
            
            {selectedBackups.length > 0 && (
              <Button
                onClick={handleDeleteBackups}
                variant="outline"
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir ({selectedBackups.length})
              </Button>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={() => loadBackupData()}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Lista de Backups */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Histórico de Backups ({backups.length})
          </h3>
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
                        setSelectedBackups(backups.map(b => b.id))
                      } else {
                        setSelectedBackups([])
                      }
                    }}
                    className="rounded"
                  />
                </th>
                <th className="p-4">Nome</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Tamanho</th>
                <th className="p-4">Compressão</th>
                <th className="p-4">Status</th>
                <th className="p-4">Criado em</th>
                <th className="p-4">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {backups.map(backup => (
                <tr key={backup.id} className="text-sm hover:bg-gray-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedBackups.includes(backup.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBackups([...selectedBackups, backup.id])
                        } else {
                          setSelectedBackups(selectedBackups.filter(id => id !== backup.id))
                        }
                      }}
                      className="rounded"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{backup.name}</span>
                      {backup.isAutomatic && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Auto
                        </span>
                      )}
                      {backup.isCorrupted && (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      backup.type === 'full' ? 'bg-blue-100 text-blue-800' :
                      backup.type === 'incremental' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {backupService.getBackupTypeLabel(backup.type)}
                    </span>
                  </td>
                  <td className="p-4 font-medium">{backupService.formatSize(backup.size)}</td>
                  <td className="p-4 text-gray-600">{backup.compression}%</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      {backup.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                      ) : backup.status === 'failed' ? (
                        <XCircle className="w-4 h-4 text-red-600 mr-1" />
                      ) : (
                        <Clock className="w-4 h-4 text-orange-600 mr-1" />
                      )}
                      <span className={`text-xs ${
                        backup.status === 'completed' ? 'text-green-600' :
                        backup.status === 'failed' ? 'text-red-600' :
                        'text-orange-600'
                      }`}>
                        {backupService.getStatusLabel(backup.status)}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">
                    <div>
                      <p>{format(backup.createdAt, 'dd/MM/yyyy', { locale: ptBR })}</p>
                      <p className="text-xs text-gray-500">
                        {format(backup.createdAt, 'HH:mm', { locale: ptBR })}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-emerald-600"
                        onClick={() => setActiveTab('restore')}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {backups.length === 0 && (
          <div className="p-8 text-center">
            <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Nenhum backup encontrado</p>
            <Button
              onClick={handleCreateBackup}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Backup
            </Button>
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
              <Shield className="w-8 h-8 text-emerald-600" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Sistema de Backup
                </h1>
                <p className="text-sm text-gray-600">
                  Proteção completa dos seus dados
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleCreateBackup}
                disabled={isCreatingBackup}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Backup
              </Button>
            </div>
          </div>

          {/* Navegação de Tabs */}
          <div className="flex space-x-1 mt-4 overflow-x-auto">
            {[
              { id: 'overview', label: 'Visão Geral', icon: Activity },
              { id: 'backups', label: 'Backups', icon: Database },
              { id: 'schedules', label: 'Agendamentos', icon: Calendar },
              { id: 'restore', label: 'Restaurar', icon: RotateCcw },
              { id: 'settings', label: 'Configurações', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white'
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
        {activeTab === 'backups' && renderBackups()}
        {activeTab === 'schedules' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Agendamentos de Backup</h3>
            <p className="text-gray-600">Configure backups automáticos...</p>
          </div>
        )}
        {activeTab === 'restore' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <RotateCcw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Restaurar Dados</h3>
            <p className="text-gray-600">Restaure dados de backups anteriores...</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Configurações de Backup</h3>
            <p className="text-gray-600">Configure políticas de retenção e notificações...</p>
          </div>
        )}
      </main>
    </div>
  )
}