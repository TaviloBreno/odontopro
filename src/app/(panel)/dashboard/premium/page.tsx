import { Button } from '@/components/ui/button'
import getSesion from '@/lib/getSession'
import { 
  Calendar, Users, Clock, Bell, BarChart3, MapPin, Phone, Crown, 
  MessageSquare, TrendingUp, Shield, Star, Bot, Brain, Zap,
  Camera, Mic, FileText, Target, Sparkles 
} from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { DashboardLogoutButton } from '../_components/dashboard-logout-button'

export default async function PremiumDashboard() {
  const session = await getSesion()

  if (!session) {
    redirect("/auth/signin")
  }

  // Verificar se o usuário tem o plano correto
  const userPlan = session.user?.plan || 'PREMIUM'
  if (userPlan !== 'PREMIUM') {
    redirect(`/dashboard/${userPlan.toLowerCase()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <h1 className="text-lg sm:text-2xl font-bold">
                Odonto<span className="text-yellow-300">PRO</span>
              </h1>
              <div className="flex items-center space-x-2">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-900 text-xs font-bold px-3 py-1 rounded-full flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Premium IA
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{session.user?.name}</p>
                  <p className="text-xs text-purple-200">{session.user?.email}</p>
                </div>
                <div className="w-8 h-8 bg-purple-800 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {session.user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              </div>
              <DashboardLogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo ao Futuro, {session.user?.name?.split(' ')[0]}! 🚀
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Dashboard com Inteligência Artificial - A clínica do futuro está aqui
          </p>
        </div>

        {/* AI Powered Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bot className="w-8 h-8" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">42</p>
                  <p className="text-purple-100 text-sm">Consultas IA Hoje</p>
                </div>
              </div>
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Brain className="w-8 h-8 text-emerald-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">278</p>
                  <p className="text-gray-600 text-sm">Diagnósticos IA</p>
                </div>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">98.7% Precisão</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Camera className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">156</p>
                  <p className="text-gray-600 text-sm">Análises Radiológicas</p>
                </div>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Auto</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Target className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">R$ 32.450</p>
                  <p className="text-gray-600 text-sm">Receita Otimizada</p>
                </div>
              </div>
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">+38% IA</span>
            </div>
          </div>
        </div>

        {/* AI Features Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* AI Tools */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Bot className="w-5 h-5 mr-2 text-purple-600" />
              Ferramentas IA
            </h3>
            <div className="space-y-3">
              <Link href="/dashboard/ai-diagnostics">
                <Button className="w-full justify-start bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" size="sm">
                  <Brain className="w-4 h-4 mr-2" />
                  Assistente de Diagnóstico
                </Button>
              </Link>
              
              <Link href="/dashboard/ai-radiology">
                <Button className="w-full justify-start" variant="outline">
                  <Camera className="w-4 h-4 mr-2" />
                  Análise Radiológica IA
                </Button>
              </Link>
              
              <Link href="/dashboard/ai-chatbot">
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chatbot IA 24/7
                </Button>
              </Link>
              
              <Link href="/dashboard/ai-transcription">
                <Button className="w-full justify-start" variant="outline">
                  <Mic className="w-4 h-4 mr-2" />
                  Transcrição Automática
                </Button>
              </Link>
            </div>
          </div>

          {/* AI Analytics */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-sm p-6 border border-indigo-200">
            <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-indigo-600" />
              Insights IA
            </h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-indigo-100">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-900">Predição de Receita</span>
                </div>
                <p className="text-lg font-bold text-indigo-600">R$ 45.800 próximo mês</p>
                <p className="text-xs text-gray-500">Baseado em padrões IA</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-indigo-100">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-900">Recomendação IA</span>
                </div>
                <p className="text-sm text-gray-700">"Agende 3 consultas extras na quinta-feira para otimizar a agenda"</p>
              </div>
            </div>
          </div>

          {/* Premium Features */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-sm p-6 border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
              <Crown className="w-5 h-5 mr-2 text-yellow-600" />
              Exclusivo Premium
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-yellow-800">
                <Shield className="w-4 h-4" />
                <span>Suporte IA Dedicado</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-yellow-800">
                <Sparkles className="w-4 h-4" />
                <span>API de Desenvolvedores</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-yellow-800">
                <FileText className="w-4 h-4" />
                <span>Relatórios Preditivos</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-yellow-800">
                <Bot className="w-4 h-4" />
                <span>Equipamentos Inteligentes</span>
              </div>
              
              <div className="mt-4 p-3 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg">
                <p className="text-sm font-medium text-purple-800">🤖 Clínica do Futuro</p>
                <p className="text-xs text-purple-600">Tecnologia de ponta em funcionamento</p>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Analytics & AI Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Activity Feed */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Bot className="w-5 h-5 mr-2 text-purple-600" />
              Atividade da IA
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">IA sugeriu tratamento para paciente</p>
                  <p className="text-xs text-gray-500">João Silva - Recomendação de aparelho ortodôntico - 98% confiança</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Camera className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Análise radiológica concluída</p>
                  <p className="text-xs text-gray-500">Maria Santos - Nenhuma anomalia detectada pela IA</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <Zap className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Otimização automática da agenda</p>
                  <p className="text-xs text-gray-500">IA reorganizou 5 consultas para melhor eficiência</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <MessageSquare className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Chatbot atendeu 12 pacientes</p>
                  <p className="text-xs text-gray-500">Resoluções automatizadas - Satisfação: 4.9/5</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Performance Metrics */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
              Performance IA
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                <div>
                  <span className="text-sm font-medium text-gray-900">Precisão de Diagnósticos IA</span>
                  <p className="text-xs text-gray-500">Baseado em 278 casos analisados</p>
                </div>
                <span className="text-lg font-bold text-purple-600">98.7%</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                <div>
                  <span className="text-sm font-medium text-gray-900">Tempo Economizado</span>
                  <p className="text-xs text-gray-500">Automação vs manual</p>
                </div>
                <span className="text-lg font-bold text-blue-600">4.2h/dia</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                <div>
                  <span className="text-sm font-medium text-gray-900">Satisfação Chatbot IA</span>
                  <p className="text-xs text-gray-500">Avaliações dos pacientes</p>
                </div>
                <span className="text-lg font-bold text-emerald-600">4.9/5.0</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                <div>
                  <span className="text-sm font-medium text-gray-900">Otimização de Receita</span>
                  <p className="text-xs text-gray-500">IA vs período anterior</p>
                </div>
                <span className="text-lg font-bold text-orange-600">+38%</span>
              </div>

              <div className="mt-4 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border border-yellow-300">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm font-bold text-yellow-800">IA Premium Ativa</p>
                </div>
                <p className="text-xs text-yellow-700 mt-1">Todos os módulos de IA funcionando perfeitamente</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}