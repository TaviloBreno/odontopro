"use client"

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, User, Phone, Mail, DollarSign, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Dados fictícios para serviços (limitado a 3 no plano básico)
const services = [
  { id: '1', name: 'Limpeza Dental', duration: 60, price: 120 },
  { id: '2', name: 'Consulta Básica', duration: 30, price: 80 },
  { id: '3', name: 'Obturação', duration: 90, price: 200 }
]

// Horários disponíveis
const availableSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
]

export default function NewAppointmentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    serviceId: '',
    date: '',
    time: '',
    notes: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const selectedService = services.find(s => s.id === formData.serviceId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simular criação do agendamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Aqui seria feita a requisição para a API
      console.log('Novo agendamento:', formData)
      
      // Redirecionar para a lista de agendamentos
      router.push('/dashboard/appointments?success=true')
    } catch (error) {
      console.error('Erro ao criar agendamento:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/appointments" className="text-emerald-600 hover:text-emerald-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Novo Agendamento</h1>
              <p className="text-sm text-gray-600">Agende uma nova consulta</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações do Paciente */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-emerald-600" />
                Informações do Paciente
              </h2>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="patientName"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Ex: Maria Silva Santos"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="patientEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="email"
                        id="patientEmail"
                        name="patientEmail"
                        value={formData.patientEmail}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="maria@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="patientPhone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="tel"
                        id="patientPhone"
                        name="patientPhone"
                        value={formData.patientPhone}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Serviço */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-emerald-600" />
                Serviço
              </h2>
              
              <div>
                <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 mb-2">
                  Selecione o serviço *
                </label>
                <select
                  id="serviceId"
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Selecione um serviço</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - {service.duration} min - R$ {service.price}
                    </option>
                  ))}
                </select>
                
                {selectedService && (
                  <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-800">
                        <strong>{selectedService.name}</strong>
                      </span>
                      <span className="text-emerald-600">
                        {selectedService.duration} minutos - R$ {selectedService.price}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Data e Horário */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-emerald-600" />
                Data e Horário
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Data *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                    Horário *
                  </label>
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Selecione o horário</option>
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Observações */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Informações adicionais sobre a consulta..."
              />
            </div>

            {/* Resumo */}
            {selectedService && formData.date && formData.time && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Resumo do Agendamento</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Paciente:</strong> {formData.patientName || 'Não informado'}</p>
                  <p><strong>Serviço:</strong> {selectedService.name}</p>
                  <p><strong>Data:</strong> {new Date(formData.date).toLocaleDateString('pt-BR')}</p>
                  <p><strong>Horário:</strong> {formData.time}</p>
                  <p><strong>Duração:</strong> {selectedService.duration} minutos</p>
                  <p><strong>Valor:</strong> R$ {selectedService.price}</p>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link href="/dashboard/appointments" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Agendando...
                  </div>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Criar Agendamento
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