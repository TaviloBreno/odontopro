"use client"

import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface SuccessMessageProps {
  plan: string
}

export function SuccessMessage({ plan }: SuccessMessageProps) {
  const router = useRouter()

  const handleContinue = () => {
    // Remover parâmetros da URL e recarregar
    router.push('/dashboard/plans')
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
      <div className="flex items-center space-x-3">
        <CheckCircle className="w-8 h-8 text-green-600" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-green-900">
            🎉 Pagamento realizado com sucesso!
          </h3>
          <p className="text-green-700 mt-1">
            Seu plano <strong>{plan}</strong> foi ativado com sucesso. 
            Você agora tem acesso a todos os recursos incluídos no seu plano.
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