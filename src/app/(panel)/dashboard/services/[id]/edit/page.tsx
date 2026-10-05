'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock, DollarSign, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'

// Dados fictícios do serviço
const getServiceData = (id: string) => {
  const services: Record<string, any> = {
    '1': {
      id: '1',
      name: 'Limpeza Dental',
      description: 'Profilaxia dental completa com remoção de tártaro e placa bacteriana',
      duration: 60,
      price: 120,
      status: true,
      appointments: 15
    },
    '2': {
      id: '2',
      name: 'Consulta Básica',
      description: 'Avaliação inicial e exame clínico completo',
      duration: 30,
      price: 80,
      status: true,
      appointments: 22
    },
    '3': {
      id: '3',
      name: 'Obturação',
      description: 'Restauração dentária com resina composta',
      duration: 90,
      price: 200,
      status: true,
      appointments: 8
    }
  }
  return services[id] || null
}

export default function EditServicePage() {
  const router = useRouter()
  const params = useParams()
  const serviceId = params.id as string
  
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [service, setService] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 60,
    price: 0,
    status: true
  })

  useEffect(() => {
    const serviceData = getServiceData(serviceId)
    if (serviceData) {
      setService(serviceData)
      setFormData({
        name: serviceData.name,
        description: serviceData.description,
        duration: serviceData.duration,
        price: serviceData.price,
        status: serviceData.status
      })
    } else {
      router.push('/dashboard/services')
    }
  }, [serviceId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simular atualização do serviço
    setTimeout(() => {
      router.push('/dashboard/services?success=Serviço atualizado com sucesso!')
    }, 1500)
  }

  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja excluir o serviço "${service?.name}"?\n\nEsta ação não pode ser desfeita e o serviço será removido permanentemente.`)) {
      return
    }

    setIsDeleting(true)
    
    // Simular exclusão do serviço
    setTimeout(() => {
      router.push('/dashboard/services?success=Serviço excluído com sucesso!')
    }, 1500)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }))
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando serviço...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/services" className="text-emerald-600 hover:text-emerald-700 flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Serviços
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Editar Serviço</h1>
                <p className="text-sm text-gray-600">{service.name}</p>
              </div>
            </div>

            <Button 
              onClick={handleDelete}
              disabled={isDeleting || isLoading}
              variant="outline"
              className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
            >
              {isDeleting ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2" />
                  Excluindo...
                </div>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas do Serviço</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{service.appointments}</p>
                  <p className="text-sm text-blue-700">Agendamentos Realizados</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    R$ {(service.price * service.appointments).toFixed(2).replace('.', ',')}
                  </p>
                  <p className="text-sm text-green-700">Receita Gerada</p>
                </div>
              </div>
            </div>

            {/* Service Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações do Serviço</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Serviço *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Ex: Limpeza Dental, Consulta Básica..."
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Descreva o que está incluído no serviço..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Duração (minutos) *
                    </label>
                    <select
                      id="duration"
                      name="duration"
                      required
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value={15}>15 minutos</option>
                      <option value={30}>30 minutos</option>
                      <option value={45}>45 minutos</option>
                      <option value={60}>1 hora</option>
                      <option value={90}>1h 30min</option>
                      <option value={120}>2 horas</option>
                      <option value={150}>2h 30min</option>
                      <option value={180}>3 horas</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Preço (R$) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status ? 'true' : 'false'}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value === 'true' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="true">Ativo - Disponível para agendamento</option>
                    <option value="false">Inativo - Não disponível para agendamento</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Preview Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Prévia das Alterações</h2>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{formData.name}</h3>
                    {formData.description && (
                      <p className="text-sm text-gray-600">{formData.description}</p>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    formData.status 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {formData.status ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-500">Duração</p>
                    <p className="font-medium text-gray-900">{formData.duration} min</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">Preço</p>
                    <p className="font-medium text-emerald-600">
                      R$ {formData.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard/services" className="flex-1">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  disabled={isLoading || isDeleting}
                >
                  Cancelar
                </Button>
              </Link>
              <Button 
                type="submit" 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                disabled={isLoading || isDeleting || !formData.name || formData.price <= 0}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Salvando...
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}