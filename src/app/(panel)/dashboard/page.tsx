import { Button } from '@/components/ui/button'
import getSesion from '@/lib/getSession'
import { Calendar, Users, Clock, Settings, Bell, BarChart3, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { DashboardLogoutButton } from './_components/dashboard-logout-button'

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Calendar,
  Users,
  BarChart3,
  Settings,
  Clock,
  Package,
  MessageSquare,
  FileText,
  Shield,
  Building2,
  Star,
  Smartphone,
  Bot,
  Video,
  DollarSign,
  Network,
  Eye,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Activity,
  Plus,
  ArrowRight,
  Zap,
  Globe,
  Database,
  RefreshCw,
  Target,
  PieChart,
  Briefcase,
  HeartHandshake,
  Stethoscope,
  ClipboardList
} from 'lucide-react'
import Link from 'next/link'
import getSesion from '@/lib/getSession'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface UserPlanFeatures {
  plan: string
  features: {
    id: string
    name: string
    description: string
    icon: any
    href: string
    available: boolean
    badge?: string
  }[]
}

export default function UnifiedDashboardPage() {
  const [userPlan, setUserPlan] = useState<string>('BASIC')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUserPlan = async () => {
      try {
        const session = await getSesion()
        setUserPlan(session?.user?.plan || 'BASIC')
      } catch (error) {
        console.error('Erro ao verificar plano:', error)
      } finally {
        setLoading(false)
      }
    }
    checkUserPlan()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  const getPlanFeatures = (): UserPlanFeatures => {
    const baseFeatures = [
      {
        id: 'appointments',
        name: 'Agendamentos',
        description: 'Gerencie consultas e horários',
        icon: Calendar,
        href: '/dashboard/appointments',
        available: true
      },
      {
        id: 'patients',
        name: 'Pacientes',
        description: 'Cadastro e histórico médico',
        icon: Users,
        href: '/dashboard/patients',
        available: true
      },
      {
        id: 'services',
        name: 'Serviços',
        description: 'Tratamentos e procedimentos',
        icon: Stethoscope,
        href: '/dashboard/services',
        available: true
      },
      {
        id: 'profile',
        name: 'Perfil',
        description: 'Configurações da conta',
        icon: Settings,
        href: '/dashboard/profile',
        available: true
      }
    ]

    const professionalFeatures = [
      {
        id: 'sms',
        name: 'SMS & WhatsApp',
        description: 'Notificações automáticas',
        icon: Smartphone,
        href: '/dashboard/sms',
        available: true,
        badge: 'Pro'
      },
      {
        id: 'reports',
        name: 'Relatórios Avançados',
        description: 'Analytics e exportação',
        icon: FileText,
        href: '/dashboard/reports',
        available: true,
        badge: 'Pro'
      },
      {
        id: 'calendar',
        name: 'Calendário Integrado',
        description: 'Sync com Google Calendar',
        icon: Calendar,
        href: '/dashboard/calendar',
        available: true,
        badge: 'Pro'
      },
      {
        id: 'reminders',
        name: 'Lembretes Automáticos',
        description: 'Sistema inteligente',
        icon: Clock,
        href: '/dashboard/reminders',
        available: true,
        badge: 'Pro'
      },
      {
        id: 'inventory',
        name: 'Gestão de Estoque',
        description: 'Controle de materiais',
        icon: Package,
        href: '/dashboard/inventory',
        available: true,
        badge: 'Pro'
      },
      {
        id: 'theme',
        name: 'Temas Personalizados',
        description: 'Customização visual',
        icon: Settings,
        href: '/dashboard/theme',
        available: true,
        badge: 'Pro'
      },
      {
        id: 'backup',
        name: 'Sistema de Backup',
        description: 'Backup automático',
        icon: Database,
        href: '/dashboard/backup',
        available: true,
        badge: 'Pro'
      }
    ]

    const premiumFeatures = [
      {
        id: 'ai-treatment',
        name: 'IA para Tratamentos',
        description: 'Recomendações inteligentes',
        icon: Bot,
        href: '/dashboard/ai-treatment',
        available: true,
        badge: 'Premium'
      },
      {
        id: 'telemedicine',
        name: 'Telemedicina',
        description: 'Consultas virtuais',
        icon: Video,
        href: '/dashboard/telemedicine',
        available: true,
        badge: 'Premium'
      },
      {
        id: 'financial-analytics',
        name: 'Analytics Financeiros',
        description: 'Business Intelligence',
        icon: DollarSign,
        href: '/dashboard/financial-analytics',
        available: true,
        badge: 'Premium'
      },
      {
        id: 'integrations',
        name: 'Integrações APIs',
        description: 'Conectividade externa',
        icon: Network,
        href: '/dashboard/integrations',
        available: true,
        badge: 'Premium'
      },
      {
        id: 'audit',
        name: 'Sistema de Auditoria',
        description: 'Conformidade LGPD/HIPAA',
        icon: Shield,
        href: '/dashboard/audit',
        available: true,
        badge: 'Premium'
      },
      {
        id: 'multi-location',
        name: 'Multi-localização',
        description: 'Rede de clínicas',
        icon: Building2,
        href: '/dashboard/multi-location',
        available: true,
        badge: 'Premium'
      }
    ]

    switch (userPlan) {
      case 'PROFESSIONAL':
        return {
          plan: 'PROFESSIONAL',
          features: [...baseFeatures, ...professionalFeatures]
        }
      case 'PREMIUM':
        return {
          plan: 'PREMIUM',
          features: [...baseFeatures, ...professionalFeatures, ...premiumFeatures]
        }
      default:
        return {
          plan: 'BASIC',
          features: baseFeatures
        }
    }
  }

  const planData = getPlanFeatures()

  const getPlanColor = () => {
    switch (userPlan) {
      case 'PROFESSIONAL':
        return 'blue'
      case 'PREMIUM':
        return 'red'
      default:
        return 'gray'
    }
  }

  const getPlanBadge = () => {
    switch (userPlan) {
      case 'PROFESSIONAL':
        return { color: 'bg-blue-100 text-blue-800', label: 'Professional' }
      case 'PREMIUM':
        return { color: 'bg-red-100 text-red-800', label: 'Premium' }
      default:
        return { color: 'bg-gray-100 text-gray-800', label: 'Basic' }
    }
  }

  const getQuickStats = () => {
    // Dados simulados baseados no plano
    const baseStats = {
      appointments: 24,
      patients: 156,
      revenue: 12500
    }

    if (userPlan === 'PROFESSIONAL' || userPlan === 'PREMIUM') {
      return {
        ...baseStats,
        satisfaction: 4.8,
        efficiency: 92
      }
    }

    return baseStats
  }

  const badge = getPlanBadge()
  const stats = getQuickStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🦷 Dashboard OdontoPro
              </h1>
              <p className="text-gray-600">
                Bem-vindo ao seu painel de controle
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color} flex items-center`}>
                <Star className="w-3 h-3 mr-1" />
                {badge.label}
              </span>
              
              {userPlan !== 'PREMIUM' && (
                <Link href="/dashboard/plans">
                  <Button className="bg-red-600 hover:bg-red-700">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Fazer Upgrade
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Consultas Hoje</p>
                <p className="text-3xl font-bold text-blue-600">{stats.appointments}</p>
                <p className="text-sm text-blue-600 flex items-center mt-1">
                  <Calendar className="w-3 h-3 mr-1" />
                  {format(new Date(), 'dd/MM/yyyy')}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pacientes Ativos</p>
                <p className="text-3xl font-bold text-green-600">{stats.patients}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% este mês
                </p>
              </div>
              <Users className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita do Mês</p>
                <p className="text-3xl font-bold text-purple-600">
                  {new Intl.NumberFormat('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL',
                    minimumFractionDigits: 0
                  }).format(stats.revenue)}
                </p>
                <p className="text-sm text-purple-600 flex items-center mt-1">
                  <DollarSign className="w-3 h-3 mr-1" />
                  Meta: R$ 15.000
                </p>
              </div>
              <BarChart3 className="w-10 h-10 text-purple-600" />
            </div>
          </div>

          {(userPlan === 'PROFESSIONAL' || userPlan === 'PREMIUM') && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Satisfação</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.satisfaction}</p>
                  <p className="text-sm text-orange-600 flex items-center mt-1">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Excelente
                  </p>
                </div>
                <HeartHandshake className="w-10 h-10 text-orange-600" />
              </div>
            </div>
          )}
        </div>

        {/* Plan Status & Upgrade */}
        {userPlan === 'BASIC' && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6 mb-8 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Desbloqueie Todo o Potencial do OdontoPro
                </h3>
                <p className="text-red-700 mb-4">
                  Upgrade para Professional ou Premium e tenha acesso a SMS automático, relatórios avançados, IA, telemedicina e muito mais.
                </p>
                <div className="flex space-x-4">
                  <Link href="/dashboard/plans">
                    <Button className="bg-red-600 hover:bg-red-700">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Ver Planos
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block">
                <Star className="w-24 h-24 text-red-600" />
              </div>
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planData.features.map((feature) => (
            <Link
              key={feature.id}
              href={feature.available ? feature.href : '/dashboard/plans'}
              className="group"
            >
              <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-200 ${
                feature.available 
                  ? 'hover:shadow-md hover:border-gray-300 cursor-pointer' 
                  : 'opacity-60 cursor-not-allowed'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${
                    feature.available 
                      ? feature.badge === 'Premium' 
                        ? 'bg-red-100 text-red-600' 
                        : feature.badge === 'Pro'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  
                  {feature.badge && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      feature.badge === 'Premium' 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {feature.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                  {feature.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {feature.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className={`text-sm ${
                    feature.available ? 'text-gray-500' : 'text-red-500'
                  }`}>
                    {feature.available ? 'Disponível' : 'Requer upgrade'}
                  </span>
                  
                  {feature.available && (
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="w-5 h-5 text-yellow-600 mr-2" />
            Ações Rápidas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/appointments">
              <Button variant="outline" className="w-full h-16 flex-col">
                <Plus className="w-5 h-5 mb-1" />
                Nova Consulta
              </Button>
            </Link>
            
            <Link href="/dashboard/patients">
              <Button variant="outline" className="w-full h-16 flex-col">
                <Users className="w-5 h-5 mb-1" />
                Novo Paciente
              </Button>
            </Link>
            
            {(userPlan === 'PROFESSIONAL' || userPlan === 'PREMIUM') && (
              <Link href="/dashboard/reports">
                <Button variant="outline" className="w-full h-16 flex-col">
                  <FileText className="w-5 h-5 mb-1" />
                  Gerar Relatório
                </Button>
              </Link>
            )}
            
            <Link href="/dashboard/profile">
              <Button variant="outline" className="w-full h-16 flex-col">
                <Settings className="w-5 h-5 mb-1" />
                Configurações
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}