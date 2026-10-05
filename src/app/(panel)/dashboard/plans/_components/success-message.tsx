'use client'

import { CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface SuccessMessageProps {
  type: 'success' | 'cancel'
  plan?: string
}

export function SuccessMessage({ type, plan }: SuccessMessageProps) {
  const router = useRouter()

  const handleContinue = () => {
    router.push('/dashboard/plans')
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  if (type === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-8 h-8 text-green-600" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-900">
              🎉 Pagamento realizado com sucesso!
            </h3>
            <p className="text-green-700 mt-1">
              {plan ? (
                <>Seu plano <strong>{plan}</strong> foi ativado com sucesso. Você agora tem acesso a todos os recursos incluídos no seu plano.</>
              ) : (
                'Sua assinatura foi ativada. Aproveite todos os recursos do seu plano.'
              )}
            </p>
            <div className="mt-4">
              <Button 
                onClick={handleContinue}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Continuar para Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'cancel') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-8 h-8 text-yellow-600" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-yellow-900">
              Pagamento cancelado
            </h3>
            <p className="text-yellow-700 mt-1">
              O processo de pagamento foi cancelado. Você pode tentar novamente quando desejar.
            </p>
            <div className="mt-4">
              <Button 
                onClick={handleContinue}
                variant="outline"
                className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
              >
                Voltar aos Planos
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}