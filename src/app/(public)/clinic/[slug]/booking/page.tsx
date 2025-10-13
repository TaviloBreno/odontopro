'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, Phone, Mail, ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

// Dados fictícios da clínica (mesmo da página anterior)
const getClinicData = (slug: string) => {
  return {
    id: '1',
    name: 'Clínica OdontoPro',
    slug: 'clinica-odontopro',
    dentist: {
      name: 'Dr. João Silva',
      cro: 'CRO-SP 12345'
    },
    services: [
      {
        id: '1',
        name: 'Limpeza Dental',
        description: 'Profilaxia completa com remoção de tártaro e polimento',
        duration: 60,
        price: 120
      },
      {
        id: '2',
        name: 'Consulta de Avaliação',
        description: 'Exame clínico completo e orientações preventivas',
        duration: 30,
        price: 80
      },
      {
        id: '3',
        name: 'Restauração Dentária',
        description: 'Obturação com resina composta da cor do dente',
        duration: 90,
        price: 200
      }
    ]
  }
}

// Horários disponíveis fictícios
const getAvailableSlots = (date: string) => {
  return [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ]
}

export default function ClinicBookingPage() {
  const params = useParams()
  const router = useRouter()
  const clinic = getClinicData(params.slug as string)
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    notes: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular agendamento
    setTimeout(() => {
      setCurrentStep(4) // Tela de confirmação
      setIsLoading(false)
    }, 2000)
  }

  const selectedService = clinic?.services.find(s => s.id === formData.service)
  const availableSlots = formData.date ? getAvailableSlots(formData.date) : []

  // Gerar próximos 30 dias (exceto domingos)
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      // Pular domingos (0)
      if (date.getDay() !== 0) {
        dates.push({
          value: date.toISOString().split('T')[0],
          label: date.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            day: '2-digit', 
            month: 'long' 
          })
        })
      }
    }
    
    return dates
  }

  if (!clinic) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Clínica não encontrada</h1>
          <p className="text-gray-600">A página que você está procurando não existe.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href={`/clinic/${clinic.slug}`} className="text-emerald-600 hover:text-emerald-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Agendar Consulta</h1>
              <p className="text-sm text-gray-600">{clinic.name} - {clinic.dentist.name}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step ? <Check className="w-4 h-4" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`flex-1 h-1 mx-4 ${
                      currentStep > step ? 'bg-emerald-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Escolher Serviço</span>
              <span>Data e Horário</span>
              <span>Seus Dados</span>
            </div>
          </div>

          {/* Step 1: Choose Service */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Escolha o Serviço</h2>
              
              <div className="space-y-4">
                {clinic.services.map((service) => (
                  <div 
                    key={service.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      formData.service === service.id
                        ? 'border-emerald-600 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, service: service.id }))}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {service.duration} min
                          </div>
                          <div className="font-medium text-emerald-600">
                            R$ {service.price.toFixed(2).replace('.', ',')}
                          </div>
                        </div>
                      </div>
                      {formData.service === service.id && (
                        <div className="ml-4">
                          <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={() => setCurrentStep(2)}
                  disabled={!formData.service}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Próximo Passo
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Choose Date and Time */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Data e Horário</h2>
                {selectedService && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{selectedService.name}</span> - {selectedService.duration} min
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Escolha a Data
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {getAvailableDates().slice(0, 10).map((date) => (
                      <button
                        key={date.value}
                        onClick={() => setFormData(prev => ({ ...prev, date: date.value, time: '' }))}
                        className={`p-3 text-left rounded-lg border transition-all capitalize ${
                          formData.date === date.value
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        {date.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                {formData.date && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Escolha o Horário
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {availableSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setFormData(prev => ({ ...prev, time }))}
                          className={`p-2 text-center rounded-lg border transition-all ${
                            formData.time === time
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  Voltar
                </Button>
                <Button 
                  onClick={() => setCurrentStep(3)}
                  disabled={!formData.date || !formData.time}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Próximo Passo
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Patient Information */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Seus Dados</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="patientName"
                    required
                    value={formData.patientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Digite seu nome completo"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="patientPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      id="patientPhone"
                      required
                      value={formData.patientPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, patientPhone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <label htmlFor="patientEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="patientEmail"
                      value={formData.patientEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, patientEmail: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Observações (opcional)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Alguma informação adicional que gostaria de compartilhar..."
                  />
                </div>

                {/* Booking Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Resumo do Agendamento</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Serviço:</span>
                      <span className="font-medium">{selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data:</span>
                      <span className="font-medium">
                        {new Date(formData.date).toLocaleDateString('pt-BR', { 
                          weekday: 'long', 
                          day: '2-digit', 
                          month: 'long' 
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Horário:</span>
                      <span className="font-medium">{formData.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duração:</span>
                      <span className="font-medium">{selectedService?.duration} min</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="text-gray-900 font-medium">Valor:</span>
                      <span className="font-bold text-emerald-600">
                        R$ {selectedService?.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                    disabled={isLoading}
                  >
                    Voltar
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isLoading || !formData.patientName || !formData.patientPhone}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Confirmando...
                      </div>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4 mr-2" />
                        Confirmar Agendamento
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Agendamento Confirmado!</h2>
              <p className="text-gray-600 mb-6">
                Seu agendamento foi realizado com sucesso. Você receberá uma confirmação em breve.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
                <h3 className="font-semibold text-gray-900 mb-3">Detalhes do seu agendamento:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paciente:</span>
                    <span className="font-medium">{formData.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Serviço:</span>
                    <span className="font-medium">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data:</span>
                    <span className="font-medium">
                      {new Date(formData.date).toLocaleDateString('pt-BR', { 
                        day: '2-digit', 
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Horário:</span>
                    <span className="font-medium">{formData.time}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  📧 Enviamos um e-mail de confirmação para {formData.patientEmail || formData.patientPhone}
                </p>
                <p className="text-sm text-gray-600">
                  📱 Você receberá um lembrete 24h antes da consulta
                </p>
              </div>

              <div className="mt-8">
                <Link href={`/clinic/${clinic.slug}`}>
                  <Button variant="outline" className="mr-3">
                    Voltar para a Clínica
                  </Button>
                </Link>
                <Button 
                  onClick={() => {
                    setCurrentStep(1)
                    setFormData({
                      service: '',
                      date: '',
                      time: '',
                      patientName: '',
                      patientPhone: '',
                      patientEmail: '',
                      notes: ''
                    })
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Agendar Outra Consulta
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}