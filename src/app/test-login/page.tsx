"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function TestLogin() {
  const handleTestLogin = async () => {
    try {
      console.log('Tentando fazer login com usuário de teste...')
      
      const result = await signIn("credentials", {
        email: "dr.joao@teste.com",
        password: "123456",
        redirect: false,
      })

      console.log('Resultado do login:', result)

      if (result?.error) {
        console.error('Erro no login:', result.error)
        alert('Erro no login: ' + result.error)
      } else if (result?.ok) {
        console.log('Login bem-sucedido!')
        alert('Login bem-sucedido! Redirecionando para dashboard...')
        window.location.href = '/dashboard'
      }
    } catch (error: any) {
      console.error('Erro ao fazer login:', error)
      alert('Erro ao fazer login: ' + (error?.message || 'Erro desconhecido'))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Teste de Login</h1>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="font-semibold text-blue-800 mb-2">Credenciais de Teste:</h2>
          <p className="text-sm text-blue-700">📧 Email: dr.joao@teste.com</p>
          <p className="text-sm text-blue-700">🔑 Senha: 123456</p>
        </div>

        <Button 
          onClick={handleTestLogin}
          className="w-full bg-emerald-600 hover:bg-emerald-700 mb-4"
        >
          🧪 Testar Login Automático
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">ou</p>
          <a 
            href="/auth/signin" 
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            Ir para página de login manual
          </a>
        </div>
      </div>
    </div>
  )
}