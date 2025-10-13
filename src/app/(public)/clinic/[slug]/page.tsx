import { Clock, MapPin, Phone, Star, Calendar, User, Shield, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Dados fictícios da clínica
const getClinicData = (slug: string) => {
  return {
    id: '1',
    name: 'Clínica OdontoPro',
    slug: 'clinica-odontopro',
    description: 'Cuidando do seu sorriso há mais de 15 anos com tecnologia de ponta e atendimento humanizado.',
    dentist: {
      name: 'Dr. João Silva',
      cro: 'CRO-SP 12345',
      specialty: 'Cirurgião-Dentista',
      experience: '15 anos de experiência',
      photo: null
    },
    rating: 4.8,
    reviewsCount: 127,
    address: {
      street: 'Rua das Flores, 123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    contact: {
      phone: '(11) 99999-9999',
      whatsapp: '11999999999',
      email: 'contato@odontopro.com.br'
    },
    hours: {
      monday: '08:00 - 18:00',
      tuesday: '08:00 - 18:00',
      wednesday: '08:00 - 18:00',
      thursday: '08:00 - 18:00',
      friday: '08:00 - 17:00',
      saturday: '08:00 - 12:00',
      sunday: 'Fechado'
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
    ],
    features: [
      'Equipamentos Modernos',
      'Ambiente Climatizado',
      'Estacionamento Próprio',
      'Atendimento Humanizado',
      'Materiais de Qualidade',
      'Seguimos Protocolos de Biossegurança'
    ]
  }
}

interface PageProps {
  params: {
    slug: string
  }
}

export default function ClinicPublicPage({ params }: PageProps) {
  const clinic = getClinicData(params.slug)

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

  const weekDays = [
    { key: 'monday', name: 'Segunda-feira' },
    { key: 'tuesday', name: 'Terça-feira' },
    { key: 'wednesday', name: 'Quarta-feira' },
    { key: 'thursday', name: 'Quinta-feira' },
    { key: 'friday', name: 'Sexta-feira' },
    { key: 'saturday', name: 'Sábado' },
    { key: 'sunday', name: 'Domingo' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{clinic.name}</h1>
                <p className="text-sm text-gray-600">{clinic.dentist.name} - {clinic.dentist.cro}</p>
              </div>
            </div>
            
            <Link href={`/clinic/${clinic.slug}/booking`}>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Calendar className="w-4 h-4 mr-2" />
                Agendar Consulta
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{clinic.name}</h1>
                  <p className="text-lg text-gray-600 mb-4">{clinic.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 mr-1" />
                      <span className="font-medium">{clinic.rating}</span>
                      <span className="ml-1">({clinic.reviewsCount} avaliações)</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      <span>{clinic.dentist.experience}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <User className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">{clinic.dentist.name}</p>
                    <p className="text-sm text-blue-700">{clinic.dentist.specialty}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Shield className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Biossegurança</p>
                    <p className="text-sm text-green-700">Protocolos rigorosos</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Clock className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="font-medium text-purple-900">Horário Flexível</p>
                    <p className="text-sm text-purple-700">Seg-Sáb disponível</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Serviços Disponíveis</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clinic.services.map((service) => (
                  <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{service.duration} min</span>
                      </div>
                      <div className="font-bold text-emerald-600">
                        R$ {service.price.toFixed(2).replace('.', ',')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Link href={`/clinic/${clinic.slug}/booking`}>
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                    <Calendar className="w-5 h-5 mr-2" />
                    Agendar Agora
                  </Button>
                </Link>
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nossos Diferenciais</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {clinic.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Booking */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-emerald-900 mb-4">Agende sua Consulta</h3>
              <p className="text-sm text-emerald-700 mb-4">
                Escolha o melhor horário para você e garante seu atendimento
              </p>
              <Link href={`/clinic/${clinic.slug}/booking`}>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Online
                </Button>
              </Link>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contato e Localização</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Endereço</p>
                    <p className="text-sm text-gray-600">
                      {clinic.address.street}<br />
                      {clinic.address.neighborhood} - {clinic.address.city}/{clinic.address.state}<br />
                      CEP: {clinic.address.zipCode}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Telefone</p>
                    <p className="text-sm text-gray-600">{clinic.contact.phone}</p>
                    <a 
                      href={`https://wa.me/${clinic.contact.whatsapp}`}
                      className="text-sm text-emerald-600 hover:text-emerald-700"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Horários de Funcionamento</h3>
              
              <div className="space-y-2">
                {weekDays.map((day) => (
                  <div key={day.key} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{day.name}</span>
                    <span className={`font-medium ${
                      clinic.hours[day.key as keyof typeof clinic.hours] === 'Fechado' 
                        ? 'text-red-600' 
                        : 'text-gray-900'
                    }`}>
                      {clinic.hours[day.key as keyof typeof clinic.hours]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}