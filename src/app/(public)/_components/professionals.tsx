"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Prisma } from "@prisma/client"
import { PremiumCardBadge } from "./premium-badge"

type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true,
  }
}>

interface ProfessionalsProps {
  professionals: UserWithSubscription[]
}


export function Professionals({ professionals }: ProfessionalsProps) {
  
  const scrollToTop = () => {
    document.getElementById('profissionais')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    })
  }

  return (
    <section id="profissionais" className="bg-gray-50 py-16">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Nossos <span className="text-emerald-600">Profissionais</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Conheça nossa rede de profissionais qualificados e encontre a clínica perfeita para suas necessidades odontológicas
          </p>
        </div>

        <div className="flex justify-center">
          <section
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl"
          >

          {professionals.map((clinic) => (
            <Card className="overflow-hidden hover:shadow-lg duration-300" key={clinic.id}>
              <CardContent className="p-0">
                <div>
                  <div className="relative h-48">
                    <Image
                      src={clinic.image ?? "/foto1.png"}
                      alt="Foto da clinica"
                      fill
                      className="object-cover"
                    />

                    {clinic?.subscription?.status === "active" && clinic?.subscription?.plan === "PROFESSIONAL" && <PremiumCardBadge />}
                  </div>
                </div>

                <div className="p-4 space-y-4 min-h-[160px] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {clinic.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {clinic.address ?? "Endereço não informado."}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/clinica/${clinic.id}`}
                    target="_blank"
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center py-2 rounded-md text-sm md:text-base font-medium"
                  >
                    Agendar horário
                    <ArrowRight className="ml-2" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}

          </section>
        </div>

        {/* Seção de Informações sobre Profissionais */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Por que escolher nossos profissionais?
            </h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Todos os nossos parceiros são cuidadosamente selecionados e passam por um rigoroso processo de verificação
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Profissionais Certificados</h4>
              <p className="text-gray-600 text-sm">
                Todos possuem registro no CRO e especializações reconhecidas
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Horários Flexíveis</h4>
              <p className="text-gray-600 text-sm">
                Agendamento online com horários que se adaptam à sua rotina
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Localização Conveniente</h4>
              <p className="text-gray-600 text-sm">
                Clínicas em pontos estratégicos da cidade para facilitar o acesso
              </p>
            </div>
          </div>
        </div>

        {/* Seção de Especialidades */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Especialidades Disponíveis
            </h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Nossa rede oferece uma ampla gama de especialidades odontológicas
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              'Clínica Geral',
              'Ortodontia',
              'Implantodontia',
              'Periodontia',
              'Endodontia',
              'Odontopediatria',
              'Prótese Dentária',
              'Estética Dental'
            ].map((specialty) => (
              <div key={specialty} className="bg-white p-4 rounded-lg border border-gray-200 text-center hover:border-emerald-300 hover:bg-emerald-50 transition-all">
                <span className="text-sm font-medium text-gray-700">{specialty}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 max-w-3xl mx-auto text-white">
            <h3 className="text-2xl font-bold mb-4">
              Pronto para agendar sua consulta?
            </h3>
            <p className="mb-6 opacity-90">
              Escolha o profissional ideal para suas necessidades e agende seu horário de forma rápida e prática
            </p>
            <button 
              onClick={scrollToTop}
              className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Ver Profissionais Disponíveis
            </button>
          </div>
        </div>

      </div>

    </section>
  )
} 