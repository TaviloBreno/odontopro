import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Phone, MapPin, Settings, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ProfileDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center text-emerald-600 hover:text-emerald-700 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Dashboard
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Meu <span className="text-emerald-600">Perfil</span>
            </h1>
            <div className="w-24"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Profile Header */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50">
              <CardTitle className="flex items-center space-x-2 text-emerald-700">
                <User className="w-5 h-5" />
                <span>Informações Pessoais</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              
              {/* Avatar Section */}
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">
                    Dr
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Dr. João Silva
                  </h2>
                  <p className="text-gray-600">dr.joao@teste.com</p>
                  <p className="text-sm text-emerald-600 mt-1">● Online agora</p>
                  <Button variant="outline" size="sm" className="mt-3 hover:bg-emerald-50">
                    <Settings className="w-4 h-4 mr-2" />
                    Alterar Foto
                  </Button>
                </div>
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Nome Completo */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center space-x-2 text-gray-700">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>Nome Completo</span>
                  </Label>
                  <Input 
                    id="name"
                    defaultValue="Dr. João Silva" 
                    placeholder="Digite seu nome completo"
                    className="focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center space-x-2 text-gray-700">
                    <Mail className="w-4 h-4 text-emerald-600" />
                    <span>Email</span>
                  </Label>
                  <Input 
                    id="email"
                    type="email"
                    defaultValue="dr.joao@teste.com" 
                    placeholder="seu@email.com"
                    className="focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                {/* Telefone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center space-x-2 text-gray-700">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span>Telefone</span>
                  </Label>
                  <Input 
                    id="phone"
                    defaultValue="(11) 99999-9999" 
                    placeholder="(11) 99999-9999"
                    className="focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                {/* Endereço */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center space-x-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>Endereço</span>
                  </Label>
                  <Input 
                    id="address"
                    defaultValue="Rua das Flores, 123 - Centro, São Paulo - SP" 
                    placeholder="Seu endereço completo"
                    className="focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button variant="outline" className="hover:bg-gray-50">
                  Cancelar
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-md">
                  <Settings className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              </div>

            </CardContent>
          </Card>

          {/* Additional Settings */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50">
              <CardTitle className="flex items-center space-x-2 text-emerald-700">
                <Settings className="w-5 h-5" />
                <span>Configurações da Conta</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div>
                  <h3 className="font-medium text-gray-900">Status da Conta</h3>
                  <p className="text-sm text-gray-600">Sua conta está ativa e verificada</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600">Ativo</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div>
                  <h3 className="font-medium text-gray-900">Plano Atual</h3>
                  <p className="text-sm text-gray-600">Plano Profissional - Recursos completos</p>
                </div>
                <Button variant="outline" size="sm" className="hover:bg-blue-50 border-blue-300">
                  Gerenciar Plano
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div>
                  <h3 className="font-medium text-gray-900">Segurança</h3>
                  <p className="text-sm text-gray-600">Alterar senha e configurações de segurança</p>
                </div>
                <Button variant="outline" size="sm" className="hover:bg-purple-50 border-purple-300">
                  Alterar Senha
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                <div>
                  <h3 className="font-medium text-gray-900">Notificações</h3>
                  <p className="text-sm text-gray-600">Configurar preferências de notificação</p>
                </div>
                <Button variant="outline" size="sm" className="hover:bg-orange-50 border-orange-300">
                  Configurar
                </Button>
              </div>

            </CardContent>
          </Card>

          {/* Success Message Demo */}
          <div className="bg-gradient-to-r from-emerald-100 to-blue-100 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-medium text-emerald-800">Perfil Funcionando!</h4>
                <p className="text-sm text-emerald-600">
                  Esta é uma demonstração da tela de perfil funcionando corretamente. 
                  Agora o link do menu lateral funcionará perfeitamente.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}