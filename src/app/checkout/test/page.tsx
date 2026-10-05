"use client"

import { Button } from "@/components/ui/button"
import { Suspense } from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CreditCard, Lock, ArrowLeft } from "lucide-react"
import { subscriptionPlans } from "@/utils/plans"

export default function TestCheckoutPage() {
  return (
    <Suspense fallback={<div className="p-8">Carregando checkout de teste...</div>}>
      <TestCheckoutContent />
    </Suspense>
  )
}

function TestCheckoutContent() {
  const [loading, setLoading] = useState(false)
  const [planType, setPlanType] = useState("")
  const [planPrice, setPlanPrice] = useState("")
  const [planName, setPlanName] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (sessionId?.includes('BASIC')) {
      const basicPlan = subscriptionPlans.find(plan => plan.id === 'BASIC')
      setPlanType('BASIC')
      setPlanName(basicPlan?.name || 'Basic')
      setPlanPrice(basicPlan?.price || 'R$ 27,90')
    } else if (sessionId?.includes('PROFESSIONAL')) {
      const professionalPlan = subscriptionPlans.find(plan => plan.id === 'PROFESSIONAL')
      setPlanType('PROFESSIONAL')
      setPlanName(professionalPlan?.name || 'Profissional')
      setPlanPrice(professionalPlan?.price || 'R$ 97,90')
    } else if (sessionId?.includes('PREMIUM')) {
      const premiumPlan = subscriptionPlans.find(plan => plan.id === 'PREMIUM')
      setPlanType('PREMIUM')
      setPlanName(premiumPlan?.name || 'Premium IA')
      setPlanPrice(premiumPlan?.price || 'R$ 197,90')
    }
  }, [searchParams])

  const handlePayment = async () => {
    setLoading(true)
    
    // Simular processamento de pagamento
    setTimeout(() => {
      // Redirecionar para página de sucesso
      router.push('/dashboard/plans?success=true&plan=' + planType)
    }, 3000)
  }

  const handleCancel = () => {
    router.push('/dashboard/plans?canceled=true')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 text-white p-3 rounded-lg">
              <CreditCard className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Checkout de Teste - Stripe
          </h1>
          <p className="text-gray-600">
            Esta é uma simulação da tela de checkout do Stripe
          </p>
        </div>

        {/* Checkout Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Plano Selecionado */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h2>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Plano {planName}</p>
                <p className="text-sm text-gray-600">Assinatura mensal</p>
              </div>
              <p className="text-xl font-bold text-gray-900">{planPrice}/mês</p>
            </div>
          </div>

          {/* Formulário de Pagamento */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="seu@email.com"
                defaultValue="teste@exemplo.com"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Informações do Cartão
              </label>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="4242 4242 4242 4242"
                    defaultValue="4242 4242 4242 4242"
                    disabled={loading}
                  />
                  <div className="absolute right-3 top-3">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="MM / AA"
                    defaultValue="12 / 25"
                    disabled={loading}
                  />
                  <input
                    type="text"
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="CVC"
                    defaultValue="123"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome no Cartão
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="João Silva"
                defaultValue="João Silva"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço de Cobrança
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Rua das Flores, 123"
                  defaultValue="Rua das Flores, 123"
                  disabled={loading}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="São Paulo"
                    defaultValue="São Paulo"
                    disabled={loading}
                  />
                  <input
                    type="text"
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="01000-000"
                    defaultValue="01000-000"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="mt-8 space-y-4">
            <Button 
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processando pagamento...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Assinar {planPrice}/mês
                </div>
              )}
            </Button>

            <Button 
              onClick={handleCancel}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>

          {/* Segurança */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Lock className="w-4 h-4 mr-1" />
              Pagamento seguro processado pelo Stripe (TESTE)
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Esta é uma simulação para desenvolvimento. Nenhum pagamento real será processado.</p>
        </div>
      </div>
    </div>
  )
}