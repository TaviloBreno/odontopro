"use server"

import prisma from "@/lib/prisma"

export async function getInfoSchedule({ userId }: { userId: string }) {
  try {
    if (!userId) {
      return null;
    }

    // Verificar se DATABASE_URL está configurada corretamente
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('username:password')) {
      console.log("⚠️ DATABASE_URL não configurada - usando dados fictícios para clínica");
      throw new Error("DATABASE_URL não configurada");
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId
      },
      include: {
        subscription: true,
        services: {
          where: {
            status: true
          }
        },
      }
    })

    if (!user) {
      return null;
    }

    console.log("✅ Dados da clínica carregados do banco de dados:", user.name);
    return user;

  } catch (err) {
    console.log("⚠️ Usando dados fictícios da clínica - Configure o banco de dados para dados reais");
    
    // Retorna dados fictícios baseados no ID solicitado
    const mockClinics: Record<string, any> = {
      "1": {
        id: "1",
        name: "Dra. Maria Silva",
        email: "maria.silva@odonto.com",
        emailVerified: null,
        image: "/foto1.png",
        phone: "(11) 99999-1111",
        address: "Rua das Flores, 123 - São Paulo",
        status: true,
        timeZone: null,
        stripe_customer_id: null,
        times: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        subscription: {
          id: "sub1",
          plan: "PROFESSIONAL",
          status: "active",
          priceId: "price_1",
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "1"
        },
        services: [
          {
            id: "service1",
            name: "Consulta de Rotina",
            description: "Consulta odontológica completa",
            price: 150,
            duration: 60,
            status: true,
            userId: "1",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "service2",
            name: "Limpeza Dental",
            description: "Profilaxia completa",
            price: 100,
            duration: 45,
            status: true,
            userId: "1",
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      },
      "2": {
        id: "2",
        name: "Dr. João Santos",
        email: "joao.santos@odonto.com",
        emailVerified: null,
        image: "/foto1.png",
        phone: "(11) 99999-2222",
        address: "Av. Paulista, 456 - São Paulo",
        status: true,
        timeZone: null,
        stripe_customer_id: null,
        times: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        subscription: {
          id: "sub2",
          plan: "BASIC",
          status: "active",
          priceId: "price_2",
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "2"
        },
        services: [
          {
            id: "service3",
            name: "Ortodontia",
            description: "Consulta ortodôntica especializada",
            price: 200,
            duration: 90,
            status: true,
            userId: "2",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "service4",
            name: "Implante Dental",
            description: "Implante dentário completo",
            price: 1500,
            duration: 120,
            status: true,
            userId: "2",
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      },
      "3": {
        id: "3",
        name: "Dra. Ana Costa",
        email: "ana.costa@odonto.com",
        emailVerified: null,
        image: "/foto1.png",
        phone: "(11) 99999-3333",
        address: "Rua Augusta, 789 - São Paulo",
        status: true,
        timeZone: null,
        stripe_customer_id: null,
        times: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        subscription: {
          id: "sub3",
          plan: "PROFESSIONAL",
          status: "active",
          priceId: "price_3",
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "3"
        },
        services: [
          {
            id: "service5",
            name: "Estética Dental",
            description: "Tratamento estético completo",
            price: 300,
            duration: 90,
            status: true,
            userId: "3",
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      }
    };

    return mockClinics[userId] || null;
  }
}
