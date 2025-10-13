import getSesion from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Phone, MapPin, Settings } from 'lucide-react'
import Link from 'next/link'

export default async function ProfilePage() {
  const session = await getSesion()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-emerald-600 hover:text-emerald-700">
                ← Voltar ao Dashboard
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Meu <span className="text-emerald-600">Perfil</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Informações Pessoais</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Avatar Section */}
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-emerald-600">
                    {session.user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {session.user.name || 'Nome não informado'}
                  </h2>
                  <p className="text-gray-600">{session.user.email}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Alterar Foto
                  </Button>
                </div>
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Nome Completo */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Nome Completo</span>
                  </Label>
                  <Input 
                    id="name"
                    defaultValue={session.user.name || ''} 
                    placeholder="Digite seu nome completo"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </Label>
                  <Input 
                    id="email"
                    type="email"
                    defaultValue={session.user.email || ''} 
                    placeholder="seu@email.com"
                  />
                </div>

                {/* Telefone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Telefone</span>
                  </Label>
                  <Input 
                    id="phone"
                    defaultValue="(11) 99999-9999" 
                    placeholder="(11) 99999-9999"
                  />
                </div>

                {/* Endereço */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Endereço</span>
                  </Label>
                  <Input 
                    id="address"
                    defaultValue="Rua das Flores, 123 - Centro, São Paulo - SP" 
                    placeholder="Seu endereço completo"
                  />
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button variant="outline">
                  Cancelar
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              </div>

            </CardContent>
          </Card>

          {/* Additional Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Configurações da Conta</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Status da Conta</h3>
                  <p className="text-sm text-gray-600">Sua conta está ativa</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-600">Ativo</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Plano Atual</h3>
                  <p className="text-sm text-gray-600">Plano Profissional</p>
                </div>
                <Button variant="outline" size="sm">
                  Gerenciar Plano
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Segurança</h3>
                  <p className="text-sm text-gray-600">Alterar senha da conta</p>
                </div>
                <Button variant="outline" size="sm">
                  Alterar Senha
                </Button>
              </div>

            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}