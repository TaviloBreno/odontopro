import { Button } from '@/components/ui/button'
import getSesion from '@/lib/getSession'
import { Clock, Plus, DollarSign, Edit, Trash2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { PLANS } from '@/utils/plans'

// Dados fictícios para serviços (limitado a 3 no plano básico)
const services = [
  {
    id: '1',
    name: 'Limpeza Dental',
    description: 'Profilaxia dental completa com remoção de tártaro e placa bacteriana',
    duration: 60,
    price: 120,
    status: true,
    appointments: 15
  },
  {
    id: '2',
    name: 'Consulta Básica',
    description: 'Avaliação inicial e exame clínico completo',
    duration: 30,
    price: 80,
    status: true,
    appointments: 22
  },
  {
    id: '3',
    name: 'Obturação',
    description: 'Restauração dentária com resina composta',
    duration: 90,
    price: 200,
    status: true,
    appointments: 8
  }
]

export default async function ServicesPage() {
  const session = await getSesion()

  if (!session) {
    redirect("/auth/signin")
  }

  // Verificar plano do usuário para limitar serviços
  const userPlan = session.user?.plan || 'BASIC'
  const maxServices = PLANS[userPlan as keyof typeof PLANS]?.maxServices || 3
  const canAddMore = services.length < maxServices

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-emerald-600 hover:text-emerald-700">
                ← Dashboard
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Serviços</h1>
                <p className="text-sm text-gray-600">
                  Gerencie seus serviços ({services.length}/{maxServices} cadastrados)
                </p>
              </div>
            </div>
            
            {canAddMore ? (
              <Link href="/dashboard/services/new">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Serviço
                </Button>
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Limite atingido</span>
                <Link href="/dashboard/plans">
                  <Button variant="outline" size="sm">
                    Upgrade Plano
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Plan Limit Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-yellow-800">Plano Básico</h3>
              <p className="text-sm text-yellow-700">
                Você pode cadastrar até {maxServices} serviços. 
                {!canAddMore && (
                  <span className="ml-1">
                    Limite atingido! 
                    <Link href="/dashboard/plans" className="underline hover:text-yellow-900 ml-1">
                      Faça upgrade para cadastrar mais serviços
                    </Link>
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{services.length}</p>
                <p className="text-gray-600 text-sm">Serviços Cadastrados</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  R$ {Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length)}
                </p>
                <p className="text-gray-600 text-sm">Preço Médio</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(services.reduce((sum, s) => sum + s.duration, 0) / services.length)} min
                </p>
                <p className="text-gray-600 text-sm">Duração Média</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {services.length === 0 ? (
            <div className="p-8 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum serviço cadastrado</h3>
              <p className="text-gray-500 mb-4">
                Comece cadastrando seus primeiros serviços odontológicos
              </p>
              {canAddMore && (
                <Link href="/dashboard/services/new">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Cadastrar Primeiro Serviço
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Serviço
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duração
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preço
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Agendamentos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {services.map((service) => (
                      <tr key={service.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{service.name}</p>
                            <p className="text-sm text-gray-500">{service.description}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Clock className="w-4 h-4 mr-1 text-gray-400" />
                            {service.duration} min
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm font-medium text-emerald-600">
                            <DollarSign className="w-4 h-4 mr-1" />
                            R$ {service.price}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-gray-900">{service.appointments} consultas</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            service.status 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {service.status ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link href={`/dashboard/services/${service.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit className="w-3 h-3 mr-1" />
                                Editar
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-3 h-3 mr-1" />
                              Excluir
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="lg:hidden space-y-4 p-4">
                {services.map((service) => (
                  <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        service.status 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {service.status ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                      <div className="text-center">
                        <p className="text-gray-500">Duração</p>
                        <p className="font-medium text-gray-900">{service.duration} min</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">Preço</p>
                        <p className="font-medium text-emerald-600">R$ {service.price}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">Agendamentos</p>
                        <p className="font-medium text-gray-900">{service.appointments}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Link href={`/dashboard/services/${service.id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700">
                        <Trash2 className="w-3 h-3 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Add Service Card (if under limit) */}
        {canAddMore && services.length > 0 && (
          <div className="mt-6 bg-emerald-50 border-2 border-dashed border-emerald-300 rounded-lg p-8 text-center">
            <Plus className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-emerald-900 mb-2">
              Adicionar Novo Serviço
            </h3>
            <p className="text-emerald-700 mb-4">
              Você ainda pode cadastrar {maxServices - services.length} serviço(s) no plano básico
            </p>
            <Link href="/dashboard/services/new">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Serviço
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}