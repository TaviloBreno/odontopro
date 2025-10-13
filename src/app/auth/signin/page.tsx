import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertCircle } from "lucide-react"

export default async function SignInPage() {
  const session = await getServerSession(authOptions)
  
  // Se já estiver logado, redireciona para o dashboard
  if (session) {
    redirect("/dashboard")
  }

  // Verifica se há provedores configurados
  const hasProviders = authOptions.providers && authOptions.providers.length > 0

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Portal da Clínica
          </h2>
          <p className="text-gray-600">
            Acesse sua conta para gerenciar sua clínica
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!hasProviders ? (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <AlertCircle className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Autenticação não configurada
                </h3>
                <p className="text-gray-600 text-sm">
                  Para ativar o login, você precisa configurar as credenciais OAuth no arquivo .env
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md text-left">
                <p className="text-sm font-medium text-gray-900 mb-2">Como configurar:</p>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Acesse o Google Cloud Console</li>
                  <li>Crie credenciais OAuth 2.0</li>
                  <li>Atualize o arquivo .env com as credenciais</li>
                  <li>Reinicie o servidor</li>
                </ol>
              </div>

              <Link href="/">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para a página inicial
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-gray-600 text-sm">
                Escolha uma opção para continuar:
              </p>
              
              {authOptions.providers?.map((provider: any) => (
                <form key={provider.id} action={`/api/auth/signin/${provider.id}`} method="POST">
                  <Button type="submit" className="w-full">
                    Continuar com {provider.name}
                  </Button>
                </form>
              ))}

              <Link href="/">
                <Button variant="outline" className="w-full mt-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para a página inicial
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}