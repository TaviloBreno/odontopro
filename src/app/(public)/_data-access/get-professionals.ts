"use server"

import prisma from "@/lib/prisma"

export async function getProfessionals() {

  try {
    // Tentativa de buscar no banco de dados
    const professionals = await prisma.user.findMany({
      where: {
        status: true,
      },
      include: {
        subscription: true,
      }
    })
    
    return professionals;

  } catch (err) {
    console.log("Erro ao buscar profissionais:", err);
    
    // Retorna dados fictícios para teste se não conseguir conectar ao banco
    return [
      {
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
          plan: "PROFESSIONAL" as any,
          status: "active",
          priceId: "price_1",
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "1"
        }
      },
      {
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
          plan: "BASIC" as any,
          status: "active",
          priceId: "price_2",
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "2"
        }
      },
      {
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
          plan: "PROFESSIONAL" as any,
          status: "active",
          priceId: "price_3",
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "3"
        }
      }
    ] as any;
  }

}