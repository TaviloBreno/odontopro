import { Button } from '@/components/ui/button'
import getSesion from '@/lib/getSession'
import { Users, Plus, Search, Phone, Mail, Calendar, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

// Dados fictícios para pacientes
const patients = [
  {
    id: '1',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '(11) 99999-0001',
    birthDate: '1985-03-15',
    address: 'Rua das Flores, 123 - São Paulo, SP',
    lastVisit: '2025-09-15',
    totalAppointments: 8,
    notes: 'Paciente com sensibilidade dental'
  },
  {
    id: '2',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-0002',
    birthDate: '1978-11-22',
    address: 'Av. Principal, 456 - São Paulo, SP',
    lastVisit: '2025-10-01',
    totalAppointments: 12,
    notes: 'Alérgico à anestesia com lidocaína'
  },
  {
    id: '3',
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    phone: '(11) 99999-0003',
    birthDate: '1992-07-08',
    address: 'Rua do Centro, 789 - São Paulo, SP',
    lastVisit: '2025-08-20',
    totalAppointments: 5,
    notes: 'Primeira consulta em Janeiro/2025'
  },
  {
    id: '4',
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@email.com',
    phone: '(11) 99999-0004',
    birthDate: '1980-12-10',
    address: 'Rua Nova, 321 - São Paulo, SP',
    lastVisit: '2025-09-28',
    totalAppointments: 15,
    notes: 'Paciente frequente, tratamento ortodôntico'
  },
  {
    id: '5',
    name: 'Carla Lima',
    email: 'carla.lima@email.com',
    phone: '(11) 99999-0005',
    birthDate: '1995-05-18',
    address: 'Av. Secundária, 654 - São Paulo, SP',
    lastVisit: '2025-07-12',
    totalAppointments: 3,
    notes: 'Cancelou última consulta por motivos pessoais'
  }
]

export default async function PatientsPage() {
  const session = await getSesion()

  if (!session) {
    redirect("/auth/signin")
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

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
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Pacientes</h1>
                <p className="text-sm text-gray-600">Gerencie seus pacientes</p>
              </div>
            </div>
            
            <Link href="/dashboard/patients/new">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Paciente
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
                <p className="text-gray-600 text-sm">Total de Pacientes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {patients.filter(p => {
                    const lastVisit = new Date(p.lastVisit)
                    const thirtyDaysAgo = new Date()
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
                    return lastVisit >= thirtyDaysAgo
                  }).length}
                </p>
                <p className="text-gray-600 text-sm">Ativos (30 dias)</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {patients.filter(p => p.totalAppointments >= 5).length}
                </p>
                <p className="text-gray-600 text-sm">Frequentes (5+ consultas)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar pacientes por nome, email ou telefone..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                <option>Todos os pacientes</option>
                <option>Ativos</option>
                <option>Inativos</option>
                <option>Novos (este mês)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Patients List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Idade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Visita
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Consultas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-emerald-600">
                            {patient.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                          <p className="text-sm text-gray-500">{patient.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center text-sm text-gray-900 mb-1">
                          <Phone className="w-4 h-4 mr-1 text-gray-400" />
                          {patient.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="w-4 h-4 mr-1 text-gray-400" />
                          {patient.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">{calculateAge(patient.birthDate)} anos</p>
                      <p className="text-sm text-gray-500">{new Date(patient.birthDate).toLocaleDateString('pt-BR')}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">{new Date(patient.lastVisit).toLocaleDateString('pt-BR')}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {patient.totalAppointments} consultas
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link href={`/dashboard/patients/${patient.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3 mr-1" />
                            Ver
                          </Button>
                        </Link>
                        <Link href={`/dashboard/appointments/new?patient=${patient.id}`}>
                          <Button variant="outline" size="sm" className="text-emerald-600 hover:text-emerald-700">
                            <Calendar className="w-3 h-3 mr-1" />
                            Agendar
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Patient Cards for Mobile */}
        <div className="lg:hidden mt-6 space-y-4">
          {patients.map((patient) => (
            <div key={patient.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-emerald-600">
                      {patient.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-lg font-medium text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-500">{calculateAge(patient.birthDate)} anos</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  {patient.totalAppointments} consultas
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {patient.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {patient.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Última visita: {new Date(patient.lastVisit).toLocaleDateString('pt-BR')}
                </div>
              </div>

              <div className="flex space-x-2">
                <Link href={`/dashboard/patients/${patient.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="w-3 h-3 mr-1" />
                    Ver Detalhes
                  </Button>
                </Link>
                <Link href={`/dashboard/appointments/new?patient=${patient.id}`} className="flex-1">
                  <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Calendar className="w-3 h-3 mr-1" />
                    Agendar
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}